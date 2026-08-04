// Original artwork for the illustrated variant of the CEI Labs game decks.
//
// Everything here is drawn as flat vector SVG and rasterised at build time.
// That is a deliberate choice rather than a limitation:
//
//   * one house style, enforced by construction -- every piece uses the same
//     palette, the same stroke weights, and the same horizon-and-silhouette
//     composition language, so the whole set reads as one family;
//   * it is genuinely ours -- geometric, sparse, and reproducible from source,
//     rather than the soft-focus generated look that dates a deck instantly;
//   * it is reviewable and editable -- an illustration is a few lines of
//     shapes, not an opaque binary someone has to redraw from scratch.
//
// Subjects come from the themes already established in
// CEI-Labs-Wargames/docs/wargame-themes.md and wargame-story.md: the walled
// compound at Dryrock, the deep-space listening post, the mirrored underworld
// (which reuses the waterline-reflection idea from Natas's real attacker
// wallpaper), and -- for the AI track, which has no narrative by design -- the
// player's own machine.
//
// THREE ROLES, THREE DISTINCT IMAGES PER TRACK. An earlier revision reused the
// cover scene on the closing slide and made the corner motif a miniature of
// that same scene, so each deck showed one picture four times over. Now the
// cover is the arrival, the closing slide is the departure -- a different
// composition and a later moment in the same story -- and the corner motif is
// abstract (sky, arcs, ripples, rings) so it never competes with either.
//
// No illustration ever contains text or depicts a solution.

const sharp = require("sharp");

// Silhouettes sit on the card fill (#141F30) or the page (#0B1220), so they
// need to read lighter than both; the accent carries exactly one focal element
// per piece so the eye knows where to land.
function palette(accent, accent2) {
  // Deck colours are stored bare ("4CC9F0") because that is what pptxgenjs
  // wants; SVG needs the hash or the value is invalid and the element renders
  // black -- or not at all. Normalise once, here, rather than at every call.
  const hx = (c) => (c.startsWith("#") ? c : "#" + c);
  return {
    panel: "#0E1826",   // the letterbox behind tile art
    void: "#05090F",    // an opening with nothing behind it
    far: "#1C2942",     // distant silhouette
    near: "#2A3A52",    // foreground silhouette
    line: "#41547A",    // structural line work
    dim: "#5B6B8C",     // faint detail
    accent: hx(accent),
    accent2: hx(accent2),
  };
}

// Deterministic scatter, so a rebuild never reshuffles the stars.
function rng(seed) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
}

function stars(P, count, seed, w, h, maxR = 1.8) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < count; i++) {
    const x = (r() * w).toFixed(1);
    const y = (r() * h).toFixed(1);
    const rad = (0.7 + r() * maxR).toFixed(2);
    const op = (0.25 + r() * 0.5).toFixed(2);
    const col = r() > 0.85 ? P.accent : P.dim;
    out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${col}" opacity="${op}"/>`;
  }
  return out;
}

// A crenellated wall run -- Bandit's recurring structure.
function battlement(P, x, y, w, h, step, fill) {
  let d = `M${x} ${y + h} L${x} ${y}`;
  let cx = x;
  let up = true;
  while (cx < x + w) {
    const nx = Math.min(cx + step, x + w);
    d += ` L${nx} ${up ? y : y + h * 0.22}`;
    d += ` L${nx} ${up ? y + h * 0.22 : y}`;
    cx = nx;
    up = !up;
  }
  d += ` L${x + w} ${y + h} Z`;
  return `<path d="${d}" fill="${fill}"/>`;
}

