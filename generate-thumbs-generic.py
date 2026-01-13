#!/usr/bin/env python3
"""
Generic thumbnail generator for any folder
Converts images to smaller thumbnails (max width, quality configurable)

Usage:
    python generate-thumbs-generic.py <input_folder> [output_folder] [max_width] [quality]

Examples:
    python generate-thumbs-generic.py assets/photography/gallery/full
    python generate-thumbs-generic.py assets/us/gallery/full assets/us/gallery/thumbs 800 75
    python generate-thumbs-generic.py assets/projects/nfw/gallery/full
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

# Default settings
DEFAULT_MAX_WIDTH = 800
DEFAULT_QUALITY = 75

def generate_thumbnails(input_dir, output_dir=None, max_width=DEFAULT_MAX_WIDTH, quality=DEFAULT_QUALITY):
    """
    Generate thumbnails from input directory

    Args:
        input_dir: Path to folder containing full-size images
        output_dir: Path to output folder (default: input_dir/../thumbs)
        max_width: Maximum width in pixels (default: 800)
        quality: WebP quality 0-100 (default: 75)
    """
    input_path = Path(input_dir)

    if not input_path.exists():
        print(f"Error: Input directory not found: {input_dir}")
        return False

    # Default output directory: same parent, /thumbs folder
    if output_dir is None:
        output_path = input_path.parent / "thumbs"
    else:
        output_path = Path(output_dir)

    # Create output directory
    output_path.mkdir(parents=True, exist_ok=True)

    print(f"Generating thumbnails...")
    print(f"Input:  {input_path}")
    print(f"Output: {output_path}")
    print(f"Size:   {max_width}px max width")
    print(f"Quality: {quality}")
    print()

    # Get all image files
    image_extensions = ['*.webp', '*.web', '*.jpg', '*.jpeg', '*.png']
    image_files = []
    for ext in image_extensions:
        image_files.extend(input_path.glob(ext))
        image_files.extend(input_path.glob(ext.upper()))

    if not image_files:
        print(f"No images found in {input_path}")
        return False

    count = 0
    total = len(image_files)
    skipped = []

    for img_path in image_files:
        filename = img_path.name

        # Determine output filename (always .webp)
        if img_path.suffix.lower() in ['.web', '.webp']:
            output_filename = filename if filename.endswith('.webp') else filename + 'p'
        else:
            output_filename = img_path.stem + '.webp'

        output_file = output_path / output_filename

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
                if original_width > max_width:
                    ratio = max_width / original_width
                    new_height = int(original_height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)

                # Save as WebP
                img.save(output_file, 'WEBP', quality=quality, method=6)

            # Get file sizes
            original_size = img_path.stat().st_size
            thumb_size = output_file.stat().st_size

            original_kb = original_size // 1024
            thumb_kb = thumb_size // 1024

            count += 1
            print(f"[{count}/{total}] {filename}: {original_kb}KB -> {thumb_kb}KB")

        except Exception as e:
            print(f"Error processing {filename}: {e}")
            skipped.append(filename)

    print()
    print(f"Done! Generated {count} thumbnails in {output_path}")

    if skipped:
        print(f"\nSkipped {len(skipped)} files:")
        for name in skipped:
            print(f"  - {name}")

    return True

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else None
    max_width = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_MAX_WIDTH
    quality = int(sys.argv[4]) if len(sys.argv) > 4 else DEFAULT_QUALITY

    success = generate_thumbnails(input_dir, output_dir, max_width, quality)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
