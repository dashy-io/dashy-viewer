#!/bin/bash

if [ ! -f ~/.dashy ]; then
  echo "Initialising ~/.dashy config..."
  echo "$(uuidgen)" > ~/.dashy
else
  echo "Using existing ~/.dashy config."
fi
GIT_VER="ver=$(git rev-parse HEAD)"

DASHBOARD1_ID="$(sed -n 1p ~/.dashy)"
DASHBOARD2_ID="$(sed -n 2p ~/.dashy)"

DASHBOARD1_URL="http://client.dashy.io/?id=${DASHBOARD1_ID}&${GIT_VER}"
DASHBOARD2_URL="http://client.dashy.io/?id=${DASHBOARD2_ID}&${GIT_VER}"

echo "Dashboard 1 URL: ${DASHBOARD1_URL}"
if [ -n "$DASHBOARD2_ID" ]; then
  echo "Dashboard 2 URL: ${DASHBOARD2_URL}"
fi

PRIMARY_DISPLAY_WIDTH="$(xrandr | grep "*" | xargs | cut -d " " -f 1 | cut -d "x" -f 1)"
echo "Primary display width: ${PRIMARY_DISPLAY_WIDTH}"


printf "Waiting for api.dashy.io to be available: "
until $(curl --output /dev/null --silent --head --fail http://api.dashy.io/status); do
    printf '.'
    sleep 1
done
printf "OK\r\n"

if command -v google-chrome-stable >/dev/null 2>&1; then
  echo "Running dashboard on primary screen with google-chrome-stable"
  google-chrome-stable --incognito --no-first-run --start-fullscreen --window-position=0,0 --user-data-dir="$(mktemp -d)" ${DASHBOARD1_URL} &
  if [ -n "$DASHBOARD2_ID" ]; then
    echo "Running dashboard on secondary screen with google-chrome-stable"
    google-chrome-stable --incognito --no-first-run --start-fullscreen --window-position=${PRIMARY_DISPLAY_WIDTH},0 --user-data-dir="$(mktemp -d)" ${DASHBOARD2_URL} &
  fi
  exit 0
fi

# if command -v midori >/dev/null 2>&1; then
#   echo "Running dashboard with midori"
#   midori -e Fullscreen -a ${DASHBOARD_FILE}
#   exit 0
# fi

# if command -v epiphany-browser >/dev/null 2>&1; then
#   echo "Running dashboard with epiphany-browser"
#   epiphany-browser -a --profile /tmp ${DASHBOARD_FILE}
#   exit 0
# fi

echo "ERROR: Cannot find a browser!"
exit 1
