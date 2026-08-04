// Builds the four CEI Labs "how to play" game decks.
//
// All four share one skeleton (cover / the map / section divider / one slide
// per theory topic / getting in / first flag / go) so a player who has seen one
// knows where to look in the others. Theory sits BEFORE the practical slides
// deliberately: the mechanics are what people act on the moment the deck ends,
// so they should be the last thing they saw. Content is taken from
// the live repos, not invented:
//   - level titles + chapter bounds: CEI-Labs-Wargames/targets/*/build/generate_banners.py
//   - narrative + beats:             CEI-Labs-Wargames/docs/wargame-story.md, wargame-themes.md
//   - launch controls + first flag:  CEI-Labs-Wargames/challenges/*-start-here/challenge.yml
//   - AI Copilot track:              CEI-Labs-Wargames/scripts/build_agent.py
//   - scoring / staging rules:       cei-labs-event/PRESENTATION-BRIEF.md

const pptxgen = require("pptxgenjs");
const T = require("./theme");
const TOPICS = require("./topics");
const ART = require("./art");
const { C, F, W, M } = T;

const OUT = process.argv[2] || ".";
// Two variants off one source: the plain deck, and an illustrated one whose
// artwork is drawn by art.js. Everything else -- copy, structure, notes -- is
// identical, so the two can never drift apart.
const ILL = process.argv[3] === "illustrated";

// ------------------------------------------------------------- primitives --

function newDeck() {
  const p = new pptxgen();
  const addSlide = p.addSlide.bind(p);
  p.addSlide = (...a) => T.normalizingSlide(addSlide(...a));
  p.layout = "LAYOUT_WIDE"; // 13.33 x 7.5, same as the kickoff deck
  p.author = "CEI Labs";
  p.company = "CEI Labs";
  return p;
}

async function cover(p, d, page) {
  const s = p.addSlide();
  T.bg(s);
  if (ILL) {
    // The artwork takes the space the decorative circle used to fill, so only
    // the lower-left circle survives; text narrows to clear it.
    s.addShape("ellipse", { x: -2.4, y: 4.9, w: 4.6, h: 4.6, fill: { color: C.card } });
    s.addImage({ data: await ART.coverArt(d.key, d.accent, d.accent2),
                 x: 7.55, y: 1.15, w: 5.25, h: 4.3 });
  } else {
    T.coverCircles(s);
  }
  const tw = ILL ? 6.7 : 10;
  await T.iconBadge(s, { x: M, y: 1.05, d: 0.86, name: d.icon, fill: d.accent, glyph: C.bg });
  s.addText(d.name.toUpperCase(), {
    x: M, y: 3.3, w: tw, h: 0.9, fontFace: F.head, fontSize: 44, bold: true,
    color: C.title, margin: 0,
  });
  s.addText(d.storyTitle, {
    x: M, y: 4.25, w: tw, h: 0.45, fontFace: F.head, fontSize: 22, bold: true,
    italic: true, color: d.accent, margin: 0,
  });
  s.addText(d.coverLine, {
    x: M, y: ILL ? 4.8 : 4.85, w: ILL ? 6.8 : 8.6, h: ILL ? 0.62 : 0.4,
    fontFace: F.body, fontSize: 13.5, color: C.body, margin: 0,
    lineSpacingMultiple: 1.15,
  });
  // The track's premise. It used to have a slide of its own; folding it onto
  // the cover keeps the narrative that the chapter names on the map depend on,
  // and costs nothing -- this area was empty.
  s.addText(d.premise, {
    x: M, y: ILL ? 5.5 : 5.45, w: ILL ? 6.8 : 8.3, h: 1.3, fontFace: F.body,
    fontSize: 11.5, italic: true, color: C.muted, margin: 0,
    lineSpacingMultiple: 1.22,
  });
  T.footer(s, page);
  s.addNotes(d.coverNotes);
  return s;
}

// ------------------------------------------------------------ deck content --

const DECKS = [];

// ============================================================ 1. BANDIT ====

