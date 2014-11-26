#!/bin/bash

if [ ! -f ~/.dashy ]; then
  echo "Initialising ~/.dashy config..."
  echo "?id=$(uuidgen)" > ~/.dashy
else
  echo "Using existing ~/.dashy config."
fi

DASHBOARD_FILE="file://$(cd $(dirname $0); pwd -P)/index.html$(cat ~/.dashy)"
echo "Url: ${DASHBOARD_FILE}"

if command -v chromium >/dev/null 2>&1; then
  echo "Running dashboard with chromium"
  chromium --incognito --kiosk ${DASHBOARD_FILE}
  exit 0
fi

if command -v chromium-browser >/dev/null 2>&1; then
  echo "Running dashboard with chromium-browser"
  chromium-browser --incognito --kiosk ${DASHBOARD_FILE}
  exit 0
fi

if command -v google-chrome-stable >/dev/null 2>&1; then
  echo "Running dashboard with google-chrome-stable"
  google-chrome-stable --incognito --kiosk ${DASHBOARD_FILE}
  exit 0
fi

if command -v midori >/dev/null 2>&1; then
  echo "Running dashboard with midori"
  midori -e Fullscreen -a ${DASHBOARD_FILE}
  exit 0
fi

if command -v epiphany-browser >/dev/null 2>&1; then
  echo "Running dashboard with epiphany-browser"
  epiphany-browser -a --profile /tmp ${DASHBOARD_FILE}
  exit 0
fi

echo "ERROR: Cannot find a browser!"
exit 1
