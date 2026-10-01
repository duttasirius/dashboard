# MERN ERP Pro — Redux + Framer Motion + Razorpay

A full-stack ERP-style application for employees, salary payments, students, schools, courses and inventory.

## Stack

- Frontend: React, Vite, Tailwind CSS, Redux Toolkit, RTK Query, Framer Motion
- Backend: Node.js, Express 5, MongoDB, Mongoose, JWT, bcryptjs
- Payments: Razorpay Checkout with server-side order creation and signature verification
- Media: Cloudinary-ready upload endpoint

## Project structure

```text
mern-erp-razorpay/
├── backend/
└── frontend/
```

## Before running

Install Node.js 18+ (Node 20/22 recommended) and have access to MongoDB Atlas or a local MongoDB server.

Open `backend/.env` and set:

```env
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
```

The project has a safe local development JWT secret already present. Change it before production deployment.

For real Razorpay salary checkout, also set:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Never expose the Razorpay secret or webhook secret in frontend code.

## Run backend

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:8000`

Health check: `http://localhost:8000/api/health`

## Run frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

For local development, the Vite proxy sends `/api` requests to `http://localhost:8000`.

## First account

The first registered user becomes `admin`. Later registrations become `staff`. The admin can manage schools, courses, students and salary payments; managers can manage employees/products.

## Demo data

After MongoDB is connected:

```bash
cd backend
npm run seed
```

The seed inserts example schools, courses, students, employees and products. It clears those five collections first, so use it only on a development database.

## Razorpay salary flow

```text
Employee
  -> Pay Salary
  -> backend creates Razorpay order
  -> Razorpay Checkout popup
  -> payment
  -> backend verifies Razorpay signature
  -> MongoDB payment record becomes paid
```

The application treats this as a Razorpay Checkout payment workflow. It does not implement a bank-to-employee payout product.

## API endpoints

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET/POST/PUT/DELETE /api/employees
GET/POST/PUT/DELETE /api/products
GET/POST/PUT/DELETE /api/schools
GET/POST/PUT/DELETE /api/courses
GET/POST/PUT/DELETE /api/students

POST /api/payments/create-order
POST /api/payments/verify
GET  /api/payments
GET  /api/payments/employee/:employeeId
POST /api/payments/webhook

GET /api/dashboard
POST /api/uploads/image
```
