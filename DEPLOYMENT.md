# Deployment notes

## Backend
Use a Node service.

Build/install:
```bash
npm install
```

Start:
```bash
npm start
```

Required environment variables:
```env
MONGO_URL=mongodb+srv://...
CLOUDINARY_URL=...
JWT_SECRET=...
CLIENT_URL=https://your-frontend.example.com
PORT=8000
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

Razorpay webhook:
```text
https://your-backend.example.com/api/payments/webhook
```

## Frontend
Build:
```bash
npm install && npm run build
```

For a separate deployed API:
```env
VITE_API_URL=https://your-backend.example.com/api
```
