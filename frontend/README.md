# Frontend

```bash
npm install
npm run dev
```

The Vite server proxies `/api` to `http://localhost:8000`.

State architecture:
- Redux Toolkit: auth + UI state
- RTK Query: API server state/cache
- Framer Motion: page/card/modal/table animations
