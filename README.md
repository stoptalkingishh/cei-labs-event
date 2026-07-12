# CEI Labs Production Readiness Tracker

## Purpose

This tracker covers the work required to make the CEI Labs cyber range stable, secure, supportable, and ready for a live CTF event. It spans all three repositories and the on-site infrastructure:

- **cei-labs-engine** — game orchestration, CTFd, Docker Swarm services, user lab containers, and lifecycle management.
- **cei-labs-net** — firewall/router, VLANs, DNS, DHCP, routing, access control, and site networking.
- **CEI-Labs-Wargames** — Linux Fundamentals, Cryptography, and Web Exploitation labs; images/VMs; flags; scoring; and CTFd content.

> **Current baseline:** Up to three local users can authenticate, start labs, connect over SSH, and exercise the labs. The router and wireless access points are not configured, and neither the application stack nor the site network has been tested at the intended event load.

## Status and priority

- Status: `[ ]` Not started · `[~]` In progress · `[x]` Complete · `[!]` Blocked
- Priority: **P0** event blocker · **P1** required for production · **P2** valuable hardening/improvement
- A task is complete only when its acceptance criteria are met and evidence is linked or recorded.

## Release gates

The event is **GO** only when all of the following are true:

- [ ] **P0 — Owner: TBD:** All P0 tasks in this tracker are complete with test evidence.
- [ ] **P0 — Owner: TBD:** A full 40-user rehearsal completes without cross-user access, lost flags, scoring corruption, or unrecovered service failure.
- [ ] **P0 — Owner: TBD:** Router, VLANs, wired network, and wireless network pass functional, isolation, capacity, and recovery tests at the venue.
- [ ] **P0 — Owner: TBD:** Every lab has been solved from a clean participant account using only the published instructions.
- [ ] **P0 — Owner: TBD:** Backup restoration, stack restart, and at least one failed-node recovery have been demonstrated.
- [ ] **P0 — Owner: TBD:** Event staff complete a tabletop exercise and have an approved runbook, escalation path, and rollback/abort criteria.
- [ ] **P1 — Owner: TBD:** No unresolved critical/high security findings; any accepted risks have an owner and written mitigation.

## 1. Architecture and repository maturity

- [ ] **P0 — Owner: TBD:** Resolve the orchestration source of truth: current notes say Docker Swarm, while the public engine description mentions K3s. Update diagrams, deployment files, and documentation to name the actual event platform consistently. **Done when:** one supported topology is documented and a clean deployment follows it successfully.
- [ ] **P0 — Owner: TBD:** Audit all three local repositories and create a cross-repository dependency/version matrix. **Done when:** compatible commits/releases, image tags, ports, networks, secrets, schemas, and startup order are recorded.
- [ ] **P0 — Owner: TBD:** Define a stable release candidate and freeze deadline. Pin container images by immutable digest and dependencies by version; do not deploy mutable `latest` tags.
- [ ] **P1 — Owner: TBD:** Add a consistent repository baseline: README, architecture diagram, prerequisites, clean install, upgrade/rollback steps, troubleshooting, license, changelog, and ownership/contact information.
- [ ] **P1 — Owner: TBD:** Add automated validation for configuration, manifests, shell/Python code, Dockerfiles, and documentation links; require it before merge.
- [ ] **P1 — Owner: TBD:** Add unit, integration, and end-to-end tests with reproducible local fixtures.
- [ ] **P1 — Owner: TBD:** Generate a software bill of materials and scan dependencies, images, and secrets. Remove embedded credentials and rotate any exposed values.
- [ ] **P1 — Owner: TBD:** Establish release tags, artifact/image retention, a rollback release, and a documented change-control process for the final week.
- [ ] **P2 — Owner: TBD:** Create an architecture decision log for major choices such as Swarm versus K3s, local versus hosted infrastructure, and flag-generation strategy.

## 2. Engine and orchestration

