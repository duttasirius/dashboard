# MERN ERP Pro — Redux + Framer Motion + Razorpay

A full-stack ERP-style dashboard for employees, salary checkout, students, schools and courses.

## Stack
- React + Vite
- Tailwind CSS
- Redux Toolkit + RTK Query
- Framer Motion
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- Razorpay Checkout
- Cloudinary-ready uploads

## Modules
- Employees: add, edit, delete, search and salary payment
- Payments: Razorpay order/verification + payment history
- Students: add, edit, delete, search
- Schools: admin add, edit, delete and search
- Courses: admin add, edit, delete and search

Products have been removed from the user-facing application.

## Local setup
Backend:
```bash
cd backend
npm install
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Backend environment
Create `backend/.env`:

```env
MONGO_URL=mongodb+srv://...
CLOUDINARY_URL=cloudinary://...
PORT=8000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_this
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

The backend accepts `MONGO_URL`, `MONGODB_URL`, or `MONGO_URI` for compatibility.

## Roles
- First registered user = admin
- Later registered users = staff
- Admin can manage all modules and make salary payments
- Managers can manage employees; staff is read-only

## Razorpay
The app uses Razorpay Checkout for salary-payment recording. Orders are created server-side and signatures are verified server-side. This is not a bank-to-employee payout service.

## Demo data
Run only against a development database:
```bash
cd backend
npm run seed
```


## Making your existing local account admin

The first account in a fresh database becomes admin. If your existing account currently shows Staff, you can promote that account locally with:

```bash
cd backend
npm install
npm run make-admin -- your-login-email@example.com
```

Then sign out and sign in again so the updated role is loaded. Admin users can add/edit/delete employees, students, schools and courses and can start salary payments.