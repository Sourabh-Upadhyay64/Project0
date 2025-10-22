# QuickServe Restaurant Management System

A complete QR-based restaurant ordering system with separate customer, admin, and kitchen panels.

## 📁 Project Structure

```
quickserve-order-app/
├── customer/          # Customer-facing QR ordering app
├── admin/             # Admin panel for management
└── backend/           # Backend API server
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

#### 1. Backend Setup
```powershell
cd backend
npm install
# Configure .env file with your MongoDB URI
npm run dev
```

#### 2. Admin Panel Setup
```powershell
cd admin
npm install
npm run dev
```

#### 3. Customer App Setup
```powershell
cd customer
npm install
npm run dev
```

## 🌐 Access Points

- **Customer App**: http://localhost:5173
- **Admin Panel**: http://localhost:5174
- **Backend API**: http://localhost:3000

## 📖 Documentation

- [Admin Panel Documentation](./admin/README.md)
- [Backend API Documentation](./backend/README.md)
- Customer App Documentation (see customer/README.md)

## 🔑 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

## 🎯 Key Features

### Customer App
- QR code table-based ordering
- Browse menu by categories
- Add items to cart
- Real-time order status tracking
- WhatsApp notifications

### Admin Panel
- Revenue and order analytics
- Menu and inventory management
- Kitchen staff management
- Visual charts and reports

### Kitchen Panel
- Three-stage order workflow (Preparing → Prepared → Delivered)
- Drag-and-drop order management
- Real-time order notifications
- Late order alerts

## 🔧 Technologies

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT
- **Charts**: Recharts
- **Notifications**: Sonner, WhatsApp API

## 📝 License

MIT

## 👤 Author

Your Name / Organization
