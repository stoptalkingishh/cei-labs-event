# Cross-repo dependency & version matrix

Answers the production-readiness tracker's §1 P0 item: "Audit all three
[four] local repositories and create a cross-repository dependency/version
matrix." One place to see what commit of each repo was verified to work
together, what images/tags they build or consume, and what ports/networks/
secrets tie them together. Update the "Verified compatible set" row whenever
a new cross-repo test pass (like the ones logged in `TRACKER.md`'s evidence
table) confirms a new combination works.

## Repos and commits

| Repo | Role | Commit as of 2026-07-15 | Notes |
| :--- | :--- | :--- | :--- |
| `cei-labs-net` | Firewall/VLAN/DNS/DHCP design | `7e86d34` | Design-complete, unvalidated on real hardware — see its own `docs/security-audit-status.md` |
| `cei-labs-engine` | Swarm orchestration, CTFd, flags, isolation | `777a05c` | Most cross-repo-tested component; see `docs/validation-session-2026-07-14-15.md` |
| `CEI-Labs-Wargames` | Challenge content (Bandit/Krypton/Natas) | `a23fbad` | Staggered-games content merged to `main` |
| `cei-labs-event` | Event ops, tracker, this doc | `02e5d04` | Holds the authoritative `TRACKER.md` |

**Correction (2026-07-15, later same day):** this doc originally claimed
`cei-labs-engine`'s staggered-game admin plugin was stuck on an unmerged
`feature/staggered-wargames` branch. That was wrong — it was based on a
local clone of `cei-labs-engine` that hadn't fetched `origin/main` in some
time (last synced around `81da136`). The real `origin/main` already had
the merge (`b177c99`, 2026-07-14) plus substantially more work on top of
it (trusted-gateway rewrite, real-Swarm station validation, CTFd-dialect
fixes) by the time this doc was first written. All commit hashes in the
table above are now current as of a real `git fetch`.

## Verified compatible set (from the 2026-07-14/15 validation session)

The one combination with real integration-test evidence behind it
(`TRACKER.md`'s test evidence log has the full detail):

| Repo | Commit | Image |
| :--- | :--- | :--- |
| `cei-labs-engine` | `954243a` | orchestrator `sha256:a99322fd...`, gateway `sha256:b39b7915...`, CTFd `cei-labs-ctfd:codex-954243a` |
| `cei-labs-net` | `180c3f0` | — (design docs only, not deployed to real hardware in this pass) |
| `CEI-Labs-Wargames` | `83e9f52` | — |
| `cei-labs-event` | `4f433ae` | — |

This passed: deterministic lifecycle (cold 1/5/10/20, identical-create 20,
relaunch 20), 42/42 trusted-gateway tenant isolation, restart persistence,
encrypted backup + corruption rejection, isolated scratch restore. It did
**not** cover: the staggered-games feature specifically (already merged by
this commit, but not exercised by this particular test pass),
40-user/burst/soak load, or the full 59-challenge catalog under
concurrency (only 2/59 were deployed).

## Images

| Image | Source | Pin (as of this session) |
| :--- | :--- | :--- |
| `traefik` | Docker Hub, `v3.7.6` | Digest-pinned: `sha256:21a3d836...` |
| `mariadb` | Docker Hub, `10.11` | Digest-pinned: `sha256:be981e41...` |
| `redis` | Docker Hub, `7-alpine` | Digest-pinned: `sha256:6ab0b6e7...` |
| `ctfd/ctfd` (base for the custom CTFd image) | Docker Hub, `3.8.2` | Digest-pinned: `sha256:870e396f...` |
| `python` (base for the orchestrator image) | Docker Hub, `3.12-slim` | Digest-pinned: `sha256:c3d81d25...` |
| `ubuntu` (base for the analyst image) | Docker Hub, `24.04` | Digest-pinned: `sha256:4fbb8e6a...` |
| `debian` (base for wargame target-base-linux) | Docker Hub, `12-slim` | Digest-pinned: `sha256:7b140f37...` |
| `kalilinux/kali-rolling` (base for kali-novnc) | Docker Hub | Already digest-pinned (2026-07 security audit): `sha256:776d57c9...` |
| `ghcr.io/<org>/cei-labs-engine/ctfd` | This project's own CI (`build-ctfd.yml`) | Tagged `sha-<7-char-commit>` per push to `main`. **Never deploy `:latest`** — `.env.example`'s `IMAGE_TAG` now defaults to a placeholder that forces picking an explicit sha tag. |
| `ghcr.io/<org>/cei-labs-engine/orchestrator` | This project's own CI (`build-orchestrator.yml`) | Same `sha-<commit>` convention as above |

## Ports (engine)

| Port(s) | Service | Notes |
| :--- | :--- | :--- |
| 80, 443 | Traefik (published, Swarm ingress mesh) | Any node's IP reaches it |
| 32000–32767 | Orchestrator-assigned `single-target` instances (SSH etc.) | `ORCHESTRATOR_SSH_PORT_RANGE_START/END` in `.env` |
| 30001+ | `spawn-workspaces.sh` bulk analyst provisioning | `ANALYST_BASE_PORT`; kept below 32000 so the two provisioning paths never collide |

## Networks (engine)

| Network | Type | Purpose |
| :--- | :--- | :--- |
| `edge` | overlay, not internal | Traefik ↔ CTFd only |
| `ctfd-internal` | overlay, internal | CTFd ↔ DB ↔ Redis |
| `orchestrator-internal` | overlay, internal | CTFd's instance-launcher plugin ↔ orchestrator |
| `challenge-edge` | overlay, internal, not attachable | Traefik ↔ orchestrator-spawned public-facing containers only — never joined by DB/Redis/CTFd |
| `10.20.0.0/16` (real-hardware ingress) | non-overlapping ingress pool | Rebuilt 2026-07-14/15 after the original `/24` pool was exhausted — see `TRACKER.md` |

## Secrets (engine — Swarm secrets, files under `docker/secrets/`)

`ctfd_secret_key`, `ctfd_db_password`, `ctfd_db_root_password`, `ctf_key`,
`orchestrator_admin_password`, `plugin_shared_secret`. All `.gitignore`d;
`docker/secrets.example/` carries `CHANGE_ME_*` placeholders only. No
committed secrets found across any of the 4 repos as of the 2026-07-12
audit.

## Startup order (engine)

1. `ctfd-db`, `ctfd-redis` (no dependencies)
2. `orchestrator` (no service dependency in `stack.yml`, but functionally
   needs nothing else running first)
3. `ctfd` (`depends_on: [ctfd-db, ctfd-redis, orchestrator]` — Swarm's
   `depends_on` only affects `docker-compose up` ordering semantics, not
   Swarm scheduling; there are no `healthcheck:`/dependency-aware startup
   gates yet, a separate open P1 item)
4. `traefik` (discovers CTFd via Swarm service labels once it's up; no
   explicit ordering needed since Traefik polls the Docker API continuously)

## Cross-repo network dependency

`cei-labs-engine`'s Docker host is wired into `cei-labs-net`'s **VLAN 20**
(`10.10.20.0/24`, static/reserved) per `cei-labs-net/docs/network-topology.md`.
Players reach it from VLAN 30 (Wi-Fi, `10.10.32.0/22`) or VLAN 40 (wired,
`10.10.40.0/24`) — both firewalled to "challenge ports only" on VLAN 20 and
explicitly denied from reaching each other. This mapping has never been
exercised against real engine traffic on real hardware; it exists only as
firewall-policy design in `cei-labs-net`.
