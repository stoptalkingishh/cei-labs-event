// Shared design system for the four CEI Labs game decks.
//
// Every value here is lifted from the existing event deck
// (cei-labs-event/presentation/CEI-Labs-CTF-Kickoff.pptx) so the four game
// decks read as the same family: same dark navy canvas, same Cambria/Calibri
// pairing, same eyebrow -> title -> subtitle header, same rounded cards with
// an icon in a colored circle, same footer rail.
//
// The ONLY thing that varies per deck is `accent`, and each track's accent is
// taken from that track's own in-repo palette (see
// CEI-Labs-Wargames/docs/wargame-themes.md) rather than invented here.

const ReactDOMServer = require("react-dom/server");
const React = require("react");
const sharp = require("sharp");

// ---------------------------------------------------------------- palette --

const C = {
  bg: "0B1220",       // page canvas
  card: "141F30",     // default card / decorative circle
  cardAlt: "1B2740",  // highlighted card (kickoff uses this for the "middle" row)
  title: "F4F6FB",    // headings
  body: "93A5C7",     // body copy
  muted: "5B6B8C",    // footers, captions, de-emphasized rules
  white: "FFFFFF",
};

// Per-track accents, each sourced from that track's own banner palette.
const ACCENTS = {
  // Bandit: warm/earthy sand -> gold -> rust -> ember ramp.
  bandit: { accent: "E0A340", accent2: "C4643C", tint: "2A2015" },
  // Krypton: cool blue -> cyan -> magenta/violet progression.
  krypton: { accent: "4CC9F0", accent2: "9D6DF0", tint: "13233A" },
  // Natas: cool navy-teal surface descending to hot magenta at the bottom.
  natas: { accent: "E0559E", accent2: "5BC8C8", tint: "2A1528" },
  // AI Copilot Setup has no narrative theme by design (wargame-themes.md
  // excludes it explicitly), so it carries the CEI Labs house mint.
  agent: { accent: "35D399", accent2: "5B8DEF", tint: "10261F" },
};

const F = { head: "Cambria", body: "Calibri" };

// Much of this deck's copy is lifted verbatim from repo docs and challenge
// descriptions, which are written for plain-text/Markdown output and use "--"
// for an em dash and "-" for a numeric range. Both look like typos on a slide,
// so normalise every string on its way in rather than hand-editing each one.
function tx(s) {
  if (typeof s !== "string") return s;
  return s
    .replace(/ -- /g, " — ")
    .replace(/(\d)\s*-\s*(\d)/g, "$1–$2");
}

// 13.33 x 7.5 in, matching the kickoff deck exactly.
const W = 13.333;
const H = 7.5;
const M = 0.6; // left/right margin

// ------------------------------------------------------------------ icons --

const iconCache = new Map();

async function icon(name, color = C.white) {
  const key = name + color;
  if (iconCache.has(key)) return iconCache.get(key);
  const fi = require("react-icons/fi");
  const Comp = fi[name];
  if (!Comp) throw new Error("unknown icon: " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { color: "#" + color, size: 256, strokeWidth: 2 })
  );
  const buf = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  iconCache.set(key, data);
  return data;
}

// --------------------------------------------------------------- helpers --

function bg(slide) {
  slide.background = { color: C.bg };
}

// The kickoff cover's two off-canvas circles. Purely decorative, and the one
// piece of chrome that makes a slide instantly recognizable as this deck.
function coverCircles(slide) {
  slide.addShape("ellipse", { x: 9.6, y: -2.2, w: 6.2, h: 6.2, fill: { color: C.card } });
  slide.addShape("ellipse", { x: -2.4, y: 4.9, w: 4.6, h: 4.6, fill: { color: C.card } });
}

function footer(slide, page) {
  slide.addText("CEI LABS CTF", {
    x: M, y: 7.05, w: 3, h: 0.3, fontFace: F.body, fontSize: 9,
    color: C.muted, charSpacing: 1.5, margin: 0,
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: W - M - 1, y: 7.05, w: 1, h: 0.3, fontFace: F.body, fontSize: 9,
    color: C.muted, align: "right", margin: 0,
  });
}

// Standard content-slide header: eyebrow / title / optional standfirst.
// Returns the y coordinate where body content may begin.
function header(slide, { eyebrow, title, sub, accent }) {
  slide.addText(eyebrow.toUpperCase(), {
    x: M, y: 0.5, w: W - 2 * M, h: 0.3, fontFace: F.body, fontSize: 11,
    bold: true, color: accent, charSpacing: 1.2, margin: 0,
  });
  slide.addText(title, {
    x: M, y: 0.82, w: W - 2 * M, h: 0.62, fontFace: F.head, fontSize: 32,
    bold: true, color: C.title, margin: 0,
  });
  if (!sub) return 1.72;
  slide.addText(sub, {
    x: M, y: 1.52, w: W - 2 * M - 1.4, h: 0.52, fontFace: F.body, fontSize: 13,
    color: C.body, margin: 0, lineSpacingMultiple: 1.15,
  });
  return 2.22;
}

