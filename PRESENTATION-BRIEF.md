# Presentation brief: CEI Labs staggered wargames

## Core message

CEI Labs is one event with three independently released games—not three disconnected events and not an automatic level transition. Everyone starts Bandit, Krypton, and Natas at each game's **Start Here** challenge when the administrator releases it. Later games can open while earlier games remain playable.

## Participant deck outline

1. Welcome, learning goals, acceptable-use boundary, help process.
2. The three games: Bandit/Linux basics, Krypton/cryptography, Natas/web security.
3. Timeline graphic: morning Bandit, planned break/lunch, later Krypton and Natas releases. Label times as planned windows, not automatic triggers.
4. Start Here journey: sign in, open the released game, launch an environment when required, solve, submit, and recover/reset safely.
5. Scoring: each game has its own clock and scoreboard; elapsed time begins when that game is released. Ties use score, then last scoring solve elapsed time, then name.
6. Breaks: an announcement pauses the room, not necessarily the technical game. The presenter must say whether scoring remains open.
7. Scoreboard states: visible, temporarily hidden, or locked. Lock means later learning solves do not change that game's standings.
8. Safety, help desk, outage communications, and closing/results process.

## Staff-only deck outline

1. Roles and two-person stage authorization.
2. Preflight: versions, backup, clock sync, challenge counts `35/8/16`, pending state, hidden scoreboards.
3. Start sequence and participant smoke solve.
4. Independent decisions: start next game, keep earlier active, lock, hide/show, close.
5. Incident tree: failed start, mapping mismatch, score discrepancy, platform degradation.
6. Evidence checklist and result reconciliation.
7. Stress/rehearsal scenario with overlapping active games and solve bursts at start/lock boundaries.

## Visual requirements

- Use a horizontal timeline with separate colored lanes for Bandit, Krypton, and Natas; overlapping bars show that multiple games may remain active.
- Put lunch/break in a neutral lane so it is not mistaken for a state transition.
- Show each game clock beginning at `00:00` on its own administrator Start marker.
- Use one small state diagram: Pending → Active → Locked → Closed, with Hide/Show beside the path because visibility is independent.
- Avoid promising exact release times until the event lead approves them.

## Facts the slides must not contradict

- Start time is immutable and repeated Start is idempotent.
- Mapping changes are blocked after start.
- Lock freezes the scoreboard cutoff but does not remove learning access.
- Hide/Show never alters results.
- Global CTFd awards and paid-hint deductions are outside the per-game scoreboard unless explicit attribution is added later.
- Deployment rehearsal and multi-participant stress testing are still required before production sign-off.
