#!/bin/bash
# Attempts to stop all TaskGo-related processes (Metro, backend, emulator)
echo "[TaskGo] Stopping Metro Bundler, backend, and emulator..."
# Stop Metro and backend (node processes in TaskGo)
ps aux | grep '[n]ode' | grep 'TaskGo' | awk '{print $2}' | xargs -r kill -9
# Stop Android emulator
pkill -f 'emulator.*-avd'
echo "Stopped all TaskGo-related processes (if running)."
