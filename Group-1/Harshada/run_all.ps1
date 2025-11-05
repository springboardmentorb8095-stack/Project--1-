# ===============================================
# 🚀 TalentLink Full Stack Launcher
# Runs Redis (via WSL), Django backend, and React frontend
# ===============================================

# Change these paths as per your setup
$backendPath = "E:\infosys-milestone-1-main_\infosys-milestone-1-main\backend"
$frontendPath = "E:\infosys-milestone-1-main_\infosys-milestone-1-main\frontend"

Write-Host "🧠 Starting TalentLink stack..." -ForegroundColor Cyan
Start-Sleep -Seconds 1

# ========== Start Redis (via WSL) ==========
Write-Host "🟥 Starting Redis server in WSL..."
Start-Process wsl -ArgumentList "redis-server" -WindowStyle Minimized

Start-Sleep -Seconds 2

# ========== Start Django Backend ==========
Write-Host "🐍 Starting Django backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; venv\Scripts\activate; python manage.py runserver" -WindowStyle Normal

Start-Sleep -Seconds 2

# ========== Start React Frontend ==========
Write-Host "⚛️ Starting React frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "✅ All services started successfully!"
Write-Host "🔗 Django: http://127.0.0.1:8000"
Write-Host "🔗 React:  http://localhost:3000"
Write-Host "🔔 Redis:  Running in WSL"
Write-Host "Press Ctrl + C in any window to stop that process."
