#!/bin/bash

# Generate thumbnail images for photography gallery
# Converts full-size WebP images to smaller thumbnails (max 800px width, quality 75)

INPUT_DIR="assets/photography/gallery/full"
OUTPUT_DIR="assets/photography/gallery/thumbs"

# Create thumbs directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Check if cwebp is available
if ! command -v cwebp &> /dev/null; then
    echo "Error: cwebp not found. Please install libwebp."
    echo "Windows: Download from https://developers.google.com/speed/webp/download"
    echo "Mac: brew install webp"
    echo "Linux: apt-get install webp"
    exit 1
fi

echo "Generating thumbnails..."
echo "Input:  $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo ""

# Counter for progress
count=0
total=$(find "$INPUT_DIR" -type f \( -name "*.webp" -o -name "*.web" \) | wc -l)

# Process each WebP image in full directory
for img in "$INPUT_DIR"/*.{webp,web}; do
    # Skip if glob didn't match any files
    [ -e "$img" ] || continue

    filename=$(basename "$img")
    output="$OUTPUT_DIR/$filename"

    # Generate thumbnail (resize to 800px width, quality 75)
    cwebp -resize 800 0 -q 75 "$img" -o "$output" 2>/dev/null

    if [ $? -eq 0 ]; then
        count=$((count + 1))
        original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
        thumb_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)

        # Calculate sizes in KB
        original_kb=$((original_size / 1024))
        thumb_kb=$((thumb_size / 1024))

        echo "[$count/$total] $filename: ${original_kb}KB → ${thumb_kb}KB"
    else
        echo "Error processing: $filename"
    fi
done

echo ""
echo "✓ Generated $count thumbnails in $OUTPUT_DIR"