- [ ] **P0 — Owner: TBD:** Verify clean install from bare hosts through CTFd and all lab services. **Done when:** a second operator can deploy from documentation without undocumented manual steps.
- [ ] **P0 — Owner: TBD:** Complete per-user/per-team dynamic flag generation. Flags must be unique, unpredictable, scoped to the intended challenge, persisted appropriately, and validated by CTFd.
- [ ] **P0 — Owner: TBD:** Test flag lifecycle: issuance, restart, reconnect, submission, duplicate submission, expiration/reset, cleanup, and recovery after a service failure.
- [ ] **P0 — Owner: TBD:** Prove tenant isolation. Test container-to-host escape resistance, participant-to-participant access, shared volumes, Docker socket exposure, overlay networks, secrets, process/capability limits, and access to management services.
- [ ] **P0 — Owner: TBD:** Remove privileged containers and host mounts unless explicitly justified. Apply non-root users, read-only filesystems where practical, dropped capabilities, seccomp/AppArmor, resource limits, and network policies/segmentation.
- [ ] **P0 — Owner: TBD:** Make create/start/stop/reset/delete operations idempotent and concurrency-safe. Rapid clicks, retries, disconnects, and duplicate requests must not create orphaned or incorrectly assigned labs.
- [ ] **P0 — Owner: TBD:** Test placement and recovery when a worker is unavailable, drains, restarts, or runs out of resources. Define expected behavior for active sessions.
- [ ] **P0 — Owner: TBD:** Enforce CPU, memory, process, storage, session-count, and lifetime quotas per participant. Include cleanup for abandoned sessions and orphaned networks/volumes.
- [ ] **P1 — Owner: TBD:** Add health/readiness checks, dependency-aware startup, timeouts, retry limits, and clear participant-facing error messages.
- [ ] **P1 — Owner: TBD:** Centralize structured logs, metrics, and alerts for CTFd, the custom launcher, Docker nodes, databases, DNS, DHCP, firewall, and access points.
- [ ] **P1 — Owner: TBD:** Build an operator dashboard showing active users, lab state, node capacity, failures, queue time, and cleanup status without exposing flags.
- [ ] **P1 — Owner: TBD:** Back up all persistent state and configuration; perform and time a restore onto clean infrastructure.
- [ ] **P1 — Owner: TBD:** Verify time synchronization on every node and network appliance so scoring, logs, TLS, and incident timelines agree.

## 3. Wargames and CTF content

- [ ] **P0 — Owner: TBD:** Produce a challenge inventory for all three tracks with ID, audience, objective, prerequisites, points, flag source, expected solve path, estimated duration, hints, reset method, dependencies, and owner.
- [ ] **P0 — Owner: TBD:** Conduct a clean-account playthrough of every challenge. Record the expected solution and confirm no unintended shortcuts, stale flags, broken links, missing packages, or external-internet dependency.
- [ ] **P0 — Owner: TBD:** Validate difficulty progression and total event timing with representative novice, intermediate, and advanced testers—not only authors or AI agents.
- [ ] **P0 — Owner: TBD:** Verify scoring rules, hint penalties, tie breaking, team/user mapping, scoreboard updates, submissions under concurrency, and export of final results.
- [ ] **P0 — Owner: TBD:** Validate Linux Fundamentals accessibility: plain-language instructions, SSH onboarding, keyboard/terminal assumptions, safe reset, and recovery from destructive learner actions.
- [ ] **P0 — Owner: TBD:** Validate Cryptography challenge answers across accepted encodings/case/format variants while rejecting false positives.
- [ ] **P0 — Owner: TBD:** Validate Web Exploitation isolation between the Kali attacker and LAMP target containers and between different participants. Confirm target resets restore a known state.
- [ ] **P0 — Owner: TBD:** Ensure intentionally vulnerable services cannot reach infrastructure management, other participants, the public internet unless required, or unintended venue devices.
- [ ] **P1 — Owner: TBD:** Review content for technical accuracy, spelling, ambiguity, accessibility, and safe/legal framing. Add hints and facilitator notes.
- [ ] **P1 — Owner: TBD:** Make images reproducible and versioned; scan them for unintended secrets, malware, licensing problems, and unnecessary packages.
- [ ] **P1 — Owner: TBD:** Create offline copies of all required documentation/packages or explicitly test and budget any external dependencies.
- [ ] **P2 — Owner: TBD:** Add post-event learning summaries and participant feedback collection per track.

## 4. Router, VLANs, DNS, DHCP, and wired network

