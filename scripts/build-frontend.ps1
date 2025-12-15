Param()

try {
  Push-Location -Path (Join-Path $PSScriptRoot '..\frontend')
  Write-Host "Running frontend build in: $(Get-Location)"
  # Ensure dependencies are installed then build
  npm install
  npm run build
} finally {
  Pop-Location
}

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
