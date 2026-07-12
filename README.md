# CEI Labs — Event Readiness

This repo is the single leadership-facing view of readiness for the CEI Labs live CTF event, kept in sync with the actual state of the three engineering repos (`cei-labs-engine`, `cei-labs-net`, `CEI-Labs-Wargames`).

- **[TRACKER.md](TRACKER.md)** — the full readiness checklist (13 sections, release gates, risk register). Every item was cross-checked against the engineering repos on 2026-07-12; corrections are tagged inline.
- **[VERIFICATION.md](VERIFICATION.md)** — the evidence behind those corrections: what was inspected, what was found, file paths and commit citations.

## Bottom line

**Not GO.** No release gate is met. That was already true in the original tracker and remains true. What changed with this verification pass is *which* work is actually done versus just written down.

**Good news the original tracker didn't reflect:** the Swarm-vs-K3s architecture question is resolved (Swarm), per-team dynamic flag generation is implemented and working, a real security-audit pass has fixed several concrete vulnerabilities (CSRF gaps, a shared VNC password, an unpinned base image), and the pfSense/VLAN network design is detailed and specific — it's just untested on physical hardware.

**New risks this pass surfaced, not previously tracked:** a documented multi-worker race condition in the lab lifecycle code (concurrent create/start/stop/reset requests can misbehave), and a Docker socket mounted into two containers without a written trust-boundary justification. Both added to the risk register in `TRACKER.md`.

**Unchanged and still the largest gaps:** nothing exists yet for load/capacity testing, backup and restore, observability/alerting, event operations (runbook, roles, rehearsal), or the hosting decision. The router/VLAN/wireless work is designed but has zero on-hardware validation.

## Status by section

| # | Area | Status | Notes |
|---|---|---|---|
| 1 | Architecture & repo maturity | ⚠ Partial | Orchestration decided (Swarm); tests/CI exist in engine repo only; no SBOM, no ADR log |
| 2 | Engine & orchestration | ⚠ Partial | Dynamic flags done; isolation partially hardened; **race condition + docker.sock risks flagged** |
| 3 | Wargames & CTF content | ⚠ Partial | Full writeups for 56 levels exist; no independent tester validation, no scoring-rule docs |
| 4 | Router, VLANs, DNS/DHCP | ⚠ Design only | Detailed pfSense configs + docs; explicitly untested on real hardware |
| 5 | Wireless access points | ❌ Not started | Confirmed — planning docs exist, zero deployment |
| 6 | Capacity/stress/failure testing | ❌ Not started | No load harness anywhere |
| 7 | Security & abuse testing | ⚠ Partial | Real audit pass completed; no formal threat model or automated scanning |
| 8 | Data, observability, backup/DR | ❌ Not started | No backup scripts, no dashboards |
| 9 | Participant experience | ⚠ Partial | Quick-start + FAQ docs exist; no accessibility or device testing |
| 10 | Event operations | ❌ Not started | Only a classroom facilitation guide exists, not an event runbook |
| 11 | Hosting decision | ❌ Not started | No decision record |
| 12–13 | Final-week / event-day checklists | ❌ Not started | — |

## Repo freshness (as of verification)

| Repo | Last commit | Date |
|---|---|---|
| cei-labs-engine | `81da136` | 2026-07-11 |
| cei-labs-net | `84df78a` | 2026-07-10 |
| CEI-Labs-Wargames | `5937d6c` | 2026-07-11 |

All three are under active development. This document should be re-verified periodically as work continues — treat it as a snapshot, not a static record.