DECKS.push({
  file: "CEI-Labs-Game-Guide-01-Bandit.pptx",
  key: "bandit",
  name: "Bandit",
  icon: "FiTerminal",
  discipline: "Linux Basics",
  storyTitle: "The Vault at Dryrock",
  coverLine: "34 levels of Linux command line, played as one long night inside a walled compound.",
  coverNotes:
    "Bandit is the track everyone starts on. It teaches the Linux command line from absolute zero " +
    "to genuinely advanced material, over 34 levels plus a Start Here. Every level hands you the " +
    "password for the next one, so the track is strictly linear -- you cannot skip ahead. " +
    "The story framing (The Vault at Dryrock) is CEI Labs' own; it exists to make the login " +
    "banners feel like one continuous journey, and never encodes a hint.",



  map: {
    title: "Eight chapters, thirty-four levels",
    sub: "Chapter boundaries follow the material, not an even numeric split — the cron levels stay together, the git levels stay together.",
    items: [
      ["0–4", "Over the Wall", "The outer gate, and the first steps inside."],
      ["5–10", "The Storeyard", "A yard of crates, searched for anything useful."],
      ["11–16", "The Inner Halls", "Corridors, and doors that want keys."],
      ["17–20", "The Guardroom", "Where the compound's authority is kept."],
      ["21–23", "The Bell Tower", "Everything here runs on a schedule."],
      ["24–26", "The Locked Wing", "Rooms built to hold you, worked open."],
      ["27–31", "The Archive", "The ledger, and its whole history."],
      ["32–33", "The Escape", "Out through the far wall with it."],
    ],
    kicker: "All 34 levels share one box. Launch it once and it stays yours.",
  },

  launchNote: "All 34 Bandit levels share a single box. Launch it from any Bandit challenge — you get the same host and port back every time.",
  connect: {
    eyebrow: "Getting in",
    title: "You connect with SSH",
    sub: "Bandit gives you a host and a port. You log in from your own terminal — no browser desktop needed.",
    steps: [
      { title: "Launch Environment", body: "On the challenge itself. Wait for a host and port to appear." },
      { title: "SSH in", body: "Use the level's username and the previous level's password." },
      { title: "Solve and read", body: "Work in the shell until you find the next level's password." },
      { title: "Submit the flag", body: "Paste it into CTFd. Points go up, the next level opens." },
    ],
    kicker: "Never used SSH before? Bandit's Start Here challenge walks you through it, one step at a time.",
  },

  first: {
    eyebrow: "Your first flag",
    title: "Start Here, step by step",
    sub: "Ten points, five minutes, and it proves your whole toolchain works before any real level counts against your clock.",
    steps: [
      { title: "Click Launch", body: "On the \"Bandit: Start Here\" challenge in CTFd." },
      { title: "Log in", body: "Connect as bandit0 with password bandit0 — the fixed, publicly known entry account." },
      { title: "Read welcome.txt", body: "In the home directory. Not readme — that one is level 0's real puzzle." },
      { title: "Submit it", body: "Its contents are your flag. Then begin Bandit 0 → 1." },
    ],
    kicker: "Every track has a Start Here. Always do it first.",
  },


});

// =========================================================== 2. KRYPTON ====

DECKS.push({
  file: "CEI-Labs-Game-Guide-02-Krypton.pptx",
  key: "krypton",
  name: "Krypton",
  icon: "FiRadio",
  discipline: "Cryptography",
  storyTitle: "Signal from the Dark",
  coverLine: "Seven levels of classical cryptography, played as one long night shift on a deep-space listening post.",
  coverNotes:
    "Krypton is the shortest track and the most self-contained: seven levels that walk the entire history " +
    "of classical cryptography, from an encoding that isn't really a cipher at all up to a stream cipher. " +
    "It is a good second track -- it needs far less Linux than Bandit, so it rewards people who found " +
    "Bandit heavy going.",



  map: {
    title: "Seven levels, one night shift",
    sub: "Each level is a single named technique. Nothing here needs deep Linux — if Bandit felt heavy, start with this track.",
    items: [
      ["00", "Base64", "Not a cipher at all — an encoding. No key, no secret."],
      ["01", "ROT13", "A fixed rotation. Apply it twice and you are back."],
      ["02", "Caesar Shift", "Same idea, but nobody tells you the number."],
      ["03", "Frequency", "Letters aren't evenly used. That imbalance is a crowbar."],
      ["04", "Vigenère", "A shift that changes per position — period given."],
      ["05", "Kasiski Test", "The period isn't given. Repeats give it away."],
      ["06", "Stream Cipher", "A keystream that never quite repeats."],
    ],
    kicker: "Levels 0–6 share one box. Krypton has no environment of its own beyond that.",
  },

  launchNote: "Levels 0–6 share one box, launched from the control attached to each of those challenges.",
  connect: {
    eyebrow: "Getting in",
    title: "You connect with SSH",
    sub: "Same as Bandit: a host, a port, and your own terminal. If you've already played Bandit, you already know this part.",
    steps: [
      { title: "Launch Environment", body: "On any Krypton challenge. Wait for the host and port." },
      { title: "SSH in", body: "Same idea: the previous level's password is this login." },
      { title: "Break the cipher", body: "Everything you need is in the level's own directory." },
      { title: "Submit the flag", body: "The recovered password is both the flag and your next login." },
    ],
    kicker: "The command-line tools you need are already installed — run krypton-tools --help on the box.",
  },

  first: {
    eyebrow: "Your first flag",
    title: "Start Here, step by step",
    sub: "Ten points to confirm you can reach the box and read a file, before any cipher is involved.",
    steps: [
      { title: "Click Launch", body: "On the \"Krypton: Start Here\" challenge in CTFd." },
      { title: "Log in", body: "Connect as krypton0 with password krypton0 — the fixed public entry account." },
      { title: "Read welcome.txt", body: "In the home directory." },
      { title: "Submit it", body: "Then begin Krypton 0 → 1: Base64 Decoding." },
    ],
    kicker: "Krypton 0 is deliberately gentle — it's an encoding, not a cipher.",
  },
});

// ============================================================= 3. NATAS ====

