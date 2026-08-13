# CEI Labs CTF — Day-of Kickoff Brief

> **Historical snapshot:** This brief supports the 2026-08-06 event deck and
> may not match the current catalog or launch flow. Use the current source in
> [`CEI-Labs-Wargames/presentation/kickoff-brief.md`](https://github.com/stoptalkingishh/CEI-Labs-Wargames/blob/master/presentation/kickoff-brief.md)
> for a new event.

Source content and speaker notes for the opening presentation given to
participants right before the event starts. High level and demo-oriented
on purpose — this is the "how today works" talk, not a technical deep
dive. In particular, SSH is used but not explained here in any depth:
using SSH is one of the first things the Bandit track teaches
step-by-step, so walking through it here would spoil/duplicate that
learning objective. This doc is the outline; `CEI-Labs-CTF-Kickoff.pptx`
in this same folder is the built deck.

## Audience & goal

Participants, seated, before they've logged into anything. Goal: by the
end of this talk they know what the event is, how to get into it, and
how winning works — enough to start confidently, not enough to bore
people who already know CTFs.

Keep it to ~10 slides / 5-7 minutes. This is a live-event kickoff, not a
reference doc — the real reference material (quick-start, hints,
instructors in the room) covers anything this talk doesn't.

## Slide-by-slide outline

1. **Title** — CEI Labs CTF, event name/date/logo placeholder.

2. **What is this?**
   - A live Capture the Flag event: hands-on security challenges,
     solved for points.
   - Built on the well-known OverTheWire-style wargames — you're
     working through real, established learning tracks, not one-off
     puzzles.
   - Three games: **Bandit** (Linux basics), **Krypton**
     (cryptography), **Natas** (web security). Staff release them in
     stages; everyone begins each game at its Start Here challenge.

3. **How it runs — CTFd**
   - CTFd is the platform for the whole event: log in, browse
     challenges, launch your environment, submit flags, watch the
     scoreboard.
   - Everything today happens through your browser in CTFd. One tab,
     one login.

4. **Your assigned lab**
   - CTFd launches the environment assigned to you for the active game.
     Stay within your assigned targets; never probe another participant
     or event infrastructure.
   - Click **Launch Environment** on a challenge in CTFd, wait a few
     seconds, get your connection info back.

5. **Connecting to a challenge**
   - Bandit and Krypton: you'll connect with **SSH** — the standard
     way to remotely log into a Linux machine from a terminal. We're
     not covering SSH itself here — Bandit's very first challenge,
     "Start Here," walks you through exactly how, one step at a time.
   - Natas: no SSH needed — one click gives you a full desktop in your
     browser (noVNC), nothing to install.
   - Bottom line: open the track's "Start Here" challenge first and
     it'll tell you exactly what to do.

6. **Stuck? Use hints.**
   - Many challenges offer up to 3 hint tiers — a nudge, a real
     explanation, then a full walkthrough.
   - Any point cost is shown before unlock. Hints never block you from
     solving the challenge or lock you out.

7. **Scoring by game**
   - Bandit, Krypton, and Natas each have their own administrator-started
     clock and scoreboard.
   - Rankings use points, then last scoring solve elapsed time from that
     game's start, then name. Awards follow the rules announced before
     play; do not promise a top-three structure until it is approved.

8. **If something breaks**
   - Puzzle being hard isn't the same as something being broken — try
     the next hint tier first.
   - Environment actually stuck? Use **Reboot Host** on that
     challenge's launch panel.
   - Still stuck, or looks like a real bug? Flag down an instructor —
     that's what we're here for.

9. **Let's go**
   - Log in, wait for the announced game start, then open its Start Here
     challenge.
   - Follow that game's scoreboard and staff announcements — good luck.

## Notes for whoever presents

- State only the award structure approved by the event lead. The current
  deck deliberately says results are per game and awards will be announced.
- Don't demo live SSH usage here even briefly; pointing at the Start
  Here challenge is the correct level of detail for this talk.
- If asked live about WiFi/network/account details beyond what's on
  the slides, defer to whatever the event's actual logistics turn out
  to be on the day rather than reading numbers off this doc — this
  brief only covers how the CTF itself works, not venue logistics.
