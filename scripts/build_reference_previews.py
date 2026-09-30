"""Create web display copies; the original reference files are never written."""
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parents[1]
source_dir = root / 'assets/curated/references'
destination = root / 'assets/curated/reference-previews'
destination.mkdir(exist_ok=True)
original_bytes = preview_bytes = 0
for path in sorted(source_dir.glob('*.png')):
    with Image.open(path) as image:
        preview = ImageOps.contain(image, (1200, 1200), Image.Resampling.LANCZOS)
        target = destination / (path.stem + '.webp')
        preview.save(target, 'WEBP', quality=90, method=6)
    original_bytes += path.stat().st_size
    preview_bytes += target.stat().st_size
print(f'{original_bytes / 1024 / 1024:.2f} MiB original files; {preview_bytes / 1024 / 1024:.2f} MiB display copies. Originals unchanged.')
