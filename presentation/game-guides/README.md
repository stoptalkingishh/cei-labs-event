# Game guide decks

> **Historical exports:** These decks were built for the 2026-08-06 event and
> include an older Natas scope. Do not use them for a current event. The current
> reusable guide contract is
> [`CEI-Labs-Wargames/presentation/game-guide-brief.md`](https://github.com/stoptalkingishh/CEI-Labs-Wargames/blob/main/presentation/game-guide-brief.md).

One "how to play" deck per game, for delivery to participants before each game
is released. Each ships in two variants with **identical copy and speaker
notes** — only the artwork differs:

| Game | Plain | Illustrated | Slides |
|---|---|---|---|
| Bandit — Linux Basics | `CEI-Labs-Game-Guide-01-Bandit.pptx` | `…-01-Bandit-Illustrated.pptx` | 13 |
| Krypton — Cryptography | `CEI-Labs-Game-Guide-02-Krypton.pptx` | `…-02-Krypton-Illustrated.pptx` | 12 |
| Natas — Web Security | `CEI-Labs-Game-Guide-03-Natas.pptx` | `…-03-Natas-Illustrated.pptx` | 13 |
| AI Copilot Setup | `CEI-Labs-Game-Guide-04-AI-Copilot.pptx` | `…-04-AI-Copilot-Illustrated.pptx` | 12 |

These are **participant decks**, delivered per game. They do not replace
`../CEI-Labs-CTF-Kickoff.pptx`, which is the single day-of brief covering the
event as a whole; hint tiers and scoring live there and are deliberately not
repeated here.

## Structure

All four run the same skeleton, so a player who has seen one knows where to
look in the others:

```
cover → the map → section divider → one slide per theory topic → getting in
      → your first flag → ready to play
```

Theory sits **before** the practical slides on purpose: the mechanics are what
people act on the moment the deck ends, so they should be the last thing they
saw.

The 26 theory slides are the substance — one concept per slide, explanation on
the left, a concrete worked example on the right. Every example is a generic
textbook illustration of the idea. **None is a payload, path or command for any
actual level**, and each slide's speaker notes say so, so a presenter knows the
whole slide can be shown without spoiling anything.

## Where the content comes from

Nothing here is invented. It is pulled from the live repos, so it can be
re-checked rather than trusted:

| Content | Source |
|---|---|
| Level titles, Bandit chapter bounds | `CEI-Labs-Wargames/targets/*/build/generate_banners.py` |
| Track narrative and beats | `CEI-Labs-Wargames/docs/wargame-story.md`, `wargame-themes.md` |
| Launch controls, Start Here steps | `CEI-Labs-Wargames/challenges/*-start-here/challenge.yml` |
| AI Copilot track (6 challenges) | `CEI-Labs-Wargames/scripts/build_agent.py` |
| Staging and scoring rules | `../../docs/planning/PRESENTATION-BRIEF.md` |

Accent colours are each track's own banner palette from `wargame-themes.md`
(Bandit warm/ember, Krypton cool/cyan, Natas magenta/teal). AI Copilot Setup has
no narrative theme by design — that doc excludes it explicitly — so it carries
the CEI Labs house mint.

Everything else — dark navy canvas, Cambria/Calibri pairing, eyebrow → title →
standfirst header, rounded cards, footer rail — is inherited from
`../CEI-Labs-CTF-Kickoff.pptx` so the whole set reads as one family.

## Rebuilding

```bash
cd src
npm install pptxgenjs react-icons react react-dom sharp
node build.js ../ # plain
node build.js ../ illustrated # illustrated
python transitions.py <deck.pptx> 3,<last-slide>   # per deck
```

`transitions.py` injects slide transitions — Fade on content slides, Push at the
two structural boundaries (the divider, and the closing slide). pptxgenjs has no
API for transitions, so they are added to the packed OOXML afterwards.

The artwork in `art.js` is flat vector SVG rasterised at build time: one
enforced palette, reviewable and editable as shapes rather than as opaque
binaries, and deliberately not the generated look that dates a deck.

## Checks before shipping a change

```bash
python checkfit.py                                    # copy that would wrap out of its box
pwsh -File audit_overflow.ps1 -Dir ..                 # PowerPoint's own overset-text report
python ../../../scripts/office/validate.py <deck>     # or the pptx skill's validator
```

`audit_overflow.ps1` is the one that matters: it asks PowerPoint for the real
laid-out extent of every text box rather than relying on a visual check. It
caught 28 overset boxes that looked fine in a render.

If you edit copy, **keep the two variants in step** — they are generated from
one source, so rebuild both rather than editing a `.pptx` by hand.
