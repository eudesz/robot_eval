#!/usr/bin/env python3
"""
Local semantic check: does the *text* of a Zion final_annotation mention hands
(left / right / both / generic hands / Spanish mano, etc.) in any way?

Uses Apple MLX (mlx-lm). No video; do not infer visual ground truth.

  pip install -r scripts/hand_mention_mlx_requirements.txt

  python scripts/hand_mention_mlx.py path/to/final_annotation.json
  python scripts/hand_mention_mlx.py --model mlx-community/Qwen2.5-7B-Instruct-4bit path/to.json
  cat final_annotation.json | python scripts/hand_mention_mlx.py

For browser integration, run: python scripts/mlx_hand_server.py

First run downloads the model from Hugging Face (mlx-community).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

import mlx_hand_eval as mhe  # noqa: E402


def load_final_annotation(raw: str) -> dict:
    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Root JSON must be an object (final_annotations)")
    return data


def main() -> None:
    ap = argparse.ArgumentParser(description="MLX: hand-mention check on final_annotations JSON")
    ap.add_argument(
        "json_path",
        nargs="?",
        help="Path to JSON file (final_annotations object). If omitted, read stdin.",
    )
    ap.add_argument(
        "--model",
        default="mlx-community/Llama-3.2-3B-Instruct-4bit",
        help="HF repo id for an MLX 4-bit instruct model (mlx-community/...)",
    )
    ap.add_argument("--max-tokens", type=int, default=512)
    ap.add_argument("--temp", type=float, default=0.0)
    args = ap.parse_args()

    if args.json_path:
        raw = Path(args.json_path).read_text(encoding="utf-8")
    else:
        raw = sys.stdin.read()

    fa = load_final_annotation(raw)

    try:
        from mlx_lm import load
    except ImportError as err:
        print("Install deps: pip install -r scripts/hand_mention_mlx_requirements.txt", file=sys.stderr)
        raise SystemExit(1) from err

    model, tokenizer = load(args.model)
    result = mhe.run_hand_mention_mlx(
        model,
        tokenizer,
        fa,
        max_tokens=args.max_tokens,
        temp=args.temp,
    )
    json.dump(result, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
