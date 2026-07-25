# Natas target URL depends on DNS that isn't available when running independent of the full network setup (2026-07-24)

Reported: running independent of the venue network setup (`cei-labs-net`),
there is no DNS server available, and the URL Natas gives for its target
cannot be resolved. Notes only, no code changed.

## Two different DNS dependencies exist in this stack -- they need to be told apart

### 1. `attacker_url` (reaching the attacker workstation itself) -- has a known, documented, already-shipped DNS dependency and fallback

`cei-labs-engine/docker/orchestrator/app/instance_types.py` builds
`attacker_url` as `https://{hostname}`, where `hostname` is a
`*.apps.<base_domain>` wildcard name routed through Traefik. The code's
own comment is explicit about this:

```python
# Traefik's route depends on `*.apps.<base_domain>` actually resolving
# (cei-labs-net's DNS, or some other wildcard DNS aimed at the swarm) --
# with no wildcard DNS available at all, that route is simply
# unreachable, and unlike single-target (which only ever used a bare
# published port to begin with) there was no fallback.
```

This is a recorded, intentional finding from earlier work on the
engine, not new. It's why the orchestrator also generates a
DNS-independent fallback: `novnc_url` (a direct `https://<base_domain>:<port>/vnc.html`
link, self-signed TLS, "no DNS required" per its own `novnc_note`
field) and `connect_host`/`connect_port` for raw SSH. Confirmed this
fallback is actually surfaced to players, not just generated and
unused: `challenge-launch.js`'s `renderAccess()` renders an "Open
Attacker Workstation (direct link)" button from `access.novnc_url`
directly under the primary DNS-based button whenever it's present, and
a Host/Port block for SSH.

So: if `attacker_url` doesn't resolve, the launch panel already shows a
working direct-link alternative -- this specific dependency was
identified and mitigated previously. If this is what's actually being
hit, the existing "(direct link)" button is the intended workaround,
not a new gap.

### 2. `target_hostname` (reaching the Natas target FROM INSIDE the attacker) -- designed to need no external DNS at all

Every Natas hint/description in `CEI-Labs-Wargames/scripts/build_natas.py`
tells the player to browse to `http://<target-host>:800N/` **from
inside the attacker workstation**, not from their own machine. The
orchestrator populates that `<target-host>` value as `target_hostname`
-- confirmed in `instance_types.py`, it's the Docker Swarm **service
name** of the target container (`naming.range_target_service_name(...)`),
displayed as plain text ("Target (from inside the attacker only):
`<name>`"), not a link.

Docker Swarm overlay networks run an embedded DNS server for every
service attached to them -- resolving a sibling service's name to its
virtual IP is a built-in feature of the overlay network itself and does
not depend on `cei-labs-net`, a wildcard domain, or any external
resolver. As long as the attacker container and the target container
are both attached to the same `range_network` (which the orchestrator
creates per team), this resolution is expected to work with zero
external DNS infrastructure.

This means "no DNS server available, running independent of the net
setup" should not, by this design, affect reaching the Natas target
from inside the attacker -- that resolution never leaves the Swarm
overlay network. If it's actually failing, the likely causes are
environmental rather than something in the challenge/hint content
itself:

- The attacker and target containers aren't actually joined to the
  same overlay network (e.g. a non-Swarm `docker run`/`docker compose`
  setup that doesn't reproduce `range_network`'s Swarm-managed service
  discovery the same way plain user-defined bridge networks do -- not
  every Docker networking mode provides embedded DNS the same way).
- Docker's own embedded DNS resolver (normally at `127.0.0.11` inside
  each container on a user-defined/overlay network) isn't reachable
  from inside the attacker container for some other local reason.

This doc doesn't attempt to diagnose which of those applies to the
reporter's specific setup -- that would need live inspection of the
running attacker/target containers and their networks, which wasn't
done here per the docs-only scope of this pass.

## Update 2026-07-24: the documented "(direct link)" fallback was tried live and did not work either

Following this doc's own suggested workaround, the reporter tried the
`novnc_url` direct-link fallback (`https://192.168.1.173:<novnc_port>/vnc.html`,
reached via the "Open Attacker Workstation (direct link)" button
described above) against the live instance on `192.168.1.173`. It did
not work.

This is a new, unverified data point, recorded as-is -- no live
debugging was done in this pass (no container/network/port inspection
on `192.168.1.173`, no check of what error the browser actually showed
for that URL). It's not yet known whether the failure is:

- the same DNS-independent fallback path being broken for an unrelated
  reason (e.g. the cert/TLS handshake itself, the port not actually
  being published/reachable from outside the swarm, `tcp-gateway` not
  forwarding correctly), or
