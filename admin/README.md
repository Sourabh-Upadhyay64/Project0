# QuickServe Admin Panel

Complete admin and kitchen management system for the QuickServe restaurant ordering application.

## 🚀 Features

### 1. **Authentication Flow**
- **Login Selection Screen**: Choose between Admin or Kitchen/Cook login
- **Admin Login**: Full access to dashboard, analytics, menu, and user management
- **Kitchen Login**: Access to order management and preparation tracking

### 2. **Admin Panel Features**

#### Dashboard (Analytics)
- **Revenue Analytics**: Today, last 7 days, last 30 days
- **Order Analytics**: Total, completed, in-progress, cancelled orders
- **Popular Items**: Most ordered dishes with revenue breakdown
- **Visual Charts**: Revenue trends and order status distribution using Recharts

#### Menu & Inventory Management
- Add/Edit/Remove menu items
- Real-time inventory tracking
- Automatic stock reduction on orders
- Low-stock alerts (configurable thresholds)
- Toggle item availability (show/hide items)
- Bulk inventory updates (+10, +50 buttons)

#### Kitchen/Cook Management
- Add/Remove/Edit kitchen staff credentials
- Assign roles (Kitchen Staff or Cook)
- View active/online staff members
- Track last active timestamps

### 3. **Kitchen/Cook Panel Features**

#### Single Screen Interface
Three columns for order management:
- **Preparing / In Queue**: New orders waiting to be prepared
- **Prepared / Ready**: Orders ready for delivery
- **Delivered / Out**: Completed orders

#### Drag & Drop Support
- Move orders between stages by dragging
- Quick action buttons for status updates
- Real-time order notifications

#### Features
- Sound alerts for new orders
- Late order highlighting (>15 minutes)
- Order details with special instructions
- Live order count and status updates

### 4. **Real-time Updates**
- WebSocket integration using Socket.IO
- Instant updates across all connected devices
- New order notifications
- Status change broadcasts
- WhatsApp notifications to customers

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── MenuManagement.tsx
│   │   │   ├── InventoryManagement.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── kitchen/
│   │   │   └── OrderColumn.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useSocket.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── LoginSelection.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── KitchenLogin.tsx
│   │   ├── AdminHome.tsx
│   │   └── KitchenHome.tsx
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts

backend/
├── models/
│   ├── User.js
│   ├── MenuItem.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── menu.js
│   ├── orders.js
│   ├── users.js
│   └── analytics.js
├── .env
├── server.js
└── package.json
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend folder:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Update `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/quickserve
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. Start MongoDB (if running locally):
```powershell
# Make sure MongoDB is running on your system
```

5. Start the backend server:
```powershell
npm run dev
```

The backend will run on `http://localhost:3000`

### Admin Panel Setup

1. Navigate to the admin folder:
```powershell
cd admin
```

2. Install dependencies:
```powershell
npm install
```

3. Start the development server:
```powershell
npm run dev
```

The admin panel will run on `http://localhost:5174`

## 🔐 Default Credentials

### Admin Login
- **Username**: `admin`
- **Password**: `admin123`

### Kitchen Staff
Create kitchen users through the Admin Panel → Kitchen Staff Management

## 🎯 Usage Workflow

### For Admin:
1. Visit `http://localhost:5174`
2. Click "Admin" on the login selection screen
3. Login with admin credentials
4. Access:
   - **Dashboard**: View analytics and insights
   - **Menu Management**: Add/edit menu items
   - **Inventory**: Track and update stock levels
   - **Kitchen Staff**: Manage kitchen user accounts

### For Kitchen Staff:
1. Visit `http://localhost:5174`
2. Click "Kitchen / Cook" on the login selection screen
3. Login with assigned credentials
4. Manage orders through three stages:
   - Start Preparing → moves to "Preparing"
   - Mark Prepared → moves to "Prepared"
   - Mark Delivered → moves to "Delivered"

## 🔄 Order Flow

1. Customer places order via QR system (customer app)
2. Order appears in Kitchen Panel's "Preparing" column
3. Kitchen staff receives notification (sound + visual)
4. Kitchen moves order through stages
5. Customer receives WhatsApp updates on status changes
6. Admin can monitor all orders in real-time

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Login (admin/kitchen)
- `POST /api/auth/logout` - Logout

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item
- `PUT /api/menu/:id` - Update menu item
- `PUT /api/menu/:id/inventory` - Update inventory
- `DELETE /api/menu/:id` - Delete menu item

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/active` - Get active orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id/status` - Update order status

### Users
- `GET /api/users/kitchen` - Get kitchen staff
- `POST /api/users/kitchen` - Create kitchen user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics
- `GET /api/analytics?period=today|7days|30days` - Get analytics data

## 🔌 WebSocket Events

### Client → Server
- Connection with JWT token authentication

### Server → Client
- `new-order` - New order created
- `order-updated` - Order status changed

## 🎨 Technologies Used

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router DOM
- Recharts (Charts)
- @dnd-kit (Drag & Drop)
- Socket.IO Client
- Axios
- Sonner (Toasts)
- Lucide React (Icons)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication
- bcryptjs (Password hashing)

## 🚧 Future Enhancements

- Role-based permissions
- Order history and reports
- Export analytics to PDF/Excel
- Multi-language support
- Dark mode
- Mobile app for kitchen staff
- Push notifications
- Email notifications
- Advanced reporting

## 📝 License

MIT

## 👥 Support

For issues or questions, please create an issue in the repository.
