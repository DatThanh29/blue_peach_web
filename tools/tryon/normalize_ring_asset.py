#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

from PIL import Image
from PIL import ImageChops
from PIL import ImageFilter
from PIL import ImageStat


@dataclass
class CandidateScore:
    filename: str
    score: float
    content_ratio: float
    edge_mean: float
    bbox: tuple[int, int, int, int]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Normalize ring assets from marketing WEBP images.")
    parser.add_argument("--source-dir", required=True, help="Directory containing .webp candidates.")
    parser.add_argument("--output-dir", required=True, help="Directory to write normalized output.")
    parser.add_argument("--threshold", type=int, default=28, help="Difference threshold against sampled background.")
    parser.add_argument(
        "--padding-ratio",
        type=float,
        default=0.12,
        help="Extra crop padding around detected ring bbox.",
    )
    return parser.parse_args()


def sample_background_color(image: Image.Image) -> tuple[int, int, int]:
    rgb = image.convert("RGB")
    width, height = rgb.size
    patch = max(8, min(width, height) // 20)
    corners = [
        rgb.crop((0, 0, patch, patch)),
        rgb.crop((width - patch, 0, width, patch)),
        rgb.crop((0, height - patch, patch, height)),
        rgb.crop((width - patch, height - patch, width, height)),
    ]
    merged = Image.new("RGB", (patch * 2, patch * 2))
    merged.paste(corners[0], (0, 0))
    merged.paste(corners[1], (patch, 0))
    merged.paste(corners[2], (0, patch))
    merged.paste(corners[3], (patch, patch))
    stat = ImageStat.Stat(merged)
    return tuple(int(channel) for channel in stat.mean[:3])


def build_foreground_mask(image: Image.Image, threshold: int) -> Image.Image:
    rgb = image.convert("RGB")
    bg_color = sample_background_color(rgb)
    background = Image.new("RGB", rgb.size, bg_color)
    diff = ImageChops.difference(rgb, background).convert("L")
    hard_mask = diff.point(lambda value: 255 if value > threshold else 0)
    denoised = hard_mask.filter(ImageFilter.MedianFilter(size=5))
    softened = denoised.filter(ImageFilter.GaussianBlur(radius=1.8))
    return softened.point(lambda value: 255 if value > 48 else 0)


def expand_bbox(
    bbox: tuple[int, int, int, int],
    width: int,
    height: int,
    padding_ratio: float,
) -> tuple[int, int, int, int]:
    left, top, right, bottom = bbox
    pad_x = int((right - left) * padding_ratio)
    pad_y = int((bottom - top) * padding_ratio)
    return (
        max(0, left - pad_x),
        max(0, top - pad_y),
        min(width, right + pad_x),
        min(height, bottom + pad_y),
    )


def normalize_image(image: Image.Image, threshold: int, padding_ratio: float) -> tuple[Image.Image, Image.Image]:
    rgba = image.convert("RGBA")
    mask = build_foreground_mask(rgba, threshold)
    bbox = mask.getbbox() or (0, 0, rgba.width, rgba.height)
    bbox = expand_bbox(bbox, rgba.width, rgba.height, padding_ratio)
    cropped_rgba = rgba.crop(bbox)
    cropped_mask = mask.crop(bbox).filter(ImageFilter.GaussianBlur(radius=1.2))
    alpha = cropped_mask.point(lambda value: max(0, min(255, int(value * 1.15))))
    red, green, blue, _ = cropped_rgba.split()
    normalized = Image.merge("RGBA", (red, green, blue, alpha))
    return normalized, cropped_mask


def score_candidate(path: Path, threshold: int, padding_ratio: float) -> tuple[CandidateScore, Image.Image]:
    image = Image.open(path)
    normalized, mask = normalize_image(image, threshold, padding_ratio)
    bbox = mask.getbbox() or (0, 0, image.width, image.height)
    content_ratio = (bbox[2] - bbox[0]) * (bbox[3] - bbox[1]) / float(image.width * image.height)
    edge = normalized.convert("L").filter(ImageFilter.FIND_EDGES)
    edge_mean = ImageStat.Stat(edge).mean[0] / 255.0
    score = (0.7 * content_ratio) + (0.3 * edge_mean)
    return (
        CandidateScore(
            filename=path.name,
            score=score,
            content_ratio=content_ratio,
            edge_mean=edge_mean,
            bbox=bbox,
        ),
        normalized,
    )


def collect_webp_files(source_dir: Path) -> Iterable[Path]:
    return sorted(file for file in source_dir.glob("*.webp") if file.is_file())


def main() -> int:
    args = parse_args()
    source_dir = Path(args.source_dir)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    webp_files = list(collect_webp_files(source_dir))
    if not webp_files:
        raise SystemExit(f"No .webp files found in: {source_dir}")

    candidates: list[CandidateScore] = []
    normalized_images: dict[str, Image.Image] = {}
    for file in webp_files:
        candidate, normalized = score_candidate(file, args.threshold, args.padding_ratio)
        candidates.append(candidate)
        normalized_images[file.name] = normalized

    selected = max(candidates, key=lambda item: item.score)
    selected_image = normalized_images[selected.filename]

    normalized_path = output_dir / "ring_overlay_v1.png"
    selected_image.save(normalized_path, format="PNG")

    selected_source_path = source_dir / selected.filename
    source_copy_path = output_dir / "ring_source_selected.webp"
    source_copy_path.write_bytes(selected_source_path.read_bytes())

    report = {
        "selected": selected.filename,
        "normalized_output": normalized_path.name,
        "source_copy": source_copy_path.name,
        "scores": [
            {
                "filename": candidate.filename,
                "score": round(candidate.score, 6),
                "content_ratio": round(candidate.content_ratio, 6),
                "edge_mean": round(candidate.edge_mean, 6),
                "bbox": list(candidate.bbox),
            }
            for candidate in sorted(candidates, key=lambda item: item.score, reverse=True)
        ],
    }
    report_path = output_dir / "normalization_report.json"
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"Selected source: {selected.filename}")
    print(f"Normalized asset: {normalized_path}")
    print(f"Report: {report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