DECKS.push({
  file: "CEI-Labs-Game-Guide-03-Natas.pptx",
  key: "natas",
  name: "Natas",
  icon: "FiMonitor",
  discipline: "Web Security",
  storyTitle: "Into the Mirror",
  coverLine: "15 levels of server-side web security, played as a descent through an inverted underworld.",
  coverNotes:
    "Natas is the web track and the one that works differently from the other two: launching gives you an " +
    "attacker workstation, not a direct line to the target. Every target is reachable only from inside " +
    "that workstation. There is no SSH requirement -- one click gives a full Kali desktop in the browser " +
    "over noVNC. 'Natas' is 'Satan' spelled backwards, which is where the mirrored-underworld theme comes from.",

  map: {
    title: "Fifteen levels, one long descent",
    sub: "The first few are things you can do with nothing but a browser. The last few reach the server itself.",
    items: [
      ["00–01", "Source & Blockers", "What the page is made of, and a barrier that only looks like one."],
      ["02–03", "Unlisted Paths", "Corridors never meant to be found; a sign that only asks."],
      ["04–05", "Forged Claims", "Referer and cookies — arriving from somewhere you never were."],
      ["06–07", "Hidden Includes", "A trapdoor under something ordinary; a door that opens too far."],
      ["08–09", "Mirror & Injection", "A lock that shows its own key; one extra instruction slipped in."],
      ["10–11", "Guards & Overlap", "The same trick with a guard on it; where two things overlap."],
      ["12–14", "Uploads & Records", "Your own thing through the slot — then the records themselves."],
    ],
    kicker: "All 15 levels share one target box, distinguished by port.",
  },

  launchNote: "Launching Natas gives you an attacker workstation and the shared target box. Targets are reachable only from inside the workstation.",
  connect: {
    eyebrow: "Getting in",
    title: "No SSH required",
    sub: "Natas is the one track that needs nothing installed. One click gives you a full Linux desktop inside your browser.",
    steps: [
      { title: "Launch Environment", body: "You get an attacker workstation plus this track's shared target." },
      { title: "Open noVNC", body: "A full desktop in a browser tab. SSH is offered too." },
      { title: "Work from inside", body: "Browse to the target from the workstation, not from your own laptop." },
      { title: "Submit the flag", body: "Each level's password is the login for the next level's page." },
    ],
    kicker: "This is the track to pick if you're on a locked-down laptop with no terminal.",
  },

  first: {
    eyebrow: "Your first flag",
    title: "Start Here, step by step",
    sub: "Ten points, and it proves the part people actually get stuck on: that targets live behind the workstation.",
    steps: [
      { title: "Click Launch", body: "On the \"Natas: Start Here\" challenge in CTFd." },
      { title: "Open the workstation", body: "noVNC in your browser, or SSH — your choice." },
      { title: "Browse from inside it", body: "Open the target host on port 8000 and read welcome.txt." },
      { title: "Submit it", body: "Then begin Natas 0: View Source." },
    ],
    kicker: "If the target won't load, check you're browsing from the workstation and not your own machine.",
  },

});

// ==================================================== 4. AI COPILOT SETUP ==

DECKS.push({
  file: "CEI-Labs-Game-Guide-04-AI-Copilot.pptx",
  key: "agent",
  name: "AI Copilot Setup",
  icon: "FiCpu",
  discipline: "Your own toolkit",
  storyTitle: "The one that isn't a story",
  coverLine: "Six challenges that put a free, local AI coach on your own laptop — the event's one sanctioned AI exception.",
  coverNotes:
    "This track is deliberately unlike the other three. There is no compound, no signal, no underworld, and " +
    "no Docker instance to launch -- the target is the player's own laptop. It is not part of the staged " +
    "wave rollout and ships hidden by default; the organizer releases it manually. The single most important " +
    "slide is the rules one: this is the ONLY sanctioned AI exception, and it does not generalise to the " +
    "other three tracks.",



  map: {
    title: "Six challenges, 610 points",
    sub: "Each one is verified by ctf-agent-verify, a tool shipped with the agent. It checks a real milestone and prints the flag only when that milestone is genuinely true on your machine.",
    items: [
      ["SH · 10 PTS", "Start Here", "Read the AI-use exception and confirm you understand it."],
      ["01 · 100 PTS", "Local Brain", "Ollama installed and answering. Nothing works until this does."],
      ["02 · 100 PTS", "Pull a Model", "A runtime with no model can't think yet. Size it to your memory."],
      ["03 · 100 PTS", "Install the Agent", "ctf-agent and ctf-agent-verify properly on your PATH."],
      ["04 · 150 PTS", "Point It At a Box", "A real SSH connection to a live Bandit, Krypton or Natas instance."],
      ["05 · 150 PTS", "Ask For Help", "Name a track and a level. Show the shape of a useful prompt."],
    ],
    kicker: "Nothing here is guessable without actually doing the step.",
  },

  launchNote: "There is no Launch button on this track. The target is your laptop — the bootstrap script installs everything in one command.",
  connect: {
    eyebrow: "Getting set up",
    title: "One command installs everything",
    sub: "The bootstrap script installs Ollama, the agent and its dependencies, then opens the app in your browser.",
    steps: [
      { title: "Download the script", body: "bootstrap.sh for macOS and Linux, bootstrap.ps1 for Windows." },
      { title: "Run it", body: "One line in Terminal or PowerShell. First run pulls a model." },
      { title: "The app opens", body: "A chat window in your browser, with a model and box picker." },
      { title: "Verify", body: "Run ctf-agent-verify. It reports the milestones you passed." },
    ],
    kicker: "Venue Wi-Fi unreliable? An offline copy of the whole project site is attached to Start Here.",
  },

  first: {
    eyebrow: "Your first flag",
    title: "Start Here, step by step",
    sub: "This one has no command to run. It exists so nobody can claim they didn't know the rule.",
    steps: [
      { title: "Open Start Here", body: "\"AI Copilot Setup: Start Here\" in CTFd." },
      { title: "Read the exception", body: "One paragraph explaining exactly what this track does and does not permit." },
      { title: "Grab the attachments", body: "Bootstrap scripts, README, troubleshooting guide, offline site copy." },
      { title: "Submit the sentence", body: "Copy it word for word. That confirmation is the flag." },
    ],
    kicker: "Read it properly. The rest of this deck assumes you have.",
  },


});