- [ ] **P0 — Owner: TBD:** Select and obtain the pfSense/OPNsense appliance with enough routed/firewall throughput, interfaces, memory, and a spare/recovery option.
- [ ] **P0 — Owner: TBD:** Finalize the network diagram, IP plan, VLAN IDs, DHCP scopes, DNS zones, switch trunks/access ports, management paths, and cable/port labels.
- [ ] **P0 — Owner: TBD:** Define trust zones at minimum for management, infrastructure/cluster, participants, staff, guest/Internet, and intentionally vulnerable targets.
- [ ] **P0 — Owner: TBD:** Implement default-deny inter-VLAN firewall policy with an explicit flow matrix. Permit only documented application, DNS, DHCP, NTP, and administration flows.
- [ ] **P0 — Owner: TBD:** Configure the router, managed switches, and VLAN trunks; export versioned, encrypted backups after every approved milestone.
- [ ] **P0 — Owner: TBD:** Configure redundant/local DNS and DHCP behavior, reservations, lease sizing, split DNS if needed, and protection against rogue DHCP/DNS.
- [ ] **P0 — Owner: TBD:** Test positive and negative paths from every VLAN: permitted services work; management, other participants, host networks, and unintended targets are blocked.
- [ ] **P0 — Owner: TBD:** Measure real venue WAN bandwidth, latency, jitter, packet loss, NAT/session capacity, and captive-portal/filtering behavior during representative hours.
- [ ] **P0 — Owner: TBD:** Run an offline/WAN-loss test. Identify exactly what remains functional and eliminate unnecessary Internet dependencies.
- [ ] **P1 — Owner: TBD:** Enable firewall/DNS/DHCP logging with useful retention and synchronized timestamps; confirm staff can diagnose a user connection quickly.
- [ ] **P1 — Owner: TBD:** Test failure and restoration of router, switch uplink, DNS, DHCP, and one cluster link. Document recovery time and participant impact.
- [ ] **P1 — Owner: TBD:** Prepare spare cables, adapters, switch ports, labeled patching, console access, configuration backups, and tested replacement procedures.

## 5. Wireless access points

- [ ] **P0 — Owner: TBD:** Survey the actual venue for coverage, interference, wall attenuation, channel use, power, mounting, and cable runs.
- [ ] **P0 — Owner: TBD:** Size AP count and model for at least 40 simultaneous participants plus staff and multiple devices, with headroom—not merely for coverage.
- [ ] **P0 — Owner: TBD:** Configure participant and staff SSIDs mapped to the correct VLANs. Protect AP management on the management VLAN and disable direct participant access to it.
- [ ] **P0 — Owner: TBD:** Enable client isolation where compatible with the lab design and verify participants cannot communicate directly at Layer 2.
- [ ] **P0 — Owner: TBD:** Plan 2.4/5/6 GHz bands, channel width, non-overlapping channels, transmit power, minimum data rates, and roaming. Avoid automatic settings unless validated on site.
- [ ] **P0 — Owner: TBD:** Load-test association, DHCP, DNS, SSH, web sessions, roaming, reconnect, and sustained traffic with at least the intended number and mix of devices.
- [ ] **P0 — Owner: TBD:** Verify credentials/onboarding, device compatibility, maximum-client settings, session timeouts, and recovery after AP/controller restart.
- [ ] **P1 — Owner: TBD:** Monitor client count, retries, channel utilization, signal, latency, packet loss, and DHCP failures during rehearsal and event.
- [ ] **P1 — Owner: TBD:** Prepare a wired fallback path and a spare preconfigured AP, injector/power supply, cables, and configuration backup.

## 6. Capacity, stress, endurance, and failure testing

