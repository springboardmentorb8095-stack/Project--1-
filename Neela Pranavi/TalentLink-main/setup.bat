@echo off
echo 🚀 Setting up TalentLink Project (Milestones 1 ^& 2)
echo ==================================================

echo 📱 Setting up Django Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo.
echo To activate virtual environment, run:
echo   venv\Scripts\activate

echo.
echo Installing Python dependencies...
echo pip install -r requirements.txt

echo.
echo Setting up database...
echo python manage.py makemigrations accounts
echo python manage.py makemigrations profiles
echo python manage.py makemigrations projects  
echo python manage.py makemigrations proposals
echo python manage.py migrate

echo.
echo Creating superuser (run this interactively)...
echo python manage.py createsuperuser

echo.
echo Starting Django server...
echo python manage.py runserver

echo.
echo 📱 Setting up React Frontend...
cd ../frontend

echo Installing Node.js dependencies...
echo npm install

echo.
echo Starting React development server...
echo npm start

echo.
echo 🎉 Setup Complete!
echo ===================
echo.
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo Admin panel: http://localhost:8000/admin
