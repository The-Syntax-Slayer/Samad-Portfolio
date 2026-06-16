import os
from PIL import Image

script_dir = os.path.dirname(os.path.abspath(__file__))
assets_dir = os.path.join(script_dir, "..", "src", "assets")
images_to_resize = [
    "primax.webp",
    "mm.webp",
    "mockmate.webp",
    "planora.webp",
    "planora_2.webp",
    "weblens.webp",
    "wl.webp",
    "legalease.webp",
    "clientsync.webp",
    "smartmeet.webp"
]

def resize_image(filename):
    filepath = os.path.join(assets_dir, filename)
    if not os.path.exists(filepath):
        print(f"Skipping {filename} (does not exist)")
        return
    
    name, ext = os.path.splitext(filename)
    
    with Image.open(filepath) as img:
        orig_width, orig_height = img.size
        print(f"Processing {filename}: original size {orig_width}x{orig_height}")
        
        # Small: 400px width
        if orig_width > 400:
            sm_height = int((400 / orig_width) * orig_height)
            sm_img = img.resize((400, sm_height), Image.Resampling.LANCZOS)
            sm_img.save(os.path.join(assets_dir, f"{name}-sm.webp"), "WEBP", quality=85)
            print(f"  Saved {name}-sm.webp at 400x{sm_height}")
        else:
            img.save(os.path.join(assets_dir, f"{name}-sm.webp"), "WEBP", quality=85)
            print(f"  Saved copy as {name}-sm.webp")
            
        # Medium: 800px width
        if orig_width > 800:
            md_height = int((800 / orig_width) * orig_height)
            md_img = img.resize((800, md_height), Image.Resampling.LANCZOS)
            md_img.save(os.path.join(assets_dir, f"{name}-md.webp"), "WEBP", quality=85)
            print(f"  Saved {name}-md.webp at 800x{md_height}")
        else:
            img.save(os.path.join(assets_dir, f"{name}-md.webp"), "WEBP", quality=85)
            print(f"  Saved copy as {name}-md.webp")

for img_name in images_to_resize:
    try:
        resize_image(img_name)
    except Exception as e:
        print(f"Error processing {img_name}: {e}")
