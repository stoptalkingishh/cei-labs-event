# CEI Labs Production Readiness Tracker

> **Verification status:** cross-checked against the three repos on 2026-07-12 (engine `81da136`, net `84df78a`, wargames `5937d6c`). Items with a `✅`/`⚠`/`✖` tag were updated by that audit; see `VERIFICATION.md` for full evidence and citations. Untagged items had no repo evidence either way and are left as originally written.

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

**None of the release gates are met.** This matches repo evidence — no load harness, no venue rehearsal artifacts, no signed-off runbook exist anywhere in the three repos.

## 1. Architecture and repository maturity

- [x] **P0 — Owner: stoptalkingishh:** ✅ Resolve the orchestration source of truth: current notes say Docker Swarm, while the public engine description mentions K3s. Update diagrams, deployment files, and documentation to name the actual event platform consistently. **Done when:** one supported topology is documented and a clean deployment follows it successfully. — **Verified 2026-07-12:** resolved as Swarm. `cei-labs-engine/docker/stack.yml` is a Swarm stack file, and `ansible/roles/swarm/tasks/main.yml` explicitly replaces the old k3s-server/k3s-agent/metallb roles.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Audit all three local repositories and create a cross-repository dependency/version matrix. **Done when:** compatible commits/releases, image tags, ports, networks, secrets, schemas, and startup order are recorded. — **Done 2026-07-15:** `docs/dependency-version-matrix.md` in this repo.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Define a stable release candidate and freeze deadline. Pin container images by immutable digest and dependencies by version; do not deploy mutable `latest` tags. — **Updated 2026-07-15:** every third-party base image is now digest-pinned (`traefik`, `mariadb`, `redis`, `ctfd/ctfd` base, `python` base, `ubuntu` base, `debian` base — `kali-novnc` already was). `.env.example`'s `IMAGE_TAG` no longer defaults to `latest`, now a placeholder forcing an explicit `sha-<commit>` pick. Still open: an actual release-candidate freeze deadline hasn't been set/decided.
- [~] **P1 — Owner: stoptalkingishh:** ⚠ Add a consistent repository baseline: README, architecture diagram, prerequisites, clean install, upgrade/rollback steps, troubleshooting, license, changelog, and ownership/contact information. — README + LICENSE + install/uninstall scripts exist in all three repos; architecture diagram exists only in cei-labs-net. **Updated 2026-07-15:** `CHANGELOG.md` added to all four repos.
- [~] **P1 — Owner: stoptalkingishh:** ⚠ Add automated validation for configuration, manifests, shell/Python code, Dockerfiles, and documentation links; require it before merge. — Engine has validation/image workflows; Wargames now has pinned-action metadata validation plus immutable target-image builds, exact 59/58/3 gates, and digest-only release validation. cei-labs-net still has no CI.
- [~] **P1 — Owner: stoptalkingishh:** ⚠ Add unit, integration, and end-to-end tests with reproducible local fixtures. — real test suite in `cei-labs-engine/docker/orchestrator/tests/` (7 modules) and the CTFd instance-launcher plugin; no tests in cei-labs-net or Wargames.
- [ ] **P1 — Owner: TBD:** Generate a software bill of materials and scan dependencies, images, and secrets. Remove embedded credentials and rotate any exposed values. — ❌ no SBOM/scanning tooling found. (Manual hygiene is good — see credentials note in `VERIFICATION.md`.)
- [ ] **P1 — Owner: TBD:** Establish release tags, artifact/image retention, a rollback release, and a documented change-control process for the final week. — ❌ not started.
- [x] **P2 — Owner: stoptalkingishh:** ✅ Create an architecture decision log for major choices such as Swarm versus K3s, local versus hosted infrastructure, and flag-generation strategy. — **Done 2026-07-15:** `cei-labs-engine/docs/architecture-decisions.md` (ADR-001: Swarm not K3s; ADR-002: Docker socket mount justification). Local-vs-hosted and flag-generation-strategy decisions not yet written up as ADRs — this log now exists for future decisions to be added to.

## 2. Engine and orchestration