// A breath before the theory run. Six or seven identically-shaped topic slides
// in a row need a marker in front of them, both so the audience knows a new
// section has started and so the presenter has a natural place to pause. It
// doubles as an agenda for the section.
function slideDivider(p, d, page, topics) {
  const s = p.addSlide();
  T.bg(s);
  s.addShape("ellipse", { x: 9.4, y: -2.4, w: 6.6, h: 6.6, fill: { color: C.card } });
  s.addText("THE IDEAS", {
    x: M, y: 1.95, w: 6, h: 0.32, fontFace: F.body, fontSize: 11, bold: true,
    color: d.accent, charSpacing: 1.4, margin: 0,
  });
  s.addText(d.dividerTitle, {
    x: M, y: 2.3, w: 9.4, h: 1.05, fontFace: F.head, fontSize: 38, bold: true,
    color: C.title, margin: 0, valign: "top",
  });
  s.addText(d.dividerSub, {
    x: M, y: 3.3, w: 7.6, h: 0.6, fontFace: F.body, fontSize: 13.5,
    color: C.body, margin: 0, lineSpacingMultiple: 1.18,
  });
  // Two columns of topic titles: the section's own contents page.
  const rows = Math.ceil(topics.length / 2);
  const colW = 5.6, rowH = 0.44;
  topics.forEach((t, i) => {
    const col = Math.floor(i / rows), row = i % rows;
    const x = M + col * (colW + 0.5);
    const y = 4.35 + row * rowH;
    s.addText(String(i + 1).padStart(2, "0"), {
      x, y, w: 0.45, h: rowH, fontFace: F.head, fontSize: 12, bold: true,
      color: d.accent, margin: 0, valign: "middle",
    });
    s.addText(t.title, {
      x: x + 0.5, y, w: colW - 0.5, h: rowH, fontFace: F.body, fontSize: 13,
      color: C.title, margin: 0, valign: "middle",
    });
  });
  T.footer(s, page);
  s.addNotes(
    "A deliberate pause. Say what is coming and roughly how long it will take, then work through the " +
    "topics. None of them is a level and none is a method -- it is the shared vocabulary the track " +
    "assumes. If you are running short, this list is also the menu: cut topics from it rather than " +
    "rushing all of them."
  );
}

