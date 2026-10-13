"""
Rebuilds app/fonts/NotoSansDevanagari-devanagari.woff2 from the full Google Fonts file (variable, wght 100-900):
keeps wght 400-800 (the weights the site uses) and only the Devanagari characters that appear in the site's source
(app, components, lib, content), plus joiners and the space. Writes app/fonts/devanagari-codepoints.json, which
tests/fontSubset.test.mjs checks, so a new Hindi letter in the copy fails the test until this is re-run.

Usage:  python3 scripts/fonts/subset-devanagari.py /path/to/full/NotoSansDevanagari.woff2
Needs:  pip install fonttools brotli
"""
import json, os, sys, tempfile
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.varLib import instancer

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.join(ROOT, "app", "fonts", "NotoSansDevanagari-devanagari.woff2")
LIST = os.path.join(ROOT, "app", "fonts", "devanagari-codepoints.json")
EXTRA = {0x0020, 0x00A0, 0x200C, 0x200D, 0x25CC, 0x0964, 0x0965}  # space, nbsp, ZWNJ, ZWJ, dotted circle, danda, double danda

def is_deva(cp):
    return 0x0900 <= cp <= 0x097F or 0xA8E0 <= cp <= 0xA8FF or 0x1CD0 <= cp <= 0x1CFF

used = set()
for d in ("app", "components", "lib", "content"):
    for root, _, files in os.walk(os.path.join(ROOT, d)):
        for f in files:
            if f.endswith((".ts", ".tsx", ".md", ".mdx", ".json", ".css")):
                text = open(os.path.join(root, f), encoding="utf8", errors="ignore").read()
                used |= {ord(c) for c in text if is_deva(ord(c))}

keep = sorted(used | EXTRA)
font = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wght": (400, 800)})
with tempfile.TemporaryDirectory() as tmp:
    mid = os.path.join(tmp, "inst.ttf")
    font.flavor = None
    font.save(mid)
    font = TTFont(mid)
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["*"]
opts.notdef_outline = True
opts.hinting = False
opts.name_IDs = [1, 2, 3, 4, 6]
s = subset.Subsetter(opts)
s.populate(unicodes=keep)
s.subset(font)
font.flavor = "woff2"
font.save(OUT)
json.dump([c for c in keep if is_deva(c)], open(LIST, "w"))
print(f"{len(keep)} characters kept, {os.path.getsize(OUT)} bytes -> {OUT}")