- [ ] **P0 — Owner: TBD:** Define a measurable performance budget: 40 concurrent participants minimum, expected lab mix, acceptable login/start time, command latency, error rate, recovery time, and infrastructure headroom.
- [ ] **P0 — Owner: TBD:** Build a repeatable load harness that models real journeys: register/login, join team if applicable, start lab, SSH/browse, run representative commands, submit flags, reset, disconnect, reconnect, and finish.
- [ ] **P0 — Owner: TBD:** Use synthetic clients/agents with isolated test accounts and test-only flags. Do not rely solely on paid AI agents; use deterministic scripts for load and reserve human/AI agents for behavioral variation and usability.
- [ ] **P0 — Owner: TBD:** Run staged tests at 3, 10, 20, 40, and burst capacity (target: 50–60) while recording node, container, database, network, DNS, DHCP, firewall, AP, and application metrics.
- [ ] **P0 — Owner: TBD:** Test the worst-case lab mix, including concurrent Web Exploitation sessions that require both attacker and LAMP containers. Capacity planning must count containers/services per session, not just users.
- [ ] **P0 — Owner: TBD:** Stress simultaneous event moments: all users log in, start labs, reset labs, submit flags, and reconnect at once.
- [ ] **P0 — Owner: TBD:** Run a sustained soak test for at least the planned event duration plus setup/overtime. Check memory growth, disk consumption, connection leaks, stale sessions, scoring consistency, and cleanup.
- [ ] **P0 — Owner: TBD:** Inject safe failures during load: worker loss, manager restart, service crash, database restart, full/near-full disk, DNS failure, WAN loss, AP restart, and switch/uplink interruption.
- [ ] **P0 — Owner: TBD:** Repeat isolation/security tests under concurrency, including attempts to enumerate or access another participant's services, flags, network, volumes, and CTFd identity.
- [ ] **P1 — Owner: TBD:** Establish before/after baselines and retain reports with exact versions, topology, workload, results, bottlenecks, and fixes.
- [ ] **P1 — Owner: TBD:** Re-run the full acceptance suite after performance tuning or any release-candidate change.

## 7. Security and abuse testing

- [ ] **P0 — Owner: TBD:** Create a threat model covering participant, malicious participant, compromised vulnerable target, accidental admin error, stolen credential, rogue venue device, and infrastructure failure.
- [ ] **P0 — Owner: TBD:** Test authentication, authorization, password/session policy, CSRF, rate limiting, account/team isolation, admin privilege boundaries, and direct API access.
- [ ] **P0 — Owner: TBD:** Verify secrets are stored outside repositories/images, scoped narrowly, rotated before the event, and excluded from logs and participant-visible processes/files.
- [ ] **P0 — Owner: TBD:** Test egress controls and DNS tunneling/bypass paths from all participant-controlled containers. Explicitly document allowed outbound traffic.
- [ ] **P0 — Owner: TBD:** Confirm the vulnerable Web track cannot attack CTFd, orchestration APIs, the host, router/APs, other teams, or venue/public systems.
- [ ] **P1 — Owner: TBD:** Scan hosts, images, dependencies, and exposed services; remediate critical/high findings or document risk acceptance and compensating controls.
- [ ] **P1 — Owner: TBD:** Validate log redaction, audit trails, admin action logging, evidence preservation, and privacy/retention rules for participant data.
- [ ] **P1 — Owner: TBD:** Define acceptable-use rules, consent/notice, prohibited targets, incident response, participant removal, and emergency shutdown procedures.

## 8. Data, observability, backup, and recovery

- [ ] **P0 — Owner: TBD:** Inventory persistent data: users, teams, challenges, flags, submissions, scores, CTFd configuration, launcher state, databases, router/switch/AP configuration, and certificates/secrets.
- [ ] **P0 — Owner: TBD:** Define recovery-point and recovery-time objectives for each component and align backups to them.
- [ ] **P0 — Owner: TBD:** Perform a clean restore and compare users, challenges, scoring, and configuration with the source. A backup that has not been restored is not accepted.
- [ ] **P1 — Owner: TBD:** Create dashboards and alerts for capacity, errors, lab startup time, failed authentication, database health, node health, disk, packet loss, DNS/DHCP, AP load, and suspicious network activity.
- [ ] **P1 — Owner: TBD:** Set alert thresholds and assign an event staff owner. Test notifications without exposing participant data or flags.
- [ ] **P1 — Owner: TBD:** Size log retention and disk space for the rehearsal and event; protect logs from participant modification.
- [ ] **P1 — Owner: TBD:** Export final scoreboard, submissions, logs, and configurations at planned checkpoints and immediately after the event.

## 9. Participant experience and accessibility