function card(slide, { x, y, w, h, alt }) {
  slide.addShape("roundRect", {
    x, y, w, h, rectRadius: 0.09,
    fill: { color: alt ? C.cardAlt : C.card },
  });
}

// Icon inside a filled circle — the deck's repeated motif.
async function iconBadge(slide, { x, y, d = 0.62, name, fill, glyph = C.white }) {
  slide.addShape("ellipse", { x, y, w: d, h: d, fill: { color: fill } });
  slide.addImage({
    data: await icon(name, glyph),
    x: x + d * 0.26, y: y + d * 0.26, w: d * 0.48, h: d * 0.48,
  });
}

// A row of equal cards with an icon badge, heading and body.
async function cardRow(slide, { y, h, items, accent, badgeFill }) {
  const gap = 0.32;
  const w = (W - 2 * M - gap * (items.length - 1)) / items.length;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = M + i * (w + gap);
    card(slide, { x, y, w, h });
    await iconBadge(slide, {
      x: x + 0.34, y: y + 0.34, name: it.icon,
      fill: it.fill || badgeFill || accent,
      glyph: it.glyph || C.bg,
    });
    slide.addText(it.title, {
      x: x + 0.34, y: y + 1.14, w: w - 0.68, h: 0.38, fontFace: F.head,
      fontSize: 18, bold: true, color: C.title, margin: 0, valign: "top",
    });
    slide.addText(it.body, {
      x: x + 0.34, y: y + 1.56, w: w - 0.68, h: h - 1.9, fontFace: F.body,
      fontSize: 12.5, color: C.body, margin: 0, lineSpacingMultiple: 1.18,
      valign: "top",
    });
  }
}

// Numbered horizontal steps with chevrons between them.
function stepRow(slide, { y, h, steps, accent }) {
  const gap = 0.5;
  const w = (W - 2 * M - gap * (steps.length - 1)) / steps.length;
  for (let i = 0; i < steps.length; i++) {
    const x = M + i * (w + gap);
    card(slide, { x, y, w, h });
    slide.addText(String(i + 1), {
      x: x + 0.32, y: y + 0.26, w: 0.6, h: 0.5, fontFace: F.head, fontSize: 26,
      bold: true, color: accent, margin: 0,
    });
    // Titles are given a fixed two-line box and the body always starts below
    // it, so a one-line title and a two-line title still leave every card's
    // body text on the same baseline across the row.
    slide.addText(steps[i].title, {
      x: x + 0.32, y: y + 0.8, w: w - 0.64, h: 0.6, fontFace: F.head,
      fontSize: 15, bold: true, color: C.title, margin: 0, valign: "top",
    });
    slide.addText(steps[i].body, {
      x: x + 0.32, y: y + 1.42, w: w - 0.64, h: h - 1.72, fontFace: F.body,
      fontSize: 12, color: C.body, margin: 0, lineSpacingMultiple: 1.15,
      valign: "top",
    });
    if (i < steps.length - 1) {
      slide.addText("→", {
        x: x + w, y: y + h / 2 - 0.22, w: gap, h: 0.44, fontFace: F.body,
        fontSize: 18, color: C.muted, align: "center", margin: 0,
      });
    }
  }
}

// Full-width banded rows — the kickoff's hint-tier layout.
function bandRow(slide, { y, h, label, labelColor, title, body, alt }) {
  card(slide, { x: M, y, w: W - 2 * M, h, alt });
  slide.addText(label, {
    x: M + 0.5, y: y + h / 2 - 0.24, w: 2.0, h: 0.48, fontFace: F.head,
    fontSize: 22, bold: true, color: labelColor, margin: 0, valign: "middle",
  });
  slide.addShape("rect", {
    x: M + 2.65, y: y + 0.28, w: 0.014, h: h - 0.56, fill: { color: C.muted },
  });
  slide.addText(title, {
    x: M + 3.0, y: y + h / 2 - 0.24, w: 3.3, h: 0.48, fontFace: F.body,
    fontSize: 14, bold: true, color: C.title, margin: 0, valign: "middle",
  });
  slide.addText(body, {
    x: M + 6.5, y: y + 0.24, w: W - 2 * M - 6.9, h: h - 0.48, fontFace: F.body,
    fontSize: 12.5, color: C.body, margin: 0, valign: "middle",
    lineSpacingMultiple: 1.15,
  });
}

// A closing italic accent line, as used on kickoff slides 2/5/7.
function kicker(slide, text, accent, y = 6.55) {
  slide.addText(text, {
    x: M, y, w: W - 2 * M, h: 0.3, fontFace: F.body, fontSize: 12.5,
    italic: true, color: accent, margin: 0,
  });
}

// Route every slide's text through tx() once, at the single point it enters the
// deck, so no call site has to remember to do it.
function normalizingSlide(slide) {
  const addText = slide.addText.bind(slide);
  slide.addText = (t, o) => addText(tx(t), o);
  const addNotes = slide.addNotes.bind(slide);
  slide.addNotes = (t) => addNotes(tx(t));
  return slide;
}

module.exports = { C, F, W, H, M, ACCENTS, tx, icon, bg, coverCircles, footer,
  header, card, iconBadge, cardRow, stepRow, bandRow, kicker, normalizingSlide };