- [ ] **P0 — Owner: TBD:** Verify clean install from bare hosts through CTFd and all lab services. **Done when:** a second operator can deploy from documentation without undocumented manual steps. — install scripts exist (`stack-up.sh`/`stack-down.sh`) but no record of a second-operator verification run.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Complete per-user/per-team dynamic flag generation. Flags must be unique, unpredictable, scoped to the intended challenge, persisted appropriately, and validated by CTFd. — **Verified 2026-07-12:** `docker/orchestrator/app/instance_types.py` uses `secrets.token_urlsafe()`/`secrets.choice()`; `docker/ctfd/plugins/instance-launcher/flags.py` implements per-team flags; rolled out to Bandit, Krypton, and Natas in Wargames.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Test flag lifecycle: issuance, restart, reconnect, submission, duplicate submission, expiration/reset, cleanup, and recovery after a service failure. — SSH/port reuse and live isolation tested per `self-hosted-wargames-status.md`; expiration/reset/full lifecycle not fully covered.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Prove tenant isolation. The trusted-gateway design keeps every participant-controlled app/target/attacker on a dedicated internal overlay. Native Swarm validation passed 42/42: web/SSH/noVNC access through trusted gateways, target and attacker egress denial, cross-tenant and management-plane denial, reversible NET_ADMIN route-abuse denial, and runtime proof that gateways are UID 65532, read-only, forwarding-disabled, and capability-free. The station's exhausted `/24` ingress pool was rebuilt as non-overlapping `10.20.0.0/16`; only trusted gateways may join ingress.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Remove privileged containers and host mounts unless explicitly justified. Apply non-root users, read-only filesystems where practical, dropped capabilities, seccomp/AppArmor, resource limits, and network policies/segmentation. — no `privileged: true` found anywhere; but `/var/run/docker.sock` is mounted into Traefik (read-only) and the orchestrator (read-write) without an explicit written justification in-repo. Memory limits/restart policies exist on 5 services in `stack.yml`; no CPU limits at the stack level.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Make create/start/stop/reset/delete operations idempotent and concurrency-safe. — Real-Swarm cold 1/5/10/20, 20 identical creates, and 20 parallel relaunches passed with zero 5xx/non-JSON errors and zero service/network/listener residue. Ten fresh-account personas then exercised CTFd lifecycle behavior; invalid-action and CTFd dialect regressions were fixed in Engine `954243a`, and the final explicit-launch/status retest passed with no 5xx. Ten-concurrent catalog-scale acceptance remains a capacity gate, not an open correctness defect.
- [ ] **P0 — Owner: TBD:** Test placement and recovery when a worker is unavailable, drains, restarts, or runs out of resources. Define expected behavior for active sessions. — ❌ not started.
- [ ] **P0 — Owner: TBD:** Enforce CPU, memory, process, storage, session-count, and lifetime quotas per participant. Include cleanup for abandoned sessions and orphaned networks/volumes. — ❌ not started (partial memory limits only, see above).
- [!] **P1 — Owner: TBD:** ✖ Add health/readiness checks, dependency-aware startup, timeouts, retry limits, and clear participant-facing error messages. — **Contradicted:** no `healthcheck:` blocks exist anywhere in `stack.yml`.
- [~] **P1 — Owner: stoptalkingishh:** Centralize structured logs, metrics, and alerts for CTFd, the custom launcher, Docker nodes, databases, DNS, DHCP, firewall, and access points. — **Host telemetry started locally 2026-07-14:** Engine Ansible installs `btop`, `status.sh` reports monitoring readiness, and `capture-resources.sh` retains timestamped host/network/container/service/Docker-event evidence. This is not centralized monitoring or alerting; DB, DNS/DHCP, firewall, AP, retention, and notification coverage remain open.
- [ ] **P1 — Owner: TBD:** Build an operator dashboard showing active users, lab state, node capacity, failures, queue time, and cleanup status without exposing flags. — ❌ not started (stock CTFd admin UI only).
- [~] **P1 — Owner: stoptalkingishh:** Back up all persistent state and configuration; perform and time a restore onto clean infrastructure. — Encrypted backup `20260715T030642Z` passed hashes, decryption, archive, SQL-format checks, and corrupt-copy fail-closed proof. An isolated scratch restore decrypted 9 protected config files, restored 3 orchestrator files, imported MariaDB, and reconciled users=26, teams=20, challenges=2, submissions=89, solves=24; scratch resources were removed. **Not complete until a timed clean-station full-stack restore passes.**
- [ ] **P1 — Owner: TBD:** Verify time synchronization on every node and network appliance so scoring, logs, TLS, and incident timelines agree. — ❌ not started.

## 3. Wargames and CTF content

