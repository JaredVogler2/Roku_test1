#!/usr/bin/env python3
"""Generate original art and a sideload-ready Roku SDK ZIP.

Requires Pillow; no stock art, downloaded assets, or API keys.
Usage: python tools/build.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import zipfile

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
DIST = ROOT / "dist"
OUTPUT = DIST / "SofaSpark-Party-Roku.zip"
MAX_SIZE = 4 * 1024 * 1024

NAVY = (12, 17, 37)
PINK = (249, 115, 165)
TEAL = (67, 214, 177)
LAVENDER = (124, 139, 255)
GOLD = (248, 197, 104)


def font(size, bold=True):
    paths = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
        if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, max(8, int(size)))
        except OSError:
            pass
    return ImageFont.load_default()


def centered(draw, text, cx, cy, font_obj, color):
    box = draw.textbbox((0, 0), text, font=font_obj)
    width = box[2] - box[0]
    height = box[3] - box[1]
    draw.text((int(cx - width / 2), int(cy - height / 2 - box[1])),
              text, font=font_obj, fill=color)


def art(width, height, icon=False):
    image = Image.new("RGB", (width, height), NAVY)
    draw = ImageDraw.Draw(image)
    # Soft branded gradient, no photo licensing and no external dependencies.
    for y in range(height):
        t = y / max(1, height - 1)
        draw.line((0, y, width, y),
                  fill=(int(12 + t * 13), int(17 + t * 16), int(37 + t * 28)))
    s = min(width, height)
    draw.ellipse((int(width * .72), int(-height * .35),
                  int(width * 1.15), int(height * .56)), fill=(38, 46, 90))
    draw.ellipse((int(-width * .25), int(height * .52),
                  int(width * .32), int(height * 1.33)), fill=(37, 39, 76))
    # Four energetic geometric playing cards.
    scale = s / (405 if icon else 1080)
    r = max(7, int(22 * scale))
    if icon:
        boxes = [
            (.09, .11, .28, .34, PINK),
            (.72, .10, .89, .34, TEAL),
            (.73, .67, .93, .89, GOLD),
            (.08, .67, .27, .90, LAVENDER),
        ]
    else:
        boxes = [
            (.08, .14, .19, .38, PINK),
            (.79, .19, .90, .43, TEAL),
            (.12, .70, .24, .92, GOLD),
            (.76, .69, .89, .91, LAVENDER),
        ]
    for left, top, right, bottom, color in boxes:
        draw.rounded_rectangle((int(width * left), int(height * top),
                                int(width * right), int(height * bottom)),
                               radius=r, fill=color)
    # Spark pictogram accent.
    cx, cy = int(width * .83), int(height * .16)
    ray = int(s * .07)
    for dx, dy in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        draw.line((cx, cy, cx + dx * ray, cy + dy * ray),
                  fill=(255, 245, 219), width=max(3, int(scale * 8)))
    if icon:
        centered(draw, "SOFA", width / 2, height * .405,
                 font(s * .164), (255, 255, 255))
        centered(draw, "SPARK", width / 2, height * .578,
                 font(s * .150), (255, 255, 255))
        centered(draw, "PARTY GAMES", width / 2, height * .785,
                 font(s * .042), (213, 224, 245))
    else:
        centered(draw, "SOFA SPARK", width / 2, height * .434,
                 font(s * .118), (255, 255, 255))
        centered(draw, "PARTY GAMES", width / 2, height * .602,
                 font(s * .038), (213, 224, 245))
        centered(draw, "ONE REMOTE. BIG LAUGHS.", width / 2, height * .705,
                 font(s * .022), (213, 224, 245))
    return image


def make_images():
    IMAGES.mkdir(parents=True, exist_ok=True)
    art(540, 405, True).save(IMAGES / "channel-icon-fhd.png", optimize=True)
    art(290, 218, True).save(IMAGES / "channel-icon-hd.png", optimize=True)
    art(720, 480).save(IMAGES / "splash-sd.jpg", quality=86, optimize=True)
    art(1280, 720).save(IMAGES / "splash-hd.jpg", quality=86, optimize=True)
    art(1920, 1080).save(IMAGES / "splash-fhd.jpg", quality=85, optimize=True)
    # Independent marketplace-ready 540x405 poster.
    art(540, 405, True).save(IMAGES / "store-poster.png", optimize=True)


def make_zip():
    DIST.mkdir(parents=True, exist_ok=True)
    paths = [ROOT / "manifest"]
    for folder in ("source", "components"):
        paths.extend(sorted((ROOT / folder).glob("*")))
    paths.extend(sorted(p for p in IMAGES.iterdir() if p.name != "store-poster.png"))
    with zipfile.ZipFile(OUTPUT, "w", compression=zipfile.ZIP_DEFLATED,
                         compresslevel=9) as archive:
        for path in paths:
            if path.is_file():
                archive.write(path, path.relative_to(ROOT).as_posix())
    size = OUTPUT.stat().st_size
    if size > MAX_SIZE:
        raise SystemExit(f"Package {size} bytes exceeds Roku's 4 MiB policy")
    print(f"Created {OUTPUT} ({size:,} bytes)")


if __name__ == "__main__":
    make_images()
    make_zip()
