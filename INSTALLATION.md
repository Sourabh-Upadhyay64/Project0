# QuickServe - Installation Commands

Copy and paste these commands to set up the project quickly.

## Prerequisites Check

```powershell
# Check Node.js version (should be v18+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed (optional for local setup)
mongod --version
```

## Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (already created, but verify it exists)
# Should contain: PORT, MONGODB_URI, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev

# Backend should now be running on http://localhost:3000
```

## Admin Panel Setup

Open a NEW terminal window and run:

```powershell
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Start the admin panel
npm run dev

# Admin panel should open automatically at http://localhost:5174
```

## Verify Installation

```powershell
# Test backend health
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# Expected output: { status: 'ok', timestamp: '...' }
```

## Login Credentials

### Admin
- URL: http://localhost:5174
- Click "Admin"
- Username: `admin`
- Password: `admin123`

### Kitchen Staff
- URL: http://localhost:5174
- Click "Kitchen / Cook"
- Username: `kitchen1`
- Password: `kitchen123`

## Common Issues & Fixes

### MongoDB Connection Error
```powershell
# If using local MongoDB, start it:
# On Windows: Start the MongoDB service from Services
# Or install MongoDB Compass and use the GUI

# If using MongoDB Atlas:
# 1. Create a free cluster at https://www.mongodb.com/cloud/atlas
# 2. Get connection string
# 3. Update MONGODB_URI in backend/.env
```

### Port Already in Use
```powershell
# If port 3000 is in use:
# 1. Find process using port 3000
netstat -ano | findstr :3000

# 2. Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# If port 5174 is in use:
# 1. Find process using port 5174
netstat -ano | findstr :5174

# 2. Kill the process
taskkill /PID <PID> /F
```

### Missing Dependencies
```powershell
# If npm install fails, try:
npm cache clean --force
npm install

# Or delete node_modules and reinstall:
rm -r node_modules
npm install
```

## Stop Servers

```powershell
# In each terminal, press:
Ctrl + C

# Then confirm with: Y
```

## Restart Servers

```powershell
# Backend
cd backend
npm run dev

# Admin Panel (in new terminal)
cd admin
npm run dev
```

## Database Reset (Clean Start)

```powershell
# If you want to reset database to initial state
cd backend
npm run seed

# This will:
# - Clear all orders
# - Clear all kitchen users
# - Add sample menu items
# - Add sample kitchen users
```

## Testing API with PowerShell

```powershell
# Get all menu items
Invoke-RestMethod -Uri "http://localhost:3000/api/menu"

# Get analytics
Invoke-RestMethod -Uri "http://localhost:3000/api/analytics?period=today"

# Create a test order (get menu item IDs first)
$menuItems = Invoke-RestMethod -Uri "http://localhost:3000/api/menu"
$firstItemId = $menuItems[0]._id

$body = @{
    tableNumber = 5
    customerPhone = "+1234567890"
    items = @(
        @{
            menuItemId = $firstItemId
            name = "Test Item"
            quantity = 2
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Post -Body $body -ContentType "application/json"
```

## Update Admin Password

```powershell
# Edit backend/.env file
# Change ADMIN_PASSWORD to your desired password
# Restart backend server
```

## Production Build

```powershell
# Build admin panel for production
cd admin
npm run build

# Build output will be in admin/dist folder
# Deploy this folder to your hosting service
```

## Development Tips

```powershell
# Run backend with auto-restart on changes
cd backend
npm run dev

# Install MongoDB Compass for database GUI
# Download from: https://www.mongodb.com/try/download/compass

# View logs
# Backend logs appear in the terminal where you run npm run dev
# Frontend logs appear in browser console (F12)
```

## Quick Troubleshooting

```powershell
# 1. Check if backend is running
Invoke-RestMethod -Uri "http://localhost:3000/api/health"

# 2. Check if admin panel is running
# Open browser to http://localhost:5174

# 3. Check MongoDB connection
# Look for "MongoDB connected" message in backend terminal

# 4. Clear browser cache
# Press Ctrl + Shift + Delete in browser

# 5. Check for errors
# Backend: Look at terminal where backend is running
# Frontend: Press F12 in browser, check Console tab
```

## All-in-One Setup Script

Save this as `setup.ps1` and run it:

```powershell
# Backend setup
Write-Host "Setting up backend..." -ForegroundColor Green
cd backend
npm install
npm run seed
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 5

# Admin panel setup
Write-Host "Setting up admin panel..." -ForegroundColor Green
cd ../admin
npm install
npm run dev

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Admin Panel: http://localhost:5174" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:3000" -ForegroundColor Cyan
```

---

**That's it! Your QuickServe admin panel should now be running.** 🚀
