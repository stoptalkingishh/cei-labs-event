# Wargames priority handoff table (2026-07-24)

Consolidated index of every open PR from this session's review pass,
across all three live wargames (Bandit, Krypton, Natas) and the five
planned-but-not-built ones (Leviathan, Narnia, Behemoth, Utumno, Maze).
Priority is judged by player impact on the live/near-live event, not by
effort to fix. This doc doesn't change anything itself -- it's an index
into the PRs already opened, most of which are notes-only per this
session's working pattern (verify + document, don't fix, so other
agents/PRs can pick up the actual code changes).

## Priority key

- **P0** -- actively blocks players from progressing right now.
- **P1** -- broken/missing intended mechanic, or wrong content that
  undermines a specific challenge's design; not fully blocking, but a
  real player-facing problem.
- **P2** -- cosmetic/immersion or minor content-quality issue; doesn't
  block anyone.
- **P3** -- confirmed no action needed, or long-range planning content
  with no near-term deadline.

---

## Part 1: the 3 live wargames (Bandit, Krypton, Natas)

### P0 -- blocking

| PR | Wargame | Issue | Status |
|---|---|---|---|
| [cei-labs-event#18](https://github.com/stoptalkingishh/cei-labs-event/pull/18) | Natas | Target/attacker workstation URL doesn't resolve without DNS; the documented no-DNS fallback (`novnc_url` direct link) was tried live against `192.168.1.173` and **also failed**. Root cause still unknown. | Open, unresolved -- needs live reproduction (exact URL tried, exact browser error) before anyone can fix it. |
| [cei-labs-event#7](https://github.com/stoptalkingishh/cei-labs-event/pull/7) | All 3 (hint-wallet is shared CTFd infra) | Hint wallet is completely broken -- can't open any hints at all, and the described percentage-of-points economy + 2-challenges-ahead progression window was never actually implemented (`solve_hook.py` was never committed to git despite stale bytecode evidence it once existed). | Open, root-caused, needs a real build -- not a small fix. |
| [cei-labs-engine#31](https://github.com/stoptalkingishh/cei-labs-engine/pull/31) + [CEI-Labs-Wargames#20](https://github.com/stoptalkingishh/CEI-Labs-Wargames/pull/20) | All 3 | Wargame challenges weren't auto-hiding until an admin manually clicked "Sync" -- players could see/attempt not-yet-started stages. | **Already fixed and PR'd** (real code, tests included) -- just needs review/merge. Lowest-risk P0 on this list since the work is done. |

### P1 -- real player-facing gaps

| PR | Wargame | Issue | Status |
|---|---|---|---|
| [cei-labs-event#6](https://github.com/stoptalkingishh/cei-labs-event/pull/6) | All 3 (CTFd core) | No way for a player to view a flag they already submitted -- `Submissions.provided` has the data, but the API is admin-only. | Notes only, needs a scoped player-facing endpoint built. |
| [cei-labs-engine#32](https://github.com/stoptalkingishh/cei-labs-engine/pull/32) | All 3 | Standalone launch page never auto-refreshed while host/port were still provisioning, looked stuck/broken. | **Already fixed and PR'd** -- needs review/merge. |
| [cei-labs-event#9](https://github.com/stoptalkingishh/cei-labs-event/pull/9) | Bandit | Bandit2's `ls` output pre-quotes the spaces-filename, defeating the level's actual teaching point. | Notes only, root cause confirmed (coreutils default quoting style, not our content). |
| [cei-labs-event#10](https://github.com/stoptalkingishh/cei-labs-event/pull/10) | Bandit | Bandit3's free description already states both facts its hint ladder is supposed to teach. | Notes only, small text edit once picked up. |
| [cei-labs-event#17](https://github.com/stoptalkingishh/cei-labs-event/pull/17) | Krypton | krypton-00's free description spoils the exact solve command (`base64 -d`). | Notes only, small text edit. Same PR also covers krypton0 having no dedicated account -- that part is a **recorded, deliberate scope decision** (see `docs/security-audit-status.md`), not a bug -- don't conflate the two when picking this up. |
| [cei-labs-event#13](https://github.com/stoptalkingishh/cei-labs-event/pull/13) | Bandit | bandit-05's tier-3 hint hands over a two-step command instead of the self-contained one-liner a comparable external walkthrough uses. | Notes only, the one confirmed actionable hint-quality gap out of the full 33-level cross-reference in #14. |

### P2 -- cosmetic / minor

| PR | Wargame | Issue | Status |
|---|---|---|---|
| [cei-labs-event#11](https://github.com/stoptalkingishh/cei-labs-event/pull/11) | Bandit/Krypton (shared base image) | Debian's legal MOTD still prints at SSH login despite `PrintMotd no`, because PAM's `pam_motd.so` fires independently. Confirmed live, and this **overturns** a prior "already fixed" conclusion in `cei-labs-engine`'s own handoff doc. | Notes only, real root cause identified (PAM config, not sshd config). |
| [cei-labs-event#12](https://github.com/stoptalkingishh/cei-labs-event/pull/12) | Bandit/Krypton | Themed SSH banner ASCII art already exists in source (merged 2026-07-23) but the deployed target images predate that merge -- players are seeing generic/old banners. | Notes only -- this is a deploy/rebuild gap, not a content gap. Cheapest P2 to close: just rebuild and push the target images. |
| [cei-labs-event#8](https://github.com/stoptalkingishh/cei-labs-event/pull/8) | Bandit/Krypton/Natas | Hint reading links point to live external URLs (Wikipedia, git-scm.com, etc.), conflicting with the event's no-internet requirement. | Notes only. Priority depends on whether the venue network genuinely has zero internet access on event day -- confirm that before treating this as urgent. |

### P3 -- confirmed no action needed, or informational

| PR | Wargame | Note |
|---|---|---|
| [cei-labs-event#14](https://github.com/stoptalkingishh/cei-labs-event/pull/14) | Bandit | Full 33-level hint cross-reference -- confirms the bandit-05 gap (#13) does **not** generalize; also flags that our bandit-29 through bandit-33 content doesn't line up by number against the reference site's, so nobody should port that site's text into that range without checking our own `targets/bandit/build/` scripts first. |
| [cei-labs-event#15](https://github.com/stoptalkingishh/cei-labs-event/pull/15) | Krypton | Full cross-reference -- our hints already match or exceed the reference site; krypton-04 correctly avoids an external-tool dependency the site's own walkthrough uses (would reintroduce the #8 problem). No fix needed. |
| [cei-labs-event#16](https://github.com/stoptalkingishh/cei-labs-event/pull/16) | Natas | Full cross-reference -- technique coverage matches exactly; the curl-vs-browser-devtools difference is an intentional fit to this event's Kali-attacker-workstation setup, not a gap. No fix needed. |
| [cei-labs-event#5](https://github.com/stoptalkingishh/cei-labs-event/pull/5) | All 3 | Deployment run notes from the 2026-07-24 full redeploy on `192.168.1.173` (59/59 challenges loaded). Informational. |

---

## Part 2: the 5 planned-but-not-built wargames

These are all pre-implementation -- nothing here blocks the live event.
Ordered by how close each is to being buildable, based on how solid the
sourced content is (see each plan PR for full detail).

| Order | Game | Lore doc | Build plan | Readiness |
|---|---|---|---|---|
| 1 | Leviathan | [#19](https://github.com/stoptalkingishh/cei-labs-event/pull/19) | [#24](https://github.com/stoptalkingishh/cei-labs-event/pull/24) | Best-sourced (all 8 levels), no memory-corruption containment concern (permissions/binary-analysis style, closer to Bandit's risk profile) -- likely the next track to actually build. |
| 2 | Maze | [#23](https://github.com/stoptalkingishh/cei-labs-event/pull/23) | [#28](https://github.com/stoptalkingishh/cei-labs-event/pull/28) | All 9 levels sourced from one solid write-up, but the hardest track technically (format-string-over-network, self-modifying code) -- needs real subject-matter review before commitment, and an open question about whether relaunch-to-reset fits its "one wrong step" design. |
| 3 | Narnia | [#20](https://github.com/stoptalkingishh/cei-labs-event/pull/20) | [#25](https://github.com/stoptalkingishh/cei-labs-event/pull/25) | Only level 0 concretely sourced; first track needing real memory-corruption containment review -- recommend pairing that review with Behemoth's (same risk category). |
| 3 | Behemoth | [#21](https://github.com/stoptalkingishh/cei-labs-event/pull/21) | [#26](https://github.com/stoptalkingishh/cei-labs-event/pull/26) | Thinnest coverage of the five (2 of 9 levels sourced) -- a likely full-series source hit a fetch error and should be retried before investing more research time elsewhere. Pair review with Narnia. |
| 4 | Utumno | [#22](https://github.com/stoptalkingishh/cei-labs-event/pull/22) | [#27](https://github.com/stoptalkingishh/cei-labs-event/pull/27) | Sparse public coverage across the board (multiple other walkthrough projects mark it "Coming Soon" too) -- may need original research/testing against upstream rather than secondary sources. Was already recommended to sequence after Narnia/Behemoth for difficulty coherence. |

---

## Suggested near-term sequencing

1. Merge the two already-written code fixes: [cei-labs-engine#31](https://github.com/stoptalkingishh/cei-labs-engine/pull/31)/[CEI-Labs-Wargames#20](https://github.com/stoptalkingishh/CEI-Labs-Wargames/pull/20) (wargame auto-hide) and [cei-labs-engine#32](https://github.com/stoptalkingishh/cei-labs-engine/pull/32) (launch-page auto-refresh) -- lowest risk, already tested, closes two P0s immediately.
2. Reproduce the Natas DNS failure ([#18](https://github.com/stoptalkingishh/cei-labs-event/pull/18)) live -- this is the one open P0 with no fix in hand yet, and the fastest way to unblock it is a live repro session, not more source-reading.
3. Decide the hint-wallet's actual scope ([#7](https://github.com/stoptalkingishh/cei-labs-event/pull/7)) -- this is a real build, not a quick patch, so it needs a scoping decision (rebuild the described economy model vs. a simpler interim fix) before anyone starts.
4. Work the P1 list -- most are small, isolated text/endpoint changes.
5. P2s can go whenever convenient; #12 (stale banner images) is the cheapest since the content already exists and just needs a rebuild+redeploy.
6. For the 5 future wargames: no urgency, but if picking one to start, Leviathan ([#24](https://github.com/stoptalkingishh/cei-labs-event/pull/24)) is the most implementation-ready today.