- [~] **P0 — Owner: stoptalkingishh:** ⚠ Produce a challenge inventory for all three tracks with ID, audience, objective, prerequisites, points, flag source, expected solve path, estimated duration, hints, reset method, dependencies, and owner. — **Updated 2026-07-15:** `CEI-Labs-Wargames/docs/challenge-inventory.md` now has the formal per-field table for all 59 levels, generated from `challenge.yml`. Surfaced a real finding: `krypton-00` (200 pts, scored) uses a static non-per-team flag — see that doc. Still genuinely open: estimated duration per level (no playtester timing data exists) and owner (still TBD for every level).
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Conduct a clean-account playthrough of every challenge. Record the expected solution and confirm no unintended shortcuts, stale flags, broken links, missing packages, or external-internet dependency. — full solution writeups imply internal playthroughs happened; no independent tester log recorded.
- [ ] **P0 — Owner: TBD:** Validate difficulty progression and total event timing with representative novice, intermediate, and advanced testers—not only authors or AI agents. — ❌ not started.
- [~] **P0 — Owner: stoptalkingishh:** Verify scoring rules, hint penalties, tie breaking, team/user mapping, scoreboard updates, submissions under concurrency, and export of final results. — Staggered per-game implementation now defines immutable game starts, mapped-challenge scoring windows, lock cutoffs, visibility controls, and deterministic ties; 8 boundary/transition unit tests pass. Still required: deployed CTFd smoke test in both modes, concurrent integration/load test, export reconciliation, and a decision or implementation for per-game paid-hint attribution.
- [~] **P0 — Owner: stoptalkingishh:** Add administrator-controlled staggered starts for Bandit, Krypton, and Natas with independent scoreboards. — Engine plugin, Wargames `game-stages.yml`/validator, runbook, presentation brief, and corrected kickoff deck are merged locally. Deployment rehearsal and pushed release verification remain open. Required challenge counts are 35/8/16.
- [ ] **P0 — Owner: TBD:** Validate Linux Fundamentals accessibility: plain-language instructions, SSH onboarding, keyboard/terminal assumptions, safe reset, and recovery from destructive learner actions. — no dedicated evidence found beyond general writeups.
- [ ] **P0 — Owner: TBD:** Validate Cryptography challenge answers across accepted encodings/case/format variants while rejecting false positives. — ❌ not started.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Validate Web Exploitation isolation between the Kali attacker and LAMP target containers and between different participants. Confirm target resets restore a known state. — Natas attacker/target isolation implemented and live-verified per `self-hosted-wargames-status.md`; full outbound-blocking claim unverified on real hardware.
- [ ] **P0 — Owner: TBD:** Ensure intentionally vulnerable services cannot reach infrastructure management, other participants, the public internet unless required, or unintended venue devices. — ❌ not verified on real hardware.
- [ ] **P1 — Owner: TBD:** Review content for technical accuracy, spelling, ambiguity, accessibility, and safe/legal framing. Add hints and facilitator notes. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Make images reproducible and versioned; scan them for unintended secrets, malware, licensing problems, and unnecessary packages. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Create offline copies of all required documentation/packages or explicitly test and budget any external dependencies. — ❌ not started.
- [ ] **P2 — Owner: TBD:** Add post-event learning summaries and participant feedback collection per track. — ❌ not started.

## 4. Router, VLANs, DNS, DHCP, and wired network

> **⚠ Section-wide verification note (2026-07-12):** design/config artifacts are real and detailed — `cei-labs-net/config/pfsense/*.xml` (DoH blocking, IPv6 disable, DNS-redirect NAT, limiters, player-peer isolation, QoS queues, reference allowlist) plus `docs/network-topology.md`, `docs/firewall-rule-order.md`, `docs/security-qos-policy.md`, `docs/verification-checklist.md`. But the repo's own `docs/security-audit-status.md` states 5 of 6 findings "still need a live pfSense instance / real hardware to test." Every item below is therefore design-complete but **not validated on physical hardware**; individual items are left unchecked accordingly.

