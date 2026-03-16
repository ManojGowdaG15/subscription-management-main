# 🚀 Complete Setup & Running Instructions for Subscription Management System

## 📋 Prerequisites

Before you start, make sure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)

## 🔧 Step-by-Step Setup Guide

### Step 1: Create Project Structure

Open your terminal and run:

```bash
# Create main project folder
mkdir subscription-management-system
cd subscription-management-system

# Create server and client folders
mkdir server client
```

### Step 2: Setup Backend (Server)

```bash
# Navigate to server folder
cd server

# Initialize npm
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator helmet morgan

# Install dev dependencies
npm install -D nodemon
```

Create all the backend files I provided in the previous response in the `server` folder structure.

### Step 3: Setup Frontend (Client)

Open a **new terminal** (keep server terminal open):

```bash
# Navigate to client folder (from root)
cd client

# Create Vite React app
npm create vite@latest . -- --template react

# Install dependencies
npm install react-router-dom axios react-hot-toast react-icons date-fns chart.js react-chartjs-2

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p
```

Create all the frontend files I provided in the previous response in the `client/src` folder.

### Step 4: Environment Configuration

In the **root folder** (`subscription-management-system/`), create `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB - Use your local MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/subscription_app

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_123456
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173
```

In the **client folder**, create `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

### Step 5: Start MongoDB

#### **Windows:**
```bash
# If installed as a service, it should be running automatically
# To check: Open Services (Win + R, type services.msc)
# Look for "MongoDB Server"

# Or start manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

#### **MacOS:**
```bash
# If installed with Homebrew
brew services start mongodb-community

# Or manually
mongod --dbpath ~/data/db
```

#### **Linux:**
```bash
sudo systemctl start mongod
# or
sudo service mongod start
```

### Step 6: Seed Database with Initial Data

Create a script to seed your database with sample data:

In `server/package.json`, add this script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node utils/seedData.js"
}
```

Then run:
```bash
cd server
npm run seed
```

You should see output like:
```
✅ Connected to MongoDB
Cleared existing data
Admin created: admin@example.com
User created: user@example.com
Plans created:
- Basic: $9.99/monthly
- Premium: $19.99/monthly
- Pro: $29.99/monthly

✅ Database seeded successfully!

Login credentials:
Admin - email: admin@example.com, password: admin123
User - email: user@example.com, password: user123
```

### Step 7: Run the Application

Now you need to run both the backend and frontend servers.

#### **Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
Expected output:
```
🚀 Server running on port 5000
✅ Connected to MongoDB
```

#### **Terminal 2 - Frontend Server:**
```bash
cd client
npm run dev
```
Expected output:
```
VITE v4.4.5  ready in 500ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.x:5173/
```

### Step 8: Open the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@example.com | admin123 |
| **User** | user@example.com | user123 |

## 📁 Complete File Structure (What You Should Have)

```
subscription-management-system/
├── server/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── plan.controller.js
│   │   ├── subscription.controller.js
│   │   └── admin.controller.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js
│   │   └── Subscription.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── plan.routes.js
│   │   ├── subscription.routes.js
│   │   └── admin.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js
│   ├── utils/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── AdminRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Plans.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── user/
│   │   │       ├── Dashboard.jsx
│   │   │       └── SubscriptionDetails.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ManagePlans.jsx
│   │   │       └── ManageUsers.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env
├── .env (root - optional)
└── README.md
```

## 🚨 Common Issues & Solutions

### 1. MongoDB Connection Error
```
Error: MongoDB connection error: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017
```
**Solution:**
- Make sure MongoDB is running
- Check if MongoDB is installed correctly
- Try using `127.0.0.1:27017` instead of `localhost:27017` in your .env file

### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### 3. Module Not Found Errors
```
Error: Cannot find module 'express'
```
**Solution:**
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### 4. CORS Error in Browser
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution:**
Check that your server `.env` has:
```
CLIENT_URL=http://localhost:5173
```

### 5. Tailwind CSS Not Working
**Solution:**
Make sure `index.css` has the Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📝 Quick Setup Script (Optional)

Create a `setup.sh` file in the root folder:

```bash
#!/bin/bash

echo "🚀 Setting up Subscription Management System..."

# Setup Backend
echo "📦 Installing backend dependencies..."
cd server
npm install

# Setup Frontend
echo "📦 Installing frontend dependencies..."
cd ../client
npm install

# Seed Database
echo "🌱 Seeding database..."
cd ../server
npm run seed

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1 (Backend): cd server && npm run dev"
echo "2. Terminal 2 (Frontend): cd client && npm run dev"
echo ""
echo "Default credentials:"
echo "Admin - admin@example.com / admin123"
echo "User - user@example.com / user123"
```

Make it executable:
```bash
chmod +x setup.sh
./setup.sh
```

## 🎉 You're All Set!

Your Subscription Management System should now be running at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** mongodb://localhost:27017

### Test the Application:

1. **Login as Admin:**
   - Email: admin@example.com
   - Password: admin123
   - Access admin dashboard at http://localhost:5173/admin/dashboard

2. **Login as User:**
   - Email: user@example.com
   - Password: user123
   - Browse plans and subscribe

3. **Test Features:**
   - View subscription plans
   - Subscribe to a plan (simulated payment)
   - Cancel subscription
   - View dashboard
   - Toggle dark mode
   - Admin: Create/edit plans
   - Admin: View users and statistics

Need help with any specific feature or encounter any errors? Let me know! 🚀
