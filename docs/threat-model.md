# Threat model

Answers `TRACKER.md` §7's P0 item: "Create a threat model covering
participant, malicious participant, compromised vulnerable target,
accidental admin error, stolen credential, rogue venue device, and
infrastructure failure." Assembled from real controls and findings already
implemented and audited across the four repos — this is a synthesis of
existing evidence into the formal artifact the tracker calls for, not a
new design exercise. See `dependency-version-matrix.md` for what commit of
each repo this reflects.

## System summary

Participants reach a Docker Swarm-hosted CTFd instance (`cei-labs-engine`)
over a segmented venue network (`cei-labs-net`) to solve challenges
(`CEI-Labs-Wargames`: Bandit/Linux, Krypton/Cryptography, Natas/Web). Some
challenges run intentionally vulnerable target containers reachable only
from that team's own attacker container, spun up on demand by an
orchestrator that holds read-write Docker socket access (see
`cei-labs-engine/docs/architecture-decisions.md`, ADR-002).

## Assets to protect

- Per-team flags (must not be guessable, shared across teams, or
  extractable from another team's environment)
- Other participants' containers, credentials, and CTFd sessions
- The CTFd database (scores, accounts) and its Swarm secrets
- The Docker Engine API / host itself (compromise here is total)
- The venue network's management plane (pfSense, switches, APs)
- Event availability during the live window (a DoS is a real-time failure, not just a data risk)

## Actors and threats

### 1. Ordinary participant (authenticated, no malicious intent)

Mitigated by design, not something this platform needs to actively defend
against beyond normal correctness — covered by the P0 flag-lifecycle and
scoring-correctness testing tracked elsewhere in `TRACKER.md` §2/§3.

### 2. Malicious participant (authenticated, actively attacking the platform)

The threat this architecture's isolation work is mostly aimed at.

| Threat | Mitigation | Verified? |
| :--- | :--- | :--- |
| Reach another team's target/attacker container | Trusted-gateway design: every participant-controlled container sits on a dedicated internal overlay network per team; only trusted gateways may join shared ingress | **Yes** — 42/42 native-Swarm checks passed (cross-tenant, egress, management-plane, NET_ADMIN route-abuse denial), per `TRACKER.md` §2 |
| Escape the target/attacker container to reach the host or other infra | No `privileged: true` containers found anywhere; gateways run as UID 65532, read-only, forwarding-disabled, capability-free (runtime-verified) | **Yes**, on the trusted-gateway path. Non-gateway container hardening (seccomp/AppArmor, CPU/process limits) is a separate open P0 item — not yet done |
| Guess or reuse another team's flag | Per-team dynamic flags (`secrets.token_urlsafe()`/`secrets.choice()`), rolled out to all 56 Bandit/Krypton/Natas levels across every mechanism (flat files, byte-count-sensitive files, SUID binaries, TCP/TLS daemons, git) | **Yes** — verified end-to-end against a live redeployed stack with two simulated teams (`CEI-Labs-Wargames/docs/security-audit-status.md`) |
| Read another level's credentials via shared filesystem state | Natas htpasswd files were world-readable (644, root-owned) across MPM-ITK workers — fixed to `0600`, owned per-level user | **Yes** — fixed and verified (`fix/natas-htpasswd-permissions`) |
| Leak the next level's password via a challenge's own "view source" feature | Natas 6/8/11/14 leaked their own next-level secret through `?source` | **Yes** — fixed by moving secrets out of the file `highlight_file()` dumps |
| Get real internet egress from a challenge container (pivot to attack outside infra, or exfiltrate) | `challenge-edge` network is `internal: true` — a real airgap, not just an ACL; egress denial is part of the 42/42 gateway audit | **Yes**, on the trusted-gateway path. Full outbound-blocking claim for `single-target` and non-gateway instance types is unverified on real hardware |
| Brute-force or scrape flag submissions | Traefik rate-limiting middleware scoped tightly to `/api/v1/challenges/attempt` (2 req/s, burst 5), plus a looser whole-app limit and CTFd's own submission rate limiting | Configured; not load-tested under real concurrent abuse yet |
| Residual: same-build teams share Bandit level 13's SSH keypair | Not yet fixed — explicitly documented as a known residual gap, smaller than the flag-sharing risk it was found alongside | **Open**, tracked, low severity |

### 3. Compromised vulnerable target (a challenge container that gets exploited, by design)

This is the *intended* outcome of most Web-track challenges — the threat
is the blast radius after a player succeeds, not the exploit itself.

| Threat | Mitigation | Verified? |
| :--- | :--- | :--- |
| Attacking a target pivots to CTFd, the orchestrator, or the host | Targets never join `ctfd-internal`/`orchestrator-internal`; only reachable from their own team's attacker via the per-team airgapped range | **Yes**, per the gateway audit above |
| Attacking a target pivots to another team | Per-team network isolation (same mechanism as malicious-participant row above) | **Yes** |
| A target's own vulnerability class (SQLi, command injection, SUID) is treated as a "finding" | Explicitly out of scope by design — these are the point of the platform, called out in every repo's `security-audit-status.md` | N/A by design |

### 4. Accidental admin/operator error

| Threat | Mitigation | Verified? | Gap |
| :--- | :--- | :--- | :--- |
| Admin action performed without CSRF protection, exploitable via a crafted link | `admin_mappings.html` forms were missing the CSRF nonce — fixed | **Yes**, live-verified (real 403 before, real 302 after, against a running CTFd) | — |
| Wrong operator action taken because no audit trail exists | — | — | **Open.** No admin action logging beyond CTFd's stock behavior; tracker §7 P1 item, not started |
| No rollback after a bad change during the event | Release-freeze process exists on paper (`TRACKER.md` §12) | Not yet exercised | **Open** — no rollback image/procedure demonstrated yet |

### 5. Stolen or leaked credential

| Threat | Mitigation | Verified? |
| :--- | :--- | :--- |
| Secret committed to a repo | All Swarm secrets are `.gitignore`d; example files use `CHANGE_ME_*` placeholders; audited across all 4 repos | **Yes**, confirmed 2026-07-12 — no committed secrets found |
| Shared/baked-in credential recoverable from a public image | `kali-novnc`/`analyst` images baked a shared VNC/operator password into the image layer itself, recoverable via `docker history` | **Yes, fixed** — both images now refuse to start with no password set at runtime; confirmed absent from image layers |
| Credential rotation before the event | Not yet a completed process step (tracker §7 notes rotation is "not yet evidenced") | **Open** |
| Stolen participant session/account | CTFd's stock session handling; no additional hardening layered on top yet | **Open** — rate limiting/admin-boundary/API-access testing not yet evidenced per tracker §7 |

### 6. Rogue venue device

| Threat | Mitigation | Verified? |
| :--- | :--- | :--- |
| Unauthorized device plugged into a spare wired port joins a live VLAN | Unused switch ports (6–9) are documented as disabled/spare, not defaulted into an access VLAN | Design-only, no physical switch available to verify |
| Rogue DHCP/DNS server on a player VLAN | DNS-rebinding protection (Unbound `private-address`) documented; DoQ (UDP/853) and DoT (TCP/853) both blocked | Design/config-only — needs a live pfSense instance |
| Two wired stations talking directly, bypassing the firewall entirely | Ordinary same-switch Layer-2 traffic never reaches pfSense — requires switch-level Port Isolation to force a routed hairpin | **Root cause confirmed by reasoning; fix specified but zero real-hardware verification exists** — this is flagged Critical in `cei-labs-net`'s own audit and is arguably the single most important unverified control in the whole threat model |
| Rogue AP or open SSID | Every SSID required to use WPA2/WPA3-Personal, no open/unauthenticated SSID on any VLAN including staff | Design-only |

### 7. Infrastructure failure

| Threat | Mitigation | Verified? |
| :--- | :--- | :--- |
| Docker node/worker becomes unavailable mid-event | — | **Open** — placement/recovery on worker loss not started (tracker §2 P0) |
| Data loss (DB, config, secrets) | Encrypted backup with corrupt-copy fail-closed proof; isolated scratch restore reconciled real counts (users/teams/challenges/submissions/solves) | **Partially verified** — scratch restore passed; a timed clean-station full-stack restore has not |
| Router/switch/AP failure | Spares/UPS/recovery rehearsal planned on paper | **Open**, not started |
| WAN loss | Offline/WAN-loss test planned | **Open**, not started |

## What this threat model does NOT yet cover

- Real-hardware verification for nearly everything in `cei-labs-net`'s
  section (this is the single largest gap in the whole model — see
  `TRACKER.md` §4/§5)
- 40-user/burst/soak-scale adversarial testing (only isolation *correctness*
  has been proven, not isolation *under load*)
- A completed audit trail / admin action logging story
- Credential rotation as a demonstrated process, not just a plan

## Sources

`cei-labs-net/docs/security-audit-status.md`, `cei-labs-engine/docs/
security-audit-status.md`, `CEI-Labs-Wargames/docs/security-audit-status.md`,
`cei-labs-engine/docs/architecture-decisions.md`, and `TRACKER.md` §2/§6/§7.