- [ ] **P0 — Owner: TBD:** Select and obtain the pfSense/OPNsense appliance with enough routed/firewall throughput, interfaces, memory, and a spare/recovery option.
- [ ] **P0 — Owner: TBD:** Finalize the network diagram, IP plan, VLAN IDs, DHCP scopes, DNS zones, switch trunks/access ports, management paths, and cable/port labels. — diagram/IP plan/VLAN IDs are documented in `docs/network-topology.md`; treat as drafted, not field-finalized.
- [ ] **P0 — Owner: TBD:** Define trust zones at minimum for management, infrastructure/cluster, participants, staff, guest/Internet, and intentionally vulnerable targets. — defined on paper in `docs/network-topology.md`.
- [ ] **P0 — Owner: TBD:** Implement default-deny inter-VLAN firewall policy with an explicit flow matrix. Permit only documented application, DNS, DHCP, NTP, and administration flows. — flow matrix drafted in `docs/firewall-rule-order.md`; not implemented on hardware.
- [ ] **P0 — Owner: TBD:** Configure the router, managed switches, and VLAN trunks; export versioned, encrypted backups after every approved milestone.
- [ ] **P0 — Owner: TBD:** Configure redundant/local DNS and DHCP behavior, reservations, lease sizing, split DNS if needed, and protection against rogue DHCP/DNS. — DNS-rebinding and DoQ protections are drafted in the pfSense XML fragments; unvalidated on hardware.
- [ ] **P0 — Owner: TBD:** Test positive and negative paths from every VLAN: permitted services work; management, other participants, host networks, and unintended targets are blocked.
- [ ] **P0 — Owner: TBD:** Measure real venue WAN bandwidth, latency, jitter, packet loss, NAT/session capacity, and captive-portal/filtering behavior during representative hours.
- [ ] **P0 — Owner: TBD:** Run an offline/WAN-loss test. Identify exactly what remains functional and eliminate unnecessary Internet dependencies.
- [ ] **P1 — Owner: TBD:** Enable firewall/DNS/DHCP logging with useful retention and synchronized timestamps; confirm staff can diagnose a user connection quickly.
- [ ] **P1 — Owner: TBD:** Test failure and restoration of router, switch uplink, DNS, DHCP, and one cluster link. Document recovery time and participant impact.
- [ ] **P1 — Owner: TBD:** Prepare spare cables, adapters, switch ports, labeled patching, console access, configuration backups, and tested replacement procedures.

## 5. Wireless access points

> **✅ Verified 2026-07-12:** tracker's own baseline statement ("wireless access points are not configured") is confirmed accurate — no AP vendor config exists in any repo. Planning docs (`docs/network-topology.md`, `docs/verification-checklist.md`) specify SSID-to-VLAN mapping, mandatory WPA2/3-Personal, AP client isolation, and a "Day-Of Smoke Test" procedure, but this is a plan, not deployment evidence.

- [ ] **P0 — Owner: TBD:** Survey the actual venue for coverage, interference, wall attenuation, channel use, power, mounting, and cable runs.
- [ ] **P0 — Owner: TBD:** Size AP count and model for at least 40 simultaneous participants plus staff and multiple devices, with headroom—not merely for coverage.
- [ ] **P0 — Owner: TBD:** Configure participant and staff SSIDs mapped to the correct VLANs. Protect AP management on the management VLAN and disable direct participant access to it. — SSID-to-VLAN mapping is specified on paper only.
- [ ] **P0 — Owner: TBD:** Enable client isolation where compatible with the lab design and verify participants cannot communicate directly at Layer 2. — required on paper; not verified.
- [ ] **P0 — Owner: TBD:** Plan 2.4/5/6 GHz bands, channel width, non-overlapping channels, transmit power, minimum data rates, and roaming. Avoid automatic settings unless validated on site.
- [ ] **P0 — Owner: TBD:** Load-test association, DHCP, DNS, SSH, web sessions, roaming, reconnect, and sustained traffic with at least the intended number and mix of devices.
- [ ] **P0 — Owner: TBD:** Verify credentials/onboarding, device compatibility, maximum-client settings, session timeouts, and recovery after AP/controller restart.
- [ ] **P1 — Owner: TBD:** Monitor client count, retries, channel utilization, signal, latency, packet loss, and DHCP failures during rehearsal and event.
- [ ] **P1 — Owner: TBD:** Prepare a wired fallback path and a spare preconfigured AP, injector/power supply, cables, and configuration backup.

## 6. Capacity, stress, endurance, and failure testing

> **⚠ Section-wide: active 2026-07-12/15.** The direct orchestrator harness has a clean retained real-Swarm run through 20-way create/relaunch. A fresh ten-persona diagnostic completed in four-slot waves and drove two deployed fixes; the final retest passed. It is not a ten-concurrent acceptance run, only 2 of 59 challenges were deployed, and no 40/burst/soak test exists yet.

