# CEI Labs Staggered Games Plan

## Event format

The event contains three independently started games:

1. Bandit — Linux Basics
2. Krypton — Cryptography
3. Natas — Web Security

This is not a hard transition between rooms or platforms. Later games are
released on an administrator's schedule, while earlier games may remain open.
The anticipated flow is Bandit in the morning, a break/lunch period as the
group reaches the planned milestone, Krypton after the break, and Natas later.

## Scoreboards

Each game has a separate scoreboard and its own UTC start timestamp. Elapsed
time and tie breaking are calculated from that game's start, not the global
event opening. Administrators may:

- start a pending game;
- leave multiple games active concurrently;
- hide or reveal a scoreboard without changing results;
- lock scoring at a cutoff while preserving challenges for review;
- close and export verified final standings.

No control deletes solve history. The stock overall CTFd scoreboard may remain
available for staff, but stage awards use only the appropriate game scoreboard.

## Draft event-day sequence

| Checkpoint | Administrator action | Participant experience |
|---|---|---|
| Doors open | Verify all stages pending; scoreboards hidden | Connectivity/tutorial only |
| Game 1 | Start Bandit; reveal Bandit scoreboard | Everyone begins at Start Here/level 0 |
| Break/lunch | Leave Bandit active or lock it per event lead decision | Break; earlier game state preserved |
| Game 2 | Start Krypton; reveal Krypton scoreboard | Krypton begins at its own zero time |
| Later release | Start Natas; reveal Natas scoreboard | Natas begins at its own zero time |
| Each cutoff | Lock, reconcile, export, then close | Results become final after verification |

## Decisions required before rehearsal

- Planned and latest-allowed start window for each game.
- Whether an earlier game remains scoreable after the next game starts.
- Award structure: per-game only, or per-game plus an overall recognition.
- Tie-break rule approval: last scoring solve elapsed time, measured from that
  game's start.
- How late submissions during network/server incidents are adjudicated.
- Who may operate stage controls and who independently verifies exports.

## Rehearsal and evidence

The dress rehearsal must use multiple participant accounts and overlap at
least two active stages. Evidence must include admin audit entries, UTC start
and cutoff times, raw solves, per-stage CSV/JSON exports, screenshots of hidden
and visible scoreboards, and reconciliation totals. Future 10/20/40-user tests
must include synchronized solve bursts around stage start and lock boundaries.

## Presentation notes

Event slides should explain the staggered release visually, show that each
game starts at zero on its own clock, make clear that earlier games may remain
available, and separate break/lunch timing from an automatic technical
transition. Staff-only slides should show the start/lock/hide/close checklist
and recovery/escalation path.