// Getting in: one slide instead of two. The old deck had the launch panel and
// the connection steps on consecutive slides with the same four-card layout,
// which read as a duplicate. Two columns puts the whole "how do I start"
// story in one place and matches the topic slides' rhythm.
async function slideGettingIn(p, d, page) {
  const s = p.addSlide();
  T.bg(s);
  await themeCorner(s, d);
  T.header(s, {
    eyebrow: "Getting in",
    title: d.connect.title,
    sub: d.connect.sub,
    accent: d.accent,
  });

  const y = 2.35, h = 3.42;
  const lw = 6.1, gap = 0.28;
  const rx = M + lw + gap, rw = W - M - rx;

  // Left: the sequence you actually follow.
  T.card(s, { x: M, y, w: lw, h });
  s.addText("STEP BY STEP", {
    x: M + 0.34, y: y + 0.28, w: lw - 0.68, h: 0.26, fontFace: F.body,
    fontSize: 9.5, bold: true, color: d.accent, charSpacing: 1.1, margin: 0,
  });
  const srh = 0.68;
  d.connect.steps.forEach((st, i) => {
    const ry = y + 0.68 + i * srh;
    s.addText(String(i + 1), {
      x: M + 0.34, y: ry, w: 0.4, h: srh, fontFace: F.head, fontSize: 16,
      bold: true, color: d.accent, margin: 0, valign: "middle",
    });
    s.addText(st.title, {
      x: M + 0.8, y: ry + 0.04, w: lw - 1.2, h: 0.28, fontFace: F.body,
      fontSize: 12.5, bold: true, color: C.title, margin: 0, valign: "middle",
    });
    s.addText(st.body, {
      x: M + 0.8, y: ry + 0.3, w: lw - 1.2, h: 0.3, fontFace: F.body,
      fontSize: 11, color: C.body, margin: 0, valign: "middle",
    });
  });

  // Right: the controls (or, for the AI track, what the installer puts down).
  T.card(s, { x: rx, y, w: rw, h });
  s.addText(d.panel.label, {
    x: rx + 0.3, y: y + 0.28, w: rw - 0.6, h: 0.26, fontFace: F.body,
    fontSize: 9.5, bold: true, color: d.accent, charSpacing: 1.1, margin: 0,
  });
  const prh = 0.68;
  for (let i = 0; i < d.panel.items.length; i++) {
    const it = d.panel.items[i];
    const ry = y + 0.68 + i * prh;
    await T.iconBadge(s, {
      x: rx + 0.3, y: ry + 0.08, d: 0.44, name: it.icon, fill: d.accent, glyph: C.bg,
    });
    s.addText(it.name, {
      x: rx + 0.92, y: ry + 0.02, w: rw - 1.25, h: 0.28, fontFace: F.body,
      fontSize: 12.5, bold: true, color: C.title, margin: 0, valign: "middle",
    });
    s.addText(it.body, {
      x: rx + 0.92, y: ry + 0.28, w: rw - 1.25, h: 0.32, fontFace: F.body,
      fontSize: 11, color: C.body, margin: 0, valign: "middle",
    });
  }

  T.kicker(s, d.connect.kicker, d.accent, 6.05);
  T.footer(s, page);
  s.addNotes(d.gettingInNotes);
}


const PREMISE = {
  bandit:
    "An outlaw known only by reputation slips into the walled desert compound of Dryrock Hold after dark, " +
    "hunting a ledger locked in its deepest vault. Room by room they search, borrow authority that isn't " +
    "theirs, wait out the bell, and work deeper -- until the record room opens and the escape is made " +
    "through the far wall.",
  krypton:
    "A deep-space listening post catches a faint transmission no one can place. Over one long night shift " +
    "the operator peels back layer after layer, watching the signal grow stranger -- less like noise, more " +
    "like something reaching back -- until the last layer reveals a pattern that never quite repeats.",
  natas:
    "A researcher logs into a web application built like an inverted underworld -- every layer of ordinary " +
    "web logic mirrored, twisted, or hidden just beneath the surface. Each floor down leads further from " +
    "what a browser is supposed to show you, toward the raw records at the bottom.",
  agent:
    "The other three tracks each carry a story. This one deliberately doesn't. There is no compound to " +
    "break into and no signal to decode -- the target is your own laptop, and the reward is a coach that " +
    "sits beside you for the rest of the event.",
};

const DIVIDER = {
  bandit: {
    title: "Seven ideas Linux is built on",
    sub: "Not levels, and not methods -- the mental model the whole track quietly assumes you already have. Worth the ten minutes even if you think you know it.",
  },
  krypton: {
    title: "Six ideas every cipher rests on",
    sub: "The vocabulary the levels are written in. Each one is a technique this track will ask you to recognise, explained here without being applied to anything you have to solve.",
  },
  natas: {
    title: "Seven ideas the web is built on",
    sub: "Enough of how HTTP actually behaves to make the levels legible. No payloads and no walkthroughs -- just the model each level is bending.",
  },
  agent: {
    title: "Six ideas about how this thing works",
    sub: "What a language model is actually doing, so you can judge when to trust it. Useful whether or not you ever finish this track.",
  },
};

const LAUNCH_PANEL = {
  label: "THE LAUNCH PANEL",
  items: [
    { icon: "FiPlay", name: "Launch Environment", body: "Starts your box, or reconnects you to one already running." },
    { icon: "FiRefreshCw", name: "Reboot Host", body: "Restarts it in place. Same connection details afterward." },
    { icon: "FiTrash2", name: "Relaunch Environment", body: "Rebuilds from scratch. Anything you changed inside is lost." },
    { icon: "FiClock", name: "+5 more minutes", body: "Appears only once the track is solved and a shutdown has started." },
  ],
};

const PANEL = {
  bandit: LAUNCH_PANEL,
  krypton: LAUNCH_PANEL,
  natas: LAUNCH_PANEL,
  agent: {
    label: "WHAT THE INSTALLER PUTS DOWN",
    items: [
      { icon: "FiCpu", name: "Ollama", body: "The local runtime that loads and runs the model." },
      { icon: "FiDownload", name: "A model", body: "Chosen to fit your laptop's memory. Downloaded once." },
      { icon: "FiTool", name: "ctf-agent", body: "The app itself -- a chat window in your browser." },
      { icon: "FiCheckCircle", name: "ctf-agent-verify", body: "Checks each milestone and prints its flag when it truly passes." },
    ],
  },
};