- [ ] **P0 — Owner: TBD:** Define a measurable performance budget: 40 concurrent participants minimum, expected lab mix, acceptable login/start time, command latency, error rate, recovery time, and infrastructure headroom.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Build a repeatable load harness that models real journeys: register/login, join team if applicable, start lab, SSH/browse, run representative commands, submit flags, reset, disconnect, reconnect, and finish. — orchestrator-direct load harness exists (staged 3/10/20/40/burst-60, race probes); persona framework covers the full CTFd-mediated participant journey. No single harness does both yet.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Use synthetic clients/agents with isolated test accounts and test-only flags. Do not rely solely on paid AI agents; use deterministic scripts for load and reserve human/AI agents for behavioral variation and usability. — The deterministic orchestrator harness covers load; ten fresh-account personas covered behavioral, usability, authorization, and malformed-action variation in bounded waves without retaining credentials, tokens, flags, or generated access values.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Run staged tests at 3, 10, 20, 40, and burst capacity (target: 50–60) while recording node, container, database, network, DNS, DHCP, firewall, AP, and application metrics. — 2026-07-14 retained host/container/service/network/Docker-event telemetry for 1/5/10/20 and 20-way race stages. 40/burst/soak, DB metrics, and venue network/AP telemetry remain missing.
- [ ] **P0 — Owner: TBD:** Test the worst-case lab mix, including concurrent Web Exploitation sessions that require both attacker and LAMP containers. Capacity planning must count containers/services per session, not just users. — only `single-target` tested so far; no `target-attacker` range load-tested yet.
- [ ] **P0 — Owner: TBD:** Stress simultaneous event moments: all users log in, start labs, reset labs, submit flags, and reconnect at once.
- [ ] **P0 — Owner: TBD:** Stress staggered-stage operations under real CTFd traffic: start Krypton while Bandit remains active, hide/show one scoreboard, lock during a solve burst, then start Natas while scoreboards are polled. Run 10 users, planned attendance, and +50% headroom. Accept only immutable single start timestamps, no cross-game solve leakage, no post-lock score movement, and no missing in-window solve.
- [ ] **P0 — Owner: TBD:** Run a sustained soak test for at least the planned event duration plus setup/overtime. Check memory growth, disk consumption, connection leaks, stale sessions, scoring consistency, and cleanup.
- [ ] **P0 — Owner: TBD:** Inject safe failures during load: worker loss, manager restart, service crash, database restart, full/near-full disk, DNS failure, WAN loss, AP restart, and switch/uplink interruption.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Repeat isolation/security tests under concurrency, including attempts to enumerate or access another participant's services, flags, network, volumes, and CTFd identity. — The trusted-gateway native-Swarm audit passed 42/42, including cross-tenant, egress, management, and NET_ADMIN route-abuse denial. Ten fresh-account personas passed anonymous/admin boundaries, owner-selector spoofing resistance, and launcher redaction. Still required: the same checks at true ten-way concurrency with the full 59-challenge catalog.
- [x] **P1 — Owner: stoptalkingishh:** Establish before/after baselines and retain reports with exact versions, topology, workload, results, bottlenecks, and fixes. — The 2026-07-14/15 run retained checksummed host/network/container/service/Docker-event telemetry, deterministic load output, 42-check isolation output, pre/post restart and backup persistence results, corrupt-backup rejection, scratch-restore output, exact commits/images, and ten redacted persona reports.
- [ ] **P1 — Owner: TBD:** Re-run the full acceptance suite after performance tuning or any release-candidate change.

## 7. Security and abuse testing

> **⚠ Section-wide verification note (2026-07-12):** a real, well-documented security-audit pass exists (`docs/security-audit-status.md` in each repo, with severity/branch/verification method per finding) and has fixed CSRF gaps, a baked-in shared VNC password, unpinned Kali base image, Natas htpasswd permissions, plus several net-repo hardening items pending hardware validation. This is real progress the original tracker doesn't reflect, but it's a point-in-time audit, not the systematic threat-model-driven program this section calls for.

- [x] **P0 — Owner: stoptalkingishh:** ✅ Create a threat model covering participant, malicious participant, compromised vulnerable target, accidental admin error, stolen credential, rogue venue device, and infrastructure failure. — **Done 2026-07-15:** `docs/threat-model.md` in this repo, assembled from existing isolation/security-audit evidence across all four repos per actor category.
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Test authentication, authorization, password/session policy, CSRF, rate limiting, account/team isolation, admin privilege boundaries, and direct API access. — CSRF gaps found and fixed per the audit; rate limiting/admin boundary/API access testing not evidenced.
- [x] **P0 — Owner: stoptalkingishh:** ✅ Verify secrets are stored outside repositories/images, scoped narrowly, rotated before the event, and excluded from logs and participant-visible processes/files. — **Verified 2026-07-12:** no committed secrets found across all three repos; secrets paths are `.gitignore`d; example files use `CHANGE_ME_*` placeholders. (Rotation-before-event is a process step, not yet evidenced.)
- [ ] **P0 — Owner: TBD:** Test egress controls and DNS tunneling/bypass paths from all participant-controlled containers. Explicitly document allowed outbound traffic. — outbound-blocking only tested in a non-representative dev environment (see §2).
- [~] **P0 — Owner: stoptalkingishh:** ⚠ Confirm the vulnerable Web track cannot attack CTFd, orchestration APIs, the host, router/APs, other teams, or venue/public systems. — container isolation implemented and partially live-verified; full claim unverified on real hardware.
- [ ] **P1 — Owner: TBD:** Scan hosts, images, dependencies, and exposed services; remediate critical/high findings or document risk acceptance and compensating controls. — manual audit exists; no automated scanning tooling.
- [ ] **P1 — Owner: TBD:** Validate log redaction, audit trails, admin action logging, evidence preservation, and privacy/retention rules for participant data. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Define acceptable-use rules, consent/notice, prohibited targets, incident response, participant removal, and emergency shutdown procedures. — ❌ not started.