- [ ] **P0 — Owner: TBD:** Test registration, authentication, password reset/recovery, team creation/assignment, rules acknowledgment, and first lab launch from participant devices.
- [ ] **P0 — Owner: TBD:** Create a one-page quick start with SSID, URL, login, SSH instructions, how to start/reset a lab, how to submit a flag, and where to get help.
- [ ] **P0 — Owner: TBD:** Test supported operating systems, browsers, SSH clients, corporate-managed devices, keyboard layouts, screen sizes, and common accessibility needs.
- [ ] **P1 — Owner: TBD:** Provide a low-risk connectivity/tutorial challenge that verifies Wi-Fi, DNS, browser, CTFd, launcher, and SSH before participants enter scored tracks.
- [ ] **P1 — Owner: TBD:** Review contrast, keyboard navigation, readable language, error messages, timeout warnings, and alternatives for participants unable to install software.
- [ ] **P1 — Owner: TBD:** Define help-desk triage and a safe identity verification/reset procedure that does not leak answers or other users' data.

## 10. Event operations

- [ ] **P0 — Owner: TBD:** Create an event runbook covering setup, power-on order, validation, opening, monitoring, common failures, escalation, backup/restore, shutdown, evidence export, and teardown.
- [ ] **P0 — Owner: TBD:** Assign named roles: event lead, platform, network/Wi-Fi, challenge/content, help desk, scoring, safety/security, and communications. Define backups and contact methods.
- [ ] **P0 — Owner: TBD:** Define GO/NO-GO checkpoints for one week before, venue setup, rehearsal completion, event opening, and any mid-event degradation.
- [ ] **P0 — Owner: TBD:** Run a full dress rehearsal at the venue using release-candidate software, final network equipment, participant-like devices, and the planned schedule.
- [ ] **P0 — Owner: TBD:** Define degradation modes: cap new sessions, disable one track, move users to wired access, restore from backup, pause scoring, or stop the event safely.
- [ ] **P1 — Owner: TBD:** Confirm power capacity, UPS coverage, safe cabling, cooling, physical security, equipment inventory, venue access, setup/teardown time, and spares.
- [ ] **P1 — Owner: TBD:** Prepare participant communications for opening, outages, extensions, rule reminders, results, and post-event follow-up.
- [ ] **P1 — Owner: TBD:** Record every rehearsal/event incident with timestamp, symptoms, impact, action, owner, resolution, and follow-up.

## 11. Hosting and contingency decision

- [ ] **P1 — Owner: TBD:** Write a short decision record comparing local on-site hosting, VPS/cloud, and any government platform option against cost, eligibility, public/civilian reachability, approval lead time, bandwidth, latency, data handling, support, and failure modes.
- [ ] **P1 — Owner: TBD:** Treat Platform One as a research item, not an event dependency, until eligibility, onboarding, cost, authorization, public access, container/workload support, and schedule are confirmed directly with its official program contacts.
- [ ] **P1 — Owner: TBD:** Benchmark any remote hosting candidate from the actual venue with 40-user-equivalent traffic; include WAN failure and rate/egress cost assumptions.
- [ ] **P1 — Owner: TBD:** Keep a local/offline-capable event plan even if a hosted option is selected, unless the accepted risk explicitly states otherwise.
- [ ] **P2 — Owner: TBD:** Estimate compute needs from measured peak CPU, memory, storage I/O, network, and container count—not from user count alone—and document minimum/recommended hardware.

## 12. Final-week checklist

- [ ] **P0 — Owner: TBD:** Freeze the release candidate; document and approve every subsequent change.
- [ ] **P0 — Owner: TBD:** Rebuild/deploy from pinned artifacts and complete smoke, isolation, scoring, backup, restore, and 40-user acceptance tests.
- [ ] **P0 — Owner: TBD:** Rotate event credentials, verify certificates and expiration dates, and securely distribute staff access.
- [ ] **P0 — Owner: TBD:** Export tested configuration backups for all hosts and network devices to two protected locations.
- [ ] **P0 — Owner: TBD:** Confirm participant roster/accounts, staff coverage, contact tree, venue access, power, cooling, cabling, spares, and printed/offline runbooks.
- [ ] **P0 — Owner: TBD:** Verify monitoring dashboards and alerts; confirm sufficient disk space and correct time synchronization.
- [ ] **P0 — Owner: TBD:** Perform the venue walk-through and wireless/network smoke test from participant seating areas.
- [ ] **P0 — Owner: TBD:** Record the GO/NO-GO decision, accepted risks, owners, and contingency triggers.

