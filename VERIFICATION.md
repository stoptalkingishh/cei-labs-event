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
- Tenant isolation: **⚠ Partial.** `cap_drop: ALL` + narrow `cap_add` implemented and live-verified. **Gaps, explicitly documented in-repo:** `no_new_privileges`/`pids_limit` not implemented (docker-py SDK limitation); `read_only` rootfs not enabled anywhere; outbound-blocking claims unverified outside a Docker Desktop/WSL2 test environment — needs re-testing on real Swarm hardware.
- Privileged containers / host mounts: **⚠ Partial.** No `privileged: true` anywhere. But `docker.sock` is mounted into Traefik (read-only) and the orchestrator (read-write) — a real trust boundary that the tracker's P0 item ("removed unless justified") doesn't yet have a written justification for.
- Idempotent/concurrency-safe lifecycle ops: **✖ Risk flagged.** A multi-worker race condition is documented (gunicorn `--workers 2` gives two independent in-memory stores); current mitigation is pinning to `--workers 1`, not a real fix. This is a concrete correctness risk under concurrent event load.
- Health/readiness checks: **✖ Contradicted.** No `healthcheck:` blocks exist in `stack.yml` at all.
- Resource limits: **⚠ Partial.** Memory limits/reservations + restart policies on 5 services in `stack.yml`; no CPU limits at the stack level.
- Worker recovery, quotas, dashboards, backups, centralized logs/metrics, time sync: **❌ Not started** — no backup scripts, no Prometheus/Grafana config, no dashboard code beyond stock CTFd admin UI.

## 3. Wargames and CTF content
- Challenge inventory: **⚠ Partial.** `docs/{bandit,krypton,natas}/writeups.md` (790 lines, all 56 levels) plus `learning-objectives.md` and `instructor-cheatsheet.md` exist — strong content, but not structured as the formal inventory table the tracker asks for (owner, points, reset method per row).
- Clean-account playthroughs: **⚠ Partial.** Full solution writeups imply internal playthroughs happened; no independent tester log recorded.
- Difficulty/timing validated with real testers: **❌ Not started.**
- Scoring rules/tie-break/export: **❌ Not started** — relies on stock CTFd behavior, undocumented.
- Web Exploitation isolation: **⚠ Partial.** Attacker/target isolation implemented and live-verified for Natas. Full outbound-blocking claim unverified on real hardware (same caveat as §2).
- Vulnerable services can't reach infra/internet/venue: **❌ Not verified on real hardware.**
- Content review, image/secret scanning, offline docs, post-event feedback: **❌ Not started.**

## 4. Router, VLANs, DNS, DHCP, wired network
**⚠ Partial across the board — design done, hardware validation not.** `cei-labs-net/config/pfsense/*.xml` are real pfSense config fragments (DoH blocking, IPv6 disable, DNS-redirect NAT, limiters, player-peer isolation, QoS queues, reference allowlist). `docs/network-topology.md`, `docs/firewall-rule-order.md`, `docs/security-qos-policy.md`, `docs/verification-checklist.md` are detailed and specific (VLAN IDs, IP plan, DHCP scopes). But the repo's own `docs/security-audit-status.md` states 5 of 6 findings "still need a live pfSense instance / real hardware to test." No physical appliance evidence exists in-repo — this whole section is un-validated on real gear.

## 5. Wireless access points
**❌ Not started (deployment), planning only.** No AP vendor config anywhere. Docs specify SSID-to-VLAN mapping, mandatory WPA2/3-Personal, AP client isolation requirement, and a "Day-Of Smoke Test" procedure — a plan, not evidence of a survey, AP sizing, or load test. Tracker's own baseline statement ("wireless access points are not configured") is confirmed accurate.

## 6–13. Load/stress testing, security testing beyond the audit pass, observability, backup/DR, participant experience, event ops, hosting decision, final-week/event-day checklists
**❌ Not started, with one exception.** No load-test harness (no Locust/k6/JMeter), no soak/failure-injection scripts, no Prometheus/Grafana/alerting config, no backup/restore scripts or RPO/RTO docs, no incident-response/event runbook (the only "runbook" found, `CEI-Labs-Wargames/docs/facilitation-runbook.md`, is a classroom facilitation guide, not an event-ops runbook), no GO/NO-GO artifacts, no hosting/Platform One decision record.

The exception: `CEI-Labs-Wargames/docs/participant-quickstart.md` and `docs/troubleshooting-faq.md` cover part of §9 (participant quick start). Accessibility review and help-desk identity-verification procedure are still missing.

## Security audit pass (cross-cutting — the one thing that's genuinely ahead of the tracker)
A real, well-documented security review exists: `docs/security-audit-status.md` in each repo, with severity, branch, and verification method per finding. **Fixed and live-verified** (engine/wargames, against a real local Swarm stack): CSRF gaps, a baked-in shared VNC password (removed), kali-rolling base pinned to digest, Natas htpasswd permissions, the full per-team dynamic-flag migration. **Fixed but config-only / pending hardware** (net repo): VLAN40 peer-isolation gap, IPv6 disabled on player VLANs, DoQ blocking, WPA2/3 requirement, DNS-rebinding protection.

## Credential hygiene
**✅ Confirmed clean.** No committed secrets found. `docker/secrets.example/*.txt` contain only `CHANGE_ME_*` placeholders; real secrets paths (`docker/secrets/`, `docker/.env`, `ansible/group_vars/all.yml`, `.ctf/`) are `.gitignore`d in every repo; a grep for private-key headers / AWS / GitHub / Slack token patterns across all tracked files returned nothing.

---

## Net effect on the tracker

The tracker undersells three things (orchestration decision resolved, dynamic flags done, a real security-audit pass completed) and is accurate or slightly optimistic on everything else — no P0 release gate is met, the network/wireless sections are correctly flagged as unvalidated, and sections 6–13 are correctly at zero. `TRACKER.md` has been updated in place to reflect the items above, each tagged with this audit's date.

## 2026-07-14 staggered-games feature addendum

- **Engine implementation:** `feature/staggered-wargames` contains three persistent game records, immutable/idempotent starts, database row locking, exact challenge mappings, independent visibility, lock/close cutoffs, separate user/team standings, an administrator audit table, and CSV/JSON exports. The plugin is copied into the CTFd 3.8.2 image.
- **Automated evidence:** 8 framework-free unit tests pass for transitions, start/lock boundary inclusion, pre-start exclusion, overlapping games, and deterministic ties. Python compilation and Git whitespace checks pass. This is unit/static evidence, not deployed integration evidence.
- **Wargames evidence:** `game-stages.yml` declares Bandit 35, Krypton 8, and Natas 16. A standard-library validator passed against all three source builders and a freshly generated 59-challenge content tree.
- **Known scoring scope:** per-game standings total mapped challenge values. Global awards and paid-hint deductions lack game attribution and are intentionally excluded pending an explicit policy/design.
- **Still open before production:** build/deploy the image; test administrator CSRF/auth behavior; smoke-test participant visibility; run user and team modes; race simultaneous Starts against MariaDB; reconcile CSV/JSON against raw solves; restart/restore persistence; and execute the documented multi-participant stage-operation stress profile.
