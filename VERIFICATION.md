# Readiness Verification — Evidence Audit

**Method:** cloned all three repos and inspected them directly (code, configs, docs, CI, git history) against every line item in `TRACKER.md`. Read-only — no repo content was changed by this audit.

**Repos checked, at these commits:**

| Repo | HEAD commit | Last commit date |
|---|---|---|
| cei-labs-engine | `81da136` | 2026-07-11 17:25 |
| cei-labs-net | `84df78a` | 2026-07-10 16:13 |
| CEI-Labs-Wargames | `5937d6c` | 2026-07-11 18:13 |

All three repos were actively touched in the 48 hours before this audit — the current work is a security-audit remediation pass plus a per-team dynamic-flag rollout. The tracker document itself had not been updated to reflect that work, which is the main gap this audit closes.

Legend: **✅ Confirmed** (real evidence found) · **⚠ Partial** (some evidence, real gaps remain) · **❌ Not started** (no evidence) · **✖ Contradicted** (tracker claim is wrong given repo state).

---

## 1. Architecture and repository maturity
- Orchestration source of truth (Swarm vs K3s): **✅ Confirmed — Swarm.** `cei-labs-engine/docker/stack.yml` is a Swarm stack file; `ansible/roles/swarm/tasks/main.yml` states it explicitly replaces the old k3s-server/k3s-agent/metallb roles. The tracker's "open decision" on this is stale — it's resolved in-repo.
- Cross-repo dependency/version matrix: **❌ Not started.**
- Pin images by digest, no `latest`: **⚠ Partial.** `kali-novnc` base is pinned to a sha256 digest. `stack.yml` still uses tags (`traefik:v3.7.6`, `mariadb:10.11`, `redis:7-alpine`, `ctfd/ctfd:3.8.2`), and `.env.example` defaults `IMAGE_TAG=latest`.
- Repo baseline (README/LICENSE/install docs/diagram/changelog): **⚠ Partial.** All three repos have README + LICENSE + install/uninstall scripts. Architecture diagram exists only in cei-labs-net (`docs/network-topology.md`). No CHANGELOG anywhere.
- CI/lint required before merge: **⚠ Partial.** cei-labs-engine has 6 GitHub Actions workflows (lint + image builds). cei-labs-net and CEI-Labs-Wargames have none.
- Unit/integration/e2e tests: **⚠ Partial.** Real test suite in `cei-labs-engine/docker/orchestrator/tests/` (7 modules) and the CTFd instance-launcher plugin. No tests in cei-labs-net or Wargames.
- SBOM / dependency / secret scanning: **❌ Not started** (tooling). Manual hygiene is good — see credentials note below.
- Release tags, retention, rollback release, change control: **❌ Not started.**
- Architecture decision log: **❌ Not started** (informal status docs exist but aren't a structured ADR log).

## 2. Engine and orchestration
- Clean install verified end-to-end: **❌ Not started** (install scripts exist; no record of a second-operator run).
- Dynamic flag generation: **✅ Confirmed.** `docker/orchestrator/app/instance_types.py` uses `secrets.token_urlsafe()`/`secrets.choice()`; `docker/ctfd/plugins/instance-launcher/flags.py` implements per-team flags. Rolled out to Bandit, Krypton, and Natas in Wargames.
- Flag lifecycle testing: **⚠ Partial.** SSH/port reuse and live isolation tested; expiration/reset/full lifecycle not fully covered.
- Tenant isolation: **✅ Native-Swarm gate passed.** Participant-controlled targets/attackers remain on dedicated internal overlays; trusted gateways own exposure. The 42/42 station audit proved positive web/SSH/noVNC access, denied egress/cross-tenant/management reach, denied NET_ADMIN route abuse, and UID 65532/read-only/zero-capability/forwarding-disabled gateways. Repeat this gate on every frozen release.
- Privileged containers / host mounts: **⚠ Partial.** No `privileged: true` anywhere. But `docker.sock` is mounted into Traefik (read-only) and the orchestrator (read-write) — a real trust boundary that the tracker's P0 item ("removed unless justified") doesn't yet have a written justification for.
- Idempotent/concurrency-safe lifecycle ops: **✅ Deployed verification passed.** Cold 1/5/10/20, 20 identical creates, and 20 parallel relaunches completed with zero 5xx/non-JSON responses and no residue. A fresh ten-persona diagnostic found launcher-validation and CTFd dialect issues; Engine `954243a` fixed both and the final live explicit-launch/status retest passed without 5xx.
- Health/readiness checks: **✖ Contradicted.** No `healthcheck:` blocks exist in `stack.yml` at all.
- Resource limits: **⚠ Partial.** Memory limits/reservations + restart policies on 5 services in `stack.yml`; no CPU limits at the stack level.
- Worker recovery, quotas, dashboards, centralized logs/metrics, and time sync: **⚠ Partial/open.** Engine now has btop plus retained host/Docker telemetry, encrypted backup/verification tooling, corrupt-copy rejection, and an isolated scratch restore. A clean-station full-stack restore, centralized dashboards/alerts, quotas, and failure-injection recovery remain open.

## 3. Wargames and CTF content
- Challenge inventory: **⚠ Partial.** `docs/{bandit,krypton,natas}/writeups.md` (790 lines, all 56 levels) plus `learning-objectives.md` and `instructor-cheatsheet.md` exist — strong content, but not structured as the formal inventory table the tracker asks for (owner, points, reset method per row).
- Clean-account playthroughs: **⚠ Partial.** Full solution writeups imply internal playthroughs happened; no independent tester log recorded.
- Difficulty/timing validated with real testers: **❌ Not started.**
- Scoring rules/tie-break/export: **⚠ Implemented, deployment verification open.** The staggered-game feature defines independent clocks, deterministic ties, lock cutoffs, and CSV/JSON exports. Unit/static checks pass; deployed CTFd/MariaDB concurrency and reconciliation remain open.
- Web Exploitation isolation: **✅ Native-Swarm architecture gate passed.** The target/attacker range and trusted gateway passed positive access, egress denial, management/cross-tenant denial, and route-abuse checks. Full-catalog Natas load and reset testing remain open.
- Vulnerable services can't reach infra/internet/venue: **⚠ Proven for the station gateway test topology; venue/router enforcement still requires hardware validation.**
- Content review, image/secret scanning, offline docs, post-event feedback: **❌ Not started.**

## 4. Router, VLANs, DNS, DHCP, wired network
**⚠ Partial across the board — design done, hardware validation not.** `cei-labs-net/config/pfsense/*.xml` are real pfSense config fragments (DoH blocking, IPv6 disable, DNS-redirect NAT, limiters, player-peer isolation, QoS queues, reference allowlist). `docs/network-topology.md`, `docs/firewall-rule-order.md`, `docs/security-qos-policy.md`, `docs/verification-checklist.md` are detailed and specific (VLAN IDs, IP plan, DHCP scopes). But the repo's own `docs/security-audit-status.md` states 5 of 6 findings "still need a live pfSense instance / real hardware to test." No physical appliance evidence exists in-repo — this whole section is un-validated on real gear.

## 5. Wireless access points
**❌ Not started (deployment), planning only.** No AP vendor config anywhere. Docs specify SSID-to-VLAN mapping, mandatory WPA2/3-Personal, AP client isolation requirement, and a "Day-Of Smoke Test" procedure — a plan, not evidence of a survey, AP sizing, or load test. Tracker's own baseline statement ("wireless access points are not configured") is confirmed accurate.

## 6–13. Load/stress testing, security, observability, recovery, participant experience, and event operations
**⚠ Started, major release gates remain open.** Engine has a deterministic load harness, three adversarial/persona checkpoints including a completed ten-persona diagnostic, `btop`, retained timestamped telemetry, encrypted backup verification, corruption rejection, and isolated scratch-restore proof. Still missing are the full 59-challenge station deployment, ten-concurrent/full-attendance rehearsal, soak/failure injection, centralized alerts, clean-station full-stack restore, final network validation, and complete GO/NO-GO evidence.

The exception: `CEI-Labs-Wargames/docs/participant-quickstart.md` and `docs/troubleshooting-faq.md` cover part of §9 (participant quick start). Accessibility review and help-desk identity-verification procedure are still missing.

## Security audit pass (cross-cutting — the one thing that's genuinely ahead of the tracker)
A real, well-documented security review exists: `docs/security-audit-status.md` in each repo, with severity, branch, and verification method per finding. **Fixed and live-verified** (engine/wargames, against a real local Swarm stack): CSRF gaps, a baked-in shared VNC password (removed), kali-rolling base pinned to digest, Natas htpasswd permissions, the full per-team dynamic-flag migration. **Fixed but config-only / pending hardware** (net repo): VLAN40 peer-isolation gap, IPv6 disabled on player VLANs, DoQ blocking, WPA2/3 requirement, DNS-rebinding protection.

## Credential hygiene
**✅ Confirmed clean.** No committed secrets found. `docker/secrets.example/*.txt` contain only `CHANGE_ME_*` placeholders; real secrets paths (`docker/secrets/`, `docker/.env`, `ansible/group_vars/all.yml`, `.ctf/`) are `.gitignore`d in every repo; a grep for private-key headers / AWS / GitHub / Slack token patterns across all tracked files returned nothing.

---

## Net effect on the tracker

Several Engine P0 correctness and isolation gates are now met, but the event
is still NO-GO because catalog-scale capacity, clean deployment/restore,
network hardware, DNS/TLS, staffing, and full rehearsal gates remain open.
`TRACKER.md` is the current operational status source; this document preserves
the original audit plus dated addenda and corrections.

Publication follow-up (2026-07-15): all four repository branches were pushed
and matched against their live remote heads. Wargames `Validate` passed at
`581544f`. Engine `Validate`, Analyst image, and Kali noVNC image workflows
passed at `2fe9338`; CTFd, orchestrator, and TCP gateway image workflows also
passed on the immediately preceding published head. Event and Net currently
define no GitHub Actions workflows.

## 2026-07-14 staggered-games feature addendum

- **Engine implementation:** the locally merged staggered-games work contains three persistent game records, immutable/idempotent starts, database row locking, exact challenge mappings, independent visibility, lock/close cutoffs, separate user/team standings, an administrator audit table, and CSV/JSON exports. The plugin is copied into the CTFd 3.8.2 image.
- **Automated evidence:** 8 framework-free unit tests pass for transitions, start/lock boundary inclusion, pre-start exclusion, overlapping games, and deterministic ties. Python compilation and Git whitespace checks pass. This is unit/static evidence, not deployed integration evidence.
- **Wargames evidence:** `game-stages.yml` declares Bandit 35, Krypton 8, and Natas 16. A standard-library validator passed against all three source builders and a freshly generated 59-challenge content tree.
- **Known scoring scope:** per-game standings total mapped challenge values. Global awards and paid-hint deductions lack game attribution and are intentionally excluded pending an explicit policy/design.
- **Still open before production:** build/deploy the image; test administrator CSRF/auth behavior; smoke-test participant visibility; run user and team modes; race simultaneous Starts against MariaDB; reconcile CSV/JSON against raw solves; restart/restore persistence; and execute the documented multi-participant stage-operation stress profile.