// The outlaw. Origin is at the feet, so it drops onto any ground line.
// Recurring across Bandit's cover, two of its tiles and its closing slide --
// the one figure that gives that track a through-line the others don't need.
function figure(P, x, y, s, fill) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="0" cy="-46" r="8" fill="${fill}"/>
      <path d="M0 -37 q-11 2 -12 15 L-11 -12 L11 -12 L12 -22 q-1 -13 -12 -15 Z"
            fill="${fill}"/>
      <path d="M-9 -12 L-2 -12 L-2 0 L-8 0 Z" fill="${fill}"/>
      <path d="M2 -12 L9 -12 L8 0 L2 0 Z" fill="${fill}"/>
    </g>`;
}

// ============================================================ COVER ART ====
// The arrival. viewBox 660 x 540, sitting on the page background.

const COVERS = {
  // Approaching the walled desert compound at Dryrock, after dark.
  bandit: (P) => `
    ${stars(P, 46, 7, 660, 300)}
    <path d="M556 74 a44 44 0 1 0 30 78 a36 36 0 1 1 -30 -78 Z"
          fill="${P.accent}" opacity="0.5"/>
    <path d="M0 292 L104 246 L188 274 L278 238 L368 270 L466 244 L556 268
             L660 246 L660 292 Z" fill="${P.far}" opacity="0.8"/>
    ${battlement(P, 40, 292, 300, 130, 34, P.near)}
    ${battlement(P, 452, 292, 208, 130, 34, P.near)}
    <rect x="340" y="268" width="112" height="154" fill="${P.near}"/>
    ${battlement(P, 340, 252, 112, 30, 28, P.near)}
    <rect x="376" y="300" width="40" height="24" fill="${P.accent}" opacity="0.85"/>
    <path d="M156 422 L156 350 a34 34 0 0 1 68 0 L224 422 Z" fill="${P.void}"/>
    <path d="M156 422 L156 350 a34 34 0 0 1 68 0 L224 422"
          fill="none" stroke="${P.line}" stroke-width="3"/>
    <line x1="0" y1="422" x2="660" y2="422" stroke="${P.line}" stroke-width="3"/>
    ${figure(P, 268, 422, 1.15, P.accent)}
    <ellipse cx="268" cy="426" rx="30" ry="5" fill="${P.accent}" opacity="0.18"/>`,

  // The listening post, catching something faint out of the dark.
  krypton: (P) => `
    ${stars(P, 60, 21, 660, 420)}
    <circle cx="566" cy="96" r="52" fill="${P.far}"/>
    <circle cx="566" cy="96" r="52" fill="none" stroke="${P.line}" stroke-width="2"/>
    <ellipse cx="566" cy="96" rx="52" ry="15" fill="none" stroke="${P.line}"
             stroke-width="2" opacity="0.7"/>
    <g fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round">
      <path d="M470 20 a150 150 0 0 1 0 150" opacity="0.85"/>
      <path d="M432 34 a118 118 0 0 1 0 122" opacity="0.6"/>
      <path d="M396 48 a86 86 0 0 1 0 94" opacity="0.38"/>
      <path d="M362 62 a54 54 0 0 1 0 66" opacity="0.2"/>
    </g>
    <line x1="0" y1="430" x2="660" y2="430" stroke="${P.line}" stroke-width="3"/>
    <g transform="translate(214 300) rotate(-32)">
      <path d="M-96 0 a96 60 0 0 1 192 0 Z" fill="${P.near}"/>
      <path d="M-96 0 a96 60 0 0 1 192 0 Z" fill="none" stroke="${P.line}" stroke-width="3"/>
      <path d="M-58 -12 a58 34 0 0 1 116 0" fill="none" stroke="${P.line}"
            stroke-width="2" opacity="0.7"/>
      <circle cx="0" cy="-46" r="8" fill="${P.accent}"/>
      <line x1="0" y1="-38" x2="0" y2="-2" stroke="${P.line}" stroke-width="3"/>
    </g>
    <path d="M198 316 L206 430 L246 430 L238 316 Z" fill="${P.near}"/>
    <rect x="176" y="424" width="96" height="8" rx="3" fill="${P.near}"/>
    <rect x="392" y="386" width="128" height="44" fill="${P.far}"/>
    <rect x="392" y="386" width="128" height="44" fill="none" stroke="${P.line}" stroke-width="2"/>
    <rect x="410" y="400" width="16" height="16" fill="${P.accent}" opacity="0.8"/>`,

  // The inverted underworld: a clean structure above the waterline, and its
  // reflection below refusing to match it.
  natas: (P) => `
    ${stars(P, 34, 13, 660, 200)}
    <g fill="${P.near}">
      <rect x="132" y="120" width="104" height="150"/>
      <rect x="252" y="66" width="86" height="204"/>
      <rect x="354" y="150" width="126" height="120"/>
    </g>
    <g fill="none" stroke="${P.line}" stroke-width="2.5">
      <rect x="132" y="120" width="104" height="150"/>
      <rect x="252" y="66" width="86" height="204"/>
      <rect x="354" y="150" width="126" height="120"/>
    </g>
    <g fill="${P.dim}" opacity="0.55">
      <rect x="152" y="142" width="20" height="20"/><rect x="196" y="142" width="20" height="20"/>
      <rect x="152" y="186" width="20" height="20"/><rect x="196" y="186" width="20" height="20"/>
      <rect x="272" y="92" width="20" height="20"/><rect x="300" y="92" width="20" height="20"/>
      <rect x="272" y="140" width="20" height="20"/><rect x="300" y="140" width="20" height="20"/>
      <rect x="376" y="176" width="20" height="20"/><rect x="420" y="176" width="20" height="20"/>
    </g>
    <line x1="0" y1="284" x2="660" y2="284" stroke="${P.accent2}" stroke-width="4" opacity="1"/>
    <g stroke="${P.accent2}" stroke-width="2" opacity="0.35" fill="none">
      <path d="M60 296 q22 -8 44 0 t44 0"/>
      <path d="M420 300 q22 -8 44 0 t44 0"/>
      <path d="M180 312 q22 -8 44 0 t44 0"/>
    </g>
    <g transform="translate(0 568) scale(1 -1)" opacity="0.85">
      <g fill="${P.far}">
        <rect x="132" y="120" width="104" height="150"/>
        <rect x="252" y="66" width="86" height="204"/>
        <rect x="354" y="150" width="126" height="120"/>
      </g>
      <g fill="none" stroke="${P.accent}" stroke-width="3" opacity="0.95">
        <rect x="132" y="120" width="104" height="150"/>
        <rect x="252" y="66" width="86" height="204"/>
        <rect x="354" y="150" width="126" height="120"/>
      </g>
      <g fill="${P.accent}" opacity="0.55">
        <rect x="166" y="150" width="20" height="20"/><rect x="210" y="196" width="20" height="20"/>
        <rect x="286" y="104" width="20" height="20"/><rect x="262" y="152" width="20" height="20"/>
        <rect x="392" y="188" width="20" height="20"/>
      </g>
    </g>`,

  // No story on this track by design -- so the subject is the player's own
  // machine, thinking on its own.
  agent: (P) => `
    <g fill="none" stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round">
      <circle cx="330" cy="222" r="66" opacity="0.5"/>
      <circle cx="330" cy="222" r="106" opacity="0.3"/>
      <circle cx="330" cy="222" r="150" opacity="0.16"/>
      <circle cx="330" cy="222" r="196" opacity="0.08"/>
    </g>
    <g stroke="${P.line}" stroke-width="2" fill="none" opacity="0.75">
      <path d="M330 222 L172 128 M330 222 L494 132 M330 222 L156 300 M330 222 L508 296"/>
    </g>
    <g fill="${P.dim}">
      <circle cx="172" cy="128" r="7"/><circle cx="494" cy="132" r="7"/>
      <circle cx="156" cy="300" r="7"/><circle cx="508" cy="296" r="7"/>
    </g>
    <path d="M228 300 L432 300 L432 414 L228 414 Z" fill="${P.near}"/>
    <path d="M244 314 L416 314 L416 400 L244 400 Z" fill="${P.void}"/>
    <g stroke="${P.accent}" stroke-width="3" stroke-linecap="round" opacity="0.9">
      <path d="M266 340 L286 356 L266 372"/>
      <line x1="300" y1="372" x2="344" y2="372"/>
    </g>
    <path d="M196 414 L464 414 L482 446 L178 446 Z" fill="${P.near}"/>
    <path d="M196 414 L464 414 L482 446 L178 446 Z" fill="none"
          stroke="${P.line}" stroke-width="2.5"/>
    <rect x="292" y="424" width="76" height="7" rx="3" fill="${P.line}"/>
    <ellipse cx="330" cy="466" rx="176" ry="12" fill="${P.accent}" opacity="0.1"/>
    <circle cx="330" cy="222" r="15" fill="${P.accent}"/>`,
};

// ========================================================== CLOSING ART ====
// The departure: same viewBox, deliberately a different composition and a
// later moment than the cover, so the two bookend rather than repeat.

const CLOSERS = {
  // Out through the far wall with the ledger. The compound is behind you now.
  bandit: (P) => `
    ${stars(P, 52, 17, 660, 330)}
    <path d="M498 66 a52 52 0 1 0 36 92 a43 43 0 1 1 -36 -92 Z"
          fill="${P.accent}" opacity="0.45"/>
    <path d="M0 356 L120 292 L206 340 L300 276 L392 356 Z" fill="${P.far}" opacity="0.75"/>
    <g opacity="0.55">
      ${battlement(P, 410, 324, 190, 36, 26, P.far)}
      <rect x="470" y="312" width="44" height="48" fill="${P.far}"/>
    </g>
    <line x1="0" y1="392" x2="660" y2="392" stroke="${P.line}" stroke-width="3"/>
    <g stroke="${P.dim}" stroke-width="2" opacity="0.35" fill="none">
      <path d="M420 424 q-90 26 -190 42"/>
      <path d="M436 456 q-96 28 -204 46"/>
    </g>
    ${figure(P, 214, 456, 1.5, P.accent)}
    <rect x="238" y="428" width="32" height="23" rx="3" fill="${P.accent}"/>
    <line x1="238" y1="440" x2="270" y2="440" stroke="${P.void}" stroke-width="2.5"/>
    <ellipse cx="214" cy="462" rx="46" ry="7" fill="${P.accent}" opacity="0.16"/>`,

  // The signal resolved: one clean carrier instead of a scattered wavefront.
  krypton: (P) => `
    ${stars(P, 54, 29, 660, 400)}
    <circle cx="112" cy="102" r="44" fill="${P.far}"/>
    <circle cx="112" cy="102" r="44" fill="none" stroke="${P.line}" stroke-width="2"/>
    <path d="M156 102 L470 102" stroke="${P.accent}" stroke-width="3"
          stroke-linecap="round" opacity="0.9"/>
    <path d="M158 152 q28 -36 56 0 t56 0 t56 0 t56 0 t56 0 t28 0"
          fill="none" stroke="${P.accent}" stroke-width="3" opacity="0.85"/>
    <path d="M158 208 q14 -20 28 0 t28 4 t28 -12 t28 10 t28 -6 t28 6 t28 -10 t28 8 t28 -4"
          fill="none" stroke="${P.dim}" stroke-width="2" opacity="0.3"/>
    <line x1="0" y1="424" x2="660" y2="424" stroke="${P.line}" stroke-width="3"/>
    <g transform="translate(468 296) rotate(-14)">
      <path d="M-90 0 a90 56 0 0 1 180 0 Z" fill="${P.near}"/>
      <path d="M-90 0 a90 56 0 0 1 180 0 Z" fill="none" stroke="${P.line}" stroke-width="3"/>
      <circle cx="0" cy="-44" r="9" fill="${P.accent}"/>
      <line x1="0" y1="-36" x2="0" y2="-2" stroke="${P.line}" stroke-width="3"/>
    </g>
    <path d="M454 310 L460 424 L498 424 L492 310 Z" fill="${P.near}"/>
    <rect x="432" y="418" width="92" height="8" rx="3" fill="${P.near}"/>`,

  // The bottom floor reached: the records, finally open.
  natas: (P) => `
    ${stars(P, 24, 37, 660, 130)}
    <g fill="${P.far}" stroke="${P.line}" stroke-width="2.5">
      <rect x="176" y="86" width="308" height="42" rx="4"/>
      <rect x="196" y="150" width="268" height="42" rx="4"/>
      <rect x="216" y="214" width="228" height="42" rx="4"/>
      <rect x="236" y="278" width="188" height="42" rx="4"/>
    </g>
    <g stroke="${P.accent2}" stroke-width="2.5" opacity="0.5">
      <path d="M330 128 L330 150 M330 192 L330 214 M330 256 L330 278"/>
    </g>
    <path d="M330 320 L330 352 M317 341 L330 356 L343 341" fill="none"
          stroke="${P.accent}" stroke-width="3.5" stroke-linecap="round"
          stroke-linejoin="round"/>
    <rect x="196" y="368" width="268" height="118" rx="6" fill="${P.void}"
          stroke="${P.accent}" stroke-width="3"/>
    <g fill="${P.accent}" opacity="0.75">
      <rect x="222" y="394" width="60" height="12" rx="3"/>
      <rect x="298" y="394" width="42" height="12" rx="3"/>
      <rect x="356" y="394" width="76" height="12" rx="3"/>
      <rect x="222" y="422" width="42" height="12" rx="3"/>
      <rect x="280" y="422" width="78" height="12" rx="3"/>
      <rect x="374" y="422" width="58" height="12" rx="3"/>
      <rect x="222" y="450" width="70" height="12" rx="3"/>
      <rect x="308" y="450" width="50" height="12" rx="3"/>
    </g>`,

  // Five milestones, each actually checked rather than claimed.
  agent: (P) => `
    <g fill="none" stroke="${P.accent}" stroke-width="2.5" opacity="0.18">
      <circle cx="330" cy="248" r="150"/><circle cx="330" cy="248" r="212"/>
    </g>
    <line x1="118" y1="248" x2="542" y2="248" stroke="${P.line}" stroke-width="3"/>
    ${[0, 1, 2, 3, 4]
      .map((i) => {
        const x = 118 + i * 106;
        return `<circle cx="${x}" cy="248" r="30" fill="${P.void}"
                        stroke="${P.accent}" stroke-width="3"/>
                <path d="M${x - 12} 248 L${x - 3} 258 L${x + 13} 237" fill="none"
                      stroke="${P.accent}" stroke-width="3.5"
                      stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="${x}" y1="278" x2="${x}" y2="312" stroke="${P.line}"
                      stroke-width="2" opacity="0.45"/>`;
      })
      .join("")}
    <rect x="238" y="340" width="184" height="98" rx="6" fill="${P.near}"
          stroke="${P.line}" stroke-width="2.5"/>
    <rect x="256" y="358" width="148" height="62" fill="${P.void}"/>
    <g stroke="${P.accent}" stroke-width="3" stroke-linecap="round" opacity="0.9">
      <path d="M274 378 L290 390 L274 402"/>
      <line x1="302" y1="402" x2="338" y2="402"/>
    </g>
    <g fill="${P.dim}" opacity="0.6">
      <circle cx="140" cy="128" r="5"/><circle cx="520" cy="118" r="5"/>
      <circle cx="330" cy="96" r="5"/>
    </g>`,
};

// ============================================================= TILE ART ====
// viewBox 400 x 110, letterbox. One small scene per chapter or beat.

const T_ = {
  frame: (P) => `<rect x="0" y="0" width="400" height="110" rx="7" fill="${P.panel}"/>`,
  floor: (P, y = 92) =>
    `<line x1="18" y1="${y}" x2="382" y2="${y}" stroke="${P.line}" stroke-width="2.5"/>`,
};

const TILES = {
  // --- Bandit: eight chapters of the compound ----------------------------
  bandit: [
    // Over the Wall -- the figure crests it
    (P) => `${T_.frame(P)}${stars(P, 14, 3, 400, 60)}
      ${battlement(P, 40, 44, 190, 48, 26, P.near)}
      ${T_.floor(P)}
      ${figure(P, 278, 92, 0.78, P.accent)}`,
    // The Storeyard -- stacked crates
    (P) => `${T_.frame(P)}${T_.floor(P)}
      <g fill="${P.near}" stroke="${P.line}" stroke-width="2">
        <rect x="70" y="52" width="48" height="40"/>
        <rect x="118" y="52" width="48" height="40"/>
        <rect x="97" y="14" width="46" height="38"/>
        <rect x="230" y="44" width="58" height="48"/>
      </g>
      <g stroke="${P.dim}" stroke-width="2" opacity="0.8">
        <path d="M70 72 L118 72 M118 72 L166 72 M97 33 L143 33"/>
      </g>
      <rect x="248" y="60" width="22" height="16" fill="${P.accent}" opacity="0.85"/>`,
    // The Inner Halls -- a corridor of doors
    (P) => `${T_.frame(P)}
      <g fill="${P.near}">
        <path d="M18 8 L120 26 L120 96 L18 104 Z"/>
        <path d="M382 8 L280 26 L280 96 L382 104 Z"/>
      </g>
      <rect x="190" y="26" width="20" height="66" fill="${P.accent}" opacity="0.8"/>
      <rect x="184" y="26" width="32" height="66" fill="${P.accent}" opacity="0.14"/>
      <g fill="${P.far}" stroke="${P.line}" stroke-width="2.5">
        <rect x="140" y="26" width="42" height="66" rx="3"/>
        <rect x="218" y="26" width="42" height="66" rx="3"/>
      </g>
      ${T_.floor(P, 96)}`,
    // The Guardroom -- where the keys are kept, and one is borrowed
    (P) => `${T_.frame(P)}
      <line x1="112" y1="24" x2="288" y2="24" stroke="${P.line}" stroke-width="3"/>
      ${[140, 200, 260]
        .map((x, i) => {
          const c = i === 1 ? P.accent : P.dim;
          const drop = i === 1 ? 10 : 0;
          return `<line x1="${x}" y1="24" x2="${x}" y2="${44 + drop}"
                        stroke="${c}" stroke-width="2.5"/>
                  <circle cx="${x}" cy="${57 + drop}" r="13" fill="none"
                          stroke="${c}" stroke-width="3"/>
                  <path d="M${x} ${70 + drop} L${x} ${92 + drop}
                           M${x} ${82 + drop} L${x + 9} ${82 + drop}
                           M${x} ${90 + drop} L${x + 9} ${90 + drop}"
                        stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        })
        .join("")}`,
    // The Bell Tower -- everything runs on the schedule it keeps
    (P) => `${T_.frame(P)}${stars(P, 10, 5, 400, 40)}
      <path d="M200 22 q-42 8 -42 52 L158 82 L242 82 L242 74 q0 -44 -42 -52 Z"
            fill="${P.near}" stroke="${P.line}" stroke-width="2.5"/>
      <line x1="200" y1="10" x2="200" y2="24" stroke="${P.line}" stroke-width="3"/>
      <circle cx="200" cy="88" r="8" fill="${P.accent}"/>
      <g stroke="${P.accent}" stroke-width="2.5" fill="none" opacity="0.5">
        <path d="M126 40 a46 46 0 0 0 0 46"/><path d="M274 40 a46 46 0 0 1 0 46"/>
      </g>
      ${T_.floor(P, 96)}`,
    // The Locked Wing -- worked open from the inside
    (P) => `${T_.frame(P)}
      <rect x="132" y="16" width="136" height="80" rx="4" fill="${P.void}"
            stroke="${P.line}" stroke-width="2.5"/>
      <g stroke="${P.line}" stroke-width="7">
        <line x1="160" y1="16" x2="160" y2="96"/><line x1="188" y1="16" x2="188" y2="96"/>
        <line x1="216" y1="16" x2="216" y2="96"/><line x1="244" y1="16" x2="244" y2="96"/>
      </g>
      <rect x="132" y="16" width="136" height="80" rx="4" fill="none"
            stroke="${P.line}" stroke-width="2.5"/>
      ${stars(P, 8, 9, 130, 90)}
      <circle cx="300" cy="56" r="9" fill="${P.accent}" opacity="0.9"/>`,
    // The Archive -- the ledger, and its whole history
    (P) => `${T_.frame(P)}
      <g fill="${P.near}" stroke="${P.line}" stroke-width="2">
        <rect x="90" y="20" width="14" height="46"/><rect x="108" y="26" width="14" height="40"/>
        <rect x="126" y="18" width="14" height="48"/><rect x="144" y="28" width="14" height="38"/>
        <rect x="240" y="24" width="14" height="42"/><rect x="258" y="18" width="14" height="48"/>
        <rect x="276" y="30" width="14" height="36"/>
      </g>
      <rect x="180" y="16" width="16" height="50" fill="${P.accent}" opacity="0.9"/>
      <line x1="70" y1="70" x2="330" y2="70" stroke="${P.line}" stroke-width="3"/>`,
    // The Escape -- past the last of the wall, into open dark
    (P) => `${T_.frame(P)}${stars(P, 22, 11, 400, 78)}
      ${battlement(P, -10, 40, 92, 52, 26, P.far)}
      <path d="M286 92 L316 68 L340 80 L366 62 L400 92 Z" fill="${P.far}" opacity="0.7"/>
      ${T_.floor(P)}
      ${figure(P, 196, 92, 0.78, P.accent)}
      <rect x="212" y="70" width="20" height="14" rx="2" fill="${P.accent}"/>`,
    
  ],

  // --- Krypton: seven levels of one night shift --------------------------
  krypton: [
    // Base64 -- an unwrapping, no lock involved
    (P) => `${T_.frame(P)}
      <g fill="none" stroke="${P.line}" stroke-width="3.5" stroke-linecap="round">
        <path d="M150 26 L128 26 L128 84 L150 84"/><path d="M250 26 L272 26 L272 84 L250 84"/>
      </g>
      <rect x="164" y="40" width="72" height="30" rx="4" fill="${P.accent}" opacity="0.85"/>
      <g stroke="${P.dim}" stroke-width="2.5" stroke-linecap="round">
        <path d="M300 40 L326 40 M300 55 L340 55 M300 70 L318 70"/>
      </g>`,
    // ROT13 -- half a turn, and half a turn back. Deliberately NOT a pointer
    // dial: level 02 is the dial, and two dials in a row read as one idea.
    (P) => `${T_.frame(P)}
      <path d="M200 17 a38 38 0 0 1 0 76 Z" fill="${P.near}"/>
      <path d="M200 17 a38 38 0 0 0 0 76 Z" fill="${P.far}"/>
      <circle cx="200" cy="55" r="38" fill="none" stroke="${P.line}" stroke-width="3"/>
      <g stroke="${P.accent}" stroke-width="3.5" fill="none" stroke-linecap="round">
        <path d="M152 55 L248 55"/>
        <path d="M161 46 L151 55 L161 64"/><path d="M239 46 L249 55 L239 64"/>
      </g>`,
    // Caesar, shift unknown -- the pointer is in shadow
    (P) => `${T_.frame(P)}
      <circle cx="200" cy="55" r="38" fill="none" stroke="${P.line}" stroke-width="3"/>
      ${Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        const sx = 200 + Math.sin(a) * 32, sy = 55 - Math.cos(a) * 32;
        const ex = 200 + Math.sin(a) * 38, ey = 55 - Math.cos(a) * 38;
        return `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}"
                      x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}"
                      stroke="${P.dim}" stroke-width="2" opacity="0.7"/>`;
      }).join("")}
      <path d="M200 8 L193 17 L207 17 Z" fill="${P.dim}"/>
      <path d="M200 17 a38 38 0 0 0 -33 57" fill="none" stroke="${P.accent}"
            stroke-width="3" opacity="0.6" stroke-dasharray="5 6"/>
      <path d="M200 55 L167 74" stroke="${P.accent}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="200" cy="55" r="5" fill="${P.accent}"/>`,
    // Frequency analysis -- the counts are the picture
    (P) => `${T_.frame(P)}
      <g fill="${P.near}">
        <rect x="118" y="30" width="17" height="56"/><rect x="143" y="44" width="17" height="42"/>
        <rect x="168" y="52" width="17" height="34"/><rect x="193" y="58" width="17" height="28"/>
        <rect x="218" y="64" width="17" height="22"/><rect x="243" y="70" width="17" height="16"/>
        <rect x="268" y="76" width="17" height="10"/>
      </g>
      <rect x="118" y="30" width="17" height="56" fill="${P.accent}"/>
      <line x1="104" y1="86" x2="298" y2="86" stroke="${P.line}" stroke-width="2.5"/>`,
    // Vigenere, period known -- a steady repeat
    (P) => `${T_.frame(P)}
      <path d="M60 62 q20 -32 40 0 t40 0 t40 0 t40 0 t40 0 t40 0"
            fill="none" stroke="${P.dim}" stroke-width="3"/>
      <g stroke="${P.accent}" stroke-width="2.5" opacity="0.85">
        <line x1="100" y1="30" x2="100" y2="86"/><line x1="180" y1="30" x2="180" y2="86"/>
        <line x1="260" y1="30" x2="260" y2="86"/>
      </g>
      <g stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round">
        <path d="M100 92 L180 92"/><path d="M104 88 L100 92 L104 96"/><path d="M176 88 L180 92 L176 96"/>
      </g>`,
    // Kasiski -- the same fragment twice, and the gap between
    (P) => `${T_.frame(P)}
      <g stroke="${P.dim}" stroke-width="3" stroke-linecap="round">
        <path d="M60 44 L104 44 M164 44 L228 44 M288 44 L340 44"/>
      </g>
      <g fill="${P.accent}">
        <rect x="112" y="36" width="44" height="16" rx="3"/>
        <rect x="236" y="36" width="44" height="16" rx="3"/>
      </g>
      <g stroke="${P.accent}" stroke-width="2.5" stroke-linecap="round" opacity="0.9">
        <path d="M134 62 L134 78 M258 62 L258 78 M134 78 L258 78"/>
        <path d="M142 74 L134 78 L142 82"/><path d="M250 74 L258 78 L250 82"/>
      </g>`,
    // Stream cipher -- a generated keystream, combined bit by bit. The wave
    // that used to sit here echoed level 04; the XOR crossing is the real idea.
    (P) => `${T_.frame(P)}
      <g fill="none" stroke="${P.line}" stroke-width="2.5">
        <rect x="72" y="40" width="28" height="30"/><rect x="100" y="40" width="28" height="30"/>
        <rect x="128" y="40" width="28" height="30"/><rect x="156" y="40" width="28" height="30"/>
      </g>
      <rect x="72" y="40" width="28" height="30" fill="${P.accent}" opacity="0.85"/>
      <path d="M184 55 L226 55" stroke="${P.dim}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="250" cy="55" r="20" fill="none" stroke="${P.accent}" stroke-width="3"/>
      <path d="M236 41 L264 69 M264 41 L236 69" stroke="${P.accent}"
            stroke-width="3" stroke-linecap="round"/>
      <path d="M270 55 L322 55" stroke="${P.accent}" stroke-width="3" stroke-linecap="round"/>
      <path d="M314 48 L322 55 L314 62" fill="none" stroke="${P.accent}"
            stroke-width="3" stroke-linecap="round"/>
      <path d="M250 16 L250 35" stroke="${P.dim}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="250" cy="14" r="4.5" fill="${P.dim}"/>`,
  ],

  // --- Natas: seven stages of the descent --------------------------------
  natas: [
    // View source / right-click: the page, and what it is made of
    (P) => `${T_.frame(P)}
      <rect x="130" y="20" width="140" height="72" rx="4" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <g stroke="${P.dim}" stroke-width="2.5" stroke-linecap="round">
        <path d="M146 40 L212 40 M146 54 L232 54 M146 68 L196 68"/>
      </g>
      <path d="M270 20 L270 62 L228 20 Z" fill="${P.void}"/>
      <path d="M270 20 L228 20 L270 62 Z" fill="none" stroke="${P.accent}" stroke-width="2.5"/>
      <g stroke="${P.accent}" stroke-width="2.5" fill="none" stroke-linecap="round">
        <path d="M300 42 L292 52 L300 62 M330 42 L338 52 L330 62"/>
      </g>`,
    // Traversal / robots: a path that leaves the folder it was given
    (P) => `${T_.frame(P)}
      <path d="M112 46 L112 88 L212 88 L212 46 Z" fill="${P.near}"/>
      <path d="M112 46 L112 36 L146 36 L156 46 Z" fill="${P.near}"/>
      <path d="M112 46 L112 88 L212 88 L212 46 M112 46 L112 36 L146 36 L156 46"
            fill="none" stroke="${P.line}" stroke-width="2.5"/>
      <path d="M232 88 L232 50 L292 50 L292 26" fill="none" stroke="${P.accent}"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M285 33 L292 24 L299 33" fill="none" stroke="${P.accent}"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="212" y1="88" x2="232" y2="88" stroke="${P.dim}" stroke-width="2.5"/>`,
    // Referer / cookies: claims that travel with you
    (P) => `${T_.frame(P)}
      <rect x="112" y="34" width="94" height="60" rx="4" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <path d="M112 38 L159 68 L206 38" fill="none" stroke="${P.line}" stroke-width="2.5"/>
      <circle cx="272" cy="58" r="30" fill="${P.near}" stroke="${P.accent}" stroke-width="2.5"/>
      <g fill="${P.accent}" opacity="0.85">
        <circle cx="262" cy="48" r="4"/><circle cx="282" cy="54" r="4"/><circle cx="268" cy="70" r="4"/>
      </g>`,
    // Includes / LFI: a trapdoor under something ordinary
    (P) => `${T_.frame(P)}${T_.floor(P, 88)}
      <path d="M96 88 q40 -16 80 0 Z" fill="${P.near}"/>
      <path d="M96 88 q40 -16 80 0" fill="none" stroke="${P.line}" stroke-width="2.5"/>
      <rect x="204" y="60" width="82" height="28" fill="${P.void}"
            stroke="${P.line}" stroke-width="2.5"/>
      <path d="M286 60 L318 34 L246 34 L204 60 Z" fill="${P.near}"
            stroke="${P.accent}" stroke-width="2.5" stroke-linejoin="round"/>
      <line x1="204" y1="60" x2="286" y2="60" stroke="${P.accent}"
            stroke-width="2.5" opacity="0.7"/>`,
    // Reversing crypto / injection: a lock that mirrors its own key
    (P) => `${T_.frame(P)}
      <rect x="130" y="48" width="52" height="40" rx="4" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <path d="M142 48 L142 36 a14 14 0 0 1 28 0 L170 48" fill="none"
            stroke="${P.line}" stroke-width="2.5"/>
      <line x1="200" y1="20" x2="200" y2="94" stroke="${P.accent2}"
            stroke-width="2.5" stroke-dasharray="5 6" opacity="0.8"/>
      <g transform="translate(400 0) scale(-1 1)">
        <rect x="130" y="48" width="52" height="40" rx="4" fill="${P.void}"
              stroke="${P.accent}" stroke-width="2.5"/>
        <path d="M142 48 L142 36 a14 14 0 0 1 28 0 L170 48" fill="none"
              stroke="${P.accent}" stroke-width="2.5"/>
      </g>
      <circle cx="156" cy="66" r="5" fill="${P.dim}"/>
      <circle cx="244" cy="66" r="5" fill="${P.accent}"/>`,
    // Sanitization / XOR: where two things overlap, a third appears
    (P) => `${T_.frame(P)}
      <circle cx="176" cy="55" r="36" fill="${P.near}" opacity="0.85"/>
      <circle cx="224" cy="55" r="36" fill="${P.line}" opacity="0.7"/>
      <path d="M200 25 a36 36 0 0 0 0 60 a36 36 0 0 0 0 -60 Z" fill="${P.accent}" opacity="0.95"/>
      <circle cx="176" cy="55" r="36" fill="none" stroke="${P.line}" stroke-width="2"/>
      <circle cx="224" cy="55" r="36" fill="none" stroke="${P.line}" stroke-width="2"/>`,
    // Uploads / SQLi: through the slot, into the records
    (P) => `${T_.frame(P)}
      <rect x="104" y="52" width="76" height="10" rx="4" fill="${P.near}"
            stroke="${P.line}" stroke-width="2"/>
      <path d="M142 46 L142 20 M134 28 L142 18 L150 28" fill="none" stroke="${P.accent}"
            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <g fill="${P.near}" stroke="${P.line}" stroke-width="2.5">
        <ellipse cx="272" cy="34" rx="44" ry="12"/>
        <path d="M228 34 L228 76 a44 12 0 0 0 88 0 L316 34"/>
      </g>
      <path d="M228 55 a44 12 0 0 0 88 0" fill="none" stroke="${P.line}" stroke-width="2"/>
      <ellipse cx="272" cy="34" rx="44" ry="12" fill="none" stroke="${P.accent}" stroke-width="2.5"/>`,
  ],

  // --- AI Copilot: six setup milestones ----------------------------------
  agent: [
    // Start Here: the rule, read and acknowledged
    (P) => `${T_.frame(P)}
      <rect x="140" y="18" width="86" height="74" rx="4" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <g stroke="${P.dim}" stroke-width="2.5" stroke-linecap="round">
        <path d="M156 38 L210 38 M156 52 L210 52 M156 66 L188 66"/>
      </g>
      <circle cx="248" cy="72" r="20" fill="${P.void}" stroke="${P.accent}" stroke-width="3"/>
      <path d="M239 72 L246 79 L258 65" fill="none" stroke="${P.accent}"
            stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    // Ollama: the local runtime comes alive
    (P) => `${T_.frame(P)}
      <rect x="158" y="30" width="60" height="50" rx="5" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <rect x="174" y="46" width="28" height="18" rx="2" fill="${P.accent}"/>
      <g stroke="${P.line}" stroke-width="2.5" stroke-linecap="round">
        <path d="M170 30 L170 18 M188 30 L188 18 M206 30 L206 18"/>
        <path d="M170 80 L170 92 M188 80 L188 92 M206 80 L206 92"/>
        <path d="M158 42 L146 42 M158 60 L146 60 M218 42 L230 42 M218 60 L230 60"/>
      </g>
      <g fill="none" stroke="${P.accent}" stroke-width="2.5" opacity="0.4">
        <circle cx="188" cy="55" r="52"/>
      </g>`,
    // Pull a model: something large arrives and stays
    (P) => `${T_.frame(P)}
      <path d="M200 16 L200 56 M186 44 L200 60 L214 44" fill="none" stroke="${P.accent}"
            stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M150 66 L150 92 L250 92 L250 66" fill="none" stroke="${P.line}"
            stroke-width="3" stroke-linecap="round"/>
      <rect x="162" y="72" width="76" height="14" rx="3" fill="${P.accent}" opacity="0.55"/>
`,
    // Install and launch: the tool is on your machine
    (P) => `${T_.frame(P)}
      <rect x="128" y="24" width="144" height="64" rx="5" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <line x1="128" y1="42" x2="272" y2="42" stroke="${P.line}" stroke-width="2"/>
      <g fill="${P.dim}"><circle cx="142" cy="33" r="3.5"/><circle cx="154" cy="33" r="3.5"/>
        <circle cx="166" cy="33" r="3.5"/></g>
      <g stroke="${P.accent}" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M146 56 L160 66 L146 76"/><line x1="170" y1="76" x2="206" y2="76"/>
      </g>`,
    // Point it at your box: a real connection, both ways
    (P) => `${T_.frame(P)}
      <path d="M96 46 L164 46 L172 68 L88 68 Z" fill="${P.near}"
            stroke="${P.line}" stroke-width="2.5"/>
      <rect x="106" y="26" width="48" height="20" rx="3" fill="${P.void}"
            stroke="${P.line}" stroke-width="2"/>
      <g fill="${P.near}" stroke="${P.line}" stroke-width="2.5">
        <rect x="246" y="24" width="62" height="22" rx="3"/>
        <rect x="246" y="52" width="62" height="22" rx="3"/>
      </g>
      <g fill="${P.accent}"><circle cx="258" cy="35" r="4"/><circle cx="258" cy="63" r="4"/></g>
      <g stroke="${P.accent}" stroke-width="3" fill="none" stroke-linecap="round">
        <path d="M182 50 L236 50"/><path d="M229 44 L236 50 L229 56"/>
        <path d="M236 64 L182 64"/><path d="M189 58 L182 64 L189 70"/>
      </g>`,
    // Know how to ask: a question with enough in it to answer
    (P) => `${T_.frame(P)}
      <path d="M112 24 L232 24 a6 6 0 0 1 6 6 L238 70 a6 6 0 0 1 -6 6 L146 76 L126 92 L126 76
               L112 76 a6 6 0 0 1 -6 -6 L106 30 a6 6 0 0 1 6 -6 Z"
            fill="${P.near}" stroke="${P.line}" stroke-width="2.5"/>
      <g stroke="${P.accent}" stroke-width="3" stroke-linecap="round">
        <path d="M124 40 L200 40 M124 54 L216 54 M124 66 L172 66"/>
      </g>
      <g stroke="${P.dim}" stroke-width="2.5" stroke-linecap="round" opacity="0.6">
        <path d="M266 40 L318 40 M266 54 L300 54"/>
      </g>`,
  ],
};

// ============================================================== VIGNETTE ===
// Abstract, never a miniature of the cover -- sky, arcs, ripples, rings. It is
// texture behind a header, so it must not look like a picture with a border.

const VIGNETTES = {
  bandit: (P) => `${stars(P, 44, 31, 520, 300)}
    <path d="M120 44 a34 34 0 1 0 24 60 a28 28 0 1 1 -24 -60 Z"
          fill="${P.accent}" opacity="0.75"/>
    <g stroke="${P.dim}" stroke-width="2" opacity="0.2" fill="none">
      <path d="M40 214 q120 -26 240 -6 t200 -14"/>
      <path d="M60 248 q130 -22 250 -2 t170 -12"/>
    </g>`,
  krypton: (P) => `${stars(P, 30, 41, 520, 240)}
    <g fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round">
      <path d="M400 40 a130 130 0 0 1 0 200" opacity="0.75"/>
      <path d="M348 62 a95 95 0 0 1 0 156" opacity="0.5"/>
      <path d="M300 84 a60 60 0 0 1 0 112" opacity="0.28"/>
    </g>
    <circle cx="452" cy="140" r="9" fill="${P.accent}" opacity="0.8"/>`,
  natas: (P) => `${stars(P, 18, 13, 520, 108)}
    <line x1="0" y1="150" x2="520" y2="150" stroke="${P.accent2}" stroke-width="3" opacity="0.85"/>
    <g stroke="${P.accent2}" stroke-width="2" opacity="0.3" fill="none">
      <path d="M60 128 q26 -9 52 0 t52 0"/>
      <path d="M300 122 q26 -9 52 0 t52 0"/>
    </g>
    <g stroke="${P.accent}" stroke-width="2" opacity="0.35" fill="none">
      <path d="M80 176 q26 9 52 0 t52 0"/>
      <path d="M280 186 q26 9 52 0 t52 0"/>
      <path d="M160 210 q26 9 52 0 t52 0"/>
    </g>`,
  agent: (P) => `
    <g fill="none" stroke="${P.accent}" stroke-width="3" stroke-linecap="round">
      <circle cx="300" cy="140" r="48" opacity="0.55"/><circle cx="300" cy="140" r="86" opacity="0.32"/>
      <circle cx="300" cy="140" r="128" opacity="0.16"/><circle cx="300" cy="140" r="172" opacity="0.07"/>
    </g>
    <circle cx="300" cy="140" r="12" fill="${P.accent}" opacity="0.85"/>
    <g fill="${P.dim}" opacity="0.7">
      <circle cx="180" cy="66" r="5"/><circle cx="424" cy="80" r="5"/><circle cx="436" cy="212" r="5"/>
    </g>`,
};

// ------------------------------------------------------------- rendering --

const cache = new Map();

async function raster(svgInner, vw, vh, pxWidth, key) {
  if (cache.has(key)) return cache.get(key);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${vw}" height="${vh}" viewBox="0 0 ${vw} ${vh}">${svgInner}</svg>`;
  const buf = await sharp(Buffer.from(svg)).resize({ width: pxWidth }).png().toBuffer();
  const data = "image/png;base64," + buf.toString("base64");
  cache.set(key, data);
  return data;
}

