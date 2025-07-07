# Starts the first available Android emulator
Write-Host "[TaskGo] Starting Android emulator..."
$emulator = ( & "$env:ANDROID_HOME\emulator\emulator.exe" -list-avds | Select-Object -First 1 )
if ($emulator) {
    & "$env:ANDROID_HOME\emulator\emulator.exe" -avd $emulator
} else {
    Write-Host "No Android emulators found. Please create one in Android Studio."
}
