# QuickSeva — Backend ⚙️

Node.js + Express + MongoDB backend for **QuickSeva**, a doorstep service booking platform for Nagercoil, Tamil Nadu. Handles OTP-based authentication, order creation and tracking, and admin order management.

**Live API:** https://quickseva-backend.onrender.com
**Frontend Repo / Site:** https://quickseva-frontend.vercel.app

---

## ✨ What This Backend Does

- 🔐 Generates and verifies OTPs for passwordless phone-number login
- 🪪 Issues JWTs containing the user's `id` and `role` on successful login
- 📝 Creates orders (with optional file uploads) tied to the logged-in user
- 📦 Lets customers fetch their own order history
- 📊 Lets admins fetch **all** orders and update order status
- 🔒 Protects routes via JWT auth middleware and an admin-only role check

---

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- Multer (file/document uploads)
- CORS, dotenv

---

## 📁 Project Structure

```
quickseva-backend/
└── src/
    ├── config/
    ├── controllers/
    │   ├── authController.js      # sendOTP, verifyOTP
    │   ├── orderController.js     # createOrder, getMyOrders, getAllOrders, updateOrderStatus
    │   └── adminController.js     # (legacy/duplicate — not currently wired into routes)
    ├── middleware/
    │   ├── authMiddleware.js      # verifies JWT, attaches req.user
    │   ├── adminMiddleware.js     # checks req.user.role === "admin"
    │   └── uploadMiddleware.js    # Multer config for document uploads
    ├── models/
    │   ├── User.js                # name, phone, role, otp, otpExpiry
    │   └── Order.js                # order details + status
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── orderRoutes.js         # includes admin-only order routes (/all, /:id/status)
    │   ├── adminRoutes.js         # (legacy — currently unused by the frontend)
    │   └── uploadRoutes.js
    ├── uploads/                    # uploaded documents (multer destination)
    ├── .env                        # not committed — see below
    └── server.js                   # app entry point, route mounting
```

---

## 🔌 API Reference

Base URL (production): `https://quickseva-backend.onrender.com/api`

### Auth — `/api/auth`

| Method | Route | Body | Description | Auth |
|--------|-------|------|-------------|------|
| POST | `/send-otp` | `{ phone }` | Generates a 6-digit OTP, stores it on the user document (upserted by phone) with a 5-minute expiry | No |
| POST | `/verify-otp` | `{ phone, otp, name }` | Verifies the OTP, creates the user if new, returns `{ token, user }` | No |

### Orders — `/api/orders`

| Method | Route | Body | Description | Auth |
|--------|-------|------|-------------|------|
| POST | `/` | `multipart/form-data`: `serviceId, serviceName, name, phone, delivery, address, notes, amount, file` | Creates a new order for the logged-in user | Yes |
| GET | `/my-orders` | — | Returns orders placed by the logged-in user, newest first | Yes |
| GET | `/all` | — | Returns **all** orders across all users, with populated `user` name/phone, newest first | Yes (admin) |
| PUT | `/:id/status` | `{ status }` | Updates an order's status | Yes (admin) |

**Auth header:**
```
Authorization: Bearer <jwt_token>
```

---

## 🗄️ Data Models

### `User`
```js
{
  name: String,          // required
  phone: String,         // required, unique
  role: "user" | "admin" // default: "user"
  otp: String,
  otpExpiry: Date,
  timestamps: true        // createdAt, updatedAt
}
```

### `Order`
```js
{
  user: ObjectId,          // ref: User
  serviceId: String,
  serviceName: String,
  name: String,
  phone: String,
  delivery: "pickup" | "doorstep",
  address: String,
  notes: String,
  amount: Number,
  status: "pending" | "processing" | "completed" | "cancelled", // default: "pending"
  file: [String],          // uploaded filenames
  timestamps: true
}
```

---

## 🔑 Authentication & Authorization

1. **`POST /auth/send-otp`** — generates a 6-digit OTP and upserts it (with a 5-minute expiry) onto the `User` document matching the given phone number. In development, the OTP is returned in the response for convenience — **remove this before going to production** and wire up a real SMS provider (Twilio, MSG91, etc.).

2. **`POST /auth/verify-otp`** — looks up the user by phone, checks the OTP matches and hasn't expired, clears the OTP fields, and signs a JWT:
   ```js
   jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })
   ```

3. **`authMiddleware`** — reads the `Authorization: Bearer <token>` header, verifies it, and attaches the decoded payload (`{ id, role }`) to `req.user`.

4. **`adminMiddleware`** — runs after `authMiddleware`; returns `403 Access Denied` unless `req.user.role === "admin"`.

To promote a user to admin, update their `role` field to `"admin"` directly in the MongoDB `users` collection (via MongoDB Atlas or Compass) — there is currently no in-app UI for this.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB connection string (MongoDB Atlas recommended)

### Setup
```bash
git clone <this-repo-url>
cd quickseva-backend
npm install
```

Create a `.env` file in the project root:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Run the server:
```bash
node src/server.js (or) npm run dev
```

The server starts on `http://localhost:5000` (or your configured `PORT`) and connects to MongoDB on startup, logging `MongoDB Connected` and `server running on <port>` when successful.

---

## 🌐 Deployment (Render)

Deployed on Render's free tier. Environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) are configured in the Render dashboard, **not** committed to the repo.

⚠️ **Free tier cold starts:** Render's free plan spins the server down after a period of inactivity. The first request after idling can take 20–50 seconds to respond while the server wakes up. This can make OTP sending or order status updates feel slow/stuck on the first request of a session — it's expected behavior on the free tier, not a bug.

---

## 📌 Known Limitations / Roadmap

- OTP delivery is simulated (returned directly in the API response) — no real SMS integration yet
- `adminController.js` / `adminRoutes.js` exist but are **not currently used** by the frontend; all admin order operations go through `orderRoutes.js` (`/orders/all`, `/orders/:id/status`) with `authMiddleware` + `adminMiddleware` applied there instead. These can be removed or repurposed for future admin-only features (e.g. user management).
- No automated tests yet
- No rate limiting on `/send-otp` (a bad actor could spam OTP requests) — worth adding before a real production launch
- CORS is currently open (`cors()` with no config) — consider restricting to the known frontend origin in production

---

## 🔗 Related

- Frontend repository: see the QuickSeva frontend README for pages, routing, and UI details