// Corner motifs are cropped by the image box, and any shape whose edge meets
// that boundary reads as a hard-edged slab against the slide. Fading the art
// out towards the bottom and the left -- the two edges that face the content --
// makes it behave like texture instead of like a picture with a border.
function faded(inner, w, h) {
  return `<defs>
      <linearGradient id="fv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.45" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="fh" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="0.42" stop-color="#fff" stop-opacity="1"/>
      </linearGradient>
      <mask id="mv"><rect width="${w}" height="${h}" fill="url(#fv)"/></mask>
      <mask id="mh"><rect width="${w}" height="${h}" fill="url(#fh)"/></mask>
    </defs>
    <g mask="url(#mv)"><g mask="url(#mh)">${inner}</g></g>`;
}

const coverArt = (k, a, a2) =>
  raster(COVERS[k](palette(a, a2)), 660, 540, 1320, "cover:" + k);

const closingArt = (k, a, a2) =>
  raster(CLOSERS[k](palette(a, a2)), 660, 540, 1320, "close:" + k);

const tileArt = (k, i, a, a2) =>
  raster(TILES[k][i](palette(a, a2)), 400, 110, 800, `tile:${k}:${i}`);

const vignetteArt = (k, a, a2) =>
  raster(faded(VIGNETTES[k](palette(a, a2)), 520, 300), 520, 300, 1040, "vig:" + k);

// Guard: every track's tile set must cover every entry on its map slide.
const tileCount = (k) => TILES[k].length;

module.exports = { coverArt, closingArt, tileArt, vignetteArt, tileCount };
