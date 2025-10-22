# QuickServe - Quick Start Guide

## 🎯 Getting Started in 5 Minutes

Follow these steps to get your QuickServe admin panel up and running.

### Step 1: Install MongoDB

#### Option A: Local MongoDB
Download and install from: https://www.mongodb.com/try/download/community

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

### Step 2: Setup Backend

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

You should see: `Server running on port 3000` and `MongoDB connected`

### Step 3: Setup Admin Panel

Open a new terminal window:

```powershell
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Start the admin panel
npm run dev
```

The admin panel will open at: http://localhost:5174

### Step 4: Login and Explore

#### Admin Login
1. Click "Admin" on the login selection screen
2. Use credentials:
   - Username: `admin`
   - Password: `admin123`

#### Kitchen Login
1. Click "Kitchen / Cook" on the login selection screen
2. Use credentials:
   - Username: `kitchen1`
   - Password: `kitchen123`

## 🎨 What You'll See

### Admin Panel Features
1. **Dashboard** - View analytics, revenue, and order statistics
2. **Menu Management** - Add, edit, or remove menu items
3. **Inventory** - Track stock levels with low-stock alerts
4. **Kitchen Staff** - Manage kitchen user accounts

### Kitchen Panel Features
1. **Preparing Column** - New orders waiting to be prepared
2. **Prepared Column** - Orders ready for delivery
3. **Delivered Column** - Completed orders

## 🧪 Testing the System

### Create a Test Order (Using Backend API)

You can create a test order using this PowerShell command:

```powershell
$body = @{
    tableNumber = 5
    customerPhone = "+1234567890"
    items = @(
        @{
            menuItemId = "GET_FROM_MENU_API"
            name = "Margherita Pizza"
            quantity = 2
            specialInstructions = "Extra cheese"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Post -Body $body -ContentType "application/json"
```

Or use the customer app (if you've set it up).

### Watch Real-time Updates

1. Open Admin Panel in one browser window
2. Open Kitchen Panel in another browser window
3. Create an order using the customer app or API
4. Watch as the order appears in both panels instantly!

## 📱 Connect Customer App

To complete the full system:

1. Setup the customer app (in the `customer` folder)
2. Customers scan QR code → Visit menu → Place orders
3. Orders appear in kitchen panel automatically
4. Kitchen staff updates order status
5. Customer receives WhatsApp notifications

## 🔧 Troubleshooting

### Backend won't start?
- Make sure MongoDB is running
- Check if port 3000 is available
- Verify `.env` file exists with correct values

### Admin panel won't load?
- Check if backend is running (http://localhost:3000/api/health)
- Make sure port 5174 is available
- Clear browser cache

### Can't login?
- Make sure you ran `npm run seed` in the backend
- Check admin credentials in `backend/.env`
- Check browser console for errors

## 🎓 Next Steps

1. **Customize Menu**: Add your restaurant's actual menu items
2. **Change Credentials**: Update admin password in `.env`
3. **Configure WhatsApp**: Add WhatsApp API credentials for notifications
4. **Deploy**: Deploy to production (Vercel, Heroku, etc.)

## 📚 Additional Resources

- [Full Documentation](./README.md)
- [API Reference](./admin/README.md)
- [Deployment Guide](coming soon)

## 💡 Tips

- Keep the backend running while testing
- Use Chrome DevTools to inspect network requests
- Check browser console for any errors
- Monitor MongoDB with MongoDB Compass

## 🆘 Need Help?

- Check the README files in each folder
- Review the code comments
- Open an issue on GitHub
- Check the troubleshooting section above

---

**Happy Coding! 🚀**
