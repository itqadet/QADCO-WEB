"""Usage: python scripts/anonymise-works.py ../assets/works_done public/images/reel

Make client rooms in the "Our work" reel less recognisable, locally (nothing is uploaded).

For each photo: blur personal items (screens, art, mirrors, views), recolour distinctive
furnishings, crop a little tighter on QADCO's work, mirror the layout, and apply a light,
shared colour grade. Boxes are fractions of the original image (x0, y0, x1, y1).
"""
import glob
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

SRC = sys.argv[1]  # assets/works_done
OUT = sys.argv[2]  # public/images/works
files = sorted(glob.glob(os.path.join(SRC, "*.jpeg")))
source = {"majlis-seating": 21, "bedroom-timber-ceiling": 24, "living-layered-ceiling": 37, "fitted-kitchen": 25,
          "tv-wall-lit-shelves": 44, "tv-wall-marble-slats": 31, "fireplace-wall-slats": 51, "walk-in-wardrobe": 22,
          # ceilings, columns and doors: also clients' buildings
          "columns-capitals-cornice": 6, "dome-dentil-cornice": 10, "fluted-columns-site": 1, "column-base-panelling": 5,
          "pilaster-cornice-corner": 11, "oval-cove-chandelier": 40, "tray-blue-cove": 52, "stepped-warm-cove": 48,
          "round-fretwork-ceiling": 49, "tray-timber-beams": 27, "tray-blue-lit": 46, "sculpted-backlit-curves": 33,
          "office-acoustic-ceiling": 53, "door-vertical-grooves": 17, "door-two-tone": 14, "door-inlay": 18,
          "door-classic-panels": 19}


def px(im, box):
    w, h = im.size
    return (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))


def blur_box(im, box, radius):
    """Soft-edged blur so the patch blends into the room."""
    b = px(im, box)
    region = im.crop(b).filter(ImageFilter.GaussianBlur(radius))
    mask = Image.new("L", region.size, 0)
    m = max(2, min(region.size) // 8)
    ImageDraw.Draw(mask).rectangle((m, m, region.size[0] - m, region.size[1] - m), fill=255)
    im.paste(region, b[:2], mask.filter(ImageFilter.GaussianBlur(m)))


def patch(im, box, dx, dy):
    """Cover a box with a clean piece of the same surface from (dx, dy) away, soft-edged."""
    b = px(im, box)
    w, h = im.size
    sx, sy = int(dx * w), int(dy * h)
    piece = im.crop((b[0] + sx, b[1] + sy, b[2] + sx, b[3] + sy))
    mask = Image.new("L", piece.size, 0)
    m = max(2, min(piece.size) // 12)
    ImageDraw.Draw(mask).rectangle((m, m, piece.size[0] - m, piece.size[1] - m), fill=255)
    im.paste(piece, b[:2], mask.filter(ImageFilter.GaussianBlur(m * 0.8)))


def blur_poly(im, pts, radius, desaturate=0.0):
    w, h = im.size
    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).polygon([(x * w, y * h) for x, y in pts], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius / 2))
    soft = im.filter(ImageFilter.GaussianBlur(radius))
    if desaturate:
        soft = ImageEnhance.Color(soft).enhance(1 - desaturate)
    im.paste(soft, (0, 0), mask)


def recolour_reds(im, hue=158, sat_scale=0.5, value=0.6):
    """Shift strongly saturated reds (the majlis upholstery) to a deep, muted navy."""
    hsv = im.convert("HSV")
    h, s, v = hsv.split()
    red = Image.eval(h, lambda x: 255 if (x < 22 or x > 238) else 0)
    sat = Image.eval(s, lambda x: 255 if x > 120 else 0)
    mask = Image.composite(red, Image.new("L", im.size, 0), sat).filter(ImageFilter.GaussianBlur(1.5))
    new_h = Image.new("L", im.size, hue)
    new_s = Image.eval(s, lambda x: int(x * sat_scale))
    new_v = Image.eval(v, lambda x: int(x * value))
    shifted = Image.merge("HSV", (new_h, new_s, new_v)).convert("RGB")
    im.paste(shifted, (0, 0), mask)


def plain_rug(im, pts, colour=(226, 214, 194), border=(92, 70, 60)):
    """Replace a patterned rug with a plain cream one with a bound edge: loses the pattern."""
    w, h = im.size
    poly = [(x * w, y * h) for x, y in pts]
    top, bottom = min(p[1] for p in poly), max(p[1] for p in poly)
    # light falls off gently toward the back of the room
    grad = Image.new("L", (1, h))
    for y in range(h):
        t = 0 if y < top else min(1, (y - top) / max(1, bottom - top))
        grad.putpixel((0, y), int(208 + 34 * t))
    grad = grad.resize(im.size)
    lit = Image.composite(Image.new("RGB", im.size, colour), Image.new("RGB", im.size, (0, 0, 0)), grad)
    weave = Image.effect_noise(im.size, 26).convert("RGB")
    lit = Image.blend(lit, weave, 0.05).filter(ImageFilter.GaussianBlur(0.6))

    cx = sum(p[0] for p in poly) / 4
    cy = sum(p[1] for p in poly) / 4

    def ring(scale):
        m = Image.new("L", im.size, 0)
        ImageDraw.Draw(m).polygon([(cx + (x - cx) * scale, cy + (y - cy) * scale) for x, y in poly], fill=255)
        return m

    def band(outer, inner):
        return Image.composite(ring(outer), Image.new("L", im.size, 0), Image.eval(ring(inner), lambda x: 255 - x))

    edge = Image.new("RGB", im.size, border)
    lit.paste(edge, (0, 0), band(1.0, 0.965).filter(ImageFilter.GaussianBlur(1)))
    lit.paste(edge, (0, 0), band(0.935, 0.925).filter(ImageFilter.GaussianBlur(0.8)))
    im.paste(lit, (0, 0), ring(1.0).filter(ImageFilter.GaussianBlur(1.2)))


