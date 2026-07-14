# CEI Labs — Event Readiness

Simple task list for the admin team: what's done, what's in progress, and what's still needed before the CEI Labs live CTF event.

- **[TRACKER.md](TRACKER.md)** — the detailed engineering checklist (13 sections, technical evidence, risk register).
- **[VERIFICATION.md](VERIFICATION.md)** — the proof behind that checklist (files/commits inspected).

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
- ✅ Fixed a bug where fast clicking could break lab creation — *stoptalkingishh*
- 🔶 Make sure participants can't access each other's labs/data — *stoptalkingishh* (one open issue: participants can currently reach each other's networks over the internet — actively being fixed)
- ⬜ Set usage limits per participant (CPU, memory, time)
- ⬜ Set up automatic health checks and alerts
- ⬜ Set up backups for the lab system
- ⬜ Build a simple staff dashboard (who's using what, right now)

### 3. CTF challenges/content
- 🔶 Finish writing all challenges (56 levels written) — *stoptalkingishh*
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
- ⬜ Run a full-scale test with the real target number of participants
- ⬜ Run an "all day" endurance test

### 7. Security
- 🔶 Run a security review and fix what's found — *stoptalkingishh* (first pass done)
- ✅ Confirmed no passwords/secrets are exposed anywhere — *stoptalkingishh*
- ⬜ Write a formal "what could go wrong" document
- ⬜ Set rules for acceptable use and what happens if someone misbehaves

### 8. Backups & monitoring
- ⬜ Decide what data needs backing up
- ⬜ Set up backups and test restoring from one
- ⬜ Set up dashboards/alerts so staff know if something breaks

### 9. Participant experience
- 🔶 Write a one-page "getting started" guide for participants — *stoptalkingishh*
- 🔶 Build a form asking what device participants are bringing (laptop/tablet that can run SSH) and flag anyone who needs a loaner — *stoptalkingishh* (form built, not yet sent to participants)
- ⬜ Test that different laptops/browsers/devices actually work
- ⬜ Review for accessibility (colors, screen readers, etc.)

### 10. Event-day operations
- ⬜ Write a real event-day runbook (setup, monitoring, what to do if something breaks)
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
| cei-labs-engine | `81da136` | 2026-07-11 |
| cei-labs-net | `84df78a` | 2026-07-10 |
| CEI-Labs-Wargames | `5937d6c` | 2026-07-11 |

All three are under active development — treat this as a snapshot, not a static record.
