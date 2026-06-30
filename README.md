# QuickSeva 🏪

QuickSeva is a full-stack **MERN** web application that lets customers book doorstep services — PAN Card applications, Aadhar updates, Xerox/Printout requests, and more — directly from their homes in Chennai, Tamil Nadu.

## ✨ Features

- 📱 **OTP-based Login** — Secure phone number authentication with JWT
- 🛒 **Service Booking** — Browse categories, select a service, and book in 2 simple steps
- 📄 **Document Upload** — Attach supporting documents (JPG, PNG, PDF) during booking
- 📦 **Order Tracking** — Customers can view their order history and live status
- 🛠️ **Admin Dashboard** — Admins can view all orders and update their status (pending → processing → completed)
- 🔒 **Protected Routes** — Booking and order pages require login; guests are redirected automatically
- 🎨 **Responsive UI** — Built with React + Vite for a fast, modern experience

## 🧰 Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Multer (file uploads)

## 📂 Project Structure

```
QuickSeva Web/
├── quickseva-backend/
│   ├── src/
│   │   ├── controllers/   # Business logic (auth, orders, admin)
│   │   ├── middleware/    # Auth, admin, and upload middleware
│   │   ├── models/        # Mongoose schemas (User, Order)
│   │   ├── routes/        # Express routes
│   │   └── server.js
│   └── uploads/           # Uploaded documents (gitignored)
└── quickseva-frontend/
    └── src/
        ├── pages/          # Landing, Login, Home, Services, BookService, Orders, Profile, Admin
        ├── components/     # Navbar
        ├── data/           # Static services data
        └── api.js          # Axios instance with auth interceptor
```

## 🔑 Key Flows

**Booking flow:**
```
Landing Page → Book Now → (Login if needed) → Select Service → Fill Form → Confirm Order
```

**Auth flow:**
```
Enter Phone → Receive OTP → Verify → JWT token stored → Redirected to original destination
```

## 🚀 Getting Started

### Backend
```bash
cd quickseva-backend
npm install
npm run dev
```

Create a `.env` file in `quickseva-backend/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Frontend
```bash
cd quickseva-frontend
npm install
npm run dev
```

## 📌 Notes

- This is a learning/portfolio project built to practice full-stack MERN development, JWT authentication, and file uploads.
- Admin access requires a user with `role: "admin"` in the database.

---