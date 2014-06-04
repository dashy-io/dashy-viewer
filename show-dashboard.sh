#!/bin/bash

DASHBOARD_FILE="file://$(pwd)/index.html$(cat ~/.dashy)"

if command -v chromium >/dev/null 2>&1
then
  chromium --incognito --kiosk $DASHBOARD_FILE
  exit 0
fi

if command -v midori >/dev/null 2>&1
then
  midori -e Fullscreen -a $DASHBOARD_FILE
  exit 0
fi

if command -v chromium-browser >/dev/null 2>&1
then
  chromium-browser --incognito --kiosk $DASHBOARD_FILE
  exit 0
fi
