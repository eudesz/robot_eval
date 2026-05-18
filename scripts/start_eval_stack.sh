#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.logs"
PYTHON="$ROOT_DIR/.venv/bin/python"

APP_HOST="${APP_HOST:-127.0.0.1}"
APP_PORT="${APP_PORT:-8000}"
HAND_HOST="${HAND_HOST:-127.0.0.1}"
HAND_PORT="${HAND_PORT:-8765}"
HAND_MODEL="${HAND_MODEL:-mlx-community/Llama-3.2-3B-Instruct-4bit}"

OPENAI_MLX_HOST="${OPENAI_MLX_HOST:-127.0.0.1}"
OPENAI_MLX_PORT="${OPENAI_MLX_PORT:-8080}"
OPENAI_MLX_MODEL="${OPENAI_MLX_MODEL:-mlx-community/Qwen2.5-14B-Instruct-4bit}"
START_OPENAI_MLX="${START_OPENAI_MLX:-0}"

mkdir -p "$LOG_DIR"

if [[ ! -x "$PYTHON" ]]; then
  echo "Missing virtualenv Python: $PYTHON" >&2
  echo "Create/restore .venv before running this script." >&2
  exit 1
fi

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -z "$pids" ]]; then
    echo "Port $port is free."
    return
  fi

  echo "Stopping processes on port $port: $pids"
  kill $pids 2>/dev/null || true
  sleep 1

  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Force stopping processes on port $port: $pids"
    kill -9 $pids 2>/dev/null || true
  fi
}

wait_http() {
  local url="$1"
  local label="$2"
  local attempts="${3:-60}"

  for _ in $(seq 1 "$attempts"); do
    if "$PYTHON" - "$url" >/dev/null 2>&1 <<'PY'
import sys
from urllib.request import urlopen

with urlopen(sys.argv[1], timeout=2) as response:
    if 200 <= response.status < 500:
        raise SystemExit(0)
raise SystemExit(1)
PY
    then
      echo "$label is up: $url"
      return
    fi
    sleep 1
  done

  echo "Timed out waiting for $label: $url" >&2
  exit 1
}

echo "Cleaning eval ports..."
kill_port "$APP_PORT"
kill_port "$HAND_PORT"
if [[ "$START_OPENAI_MLX" == "1" ]]; then
  kill_port "$OPENAI_MLX_PORT"
fi

echo "Starting Zion eval app on http://$APP_HOST:$APP_PORT ..."
(
  cd "$ROOT_DIR/zion_eval_app"
  exec "$PYTHON" -m http.server "$APP_PORT" --bind "$APP_HOST"
) >"$LOG_DIR/zion_eval_app.log" 2>&1 &
echo $! > "$LOG_DIR/zion_eval_app.pid"

echo "Starting MLX hand server on http://$HAND_HOST:$HAND_PORT ..."
(
  cd "$ROOT_DIR"
  exec "$PYTHON" scripts/mlx_hand_server.py \
    --host "$HAND_HOST" \
    --port "$HAND_PORT" \
    --model "$HAND_MODEL"
) >"$LOG_DIR/mlx_hand_server.log" 2>&1 &
echo $! > "$LOG_DIR/mlx_hand_server.pid"

if [[ "$START_OPENAI_MLX" == "1" ]]; then
  echo "Starting OpenAI-compatible MLX server on http://$OPENAI_MLX_HOST:$OPENAI_MLX_PORT ..."
  (
    cd "$ROOT_DIR"
    exec "$PYTHON" -m mlx_lm.server \
      --model "$OPENAI_MLX_MODEL" \
      --host "$OPENAI_MLX_HOST" \
      --port "$OPENAI_MLX_PORT"
  ) >"$LOG_DIR/mlx_openai_server.log" 2>&1 &
  echo $! > "$LOG_DIR/mlx_openai_server.pid"
fi

wait_http "http://$APP_HOST:$APP_PORT/" "Zion eval app" 20
wait_http "http://$HAND_HOST:$HAND_PORT/health" "MLX hand server" 120

if [[ "$START_OPENAI_MLX" == "1" ]]; then
  wait_http "http://$OPENAI_MLX_HOST:$OPENAI_MLX_PORT/v1/models" "OpenAI-compatible MLX server" 60
fi

echo
echo "Ready."
echo "App: http://localhost:$APP_PORT"
echo "Hand server: http://$HAND_HOST:$HAND_PORT"
echo "Logs:"
echo "  $LOG_DIR/zion_eval_app.log"
echo "  $LOG_DIR/mlx_hand_server.log"
if [[ "$START_OPENAI_MLX" == "1" ]]; then
  echo "  $LOG_DIR/mlx_openai_server.log"
fi
