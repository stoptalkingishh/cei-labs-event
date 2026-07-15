# CEI Labs — Event Readiness

Simple task list for the admin team: what's done, what's in progress, and what's still needed before the CEI Labs live CTF event.

- **[TRACKER.md](TRACKER.md)** — the detailed engineering checklist (13 sections, technical evidence, risk register).
- **[VERIFICATION.md](VERIFICATION.md)** — the proof behind that checklist (files/commits inspected).
- **[STAGGERED-GAMES-PLAN.md](STAGGERED-GAMES-PLAN.md)** — approved behavior for independently starting Bandit, Krypton, and Natas.
- **[STAGGERED-GAMES-RUNBOOK.md](STAGGERED-GAMES-RUNBOOK.md)** — administrator rehearsal and event-day controls.
- **[PRESENTATION-BRIEF.md](PRESENTATION-BRIEF.md)** — source material and slide outline for the presentation team.

You shouldn't need those two for day-to-day tracking — everything below is the plain-language version. If a task needs more detail, its section number matches `TRACKER.md`.

## Bottom line

**Not ready yet.** Most of the software/platform work is on track, but almost nothing on the event-logistics side (network hardware, WiFi, staffing, rehearsal, backups) has started.

## Task list

**Status:** ✅ Done · 🔶 In progress · ⬜ Needed — **Owner** shown for done/in-progress items; needed items have no owner assigned yet.

### 1. Platform setup
- ✅ Decide the platform: Docker Swarm — *stoptalkingishh*
- 🔶 Lock down which software versions everything runs on — *stoptalkingishh*
- 🔶 Write setup docs (README, diagrams, how to install/upgrade) — *stoptalkingishh*
- 🔶 Add automated checks before code changes go live — *stoptalkingishh*
- ⬜ Scan for known security issues in the software being used
- ⬜ Set a "final version" freeze date and rollback plan

### 2. Lab system (the engine running the CTF)
- ✅ Each participant gets their own isolated lab environment — *stoptalkingishh*
- ✅ Unique secret flags generated automatically per team — *stoptalkingishh*
- ✅ Fix fast-click/concurrent lab creation and reset behavior — *stoptalkingishh* (real-Swarm 1/5/10/20 cold waves, 20-way same-key create/relaunch, and the final post-fix persona lifecycle retest passed without 5xx/non-JSON responses or residue)
- ✅ Make sure participants can't access each other's labs/data — *stoptalkingishh* (native Swarm trusted-gateway gate passed 42/42: positive web/SSH/noVNC access, denied egress/cross-team/management access, route-abuse denial, and gateway runtime hardening)
- ⬜ Set usage limits per participant (CPU, memory, time)
- ⬜ Set up automatic health checks and alerts
- 🔶 Set up backups for the lab system — *stoptalkingishh* (encrypted backup, checksum/decryption validation, corrupt-copy rejection, and isolated scratch restore of config/uploads/orchestrator state/MariaDB passed; a timed clean-station full-stack restore remains required)
- ⬜ Build a simple staff dashboard (who's using what, right now)

### 3. CTF challenges/content
- 🔶 Finish writing all challenges (56 levels written) — *stoptalkingishh*
- 🔶 Add separate administrator-started Bandit/Krypton/Natas scoreboards — *stoptalkingishh* (implementation and unit checks complete on feature branches; deployment rehearsal remains)
- ⬜ Have real test participants (not just staff) try the challenges
- ⬜ Confirm scoring and tie-breaker rules work correctly
- ⬜ Confirm practice targets can't reach the real internet or other teams

### 4. Router & wired network
- ⬜ Get the router/network hardware
- 🔶 Finalize the network design (who can talk to whom) — *stoptalkingishh* (designed, not yet tested on real equipment)
- ⬜ Set up and test the router/switches on-site

### 5. WiFi
- ⬜ Survey the venue for WiFi coverage
- ⬜ Buy and configure the WiFi access points
- ⬜ Test WiFi with a full room of devices at once

### 6. Load testing (can it handle everyone at once?)
- 🔶 Build a tool to simulate many participants at once — *stoptalkingishh*
- 🔶 Re-run the 10-persona test after the concurrency fix — *stoptalkingishh* (ten fresh-account personas completed in four-slot waves; launcher validation and CTFd dialect defects were fixed and the final retest passed, but this is not 10-concurrent acceptance and the station exposed only 2 of 59 challenges)
- ⬜ Run a full-scale test with the real target number of participants
- ⬜ Run an "all day" endurance test
- ⬜ Stress staggered game start/lock/hide actions during participant solve and scoreboard bursts

### 7. Security
- 🔶 Run a security review and fix what's found — *stoptalkingishh* (first pass done)
- ✅ Confirmed no passwords/secrets are exposed anywhere — *stoptalkingishh*
- ⬜ Write a formal "what could go wrong" document
- ⬜ Set rules for acceptable use and what happens if someone misbehaves

### 8. Backups & monitoring
- ⬜ Decide what data needs backing up
- 🔶 Set up backups and test restoring from one — scratch restore passed; clean-station full-stack rehearsal remains open
- 🔶 Add host resource monitoring — *stoptalkingishh* (`btop` and the timestamped host/Docker collector were deployed and exercised during the deterministic station run; Engine PR #2 adds Ansible-managed Fedora installation and equivalent firewalld/UFW rules with green CI, pending merge and an approved live Fedora role run; centralized dashboards/alerts remain open)

### 9. Participant experience
- 🔶 Write a one-page "getting started" guide for participants — *stoptalkingishh*
- 🔶 Build a form asking what device participants are bringing (laptop/tablet that can run SSH) and flag anyone who needs a loaner — *stoptalkingishh* (form built, not yet sent to participants)
- ⬜ Test that different laptops/browsers/devices actually work
- ⬜ Review for accessibility (colors, screen readers, etc.)

### 10. Event-day operations
- 🔶 Write a real event-day runbook (setup, monitoring, what to do if something breaks) — staggered game controls documented; full infrastructure/incident runbook remains
- ⬜ Assign staff roles for the event
- ⬜ Schedule and run a full dress rehearsal

### 11. Hosting decision
- ⬜ Decide: host on-site or on a cloud/hosting service

### 12–13. Final-week & event-day checklists
- ⬜ Freeze all changes the week before the event
- ⬜ Full walkthrough/test right before doors open
- ⬜ Plan for event-day monitoring and shutdown

## Repo freshness (as of last check)

| Repo | Last commit | Date |
|---|---|---|
| cei-labs-engine | `a1e85f0` | 2026-07-15 |
| cei-labs-net | `1d1b70a` | 2026-07-15 |
| CEI-Labs-Wargames | `581544f` | 2026-07-15 |

All three are under active development — treat this as a snapshot, not a static record.
