#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

if ! command -v air >/dev/null 2>&1; then
  echo "未找到 air，请先安装："
  echo "  go install github.com/air-verse/air@latest"
  exit 1
fi

cleanup() {
  echo ""
  echo "正在停止 api / rpc ..."
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "==> 启动 stats-rpc (air) ..."
(cd "$ROOT/rpc" && air -c .air.toml) &

echo "==> 启动 stats-api (air) ..."
(cd "$ROOT/api" && air -c .air.toml) &

echo "rpc / api 已在后台热重载运行，Ctrl+C 同时退出"
wait