def grade(im):
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(0.9)
    r, g, b = im.split()
    r = Image.eval(r, lambda x: min(255, int(x * 1.025)))
    b = Image.eval(b, lambda x: int(x * 0.97))
    return Image.merge("RGB", (r, g, b))


# photos whose subject (a ceiling feature) sits at the top: crop from the bottom instead
TOP_SUBJECT = {"bedroom-timber-ceiling", "living-layered-ceiling", "tray-timber-beams"}


def stylise(im, name):
    """The strong pass: tighter on the work, the room around it melted, real colours replaced.

    1. crop 8% more from every side (or 16% from the bottom when the subject is at the top)
    2. focus blur: sharp across most of the frame, softening into the corners
    3. brand duotone: navy shadows, a warm stone middle, cream highlights
    4. fine grain to break up surface detail
    """
    w, h = im.size
    box = (0.08, 0.0, 0.92, 0.84) if name in TOP_SUBJECT else (0.08, 0.08, 0.92, 0.92)
    im = im.crop((int(w * box[0]), int(h * box[1]), int(w * box[2]), int(h * box[3])))
    w, h = im.size
    soft = im.filter(ImageFilter.GaussianBlur(max(w, h) / 110))
    focus = Image.new("L", (w, h), 0)
    cy = 0.42 if name in TOP_SUBJECT else 0.5
    ImageDraw.Draw(focus).ellipse((w * 0.06, h * (cy - 0.44), w * 0.94, h * (cy + 0.44)), fill=255)
    im = Image.composite(im, soft, focus.filter(ImageFilter.GaussianBlur(max(w, h) / 12)))
    grey = ImageOps.autocontrast(ImageOps.grayscale(im), cutoff=0.5)
    im = ImageOps.colorize(grey, black=(11, 20, 56), mid=(150, 128, 104), white=(246, 238, 222), midpoint=100)
    grain = Image.effect_noise((w, h), 22).convert("RGB")
    return Image.blend(im, grain, 0.045)


def crop(im, box):
    return im.crop(px(im, box))


def process(name, im):
    if name == "majlis-seating":
        recolour_reds(im)
        plain_rug(im, [(0.375, 0.345), (0.645, 0.345), (0.80, 0.825), (0.235, 0.825)])
        im = crop(im, (0.03, 0.06, 0.97, 1.0))
    elif name == "bedroom-timber-ceiling":
        for box in [(0.70, 0.18, 0.85, 0.31), (0.39, 0.42, 0.51, 0.59), (0.71, 0.53, 0.82, 0.69),
                    (0.74, 0.69, 0.80, 0.78), (0.81, 0.77, 0.91, 0.89)]:
            blur_box(im, box, 9)
        im = crop(im, (0.0, 0.0, 1.0, 0.84))
    elif name == "living-layered-ceiling":
        for box in [(0.35, 0.44, 0.55, 0.63), (0.59, 0.45, 0.67, 0.57), (0.81, 0.40, 0.91, 0.60)]:
            blur_box(im, box, 7)
        im = crop(im, (0.04, 0.0, 0.96, 0.9))
    elif name == "fitted-kitchen":
        blur_box(im, (0.0, 0.21, 0.14, 0.53), 10)
        blur_box(im, (0.10, 0.43, 0.24, 0.56), 5)
        im = crop(im, (0.03, 0.04, 0.97, 0.96))
    elif name == "tv-wall-lit-shelves":
        blur_box(im, (0.40, 0.48, 0.68, 0.70), 6)
        im = crop(im, (0.02, 0.0, 0.98, 0.97))
    elif name == "dome-dentil-cornice":
        # the street window (left), a marker patch and scaffold poles (right) all sit at the
        # edges: crop to the dome and cornice, and soften the last bit of pole
        blur_box(im, (0.74, 0.40, 0.80, 0.58), 12)
        im = crop(im, (0.18, 0.0, 0.79, 1.0))
    elif name == "fluted-columns-site":
        blur_box(im, (0.35, 0.40, 0.59, 1.0), 16)  # the opening between the columns shows outside
        im = crop(im, (0.03, 0.0, 0.97, 0.97))
    elif name == "office-acoustic-ceiling":
        im = crop(im, (0.03, 0.0, 0.97, 0.78))  # loses the windows and the view beyond
    elif name == "tray-timber-beams":
        blur_box(im, (0.0, 0.80, 0.32, 1.0), 12)
        im = crop(im, (0.02, 0.0, 0.98, 0.95))
    elif name == "tray-blue-cove":
        blur_box(im, (0.80, 0.76, 1.0, 1.0), 12)
        im = crop(im, (0.02, 0.0, 0.98, 0.97))
    elif name.startswith("door-"):
        blur_box(im, (0.0, 0.86, 1.0, 1.0), 10)  # patterned floor of the client's home
        im = crop(im, (0.03, 0.02, 0.97, 0.96))
    else:
        im = crop(im, (0.02, 0.02, 0.98, 0.98))
    return stylise(grade(ImageOps.mirror(im)), name)


for name, idx in source.items():
    im = ImageOps.exif_transpose(Image.open(files[idx])).convert("RGB")
    im.thumbnail((1600, 1600))
    im = process(name, im)
    im.save(os.path.join(OUT, name + ".jpg"), quality=84, optimize=True, progressive=True)
    print(f'{name}: [{im.width}, {im.height}]')