const GETTING_IN_NOTES = {
  bandit:
    "Two things to land. First, Reboot versus Relaunch: reboot keeps everything you have done inside the box, " +
    "relaunch throws it away -- people reach for relaunch first and lose their own notes. Second, all 34 levels " +
    "share one box, so they launch it once and keep it.",
  krypton:
    "Identical mechanics to Bandit, so if the room has already seen that deck you can move quickly here. " +
    "The one addition worth naming is krypton-tools --help: the tools they need are already on the box, and " +
    "people waste time installing their own.",
  natas:
    "This is the slide people get wrong. The launch gives them an attacker workstation, and the targets are " +
    "reachable ONLY from inside it -- not from their own laptop. Say that twice. The noVNC desktop needs " +
    "nothing installed, which makes this the right track for anyone on a locked-down machine.",
  agent:
    "There is no launch panel on this track at all -- the target is their own laptop, which is why the right " +
    "column lists what the installer sets up instead. Warn them about the first-run model download: it is " +
    "several gigabytes and it only happens once, but on venue wi-fi it is not quick.",
};

// A quiet themed motif behind the header of the closing practical slides.
// Drawn faint on purpose -- it should read as texture, not compete with the
// content sitting next to it. No-op in the plain variant.
async function themeCorner(s, d) {
  if (!ILL) return;
  s.addImage({ data: await ART.vignetteArt(d.key, d.accent, d.accent2),
               x: 9.35, y: 0.12, w: 3.6, h: 2.08, transparency: 72 });
}

// --------------------------------------------------------------- builders --



// Slide 2 is the same tile grid on all four decks -- the layout Bandit already
// used. In the illustrated variant every tile carries a small scene for that
// part of the game.
// Slide 2 is the same tile grid on all four decks -- the layout Bandit already
// used. In the illustrated variant every tile carries a small scene for that
// part of the game.
//
// Geometry note: the illustrated tile is taller and its grid starts higher,
// because the artwork pushes the text down and the blurb needs room for two
// full lines. The earlier numbers left it 16pt of box for 25pt of text, which
// the overflow audit caught on every tile of every deck.
async function slideMap(p, d, page) {
  const s = p.addSlide();
  T.bg(s);
  T.header(s, { eyebrow: "The map", title: d.map.title, sub: d.map.sub, accent: d.accent });

  const cols = 4, gap = 0.28;
  const cw = (W - 2 * M - gap * (cols - 1)) / cols;
  const th = ILL ? 2.05 : 1.72;
  const top = 2.16;
  const imgW = cw - 0.28;
  const imgH = imgW * 110 / 400;      // tile art is a 400x110 letterbox
  const textTop = ILL ? 0.14 + imgH + 0.15 : 0.2;

  for (let i = 0; i < d.map.items.length; i++) {
    const [label, name, blurb] = d.map.items[i];
    const x = M + (i % cols) * (cw + gap);
    const y = top + Math.floor(i / cols) * (th + gap);
    T.card(s, { x, y, w: cw, h: th, alt: Math.floor(i / cols) % 2 === 1 });
    if (ILL) {
      s.addImage({ data: await ART.tileArt(d.key, i, d.accent, d.accent2),
                   x: x + 0.14, y: y + 0.14, w: imgW, h: imgH });
    }
    s.addText(label, {
      x: x + 0.26, y: y + textTop, w: cw - 0.52, h: 0.24, fontFace: F.body,
      fontSize: 10.5, bold: true, color: d.accent, charSpacing: 0.8, margin: 0,
      valign: "top",
    });
    s.addText(name, {
      x: x + 0.26, y: y + textTop + 0.26, w: cw - 0.52, h: 0.3, fontFace: F.head,
      fontSize: 14, bold: true, color: C.title, margin: 0, valign: "top",
    });
    s.addText(blurb, {
      x: x + 0.26, y: y + textTop + 0.57, w: cw - 0.52,
      h: th - textTop - 0.66, fontFace: F.body, fontSize: 10, color: C.body,
      margin: 0, lineSpacingMultiple: 1.1, valign: "top",
    });
  }
  const rows = Math.ceil(d.map.items.length / cols);
  T.kicker(s, d.map.kicker, d.accent, top + rows * th + (rows - 1) * gap + 0.14);
  T.footer(s, page);
  s.addNotes(d.mapNotes || d.map.sub);
}


async function slideSteps(p, d, page, block) {
  const s = p.addSlide();
  T.bg(s);
  await themeCorner(s, d);
  T.header(s, { eyebrow: block.eyebrow, title: block.title, sub: block.sub, accent: d.accent });
  T.stepRow(s, { y: 2.4, h: 3.05, steps: block.steps, accent: d.accent });
  T.kicker(s, block.kicker, d.accent, 5.85);
  T.footer(s, page);
  s.addNotes(block.notes || block.sub);
}




