#!/bin/bash
# Starts the first available Android emulator
echo "[TaskGo] Starting Android emulator..."
EMULATOR=$("$ANDROID_HOME/emulator/emulator" -list-avds | head -n 1)
if [ -n "$EMULATOR" ]; then
  "$ANDROID_HOME/emulator/emulator" -avd "$EMULATOR"
else
  echo "No Android emulators found. Please create one in Android Studio."
fi
