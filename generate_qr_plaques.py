#!/usr/bin/env python3
"""
APOSONÍA — QR plaque generator
===============================
Produces five printable plaques (one per station) with QR code,
station number (roman numeral), name, coordinates, and brief cue.

Output: aposonia_plaques.pdf  (A5 landscape, five pages)

Requirements:
    pip install qrcode[pil] reportlab

Usage:
    # 1. Edit BASE_URL below to your deployed site (e.g., https://apseprojecteu.github.io/aposonia-map)
    # 2. Run: python generate_qr_plaques.py
    # 3. Print on heavy cream paper, laminate, affix to waterfront.
"""

import qrcode
from reportlab.lib.pagesizes import A5, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from PIL import Image

# ===== CONFIG =====
BASE_URL = "https://apseprojecteu.github.io/aposonia-map"   # ← EDIT THIS
OUTPUT   = "aposonia_plaques.pdf"

STATIONS = [
    (1, "I",   "White Tower Embankment",      "40.6264° N — 22.9486° E"),
    (2, "II",  "Port Pier № 1",               "40.6358° N — 22.9361° E"),
    (3, "III", "Nea Paralia, beneath the umbrellas", "40.6201° N — 22.9531° E"),
    (4, "IV",  "Kalamaria coast",             "40.5835° N — 22.9543° E"),
    (5, "V",   "Axios Delta — the reference", "40.4860° N — 22.8430° E"),
]

# Paper + ink palette (from the score)
PAPER = (0.929, 0.894, 0.820)   # #ede4d1
INK   = (0.059, 0.051, 0.039)   # #0f0d0a
RUBRIC = (0.627, 0.157, 0.157)  # #a02828
MUTE  = (0.478, 0.447, 0.392)   # #7a7264


def make_qr(url):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=0
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(
        fill_color=(15, 13, 10),
        back_color=(237, 228, 209),
    ).convert("RGB")
    return img


def draw_plaque(c, station):
    n, roman, name, coord = station
    W, H = landscape(A5)

    # Paper fill
    c.setFillColorRGB(*PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Frame
    c.setStrokeColorRGB(*INK)
    c.setLineWidth(1.2)
    c.rect(12*mm, 12*mm, W - 24*mm, H - 24*mm, fill=0, stroke=1)
    c.setLineWidth(0.3)
    c.rect(14*mm, 14*mm, W - 28*mm, H - 28*mm, fill=0, stroke=1)

    # QR code — right side, large
    qr_size = 80*mm
    qr_x = W - qr_size - 24*mm
    qr_y = (H - qr_size) / 2
    url = f"{BASE_URL}/station.html?n={n}"
    qr_img = make_qr(url)
    buf = BytesIO()
    qr_img.save(buf, format="PNG")
    buf.seek(0)
    from reportlab.lib.utils import ImageReader
    c.drawImage(ImageReader(buf), qr_x, qr_y, qr_size, qr_size, mask='auto')

    # Left block — text
    tx = 24*mm
    ty = H - 34*mm

    # Opus line
    c.setFillColorRGB(*RUBRIC)
    c.setFont("Helvetica", 8)
    c.drawString(tx, ty, "APOSONÍA · CME MMXXVI")

    # Roman numeral — huge
    ty -= 26*mm
    c.setFillColorRGB(*RUBRIC)
    try:
        c.setFont("Times-Italic", 80)
    except:
        c.setFont("Helvetica", 80)
    c.drawString(tx, ty, roman)

    # Station label
    ty -= 10*mm
    c.setFillColorRGB(*INK)
    c.setFont("Helvetica", 8)
    c.drawString(tx, ty, "LISTENING STATION")

    # Name
    ty -= 8*mm
    c.setFillColorRGB(*INK)
    c.setFont("Times-Roman", 14)
    # wrap long names
    max_width = qr_x - tx - 8*mm
    words = name.split()
    line = ""
    for w in words:
        test = (line + " " + w).strip()
        if c.stringWidth(test, "Times-Roman", 14) > max_width:
            c.drawString(tx, ty, line)
            ty -= 6*mm
            line = w
        else:
            line = test
    if line:
        c.drawString(tx, ty, line)

    # Coord
    ty -= 8*mm
    c.setFillColorRGB(*MUTE)
    c.setFont("Courier", 8)
    c.drawString(tx, ty, coord)

    # Cue instruction
    ty -= 16*mm
    c.setFillColorRGB(*INK)
    c.setFont("Helvetica", 7)
    c.drawString(tx, ty, "▸ SCAN · USE HEADPHONES · LISTEN WHERE YOU STAND")

    # QR caption
    c.setFillColorRGB(*MUTE)
    c.setFont("Courier", 6)
    c.drawCentredString(qr_x + qr_size/2, qr_y - 5*mm,
                        f"station {n} of 5  ·  {BASE_URL.replace('https://', '')}")

    # Page corners (chart style)
    corner_size = 5*mm
    for (x, y, dx, dy) in [
        (12*mm, 12*mm, 1, 1),
        (W - 12*mm, 12*mm, -1, 1),
        (12*mm, H - 12*mm, 1, -1),
        (W - 12*mm, H - 12*mm, -1, -1),
    ]:
        c.setLineWidth(1.5)
        c.line(x, y, x + corner_size*dx, y)
        c.line(x, y, x, y + corner_size*dy)


def main():
    c = canvas.Canvas(OUTPUT, pagesize=landscape(A5))
    for s in STATIONS:
        draw_plaque(c, s)
        c.showPage()
    c.save()
    print(f"✓ Generated {OUTPUT}")
    print(f"  5 plaques, A5 landscape, ready for print.")
    print(f"  Base URL: {BASE_URL}")


if __name__ == "__main__":
    main()
