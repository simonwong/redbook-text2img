#!/usr/bin/env bash
# Idempotent Cloud Agent bootstrap for redbook-text2img.
# Prepares CJK fonts, JS dependencies, and the Playwright browser so that
# `pnpm build`, `pnpm test`, and `pnpm test:e2e` all run cleanly.
set -euo pipefail

cd "$(dirname "$0")/.."

# ---------------------------------------------------------------------------
# System fonts.
# The theme presets render Simplified-Chinese content and the e2e suite
# compares the live DOM against html2canvas-pro exports. fonts-noto-cjk ships
# the Noto Sans/Serif CJK SC families; the fontconfig alias below makes the
# exact families the app requests ("Noto Sans SC" / "Noto Serif SC", see
# src/lib/theme/fonts.ts) resolve to those CJK faces, which keeps the
# preview-vs-export pixel comparison within tolerance in headless Chromium
# regardless of the base image's other fonts.
# ---------------------------------------------------------------------------
export DEBIAN_FRONTEND=noninteractive

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  SUDO="sudo"
fi

$SUDO apt-get update -y
$SUDO apt-get install -y --no-install-recommends \
  fonts-noto-cjk \
  fonts-noto-color-emoji \
  curl \
  ca-certificates

# Provide the exact "Noto Serif SC" / "Noto Sans SC" family names as real files
# too (the Debian package only ships the differently named "... CJK SC"
# families). The alias below still routes rendering to the CJK faces.
FONT_DIR="/usr/share/fonts/truetype/noto-sc"
$SUDO mkdir -p "$FONT_DIR"
install_google_font() {
  local family_file="$1" url="$2"
  if [ ! -f "$FONT_DIR/$family_file" ]; then
    local tmp
    tmp="$(mktemp)"
    curl -fsSL -o "$tmp" "$url"
    $SUDO cp "$tmp" "$FONT_DIR/$family_file"
    rm -f "$tmp"
  fi
}
install_google_font "NotoSerifSC.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/notoserifsc/NotoSerifSC%5Bwght%5D.ttf"
install_google_font "NotoSansSC.ttf" \
  "https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf"

# Route the app's requested SC families to the Noto CJK faces so the e2e
# preview-vs-html2canvas-pro ink comparison stays within tolerance.
$SUDO tee /etc/fonts/conf.d/99-redbook-cjk.conf >/dev/null <<'FONTCONF'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <match target="pattern">
    <test name="family"><string>Noto Serif SC</string></test>
    <edit name="family" mode="prepend" binding="strong"><string>Noto Serif CJK SC</string></edit>
  </match>
  <match target="pattern">
    <test name="family"><string>Noto Sans SC</string></test>
    <edit name="family" mode="prepend" binding="strong"><string>Noto Sans CJK SC</string></edit>
  </match>
</fontconfig>
FONTCONF

$SUDO fc-cache -f >/dev/null

# ---------------------------------------------------------------------------
# JavaScript dependencies (pnpm is pinned via package.json "packageManager").
# COREPACK_ENABLE_DOWNLOAD_PROMPT keeps corepack from prompting when it fetches
# the pinned pnpm release, so the script stays non-interactive.
# ---------------------------------------------------------------------------
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable >/dev/null 2>&1 || true
pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# Playwright browser used by `pnpm test:e2e`.
# ---------------------------------------------------------------------------
pnpm exec playwright install --with-deps chromium

echo "Cloud Agent environment ready."