## 8. Data, observability, backup, and recovery

> **⚠ Section-wide: active 2026-07-14/15.** Engine provisions `btop`, retained timestamped station telemetry, persists orchestrator state, and now has a verified encrypted backup plus isolated scratch restore proof. No centralized dashboard/alerts, clean-station full-stack restore, or network-appliance telemetry exists yet.

- [~] **P0 — Owner: stoptalkingishh:** Inventory persistent data: users, teams, challenges, flags, submissions, scores, CTFd configuration, launcher/orchestrator state, database/uploads, `.env`, six Swarm secrets, TLS, commits, resolved services/images, and network-device exports are documented. Router/switch/AP export commands and retention owners remain open.
- [~] **P0 — Owner: stoptalkingishh:** Define recovery-point and recovery-time objectives for each component and align backups to them. — provisional core RPO 15m/RTO 30m and active-session relaunch RTO 10m documented; accept only after measured rehearsal.
- [ ] **P0 — Owner: TBD:** Perform a clean restore and compare users, challenges, scoring, and configuration with the source. A backup that has not been restored is not accepted.
- [ ] **P1 — Owner: TBD:** Create dashboards and alerts for capacity, errors, lab startup time, failed authentication, database health, node health, disk, packet loss, DNS/DHCP, AP load, and suspicious network activity.
- [ ] **P1 — Owner: TBD:** Set alert thresholds and assign an event staff owner. Test notifications without exposing participant data or flags.
- [ ] **P1 — Owner: TBD:** Size log retention and disk space for the rehearsal and event; protect logs from participant modification.
- [ ] **P1 — Owner: TBD:** Export final scoreboard, submissions, logs, and configurations at planned checkpoints and immediately after the event.

## 9. Participant experience and accessibility

- [ ] **P0 — Owner: TBD:** Test registration, authentication, password reset/recovery, team creation/assignment, rules acknowledgment, and first lab launch from participant devices. — ❌ not started.
- [~] **P1 — Owner: stoptalkingishh:** ⚠ Create a one-page quick start with SSID, URL, login, SSH instructions, how to start/reset a lab, how to submit a flag, and where to get help. — `CEI-Labs-Wargames/docs/participant-quickstart.md` and `docs/troubleshooting-faq.md` exist and cover most of this; not yet confirmed field-tested.
- [~] **P1 — Owner: stoptalkingishh:** Collect a participant equipment/device intake ahead of the event, since participants bring their own laptop or tablet: confirm the device can run an SSH client, and identify anyone without a capable device so a loaner can be arranged. — Microsoft Form built 2026-07-13 to capture this; not yet sent to participants, no responses collected. **Done when:** the form has been distributed, responses reviewed, and a loaner-device count/plan exists for anyone flagged.
- [ ] **P0 — Owner: TBD:** Test supported operating systems, browsers, SSH clients, corporate-managed devices, keyboard layouts, screen sizes, and common accessibility needs. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Provide a low-risk connectivity/tutorial challenge that verifies Wi-Fi, DNS, browser, CTFd, launcher, and SSH before participants enter scored tracks. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Review contrast, keyboard navigation, readable language, error messages, timeout warnings, and alternatives for participants unable to install software. — ❌ not started.
- [ ] **P1 — Owner: TBD:** Define help-desk triage and a safe identity verification/reset procedure that does not leak answers or other users' data. — ❌ not started.

## 10. Event operations

> **❌ Section-wide: not started.** The only "runbook" found anywhere (`CEI-Labs-Wargames/docs/facilitation-runbook.md`) is a classroom facilitation guide, not an event-ops/incident runbook — it does not satisfy this section's P0 item.

