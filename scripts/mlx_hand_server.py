#!/usr/bin/env python3
"""
Local HTTP API for MLX hand-mention checks (used by zion_eval_app in the browser).

  pip install -r scripts/hand_mention_mlx_requirements.txt
  python scripts/mlx_hand_server.py
  python scripts/mlx_hand_server.py --port 8765 --model mlx-community/Qwen2.5-7B-Instruct-4bit

Then open the static app and use "Run MLX hand check (flagged)".

POST /mlx-hand-check
  Body JSON: {
    "tasks": [ { "task_id": "uuid", "final_annotation": { ... } }, ... ],
    "max_tokens": 512,
    "temp": 0.2
  }
  Response: { "results": [ { "task_id", "ok": true, "eval": { ... } } | { "task_id", "ok": false, "error": "..." } ] }

GET /health -> { "ok": true, "model": "..." }
"""

from __future__ import annotations

import argparse
import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import urlparse

_SCRIPTS = Path(__file__).resolve().parent
if str(_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_SCRIPTS))

import mlx_hand_eval as mhe  # noqa: E402

_model = None
_tokenizer = None
_model_id = ""
_model_ready = False


def _ensure_model(model_id: str):
    global _model, _tokenizer, _model_id, _model_ready
    if _model is not None and _model_id == model_id and _model_ready:
        return
    from mlx_lm import load

    print(f"Loading MLX model {model_id} … (first run may take a while)", flush=True)
    _model, _tokenizer = load(model_id)
    _model_id = model_id
    _model_ready = True
    print("Model loaded and ready for requests.", flush=True)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        return

    def _send(self, code: int, body: dict):
        raw = json.dumps(body).encode("utf-8")
        try:
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(raw)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            self.wfile.write(raw)
        except BrokenPipeError:
            # Browser closed the connection (timeout) before the response was sent.
            print("Client disconnected before response was sent (often a browser timeout).", flush=True)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/health":
            self._send(
                200,
                {
                    "ok": True,
                    "model": _model_id or "not_loaded",
                    "model_ready": _model_ready,
                },
            )
            return
        self._send(404, {"ok": False, "error": "not_found"})

    def do_POST(self):
        path = urlparse(self.path).path
        if path != "/mlx-hand-check":
            self._send(404, {"ok": False, "error": "not_found"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        try:
            payload = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        except json.JSONDecodeError as err:
            self._send(400, {"ok": False, "error": f"invalid_json: {err}"})
            return

        tasks = payload.get("tasks")
        if not isinstance(tasks, list) or not tasks:
            self._send(400, {"ok": False, "error": "tasks must be a non-empty array"})
            return

        max_tokens = int(payload.get("max_tokens") or 512)
        temp = float(payload.get("temp") or 0.2)

        global _model_id
        model_id = str(payload.get("model") or "").strip() or _model_id
        if not model_id:
            self._send(400, {"ok": False, "error": "set model on server (--model) or pass model in first request"})
            return

        try:
            _ensure_model(model_id)
        except Exception as err:
            self._send(500, {"ok": False, "error": f"model_load: {err}"})
            return

        results = []
        for item in tasks:
            if not isinstance(item, dict):
                results.append({"task_id": None, "ok": False, "error": "task_not_object"})
                continue
            tid = item.get("task_id")
            fa = item.get("final_annotation")
            if not isinstance(fa, dict):
                results.append({"task_id": tid, "ok": False, "error": "final_annotation must be object"})
                continue
            try:
                ev = mhe.run_hand_mention_mlx(_model, _tokenizer, fa, max_tokens=max_tokens, temp=temp)
                results.append({"task_id": tid, "ok": True, "eval": ev})
            except Exception as err:
                results.append({"task_id": tid, "ok": False, "error": str(err)})

        self._send(200, {"ok": True, "results": results})


def main():
    global _model_id
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--port", type=int, default=8765)
    ap.add_argument(
        "--model",
        default="mlx-community/Llama-3.2-3B-Instruct-4bit",
        help="Default MLX model id (client can override per request with body.model on first batch)",
    )
    ap.add_argument(
        "--no-preload",
        action="store_true",
        help="Do not load the model at startup (loads on first POST instead).",
    )
    args = ap.parse_args()
    _model_id = args.model
    print(f"MLX hand server http://{args.host}:{args.port}  (default model: {args.model})", flush=True)
    print("POST /mlx-hand-check with JSON { tasks: [{ task_id, final_annotation }], ... }", flush=True)
    if not args.no_preload:
        try:
            _ensure_model(args.model)
        except Exception as err:
            print(f"Failed to preload model: {err}", flush=True)
            raise SystemExit(1) from err
    HTTPServer((args.host, args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
