Param()

Write-Output "Resetting backend and starting services..."

$backend = (Get-Location)
Write-Output "Working directory: $backend"

# Kill existing backend-related processes (uvicorn or python running from this backend folder)
$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ($_.CommandLine -match [regex]::Escape($backend.Path) -or $_.CommandLine -match 'uvicorn') }
if ($procs) {
  $procs | ForEach-Object { Write-Output "Killing PID $($_.ProcessId): $($_.CommandLine)"; Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
} else {
  Write-Output 'No backend-related processes found.'
}

# Locate venv python
$py = Join-Path $backend '.venv\Scripts\python.exe'
if (-not (Test-Path $py)) { Write-Error "Python executable not found at $py"; exit 1 }
Write-Output "Using python: $py"

# Start uvicorn (single process, no reload to avoid multiprocess issues)
Start-Process -FilePath $py -ArgumentList '-m','uvicorn','main:app','--host','127.0.0.1','--port','8000' -WorkingDirectory $backend
Write-Output 'Started uvicorn on port 8000.'

Start-Sleep -Seconds 2

# Run ETL to ensure backend/dev.db is populated (run and wait)
Write-Output 'Running ETL import...'
Start-Process -FilePath $py -ArgumentList (Join-Path $backend 'etl\import_schools.py') -WorkingDirectory $backend -NoNewWindow -Wait

Start-Sleep -Seconds 1

# Query API
try {
  $resp = Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/schools' -Method GET -TimeoutSec 10
  Write-Output ($resp | ConvertTo-Json -Depth 5)
} catch {
  Write-Output "API request failed: $($_.Exception.Message)"
}

Write-Output 'Reset script finished.'