## 13. Event-day checklist

- [ ] **P0 — Owner: TBD:** Start infrastructure in documented order and run automated health checks.
- [ ] **P0 — Owner: TBD:** Test one clean participant journey on each track from the participant network.
- [ ] **P0 — Owner: TBD:** Confirm inter-user, management, and vulnerable-target isolation before admitting participants.
- [ ] **P0 — Owner: TBD:** Confirm CTFd time, scoring, backups, dashboards, alerts, DNS/DHCP, Internet/offline dependencies, and Wi-Fi capacity.
- [ ] **P0 — Owner: TBD:** Record baseline utilization and configuration versions.
- [ ] **P0 — Owner: TBD:** Monitor user count, lab starts/failures, container/node resources, database, network, firewall sessions, AP health, and help-desk patterns throughout the event.
- [ ] **P0 — Owner: TBD:** Take scheduled data/configuration exports and record all incidents and changes.
- [ ] **P0 — Owner: TBD:** At close, stop new sessions, export final results, preserve required logs, back up state, revoke temporary access, and shut down safely.

## Test evidence log

| Date | Build/commit set | Environment/topology | Test | Load | Result | Evidence link/path | Defects/follow-up | Owner |
|---|---|---|---|---:|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

## Risk register

| Risk | Likelihood | Impact | Mitigation/contingency | Trigger | Owner | Status |
|---|---|---|---|---|---|---|
| Router/AP configuration is incomplete | High | Critical | Configure early; retain backups and preconfigured spares; complete venue rehearsal | Network acceptance tests miss deadline | TBD | Open |
| Capacity at 40+ users is unknown | High | Critical | Deterministic load harness, staged load, burst and soak tests, measured hardware sizing | 40-user gate fails or headroom is below target | TBD | Open |
| Cross-user/container isolation failure | Medium | Critical | Threat model, default-deny segmentation, container hardening, adversarial isolation tests | Any user can reach another user's assets or management plane | TBD | Open |
| Dynamic flags are incomplete or unreliable | High | Critical | Finish lifecycle design; concurrency and recovery tests; documented fallback | Duplicate, lost, predictable, or invalid flags | TBD | Open |
| Venue WAN is unreliable or constrained | Medium | High | Remove external dependencies; offline assets; local DNS; test WAN-loss mode | Latency/loss exceeds budget or WAN fails | TBD | Open |
| Orchestration architecture/documentation disagrees | Medium | High | Choose and document one production topology; pin compatible releases | Deployment cannot be reproduced from clean hosts | TBD | Open |
| Single hardware/network failure interrupts event | Medium | High | UPS, spares, backups, recovery rehearsal, defined degraded mode | Node/router/AP/switch failure | TBD | Open |
| Last-minute changes introduce regressions | High | High | Release freeze, approval, automated acceptance suite, rollback image | Change requested after freeze | TBD | Open |

## Recommended execution order

1. Resolve architecture and inventory the repositories, hardware, challenges, dependencies, and persistent data.
2. Finish dynamic flags, lifecycle correctness, isolation, quotas, and reproducible deployment.
3. Finalize and configure the router, VLANs, switching, DNS/DHCP, and wireless design.
4. Build deterministic end-to-end tests and complete clean-account challenge playthroughs.
5. Run staged load, security, failure, recovery, burst, and soak tests; fix and repeat.
6. Complete the venue dress rehearsal, staff tabletop, release freeze, and GO/NO-GO review.

## Open decisions

- [ ] Docker Swarm or K3s is the production orchestration platform?
- [ ] Individual accounts or teams, and are flags unique per user or per team?
- [ ] Exact event duration, participant count, device count, and expected lab mix?
- [ ] Required Internet access versus fully local/offline operation?
- [ ] Final venue, floor plan, ISP characteristics, available power, and wired drops?
- [ ] Hardware inventory and spare/replacement equipment?
- [ ] Recovery objectives and acceptable degraded modes?
- [ ] Data retention, participant privacy, and log-retention requirements?
- [ ] Local hosting, remote hosting, or local-primary with remote contingency?