- a difference between this doc's read of the source (`instance_types.py`,
  `challenge-launch.js`) and what's actually deployed/running on
  `192.168.1.173` right now (e.g. an older image predating this
  fallback -- `banner-art-not-deployed-gap-2026-07-24.md` already
  documented a separate instance of the running box lagging behind
  `main`), or
- something specific to the reporter's own network path to
  `192.168.1.173` unrelated to this stack at all.

None of these were distinguished in this pass. Closing this now
additionally needs live reproduction against the actual running
instance: what URL was opened, what error/behavior the browser showed
(connection refused vs. cert error vs. blank page vs. something else),
and whether `access.novnc_url` as returned by the orchestrator API for
that specific instance actually matches the URL that was tried.

## Update 2026-07-25: root-caused live -- the `novnc_url` fallback failure was a stale image on 192.168.1.173, not a DNS or code problem, and `target_hostname` was never actually implicated

Did the live reproduction this doc's previous update said was still needed,
against the real box at `192.168.1.173`, using SSH (`ismaelrodriguez@192.168.1.173`,
passwordless key auth + passwordless `sudo docker`) and the orchestrator's own
API (no UI/CTFd session needed -- called `POST /instances` directly from
inside the `cei-labs_orchestrator` container with the `plugin_shared_secret`
it already has mounted, matching exactly what
`docker/ctfd/plugins/instance-launcher/orchestrator_client.py` does).

**Process note before the finding:** this same debugging session separately
hit and root-caused an unrelated problem on this same box -- `curl` to
`localhost` hangs because it tries `::1` first and IPv6 loopback doesn't
work here, while `curl -4`/a literal IPv4 address works instantly. That is
NOT what's described below. Every test in this update used `curl -4` (or
`openssl s_client ... -4`) and a literal IPv4 address throughout, specifically
to rule that artifact out before trusting any result.

### Reproduction

1. Confirmed the box was clean first (`sudo docker service ls | grep -v
   cei-labs_` showed a pre-existing, unrelated `chinst-1-group-bandit`
   single-target instance from some earlier session -- left untouched, not
   created by this pass).
2. Launched a real `target-attacker` range for Natas the same way a player's
   CTFd launch click would, via the orchestrator's own `/instances` API
   (`type: target-attacker`, `target_image:
   ghcr.io/stoptalkingishh/cei-labs-wargames/natas-target:latest`,
   `attacker_image: ghcr.io/stoptalkingishh/cei-labs-engine/ctf-kali-novnc:latest`
   -- both already present locally on the box). Orchestrator returned 201 with
   a real `access` payload including `novnc_url:
   https://ctf.local:32002/vnc.html` and `novnc_port: 32002`.
3. Substituted the box's own current IP (`192.168.1.173`, per this doc's own
   "Stable access endpoint" section below) for `ctf.local` in that URL and
   tried it with `curl -4 -k`. **This substitution is valid and not itself a
   gap**: `novnc_url`'s hostname is never used for virtual-host routing on
   this path -- `tcp-gateway` forwards raw TCP bytes to a fixed backend by
   published port only (see `instance_types.py`'s `_gateway_service` /
   `plan_range_attacker`), so whatever hostname appears in the URL text is
   irrelevant to where the connection actually lands; only the port and the
   TLS server's own behavior matter.
4. First attempt (attacker container still mid-boot, image is ~6GB):
   `Connection was reset` -- the attacker service was legitimately `0/1`
   replicas at that instant. Waited for `1/1`, confirmed, and retried.
5. Second attempt, once the attacker was fully up (`1/1`): TCP connected,
   but the TLS handshake itself never completed --
   `openssl s_client -4 -connect 192.168.1.173:32002` sent a ClientHello
   (1538 bytes written) and got **zero bytes back, then EOF**. Not a cert
   error, not "connection refused" -- the far end wasn't speaking TLS on
   that port at all.
6. Checked the attacker container's own logs directly
   (`sudo docker logs <chrange-999-attacker task>`). It only ever started
   **one** websockify listener:
   ```
   WebSocket server settings:
     - Listen on :6080
     - Web server. Web root: /usr/share/novnc
     - No SSL/TLS support (no cert file)
     - proxying from :6080 to localhost:5901
   ```
   No second listener on `:6443`, no TLS cert generation step, nothing.

### Root cause

