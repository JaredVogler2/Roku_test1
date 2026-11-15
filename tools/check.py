#!/usr/bin/env python3
"""Static checks run by CI after tools/build.py."""
from pathlib import Path
from collections import Counter
from PIL import Image
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
manifest = (ROOT / "manifest").read_text()
xml_file = ROOT / "components" / "MainScene.xml"
scene = xml_file.read_text()
script = (ROOT / "components" / "MainScene.brs").read_text()
decks = (ROOT / "source" / "decks.brs").read_text()

ET.parse(xml_file)
assert "signalBeacon(\"AppLaunchComplete\")" in script, "Missing Roku launch beacon"
assert "onKeyEvent" in script, "Missing remote control handler"
assert "CreateObject(\"roRegistrySection\"" in script
for essential in ("ui_resolutions=fhd", "mm_icon_focus_fhd", "splash_screen_fhd"):
    assert essential in manifest, essential
for label in ("modeFrame0", "modeFrame3", "packFrame0", "packFrame2", "promptLabel", "secondTimer"):
    assert f'id="{label}"' in scene, label

prompts = re.findall(r'"([^"\n]+)"', decks)
assert len(prompts) == 432, f"Expected 432 cards, got {len(prompts)}"
duplicates = [key for key, qty in Counter(prompts).items() if qty > 1]
assert not duplicates, f"Duplicate cards: {duplicates[:5]}"
for prompt in prompts:
    assert len(prompt) < 150, f"Too long for TV layout: {prompt}"
    assert prompt.isascii(), f"Non-ASCII card requires review: {prompt}"

dims = {
    "channel-icon-fhd.png": (540, 405),
    "channel-icon-hd.png": (290, 218),
    "splash-fhd.jpg": (1920, 1080),
    "splash-hd.jpg": (1280, 720),
    "splash-sd.jpg": (720, 480),
    "store-poster.png": (540, 405),
}
for filename, expected in dims.items():
    with Image.open(ROOT / "images" / filename) as image:
        assert image.size == expected, filename

zpath = ROOT / "dist" / "SofaSpark-Party-Roku.zip"
assert zpath.is_file(), "ZIP not built"
assert zpath.stat().st_size < 4 * 1024 * 1024, "Roku package over 4 MiB"
with zipfile.ZipFile(zpath) as z:
    assert z.testzip() is None, "Damaged ZIP"
    members = set(z.namelist())
    assert "manifest" in members
    assert "source/main.brs" in members
    assert "source/decks.brs" in members
    assert "components/MainScene.xml" in members
    assert "components/MainScene.brs" in members
    for filename in dims:
        if filename != "store-poster.png":
            assert "images/" + filename in members, filename
    assert all(not m.startswith(".") for m in members)

print(f"PASS: SceneGraph XML, assets, package and {len(prompts)} original prompts")
