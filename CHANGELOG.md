# Changelog

Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
This repo predates this file (18 commits as of 2026-07-15) — entries below
start from where this file was introduced plus a milestone summary of what
came before it, not a commit-by-commit history. See `git log` for the full
record.

## [Unreleased]

### Changed
- Reorganized the repo into lifecycle folders after the 2026-08-06 event:
  pre-event planning docs moved to `docs/planning/` (TRACKER, VERIFICATION,
  staggered-game plan/runbook, presentation brief, threat model, dependency
  matrix, priority handoff, rehearsal briefing), and event-day/post-event
  records to `docs/event/` (AAR, event recap, communications recap,
  deployment run). `WORK_LOGS/` holds the raw operator logs; `presentation/`
  holds the decks. `README.md` now serves as the archive index and reflects
  that the event is complete.

### Added
- `docs/planning/briefings/CEI-Labs-Wargames-Rehearsal-and-BC-Briefing-Guide.docx`:
  event-planning guide centered on the existing Wargames learning objectives,
  with the 16 July rehearsal sequence, 23 July BC briefing framework,
  presenter responsibilities, logistics/DRAW/equipment checks, evaluation
  criteria, and decisions requiring confirmation.
- `docs/planning/dependency-version-matrix.md`: cross-repo commit/image/port/
  network/secrets/startup-order matrix (`docs/planning/TRACKER.md` §1 P0 item). Records
  the one combination with real integration-test evidence behind it, and
  flags that `cei-labs-engine`'s staggered-game work is still stuck on an
  unmerged feature branch, not on `main`.
- `docs/planning/threat-model.md`: the formal threat-model artifact `docs/planning/TRACKER.md`
  §7 P0 calls for, assembled from the isolation/security-audit work
  already done across all four repos (participant, malicious participant,
  compromised target, admin error, stolen credential, rogue venue device,
  infrastructure failure).

## Milestones before this file existed

- `docs/planning/TRACKER.md` established as the live, cross-repo-audited production-
  readiness tracker (more current than the static baseline template in
  the operator's Downloads folder) — cross-checked against real repo
  state on 2026-07-12 and 2026-07-14/15.
- Staggered-games event operations (runbook, plan, kickoff deck) merged
  to `main`.
- Participant equipment/device-intake form built (2026-07-13) — **not yet
  distributed to participants**, still an open tracker item.

See `docs/planning/TRACKER.md` and `docs/planning/VERIFICATION.md` for full detail.
