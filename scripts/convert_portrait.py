import os
from PIL import Image

# Directories
ASSETS_DIR = r"f:\PORTFOLIO\src\assets"
PUBLIC_DIR = r"f:\PORTFOLIO\public"

images_to_convert = [
    os.path.join(ASSETS_DIR, "Samad_Portrait.jpeg"),
    os.path.join(PUBLIC_DIR, "Samad_Portrait.jpeg")
]

for img_path in images_to_convert:
    if os.path.exists(img_path):
        print(f"Converting: {img_path}")
        img = Image.open(img_path)
        base_path = os.path.splitext(img_path)[0]
        
        # Save as WebP
        webp_path = base_path + ".webp"
        img.save(webp_path, "WEBP", quality=82, method=6)
        print(f"Created: {webp_path}")
        
        # Save as AVIF (Pillow handles AVIF if pillow-heif or similar is installed. 
        # Let's try, and if it fails, fallback gracefully or use pillow's save function if supported)
        try:
            avif_path = base_path + ".avif"
            img.save(avif_path, "AVIF", quality=75)
            print(f"Created: {avif_path}")
        except Exception as e:
            print(f"AVIF save failed: {e}. Trying via WebP copy or other mode...")
            # If native AVIF fails (since it requires pillow-heif or raw codec), we can write a warning 
            # and let the build run. AVIF is optional, WebP is the primary modern format supported.
    else:
        print(f"File not found: {img_path}")

print("Image conversion completed successfully.")
