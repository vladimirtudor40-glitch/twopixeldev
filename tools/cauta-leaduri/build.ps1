# Construiește installer-ul „Caută leaduri” pe Windows.
# Cere: Go (winget install GoLang.Go) și Inno Setup 6 (winget install JRSoftware.InnoSetup).
# Parametru: calea către gmaps-scraper.exe REPARAT (cel oficial v1.18.x se închide pe Windows).
param([string]$Scraper = "D:\twopixeldev\google-maps-scraper\gmaps-scraper.exe")
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$payload = Join-Path $PSScriptRoot "installer\payload"
New-Item -ItemType Directory -Force $payload | Out-Null
$env:GOOS = "windows"; $env:GOARCH = "amd64"
go build -trimpath -ldflags "-H windowsgui -s -w" -o (Join-Path $payload "CautaLeaduri.exe") .
Copy-Item $Scraper (Join-Path $payload "gmaps-scraper.exe") -Force
$iscc = @("$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe", "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe", "$env:ProgramFiles\Inno Setup 6\ISCC.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $iscc) { throw "Nu găsesc ISCC.exe (Inno Setup 6)." }
& $iscc "installer\CautaLeaduri.iss"
Write-Host "Installer: $(Join-Path $PSScriptRoot 'dist\CautaLeaduri-twopixeldev-Setup.exe')"
