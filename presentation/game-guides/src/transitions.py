"""Add slide transitions to a built deck.

pptxgenjs has no API for transitions, so they are injected into the packed
OOXML afterwards. `<p:transition>` is a child of `<p:sld>` that must sit
between `<p:clrMapOvr>` and `<p:timing>`, so it is inserted immediately after
the `</p:clrMapOvr>` pptxgenjs already writes. Both `p:fade` and `p:push` live
in the main `p` namespace, which is already declared -- so nothing else in the
package needs touching, and the XML is edited as text rather than reparsed
(round-tripping OOXML through ElementTree rewrites namespace prefixes and
corrupts the deck).

The scheme is deliberately restrained: Fade on every content slide, and a
single Push where the deck changes section. Anything busier reads as amateur
on a projector.
"""
import re
import shutil
import sys
import zipfile
from pathlib import Path

FADE = '<p:transition spd="med" advClick="1"><p:fade/></p:transition>'
PUSH = '<p:transition spd="med" advClick="1"><p:push dir="u"/></p:transition>'
ANCHOR = "</p:clrMapOvr>"


def apply(pptx_path, push_slides=()):
    """Rewrite pptx_path in place, giving every slide a transition.

    push_slides is a set of 1-based slide numbers that get the Push instead of
    the Fade.
    """
    src = Path(pptx_path)
    tmp = src.with_suffix(".tmp.pptx")
    n_done = 0

    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(
        tmp, "w", zipfile.ZIP_DEFLATED
    ) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            m = re.fullmatch(r"ppt/slides/slide(\d+)\.xml", item.filename)
            if m:
                xml = data.decode("utf-8")
                if ANCHOR not in xml:
                    raise ValueError(
                        "%s: no %s to anchor the transition to" % (item.filename, ANCHOR)
                    )
                if "<p:transition" in xml:
                    raise ValueError("%s already has a transition" % item.filename)
                idx = int(m.group(1))
                tag = PUSH if idx in push_slides else FADE
                xml = xml.replace(ANCHOR, ANCHOR + tag, 1)
                data = xml.encode("utf-8")
                n_done += 1
            zout.writestr(item, data)

    shutil.move(str(tmp), str(src))
    return n_done


if __name__ == "__main__":
    path = sys.argv[1]
    push = {int(x) for x in sys.argv[2].split(",")} if len(sys.argv) > 2 and sys.argv[2] else set()
    print("%s: %d slides, push on %s" % (Path(path).name, apply(path, push), sorted(push) or "none"))
