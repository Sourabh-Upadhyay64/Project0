# QuickServe Deployment Configuration

## 🚀 Live Deployments

### Backend

**URL:** https://project0-f2hv.onrender.com/

- Platform: Render
- Framework: Node.js + Express
- Database: MongoDB Atlas

### Customer App

**URL:** https://project0-2upk.vercel.app/

- Platform: Vercel
- Framework: React + Vite
- Root Directory: `customer`

### Admin App

**URL:** https://project0-lac-ten.vercel.app/

- Platform: Vercel
- Framework: React + Vite
- Root Directory: `admin`

---

## Backend Environment Variables (Render)

Set these in your Render service dashboard:

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb+srv://sourabhupadhyay899_db_user:Z3GKfl65kYRuQtZt@quickserve.ftextdp.mongodb.net/quickserve?retryWrites=true&w=majority&appName=quickserve
JWT_SECRET=GB3OunhU9vJZZQ0WbuQ6OfUj9Axr2KD7
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
CUSTOMER_APP_URL=https://project0-2upk.vercel.app
SAVE_ORDERS=true
ALLOWED_ORIGINS=https://project0-2upk.vercel.app,https://project0-lac-ten.vercel.app
```

---

## Frontend Environment Variables (Vercel)

### Customer App (.env.production)

```env
VITE_API_URL=https://project0-f2hv.onrender.com
```

### Admin App (.env.production)

```env
VITE_API_URL=https://project0-f2hv.onrender.com
```

---

## How It Works

### Local Development

- Apps use Vite proxy to `localhost:3000`
- No environment variables needed
- CORS allows localhost origins

### Production

- Frontend apps point to Render backend via `VITE_API_URL`
- Backend accepts requests from Vercel URLs via `ALLOWED_ORIGINS`
- Socket.IO connects from Vercel to Render
- MongoDB Atlas accepts connections from Render IPs

---

## Deployment Workflow

### 1. Update Code

```bash
git add .
git commit -m "Your changes"
git push
```

### 2. Vercel Auto-Deploy

- Customer and Admin apps auto-deploy on push
- Environment variables persist across deployments

### 3. Render Auto-Deploy

- Backend auto-deploys on push
- Check logs for startup confirmation

### 4. Verify

- ✅ Customer app loads menu
- ✅ Can place orders
- ✅ Kitchen panel receives orders (Socket.IO)
- ✅ Admin dashboard shows analytics
- ✅ QR codes work with production URLs

---

## Security Checklist

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Rotate `JWT_SECRET` to strong random value
- [ ] Review MongoDB network access (Atlas IP whitelist)
- [ ] Enable rate limiting on API
- [ ] Set up error monitoring (Sentry)
- [ ] Configure backup strategy for MongoDB
- [ ] Review and rotate any exposed secrets

---

## Troubleshooting

### CORS Errors

**Problem:** Browser shows CORS error when making API requests

**Solution:**

- Verify `ALLOWED_ORIGINS` in Render includes both Vercel URLs
- Restart Render service after updating env vars
- Check browser console for exact origin being blocked

### Socket.IO Not Connecting

**Problem:** Kitchen panel doesn't receive real-time orders

**Solution:**

- Check browser console for WebSocket errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure Render service is not sleeping (upgrade to paid plan or keep alive)
- Check Render logs for socket connection attempts

### Orders Not Saving

**Problem:** Orders don't appear in kitchen or analytics

**Solution:**

- Verify `SAVE_ORDERS=true` in Render env vars
- Check MongoDB connection in Render logs
- Review MongoDB Atlas network access settings
- Check for errors in Render logs during order creation

### QR Codes Point to Wrong URL

**Problem:** Scanning QR code goes to localhost or wrong domain

**Solution:**

- Update `CUSTOMER_APP_URL` in Render to production URL
- Regenerate QR codes in Admin panel → Tables tab
- Or re-run seed script with updated env var

---

## Local Development Setup

```bash
# Backend
cd backend
npm install
node server.js

# Admin (separate terminal)
cd admin
npm install
npm run dev

# Customer (separate terminal)
cd customer
npm install
npm run dev
```

Access locally:

- Backend: http://localhost:3000
- Admin: http://localhost:5174
- Customer: http://localhost:8080

---

## Production URLs Quick Reference

| Service      | URL                                 | Platform |
| ------------ | ----------------------------------- | -------- |
| Backend API  | https://project0-f2hv.onrender.com  | Render   |
| Customer App | https://project0-2upk.vercel.app    | Vercel   |
| Admin Panel  | https://project0-lac-ten.vercel.app | Vercel   |

---

## Database

**MongoDB Atlas**

- Cluster: quickserve
- Database: quickserve
- Collections: users, menuitems, orders, tables

**Backup Recommendations:**

- Enable automated backups in Atlas
- Schedule daily snapshots
- Test restore procedure

---

## Monitoring

**Render:**

- View logs in Render dashboard
- Set up log drains to external service
- Monitor uptime and performance

**Vercel:**

- Check deployment logs
- Monitor build times
- Review analytics for traffic patterns

**MongoDB Atlas:**

- Monitor connection count
- Review slow queries
- Check storage usage