async function slideGo(p, d, page) {
  const s = p.addSlide();
  T.bg(s);
  // Only the top-right circle here: the cover's bottom-left one sits directly
  // under the checklist and shows through as a wedge beside the cards.
  // In the illustrated variant the artwork occupies this corner, and the
  // circle's edge cuts straight through the sky behind it.
  if (!ILL) {
    s.addShape("ellipse", { x: 9.6, y: -2.2, w: 6.2, h: 6.2, fill: { color: C.card } });
  }
  if (ILL) {
    // The departure, not the arrival -- a different composition from the
    // cover so the two bookend the deck instead of repeating it.
    s.addImage({ data: await ART.closingArt(d.key, d.accent, d.accent2),
                 x: 8.62, y: 2.5, w: 4.1, h: 3.36 });
  }
  s.addText("Ready to play.", {
    x: M, y: 1.25, w: 8, h: 0.8, fontFace: F.head, fontSize: 40, bold: true,
    color: C.title, margin: 0,
  });
  s.addText(d.goSub, {
    x: M, y: 2.1, w: 8.4, h: 0.4, fontFace: F.body, fontSize: 13.5,
    color: C.body, margin: 0,
  });
  const items = d.goSteps;
  const top = 2.85, h = 0.76, gap = 0.15;
  items.forEach((txt, i) => {
    T.card(s, { x: M, y: top + i * (h + gap), w: W - 2 * M - (ILL ? 4.9 : 2.2), h, alt: i % 2 === 1 });
    s.addText(String(i + 1), {
      x: M + 0.42, y: top + i * (h + gap), w: 0.5, h, fontFace: F.head, fontSize: 19,
      bold: true, color: d.accent, margin: 0, valign: "middle",
    });
    s.addText(txt, {
      x: M + 1.1, y: top + i * (h + gap), w: W - 2 * M - (ILL ? 6.3 : 3.6), h, fontFace: F.body,
      fontSize: 14, color: C.title, margin: 0, valign: "middle",
    });
  });
  s.addText("Good luck.", {
    x: M, y: 6.55, w: 6, h: 0.35, fontFace: F.body, fontSize: 14, italic: true,
    color: d.accent, margin: 0,
  });
  T.footer(s, page);
  s.addNotes(d.goNotes || "Closing slide -- leave it up while people get started.");
}





// ---------------------------------------------------------- topic theory ---

// One concept per slide: the explanation on the left, a concrete worked
// example on the right. This is the deck's core content -- everything else
// exists to get players to it.
const EX_MONO = "Courier New";

function exampleCard(s, d, { x, y, w, h, lines }) {
  T.card(s, { x, y, w, h });
  const rich = lines.map((ln, i) => {
    const isComment = ln.startsWith("# ");
    return {
      text: isComment ? ln.slice(2) : (ln || " "),
      options: {
        color: isComment ? C.muted : C.title,
        italic: isComment,
        breakLine: i < lines.length - 1,
      },
    };
  });
  s.addText(rich, {
    x: x + 0.3, y: y + 0.28, w: w - 0.6, h: h - 0.56,
    fontFace: EX_MONO, fontSize: 10.5, margin: 0, valign: "top",
    lineSpacingMultiple: 1.12,
  });
}

// The shift cipher gets a purpose-built visual instead of a mono block: the
// two alphabets stacked, which is the whole mechanism in one look.
function shiftVisual(s, d, { x, y, w, h }) {
  T.card(s, { x, y, w, h });
  const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const inner = w - 0.6;
  const cw = inner / 26;
  const rowY = y + 0.55;
  s.addText("PLAIN", {
    x: x + 0.3, y: y + 0.26, w: 2, h: 0.24, fontFace: F.body, fontSize: 9,
    bold: true, color: C.muted, charSpacing: 1, margin: 0,
  });
  for (let i = 0; i < 26; i++) {
    s.addText(A[i], {
      x: x + 0.3 + i * cw, y: rowY, w: cw, h: 0.3, fontFace: EX_MONO,
      fontSize: 10, color: C.body, align: "center", margin: 0, valign: "middle",
    });
  }
  s.addText("SHIFTED BY 3", {
    x: x + 0.3, y: y + 0.95, w: 2.2, h: 0.24, fontFace: F.body, fontSize: 9,
    bold: true, color: d.accent, charSpacing: 1, margin: 0,
  });
  for (let i = 0; i < 26; i++) {
    s.addText(A[(i + 3) % 26], {
      x: x + 0.3 + i * cw, y: y + 1.24, w: cw, h: 0.3, fontFace: EX_MONO,
      fontSize: 10, bold: true, color: d.accent, align: "center", margin: 0,
      valign: "middle",
    });
  }
  const rows = [
    ["CIPHERTEXT", "WKH VLJQDO LV IDLQW", C.body, false],
    ["SHIFTED BACK", "THE SIGNAL IS FAINT", d.accent, true],
  ];
  rows.forEach(([label, text, col, bold], i) => {
    const ry = y + 1.85 + i * 0.72;
    s.addText(label, {
      x: x + 0.3, y: ry, w: 1.5, h: 0.28, fontFace: F.body, fontSize: 9,
      bold: true, color: C.muted, charSpacing: 1, margin: 0,
    });
    s.addText(text, {
      x: x + 0.3, y: ry + 0.26, w: inner, h: 0.34, fontFace: EX_MONO,
      fontSize: 14, bold, color: col, margin: 0, valign: "middle",
    });
  });
  s.addText("Encrypting and decrypting are the same move, in opposite directions.", {
    x: x + 0.3, y: y + h - 0.62, w: inner, h: 0.5, fontFace: F.body,
    fontSize: 11, color: C.body, margin: 0, lineSpacingMultiple: 1.15,
  });
}

