#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$ROOT_DIR/.logs"

APP_PORT="${APP_PORT:-8000}"
HAND_PORT="${HAND_PORT:-8765}"
OPENAI_MLX_PORT="${OPENAI_MLX_PORT:-8080}"
STOP_OPENAI_MLX="${STOP_OPENAI_MLX:-1}"

stop_pid_file() {
  local label="$1"
  local pid_file="$2"

  if [[ ! -f "$pid_file" ]]; then
    echo "$label pid file not found."
    return
  fi

  local pid
  pid="$(cat "$pid_file")"
  if [[ -z "$pid" ]]; then
    rm -f "$pid_file"
    echo "$label pid file was empty."
    return
  fi

  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping $label pid $pid..."
    kill "$pid" 2>/dev/null || true
    sleep 1
    if kill -0 "$pid" 2>/dev/null; then
      echo "Force stopping $label pid $pid..."
      kill -9 "$pid" 2>/dev/null || true
    fi
  else
    echo "$label pid $pid is not running."
  fi

  rm -f "$pid_file"
}

kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -z "$pids" ]]; then
    echo "Port $port is free."
    return
  fi

  echo "Stopping remaining processes on port $port: $pids"
  kill $pids 2>/dev/null || true
  sleep 1

  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "Force stopping remaining processes on port $port: $pids"
    kill -9 $pids 2>/dev/null || true
  fi
}

echo "Stopping eval stack..."
stop_pid_file "Zion eval app" "$LOG_DIR/zion_eval_app.pid"
stop_pid_file "MLX hand server" "$LOG_DIR/mlx_hand_server.pid"

if [[ "$STOP_OPENAI_MLX" == "1" ]]; then
  stop_pid_file "OpenAI-compatible MLX server" "$LOG_DIR/mlx_openai_server.pid"
fi

echo "Cleaning ports..."
kill_port "$APP_PORT"
kill_port "$HAND_PORT"
if [[ "$STOP_OPENAI_MLX" == "1" ]]; then
  kill_port "$OPENAI_MLX_PORT"
fi

echo "Stopped."
