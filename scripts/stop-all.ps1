# Attempts to stop all TaskGo-related processes (Metro, backend, emulator)
Write-Host "[TaskGo] Stopping Metro Bundler, backend, and emulator..."
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*TaskGo*" } | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "emulator" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Write-Host "Stopped all TaskGo-related processes (if running)."
