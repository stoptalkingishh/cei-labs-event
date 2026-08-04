"""Flag deck copy that will wrap past the room its box actually has.

The two-column "Getting in" slide gives each step one title line and one body
line at a fixed row pitch; a body that wraps to two lines runs into the row
below it. Rather than eyeballing that in a render, measure it here.
"""
import io
import re

LIMIT = 70  # chars that fit on one 11pt Calibri line in the step body box

src = io.open("build.js", encoding="utf-8").read()
bad = 0
# Only connect.steps land in the cramped two-column layout. first.steps are
# rendered as a horizontal card row with plenty of vertical room, so they are
# deliberately not checked here -- stop the match at connect's own closing.
for blk in re.findall(r"connect: \{.*?steps: \[(.*?)\n    \]", src, re.S):
    for b in re.findall(r'body: "((?:[^"\\]|\\.)*)"', blk):
        if len(b) > LIMIT:
            bad += 1
            print(len(b), "|", b)
print("OK - every step body fits on one line" if not bad else "%d over %d chars" % (bad, LIMIT))