- [ ] **P0 — Owner: TBD:** Create an event runbook covering setup, power-on order, validation, opening, monitoring, common failures, escalation, backup/restore, shutdown, evidence export, and teardown.
- [ ] **P0 — Owner: TBD:** Assign named roles: event lead, platform, network/Wi-Fi, challenge/content, help desk, scoring, safety/security, and communications. Define backups and contact methods.
- [ ] **P0 — Owner: TBD:** Define GO/NO-GO checkpoints for one week before, venue setup, rehearsal completion, event opening, and any mid-event degradation.
- [ ] **P0 — Owner: TBD:** Run a full dress rehearsal at the venue using release-candidate software, final network equipment, participant-like devices, and the planned schedule.
- [ ] **P0 — Owner: TBD:** Define degradation modes: cap new sessions, disable one track, move users to wired access, restore from backup, pause scoring, or stop the event safely.
- [ ] **P1 — Owner: TBD:** Confirm power capacity, UPS coverage, safe cabling, cooling, physical security, equipment inventory, venue access, setup/teardown time, and spares.
- [ ] **P1 — Owner: TBD:** Prepare participant communications for opening, outages, extensions, rule reminders, results, and post-event follow-up.
- [ ] **P1 — Owner: TBD:** Record every rehearsal/event incident with timestamp, symptoms, impact, action, owner, resolution, and follow-up.

## 11. Hosting and contingency decision

> **❌ Section-wide: not started.** No decision record or hosting benchmark found.

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
| 2026-07-14 | Engine `2b8576a`; Event `4f433ae`; Net `84df78a`; Wargames `5937d6c`; orchestrator image `sha256:f07c0c9b0d79f5763765b0e43acf11fd0b56500907f3c7d9a019bc073cdff0fd` | Single-node Fedora 44 Docker Swarm, station `192.168.1.98` | Deterministic lifecycle gate with durable host/Docker capture | cold 1/5/10/20; identical create 20; relaunch 20 | PASS — zero 5xx/non-JSON errors; clean network/listener audit | `outputs/CEI-Labs-Test-2026-07-14/` in the Codex handoff workspace; Engine `scripts/orchestrator-loadtest.py` | Fresh 10/10 personas, gateway isolation retest, 40/burst/soak remain | stoptalkingishh |
| 2026-07-14/15 | Engine `954243a`; Net `180c3f0`; Wargames `83e9f52`; orchestrator image `sha256:a99322fd22b8419a2bee010b1eddf0fd15862f3224a16ae3a83eff75ff8f9c18`; gateway image `sha256:b39b79158e886cfb1df2cd1413652e25fd9d53c2378a3ab9f22bcb2f96b2469f`; CTFd image `cei-labs-ctfd:codex-954243a` | Single-node Fedora 44 Docker Swarm, station `192.168.1.98`, ingress `10.20.0.0/16` | Deterministic lifecycle, trusted-gateway isolation, restart persistence, encrypted backup/corruption rejection, isolated scratch restore, and ten-persona diagnostic in four-slot waves | Cold 1/5/10/20; identical create 20; relaunch 20; isolation 42; four live records across restart/backup; restored DB counts 26/20/2/89/24 | PASS lifecycle/isolation/persistence/backup/scratch restore and final persona fix retest; catalog/concurrent acceptance remains open | Engine `docs/validation-session-2026-07-14-15.md`; checksummed handoff evidence under `outputs/CEI-Labs-Test-2026-07-14/` | DNS/TLS, clean-station restore, full 59-challenge deployment, ten-concurrent, 40/burst/soak remain | stoptalkingishh |

## Risk register

