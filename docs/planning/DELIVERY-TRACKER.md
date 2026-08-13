# Cross-Repository Delivery Tracker

This is the archive repository's current work index. It tracks integration
acceptance and delivery dependencies without duplicating implementation plans
owned by the component repositories.

## Ownership

| Area | Canonical repository | Archive responsibility |
| --- | --- | --- |
| Challenge content, participant guidance, staged-game operations, presentation source | `CEI-Labs-Wargames` | Record event-specific outcomes and acceptance evidence. |
| CTFd, orchestration, stage state, scoring exports, and backups | `cei-labs-engine` | Record cross-repository acceptance status. |
| Venue network, DNS, firewall, and wireless capacity | `cei-labs-net` | Record venue-specific evidence and decisions. |
| Event agenda, staffing, communications, AAR, and raw logs | `cei-labs-event` | Own and retain. |

## Current delivery gates

| Gate | Owner | Status | Evidence required |
| --- | --- | --- | --- |
| Current Wargames catalog builds and validates | Wargames | Open | Generated catalog plus `validate_game_stages.py` output from the release revision. |
| Stage mapping and independent starts work in deployed CTFd | Engine + Wargames | Open | Authenticated deployed smoke test, audit entries, and mapping reconciliation. |
| Natas attacker workstation and target isolation are release-ready | Engine + Wargames | Open | Published immutable images, launch smoke test, and isolation evidence. |
| Stage lock/export/reconciliation works under concurrent activity | Engine | Open | Multi-account rehearsal with raw solves and CSV/JSON reconciliation. |
| Venue network supports the approved attendance | Net | Open | On-site functional, isolation, and capacity test evidence. |
| Full event rehearsal is signed off | Event lead + all owners | Open | Roles, timing, incident decisions, evidence package, and GO/NO-GO record. |

## Rules

- Update a gate only with dated, reproducible evidence and a link or path to
  the owner repository's release reference.
- Do not copy challenge walkthroughs, image-build details, or component
  runbooks into this archive. Link to their canonical source instead.
- Preserve completed event evidence in `docs/event/` and `WORK_LOGS/`; it is
  historical context, not current release certification.
