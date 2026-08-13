# Staggered games administrator runbook

> **Historical snapshot:** This runbook records the 2026-08-06 event's planned
> controls and includes obsolete catalog counts. For the current reusable
> runbook, use
> [`CEI-Labs-Wargames/docs/staged-game-operations.md`](https://github.com/stoptalkingishh/CEI-Labs-Wargames/blob/master/docs/staged-game-operations.md).

## Roles

- **Event lead:** decides when each game starts, whether an earlier scoreboard remains open, and whether an incident warrants delay or cutoff adjustment.
- **Stage operator:** performs Sync, Start, Lock, Hide/Show, and Close in CTFd. This person announces the exact action before pressing it.
- **Scoring verifier:** independently records UTC times, watches the participant view, reconciles standings, and preserves exports/evidence.
- **Communications lead:** gives participant countdowns and explains breaks. A break is never assumed to be a technical transition.

The stage operator and scoring verifier must be different people during the rehearsal and event.

## Pre-event setup

1. Deploy the pinned Engine, Wargames, and Event commit set and record it in `TRACKER.md`.
2. Generate Wargames content and run `python scripts/validate_game_stages.py`. Required result: Bandit 35, Krypton 8, Natas 16.
3. Import challenges. In CTFd **Wargame stages**, press Sync for all games and confirm `35/35`, `8/8`, and `16/16`.
4. Confirm all states are `pending`, all stage scoreboards are hidden, and participant accounts cannot see any scored game challenge.
5. Verify host and CTFd clocks are synchronized. Record the UTC source and offset.
6. Back up CTFd/MariaDB. Open system monitoring and begin the event incident log.
7. From a clean participant account, verify registration/login, the connectivity tutorial, and that the three games have not started.

Do not start a game with a mapping-count warning, incorrect clock, failed backup, or unresolved scoring discrepancy.

## Starting a game

1. Event lead says: “Authorize start of `<game>` at the operator's next action.”
2. Communications gives a visible/audible countdown and reminds everyone to begin at **Start Here**.
3. Operator presses Start once. Repeated Start requests are idempotent, but clicking repeatedly is still an incident to record.
4. Verifier records displayed UTC `started_at`, confirms the scoreboard is visible, and confirms that only that game's challenges became available.
5. Two test participants load Start Here and make one controlled solve. Verifier checks that elapsed time is measured from this game's start.

Starting Krypton or Natas does not lock or close an earlier game. The event lead makes that decision separately.

## Break or lunch

- Announce the break and expected return time; do not change a stage merely because the room is on break.
- If scoring should continue, leave the game active.
- If standings must freeze, authorize Lock and record the cutoff before the announcement. Challenges remain available for learning, but later solves do not change that stage scoreboard.
- Hide the scoreboard only when needed for suspense, investigation, or presentation. Hiding never changes scoring data.

## Locking, hiding, and closing

- **Lock:** irreversible scoring cutoff for this implementation. Verify a controlled solve after the cutoff is accepted by CTFd but excluded from the game scoreboard.
- **Hide:** reversible participant-view control. Administrators retain access. Show again and confirm rankings are unchanged.
- **Close:** marks reconciliation complete; if performed directly from active, its timestamp becomes the cutoff.
- Never delete challenges, submissions, mappings, or database rows to correct an event-day issue.

## Incident response

If Start appears to fail, do not retry blindly. Capture the page, UTC time, CTFd logs, and audit rows; then refresh and inspect the immutable start timestamp. If scores look wrong, hide that scoreboard, leave other games running when safe, preserve the database and raw solves, and escalate to the event lead. Any manual adjudication requires a written reason, affected accounts, evidence, two-person approval, and a preserved pre-change export.

## Evidence package per game

- Engine/Wargames/Event commit IDs and deployment time
- mapping counts and manifest validation output
- start, lock, and close UTC times plus administrator audit entries
- participant and administrator screenshots for hidden/visible states
- raw solves and final stage standings export
- monitoring snapshot at start and peak load
- incidents, decisions, manual adjudications, and approvals

## Post-event

Lock any still-active stage, reconcile results, close it, preserve exports and logs, back up the database, and record the shutdown. Never use a new Start action to “rerun” a game in the same database; a future event needs a new event instance or an explicitly designed reset/migration procedure.
