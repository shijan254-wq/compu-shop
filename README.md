# CompuShop - E-Commerce ya Kompyuta na Simu

Mfumo kamili wa kuuza kompyuta, simu, na vifaa vya kidijitali.

## Tech Stack
- Backend: Python, Django 5, Django REST Framework, JWT
- Frontend: React 18, Vite, TypeScript, TailwindCSS, Framer Motion
- Database: MySQL 8 (XAMPP)
- PWA: Inafanya kazi offline

## Jinsi ya Kuanzisha (Local)

### 1. Backend (Django)
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

### 2. Frontend (React)
cd frontend
npm install
npm run dev

### 3. Database (MySQL)
- Fungua XAMPP Control Panel, Start MySQL
- Database: compu_shop
- User: compu_user / Password: CompuPass2024!

## Admin Login
- URL: http://127.0.0.1:8000/admin
- Username: admin
- Password: Admin12345!
- Admin Dashboard: http://127.0.0.1:5173/admin

## API Documentation
- Swagger: http://127.0.0.1:8000/api/docs/

## Deploy (Production)
Backend (Render.com):
- Build: pip install -r requirements.txt
- Start: gunicorn config.wsgi:application

Frontend (Vercel.com):
- Build: npm run build
- Output: dist
- Env: VITE_API_URL=https://api.yourdomain.com/api

## Features
- User registration & login (JWT)
- Product catalog na filters
- Shopping cart & checkout
- Order management
- Admin dashboard
- PWA (offline mode)
- Dark mode
- Mobile responsive
