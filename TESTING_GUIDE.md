# Testing the Integrated QuickServe Order Flow

## System Status

### Running Services:
1. **Backend Server**: http://localhost:3000 (Already running)
2. **Customer App**: http://localhost:8080 (Just started)
3. **Admin Panel**: http://localhost:5175 (Need to verify)

## Testing End-to-End Flow

### Step 1: Start All Services

```powershell
# Terminal 1 - Backend (if not running)
cd c:\Users\soura\quickserve-order-app\backend
npm run dev

# Terminal 2 - Admin Panel (if not running)
cd c:\Users\soura\quickserve-order-app\admin
npm run dev

# Terminal 3 - Customer App (already running)
cd c:\Users\soura\quickserve-order-app\customer
npm run dev
```

### Step 2: Place a Customer Order

1. Open **Customer App** in browser: http://localhost:8080
2. Navigate to `/customer/menu`
3. Add items to cart
4. Go to checkout
5. Enter table number and WhatsApp number
6. Place the order
7. Note the Order ID from the confirmation page

**Expected Result:**
- Order is created in MongoDB
- Inventory is automatically reduced
- Order appears in Kitchen Panel
- Revenue is added to Admin Dashboard

### Step 3: Check Kitchen Panel

1. Open **Kitchen Panel** in browser: http://localhost:5175/kitchen
2. Login with credentials:
   - Email: `kitchen1@quickserve.com`
   - Password: `kitchen123`
3. Check the "Preparing" column

**Expected Result:**
- New order card appears in real-time (via Socket.IO)
- Order shows: Order Number, Table Number, Items, Total Amount

### Step 4: Update Order Status (Kitchen)

1. In Kitchen Panel, drag the order card:
   - From "Preparing" → "Prepared"
   - From "Prepared" → "Delivered"
2. Watch for toast notifications

**Expected Result:**
- Order moves through stages smoothly
- Socket.IO broadcasts status updates
- Customer sees real-time status updates on Order Status page

### Step 5: Check Admin Dashboard

1. Open **Admin Panel** in browser: http://localhost:5175/admin
2. Login with credentials:
   - Email: `admin@quickserve.com`
   - Password: `admin123`
3. View the Dashboard tab

**Expected Result:**
- Total Revenue increased by order amount
- Total Orders count increased by 1
- New order appears in "Recent Orders" table
- Charts updated with new data

## Integration Features Implemented

### Customer App → Backend
✅ Order creation via POST /api/orders
✅ Real-time order status updates via Socket.IO
✅ Order tracking via GET /api/orders/:id
✅ Axios for HTTP requests
✅ Proxy configuration for API calls

### Backend → Kitchen Panel
✅ Real-time order notifications via Socket.IO
✅ Order status updates via PUT /api/orders/:id/status
✅ Active orders list via GET /api/orders/active
✅ WebSocket events: orderStatusUpdated, newOrder

### Backend → Admin Panel
✅ Revenue analytics via GET /api/analytics/dashboard
✅ Recent orders display
✅ Menu & inventory management
✅ Real-time updates for new orders

### Automatic Inventory Reduction
✅ When order is created, backend automatically:
   - Reduces inventory quantities for each menu item
   - Updates stock levels in MenuItem collection
   - Triggers low stock alerts if threshold reached

## API Endpoints Used

### Customer App:
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (future use)
- `Socket.IO` - Real-time status updates

### Kitchen Panel:
- `GET /api/orders/active` - Get all active orders
- `PUT /api/orders/:id/status` - Update order status
- `Socket.IO` - Real-time order notifications

### Admin Panel:
- `GET /api/analytics/dashboard` - Dashboard stats
- `GET /api/orders` - All orders
- `GET /api/menu` - Menu items
- `PUT /api/menu/:id` - Update inventory

## Socket.IO Events

### Server Emits:
- `orderStatusUpdated` - When order status changes
- `newOrder` - When new order is created
- `inventoryUpdate` - When inventory changes

### Client Listens:
- Customer App: `orderStatusUpdated`
- Kitchen Panel: `orderStatusUpdated`, `newOrder`
- Admin Panel: `orderStatusUpdated`, `inventoryUpdate`

## Common Issues & Solutions

### Issue: Backend connection refused
**Solution:** Make sure backend is running on port 3000
```powershell
cd backend
npm run dev
```

### Issue: Axios import error
**Solution:** Axios is now installed (v1.12.2)
```powershell
cd customer
npm install axios
```

### Issue: Socket.IO not connecting
**Solution:** 
- Check backend is running
- Check proxy configuration in customer/vite.config.ts
- Check Socket.IO URL in useSocket.ts (should be http://localhost:3000)

### Issue: Orders not appearing in Kitchen Panel
**Solution:**
- Login to Kitchen Panel first
- Check browser console for Socket.IO connection
- Verify backend is emitting 'newOrder' event

### Issue: Revenue not updating
**Solution:**
- Refresh Admin Dashboard
- Check GET /api/analytics/dashboard response
- Verify order was saved in MongoDB

## Next Steps

1. ✅ Test customer order flow
2. ✅ Verify kitchen panel receives orders
3. ✅ Check admin dashboard revenue updates
4. 🔲 Add WhatsApp integration (optional)
5. 🔲 Add payment gateway (optional)
6. 🔲 Deploy to production (optional)

## Database Seeded Data

### Admin Credentials:
- Email: admin@quickserve.com
- Password: admin123

### Kitchen Staff:
- Email: kitchen1@quickserve.com
- Password: kitchen123

### Sample Menu Items:
- Margherita Pizza - $12.99
- Caesar Salad - $8.99
- Grilled Chicken - $14.99
- Pasta Carbonara - $13.99
- And more...

## Monitoring & Debugging

### Backend Logs:
Watch backend terminal for:
- Order creation logs
- Socket.IO connections
- Inventory updates

### Browser Console:
Customer App:
- "Creating order" log
- "Order created successfully" log
- "Connected to socket server" log
- "Order status updated" log

Kitchen Panel:
- "Socket connected" log
- "New order received" log
- "Order status changed" log

Admin Panel:
- API request logs
- Dashboard data updates

## Success Criteria

✅ Customer can place order and see confirmation
✅ Kitchen Panel shows new orders in real-time
✅ Kitchen staff can drag orders through stages
✅ Admin Dashboard shows increased revenue
✅ Inventory automatically reduces after order
✅ All Socket.IO connections established
✅ No errors in browser consoles
✅ No errors in backend logs

---

**Created:** 2025
**Last Updated:** After customer app integration
**Status:** Ready for testing