function slideTopic(p, d, page, topic, idx, total) {
  const s = p.addSlide();
  T.bg(s);
  T.header(s, {
    eyebrow: `Theory  ${String(idx).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
    title: topic.title,
    sub: topic.def,
    accent: d.accent,
  });

  const y = 2.35, h = 3.42;
  const lw = 6.1, gap = 0.28;
  const rx = M + lw + gap, rw = W - M - rx;

  T.card(s, { x: M, y, w: lw, h });
  const blocks = [
    ["WHAT IT IS", topic.what, y + 0.3],
    ["WHY IT MATTERS HERE", topic.why, y + 1.98],
  ];
  blocks.forEach(([label, body, by]) => {
    s.addText(label, {
      x: M + 0.34, y: by, w: lw - 0.68, h: 0.26, fontFace: F.body, fontSize: 9.5,
      bold: true, color: d.accent, charSpacing: 1.1, margin: 0,
    });
    s.addText(body, {
      x: M + 0.34, y: by + 0.3, w: lw - 0.68, h: 1.5, fontFace: F.body,
      fontSize: 12, color: C.body, margin: 0, lineSpacingMultiple: 1.2,
      valign: "top",
    });
  });

  if (topic.special === "shift") shiftVisual(s, d, { x: rx, y, w: rw, h: 3.9 });
  else exampleCard(s, d, { x: rx, y, w: rw, h, lines: topic.example });

  T.kicker(s, topic.kicker, d.accent, 6.05);
  T.footer(s, page);
  s.addNotes(
    `${topic.title}. ${topic.def}\n\n` +
    `The left column is the explanation; the right is a worked example you can talk through line by line. ` +
    `The example is a generic illustration of the concept -- it is not a payload, path or command for any ` +
    `actual level, so it can be shown in full without spoiling anything.\n\n` +
    `Land this: ${topic.kicker}`
  );
}

// ------------------------------------------------------------------ build --

const GO = {
  bandit: {
    sub: "Bandit is the longest track and the one everything else builds on.",
    steps: [
      "Log in to CTFd and open the Bandit category",
      "Solve \"Bandit: Start Here\" to check your connection",
      "Launch the environment — all 34 levels share it",
      "Work level 0 upward; each password opens the next",
    ],
  },
  krypton: {
    sub: "Krypton is short, self-contained, and needs far less Linux than Bandit.",
    steps: [
      "Log in to CTFd and open the Cryptography category",
      "Solve \"Krypton: Start Here\" to check your connection",
      "Launch the environment — levels 0 to 6 share it",
      "Run krypton-tools --help on the box before you start guessing",
    ],
  },
  natas: {
    sub: "Natas needs nothing installed — just a browser.",
    steps: [
      "Log in to CTFd and open the Web Security category",
      "Solve \"Natas: Start Here\" to reach the workstation",
      "Open noVNC and browse to the target from inside it",
      "Work level 0 downward; view source before anything else",
    ],
  },
  agent: {
    sub: "Do this one early. It pays for itself across the other three tracks.",
    steps: [
      "Open \"AI Copilot Setup: Start Here\" and read the AI-use exception",
      "Download and run the bootstrap script for your operating system",
      "Wait out the first model download — it only happens once",
      "Run ctf-agent-verify and collect the flags it reports",
    ],
  },
};


async function buildDeck(d) {
  Object.assign(d, T.ACCENTS[d.key]);
  // Every map tile needs its own illustration; a mismatch would otherwise show
  // up as a blank tile or a crash halfway through the run.
  if (ART.tileCount(d.key) !== d.map.items.length) {
    throw new Error(
      `${d.key}: ${d.map.items.length} map tiles but ${ART.tileCount(d.key)} illustrations`
    );
  }
  d.premise = PREMISE[d.key];
  d.dividerTitle = DIVIDER[d.key].title;
  d.dividerSub = DIVIDER[d.key].sub;
  d.panel = PANEL[d.key];
  d.gettingInNotes = GETTING_IN_NOTES[d.key];
  d.goSub = GO[d.key].sub;
  d.goSteps = GO[d.key].steps;

  const p = newDeck();
  const topics = TOPICS[d.key.toUpperCase()];
  let n = 1;
  await cover(p, d, n++);
  await slideMap(p, d, n++);
  slideDivider(p, d, n++, topics);
  topics.forEach((t, i) => slideTopic(p, d, n++, t, i + 1, topics.length));
  await slideGettingIn(p, d, n++);
  await slideSteps(p, d, n++, d.first);
  await slideGo(p, d, n++);

  // Distinct filenames so the two variants can sit side by side in the repo.
  const path = `${OUT}/${ILL ? d.file.replace(/\.pptx$/, "-Illustrated.pptx") : d.file}`;
  await p.writeFile({ fileName: path });
  console.log(`wrote ${path} (${n - 1} slides)`);
}

(async () => {
  for (const d of DECKS) await buildDeck(d);
})();
