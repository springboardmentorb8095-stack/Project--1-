# ==========================================
# Stop All Project Services - stop_all.ps1
# ==========================================

Write-Host "Stopping all project processes..." -ForegroundColor Red

# Stop Django server
Get-Process | Where-Object { $_.ProcessName -like "python*" } | ForEach-Object {
    if ($_.MainWindowTitle -match "runserver" -or $_.Path -match "Python") {
        Write-Host "Stopping Django process PID=$($_.Id)"
        Stop-Process -Id $_.Id -Force
    }
}

# Stop React (Node.js)
Get-Process | Where-Object { $_.ProcessName -like "node*" } | ForEach-Object {
    Write-Host "Stopping React (Node.js) PID=$($_.Id)"
    Stop-Process -Id $_.Id -Force
}

# Stop Redis (if running)
try {
    Write-Host "Trying to stop Redis..."
    redis-cli shutdown
} catch {
    Write-Host "Redis not running or redis-cli not found."
}

Write-Host ""
Write-Host "All project processes stopped successfully!" -ForegroundColor Green
