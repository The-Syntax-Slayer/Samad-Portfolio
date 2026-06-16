import os
from PIL import Image

# Directories
ASSETS_DIR = r"f:\PORTFOLIO\src\assets"
PUBLIC_DIR = r"f:\PORTFOLIO\public"

images = [
    os.path.join(ASSETS_DIR, "Samad_Portrait.jpeg"),
    os.path.join(ASSETS_DIR, "Samad_Portrait.webp"),
    os.path.join(PUBLIC_DIR, "Samad_Portrait.jpeg"),
    os.path.join(PUBLIC_DIR, "Samad_Portrait.webp")
]

# Standard EXIF tags:
# 0x013b: Artist / Creator
# 0x8298: Copyright Notice
# 0x010e: ImageDescription / Caption
exif_data = {
    0x013b: "Samad Shaikh",
    0x8298: "Copyright 2026 Samad Shaikh",
    0x010e: "Samad Shaikh - Innovative Software Developer, AI Engineer & Tech Entrepreneur in Mumbai"
}

for img_path in images:
    if os.path.exists(img_path):
        try:
            print(f"Injecting EXIF into: {img_path}")
            img = Image.open(img_path)
            exif = img.getexif()
            
            exif[0x013b] = exif_data[0x013b]
            exif[0x8298] = exif_data[0x8298]
            exif[0x010e] = exif_data[0x010e]
            
            # Save the file with updated EXIF
            if img_path.lower().endswith('.webp'):
                img.save(img_path, "WEBP", quality=82, method=6, exif=exif)
            else:
                img.save(img_path, "JPEG", quality=90, exif=exif)
            print(f"Successfully injected EXIF into: {img_path}")
        except Exception as e:
            print(f"Could not inject EXIF into {img_path}: {e}")
    else:
        print(f"File not found: {img_path}")

print("Metadata injection completed.")
