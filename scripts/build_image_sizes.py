"""Record original image dimensions without changing any photograph."""
import argparse
import json
from pathlib import Path

from PIL import Image

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
sizes = {}
for path in sorted((root / 'assets/curated').glob('*.webp')):
    with Image.open(path) as image:
        sizes[path.stem] = list(image.size)
content = 'window.IMAGE_SIZES = ' + json.dumps(sizes, separators=(',', ':')) + ';\n'
output = root / 'js/image-sizes.js'
if args.check:
    if output.read_text(encoding='utf-8') != content:
        raise SystemExit('Image dimension records differ from the actual files.')
    print(f'Original dimensions verified for {len(sizes)} images.')
else:
    output.write_text(content, encoding='utf-8')
    print(f'Recorded {len(sizes)} original image dimensions.')
