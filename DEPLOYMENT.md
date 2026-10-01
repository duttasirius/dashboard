# Deployment notes

## Backend

Use a Node service (Render, Railway, Fly.io, VPS, etc.). Start command:

```bash
npm install && npm start
```

Required environment variables:

```env
MONGO_URI=mongodb+srv://sagnikdutta1999_db_user:XeJF3lx1EKgMJbun@cluster0.2egh4dm.mongodb.net/chat
CLOUDINARY_URL=...
JWT_SECRET=...
CLIENT_URL=https://your-frontend.example.com
PORT=8000
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Configure the Razorpay webhook URL as:

```text
https://your-backend.example.com/api/payments/webhook
```

## Frontend

Build command:

```bash
npm install && npm run build
```

When frontend and backend are deployed on separate domains, set:

```env
VITE_API_URL=https://your-backend.example.com/api
```

The app also works locally without this variable because Vite proxies `/api` to port 8000.
