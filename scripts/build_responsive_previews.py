"""Build and validate the public 640px/960px WebP image variants.

The original full-size curated WebP files are read-only inputs. Existing preview
files are never replaced, so rerunning the command is safe and deterministic.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/curated"
DESTINATION = SOURCE / "previews"
WIDTHS = (640, 960)
QUALITY = 90


def _extract_array(text: str, marker: str, closing: str) -> str:
    """Return a JS array body, balancing brackets while respecting quoted text."""
    start = text.find(marker)
    if start < 0:
        raise ValueError(f"Could not find {marker!r}")
    start = text.find("[", start + len(marker) - 1)
    if start < 0:
        raise ValueError(f"Could not find array after {marker!r}")
    depth = 0
    quote = None
    escaped = False
    for index in range(start, len(text)):
        char = text[index]
        if quote:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            continue
        if char in "'\"`":
            quote = char
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return text[start + 1:index]
    raise ValueError(f"Unclosed array for {marker!r} (expected around {closing})")


def item_ids() -> list[str]:
    curated = (ROOT / "js/curated.js").read_text(encoding="utf-8")
    additions = (ROOT / "js/portfolio-additions.js").read_text(encoding="utf-8")
    curated_items = _extract_array(curated, "items:", "  ]\n};")
    additions_items = _extract_array(additions, '"items":', '  ],\n  "groups"')
    ids = re.findall(r"\bid\s*:\s*'([^']+)'", curated_items)
    ids += re.findall(r'"id"\s*:\s*"([^"]+)"', additions_items)
    if len(ids) != 93 or len(set(ids)) != len(ids):
        raise ValueError(f"Expected 93 unique active items; found {len(ids)} IDs / {len(set(ids))} unique")
    return ids


def _source_image(item_id: str) -> tuple[Path, tuple[int, int]]:
    source = SOURCE / f"{item_id}.webp"
    if not source.is_file():
        raise FileNotFoundError(f"Missing original result image: {source.relative_to(ROOT)}")
    with Image.open(source) as image:
        image.verify()
    with Image.open(source) as image:
        return source, image.size


def _validate_variant(path: Path, source_size: tuple[int, int], target_width: int) -> None:
    with Image.open(path) as image:
        image.verify()
    with Image.open(path) as image:
        width, height = image.size
        if image.format != "WEBP":
            raise ValueError(f"{path.name}: expected WebP, got {image.format}")
        metadata = [key for key in ("exif", "xmp", "icc_profile") if image.info.get(key)]
        if metadata:
            raise ValueError(f"{path.name}: unexpected metadata chunks: {', '.join(metadata)}")
        if width != target_width:
            raise ValueError(f"{path.name}: filename says {target_width}w but actual width is {width}px")
        expected_height = round(source_size[1] * width / source_size[0])
        if height != expected_height:
            raise ValueError(f"{path.name}: expected aspect-preserving {width}x{expected_height}, got {width}x{height}")


def build(check_only: bool) -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    ids = item_ids()
    generated = 0
    skipped = 0
    total_bytes = 0
    errors: list[str] = []

    for item_id in ids:
        try:
            source, source_size = _source_image(item_id)
            for width in WIDTHS:
                target = DESTINATION / f"{item_id}-{width}.webp"
                if not target.exists() and not check_only:
                    with Image.open(source) as image:
                        image = ImageOps.exif_transpose(image)
                        height = round(image.height * width / image.width)
                        resized = image.resize((width, height), Image.Resampling.LANCZOS)
                        # Saving only pixels deliberately drops EXIF, XMP, and ICC metadata.
                        resized.info.clear()
                        if resized.mode not in ("RGB", "RGBA"):
                            resized = resized.convert("RGBA" if "transparency" in image.info else "RGB")
                        resized.save(target, "WEBP", quality=QUALITY, method=6)
                    generated += 1
                elif target.exists():
                    skipped += 1
                if not target.is_file():
                    errors.append(f"{item_id}-{width}.webp: missing")
                    continue
                try:
                    _validate_variant(target, source_size, width)
                except (OSError, ValueError) as error:
                    errors.append(str(error))
                    continue
                total_bytes += target.stat().st_size
        except (OSError, ValueError) as error:
            errors.append(f"{item_id}: {error}")

    if errors:
        raise SystemExit("Responsive preview validation failed:\n- " + "\n- ".join(errors))
    action = "Verified" if check_only else "Built/verified"
    print(f"{action} {len(ids)} images x {len(WIDTHS)} widths; generated {generated}, kept existing {skipped}; total {total_bytes:,} bytes.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="validate all 186 variants without writing files")
    arguments = parser.parse_args()
    try:
        build(arguments.check)
    except (OSError, ValueError) as error:
        print(error, file=sys.stderr)
        raise SystemExit(1) from error
