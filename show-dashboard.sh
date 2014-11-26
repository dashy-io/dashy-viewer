#!/bin/bash

DASHBOARD_FILE="file://$(cd $(dirname $0); pwd -P)/index.html$(cat ~/.dashy)"

if command -v chromium >/dev/null 2>&1; then
  echo "Running dashboard with chromium"
  chromium --incognito --kiosk $DASHBOARD_FILE
  exit 0
fi

if command -v chromium-browser >/dev/null 2>&1; then
  echo "Running dashboard with chromium-browser"
  chromium-browser --incognito --kiosk $DASHBOARD_FILE
  exit 0
fi

if command -v midori >/dev/null 2>&1; then
  echo "Running dashboard with midori"
  midori -e Fullscreen -a $DASHBOARD_FILE
  exit 0
fi

if command -v epiphany-browser >/dev/null 2>&1; then
  echo "Running dashboard with epiphany-browser"
  epiphany-browser -a --profile /tmp $DASHBOARD_FILE
  exit 0
fi

echo "ERROR: Cannot find a browser!"
exit 1
