#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEV_URL="${DEV_URL:-http://10.0.2.2:5000}"
PACKAGE_NAME="${PACKAGE_NAME:-com.riffhawk.ncfl}"
AVD_NAME="${AVD_NAME:-Pixel_9_Pro}"
JBR_PATH="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

if [ -f "$HOME/.zshrc" ]; then
  source "$HOME/.zshrc"
fi

export JAVA_HOME="${JAVA_HOME:-$JBR_PATH}"
export PATH="$JAVA_HOME/bin:$PATH"

ensure_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

ensure_cmd adb
ensure_cmd emulator
ensure_cmd npm

cd "$ROOT_DIR"

if ! curl -fsS "http://127.0.0.1:5000" >/dev/null 2>&1; then
  echo "Starting Vite dev server on port 5000..."
  nohup npm run dev > /tmp/ncfl-android-dev.log 2>&1 &
  sleep 4
fi

adb start-server >/dev/null

if ! adb devices | grep -q "emulator-"; then
  echo "Starting Android emulator: $AVD_NAME"
  nohup emulator -avd "$AVD_NAME" > /tmp/ncfl-emulator.log 2>&1 &
  echo "Waiting for emulator to boot..."
  adb wait-for-device >/dev/null 2>&1 || true
  until adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' | grep -q "1"; do
    sleep 2
  done
fi

echo "Syncing Capacitor to $DEV_URL ..."
CAPACITOR_APP_URL="$DEV_URL" npm run cap:sync >/tmp/ncfl-cap-sync.log 2>&1

echo "Installing Android debug app..."
(
  cd android
  JAVA_HOME="$JAVA_HOME" ./gradlew installDebug >/tmp/ncfl-android-install.log 2>&1
)

echo "Launching app..."
adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1 >/dev/null 2>&1

echo ""
echo "Android hot reload is ready."
echo "Dev server: http://localhost:5000"
echo "Emulator URL: $DEV_URL"
echo "Package: $PACKAGE_NAME"
echo "Logs:"
echo "  /tmp/ncfl-android-dev.log"
echo "  /tmp/ncfl-cap-sync.log"
echo "  /tmp/ncfl-android-install.log"
echo "  /tmp/ncfl-emulator.log"