| Risk | Likelihood | Impact | Mitigation/contingency | Trigger | Owner | Status |
|---|---|---|---|---|---|---|
| Router/AP configuration is incomplete | High | Critical | Configure early; retain backups and preconfigured spares; complete venue rehearsal | Network acceptance tests miss deadline | TBD | Open |
| Capacity at 40+ users is unknown | High | Critical | Deterministic load harness, staged load, burst and soak tests, measured hardware sizing | 40-user gate fails or headroom is below target | TBD | Open |
| Stage started at wrong time or more than once | Medium | Critical | Two-person authorization, synchronized UTC clocks, row locking, immutable/idempotent start, audit review | Duplicate audit mutation or displayed timestamp differs from authorized start | TBD | Open until deployed concurrency rehearsal |
| Challenge mapped to the wrong game or missing | Medium | High | Static manifest validator, exact category mapping, required 35/8/16 count, block start on mismatch, freeze mapping after start | Sync count mismatch or cross-game score appears | TBD | Open until content-import rehearsal |
| Scoreboard moves after lock or hide changes results | Low | Critical | Inclusive cutoff tests, preserved raw solves, independent visibility state, before/after exports and reconciliation | Any post-cutoff solve changes standings or hide/show changes totals | TBD | Open until multi-user rehearsal |
| Cross-user/container isolation failure | Medium | Critical | Threat model, default-deny segmentation, container hardening, adversarial isolation tests | Any user can reach another user's assets or management plane | TBD | Open |
| Dynamic flags are incomplete or unreliable | High | Critical | Finish lifecycle design; concurrency and recovery tests; documented fallback | Duplicate, lost, predictable, or invalid flags | TBD | Open |
| Venue WAN is unreliable or constrained | Medium | High | Remove external dependencies; offline assets; local DNS; test WAN-loss mode | Latency/loss exceeds budget or WAN fails | TBD | Open |
| Orchestration architecture/documentation disagrees | Medium | High | Choose and document one production topology; pin compatible releases | Deployment cannot be reproduced from clean hosts | TBD | Open — **update:** resolved as Swarm per 2026-07-12 audit; closing this risk is a documentation exercise, not open engineering work. |
| Single hardware/network failure interrupts event | Medium | High | UPS, spares, backups, recovery rehearsal, defined degraded mode | Node/router/AP/switch failure | TBD | Open |
| Last-minute changes introduce regressions | High | High | Release freeze, approval, automated acceptance suite, rollback image | Change requested after freeze | TBD | Open |
| Multi-worker lifecycle and port-allocation races (§2) | Medium | Critical | Atomic replacement ownership/shared SQLite allocation; real-Swarm 20-way deterministic gate and residue audit passed. Ten fresh-account personas completed in bounded waves after the gateway rollout and the final lifecycle retest passed; require true ten-way/full-catalog acceptance on the frozen release. | Any 5xx/null state, duplicate/orphan service, stale reachable port, or conflicting cold launch under concurrency | stoptalkingishh | **Mitigated 2026-07-14/15; capacity acceptance still open** |
| **New:** Docker socket exposed to Traefik (ro) and orchestrator (rw) without written justification (§2) | Low | High | Document the trust boundary and justification, or remove/scope the mount | Security review or incident involving either container | TBD | **Open — added 2026-07-12** |
| Broken network airgap — challenge containers get real internet egress and cross-instance reach (§2) | Low | Critical | Trusted gateways remove all untrusted workloads from shared overlays/ingress; 42/42 native-Swarm positive/negative, hardening, egress, cross-tenant, management, and route-abuse checks passed. Repeat on every frozen release. | Any participant reaching another team's container, management plane, or public internet | stoptalkingishh | **Mitigated 2026-07-14/15; release regression gate required** |
| **New:** `krypton-00` (200-pt scored challenge, not a tutorial) uses a static, identical-for-every-team flag — the exact collusion/leakage pattern the rest of the dynamic-flag work closed | Low | Low | Structurally exempt (no per-team instance exists to scope a flag to — the ciphertext is embedded in the description text). Write up as an explicit accepted risk, or rework to a per-team-templated description string, if full 59/59 coverage is wanted | Any two teams comparing this specific level's answer | TBD | **Open — found 2026-07-15, see `CEI-Labs-Wargames/docs/challenge-inventory.md`** |

## Recommended execution order

1. Resolve architecture and inventory the repositories, hardware, challenges, dependencies, and persistent data.
2. Finish dynamic flags, lifecycle correctness, isolation, quotas, and reproducible deployment.
3. Finalize and configure the router, VLANs, switching, DNS/DHCP, and wireless design.
4. Build deterministic end-to-end tests and complete clean-account challenge playthroughs.
5. Run staged load, security, failure, recovery, burst, and soak tests; fix and repeat.
6. Complete the venue dress rehearsal, staff tabletop, release freeze, and GO/NO-GO review.

## Open decisions

- [x] ✅ Docker Swarm or K3s is the production orchestration platform? — **Resolved: Swarm**, per 2026-07-12 audit (see item 1 above).
- [ ] Individual accounts or teams, and are flags unique per user or per team? — leaning teams (dynamic flags are per-team in the current implementation), but not documented as a final decision.
- [ ] Exact event duration, participant count, device count, and expected lab mix?
- [ ] Required Internet access versus fully local/offline operation?
- [ ] Final venue, floor plan, ISP characteristics, available power, and wired drops?
- [ ] Hardware inventory and spare/replacement equipment?
- [ ] Recovery objectives and acceptable degraded modes?
- [ ] Data retention, participant privacy, and log-retention requirements?
- [ ] Local hosting, remote hosting, or local-primary with remote contingency?