`docker/orchestrator/app/instance_types.py`'s `plan_range_attacker()`
forwards the gateway's no-DNS noVNC fallback port (`GATEWAY_NOVNC_PORT`)
to the attacker container's port **6443** -- a dedicated, TLS-only
websockify listener that `operator/kali-novnc/Dockerfile`'s `/start.sh` is
supposed to start alongside the original plain `:6080` one (the one
Traefik's DNS-based route still uses). That second listener, plus the
per-instance self-signed cert generation that backs it, was added by
**`cei-labs-engine` commit `22c7ca6` ("fix: encrypt the attacker
workstation's no-DNS noVNC fallback"), authored 2026-07-23 20:28:54 -0400**.

The image actually running on `192.168.1.173`
(`ghcr.io/stoptalkingishh/cei-labs-engine/ctf-kali-novnc:latest`, and
`:offline`) was **built 2026-07-23T07:30:22-04:00 -- about 13 hours before
that commit landed**. It predates the second listener entirely, so
`GATEWAY_NOVNC_PORT`'s forward target (port 6443) has nothing listening on
it in the deployed container. `tcp-gateway` (a dumb byte forwarder) accepts
the player's TCP connection on the published port and forwards it to 6443
inside the attacker container; since nothing answers there, the connection
either resets (if the container isn't even up yet) or the TLS handshake
just never gets a response (once it's up but running the stale image) --
exactly what was reproduced above.

This confirms the previous update's own third hypothesis
("an older image predating this fallback ... a separate instance of the
running box lagging behind `main`") was correct, and rules out the other
two: this was never a DNS problem (the fallback's whole point is to not
need one, confirmed above -- the hostname-vs-IP substitution is a red
herring, not the actual break), and it was never anything to do with
`target_hostname`/Swarm overlay DNS either -- that code path was never
exercised by this failure at all, since it broke one layer earlier (reaching
the attacker workstation itself), before a player would ever get to the
in-challenge target URL.

### Fix verified live

`cei-labs-engine`'s source is already correct as of `22c7ca6` -- no code
change was needed in either `cei-labs-engine` or `CEI-Labs-Wargames`. To
confirm, rebuilt `operator/kali-novnc` from the current checked-out source
directly on `192.168.1.173` (`docker build`, tagged
`ctf-kali-novnc:fix-test`, ~103s using the box's already-cached base
layers), pointed a fresh copy of the same test range's attacker service at
it (`docker service update --image ... --force`), and re-ran the exact same
`curl -4 -k https://192.168.1.173:<novnc_port>/vnc.html`: the container now
starts both listeners (`:6080` plain, `:6443` TLS with a freshly generated
self-signed cert), and the request returns `HTTP/1.1 200 OK` with the real
noVNC page (17810 bytes). Test instance and range were torn down afterward
via the orchestrator's own delete API, leaving the box back the way it was
found (aside from the pre-existing, unrelated `chinst-1-group-bandit`
instance noted above, which this pass did not touch).

**This was not touched as a "fix commit" to this repo or `cei-labs-engine`,
and the box's live production image was not swapped, deliberately**: the
verification above only ever touched a disposable, uniquely-named test
range (`owner_id=999`) created and torn down entirely within this session --
the actual fix belongs in redeploying the already-fixed image to the real
`ctf-kali-novnc:latest`/`:offline` tags this station's stack uses, which is
a live production/event-infrastructure change on a station this doc's own
"Stable access endpoint" section already treats as perishable, event-day
state -- not something to do unilaterally mid-investigation.

## What closing this needs

- ~~Confirm which of the two dependencies above is actually being hit~~ --
  done above: it's neither, cleanly -- it's a stale `ctf-kali-novnc` image
  on the station, upstream of both `attacker_url` and `target_hostname`.
- **Actual remaining action, operational not code:** rebuild
  `ghcr.io/stoptalkingishh/cei-labs-engine/kali-novnc:offline` (the
  upstream tag `scripts/offline-install.sh` re-tags into `ctf-kali-novnc:*`
  locally -- see that script's `NEEDED_OFFLINE_IMAGES` mapping) from
  current `cei-labs-engine` `main` (at or after `22c7ca6`), re-run (or
  redo the equivalent of) the offline-install re-tag step on
  `192.168.1.173`, and roll the real `chrange-*-attacker` swarm services
  over to the refreshed image. Worth also checking whether any other
  `:offline`-pattern image on this station is similarly stale relative to
  `main` before the next event, rather than assuming this was the only one.
- `target_hostname`'s Swarm-overlay-DNS design was never actually
  contradicted by anything reproduced here -- no live evidence surfaced
  that it's broken. If a future report reproduces a failure specifically
  *after* successfully reaching the attacker workstation (i.e. the noVNC
  session itself loads and connects fine, but a target URL given from
  inside it doesn't resolve), that would be the first real signal to
  investigate that path -- nothing here should be read as having tested it.
