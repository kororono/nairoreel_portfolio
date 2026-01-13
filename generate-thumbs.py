#!/usr/bin/env python3
"""
Generate thumbnail images for photography gallery
Converts full-size WebP images to smaller thumbnails (max 800px width, quality 75)
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not found. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

INPUT_DIR = Path("assets/photography/gallery/full")
OUTPUT_DIR = Path("assets/photography/gallery/thumbs")
MAX_WIDTH = 800
QUALITY = 75

def main():
    # Create thumbs directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print("Generating thumbnails...")
    print(f"Input:  {INPUT_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    # Get all WebP files
    image_files = list(INPUT_DIR.glob("*.webp")) + list(INPUT_DIR.glob("*.web"))

    if not image_files:
        print(f"No images found in {INPUT_DIR}")
        return

    count = 0
    total = len(image_files)

    for img_path in image_files:
        filename = img_path.name

        # Skip wadagliz_1.web (missing/broken file)
        if filename == "wadagliz_1.web":
            print(f"[SKIP] {filename} (missing extension)")
            continue

        output_path = OUTPUT_DIR / filename

        try:
            # Open image
            with Image.open(img_path) as img:
                # Convert to RGB if needed (WebP can have alpha)
                if img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = rgb_img

                # Calculate new dimensions maintaining aspect ratio
                original_width, original_height = img.size
                if original_width > MAX_WIDTH:
                    ratio = MAX_WIDTH / original_width
                    new_height = int(original_height * ratio)
                    img = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)

                # Save as WebP
                img.save(output_path, 'WEBP', quality=QUALITY, method=6)

            # Get file sizes
            original_size = img_path.stat().st_size
            thumb_size = output_path.stat().st_size

            original_kb = original_size // 1024
            thumb_kb = thumb_size // 1024

            count += 1
            print(f"[{count}/{total}] {filename}: {original_kb}KB -> {thumb_kb}KB")

        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print()
    print(f"Done! Generated {count} thumbnails in {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
