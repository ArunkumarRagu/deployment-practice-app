# React Frontend (Vite)

A fast, responsive React frontend designed to test and practice deployment with a live backend connection badge and mock database management.

## Local Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Ensure `.env` exists (copied from `.env.example`):
   ```env
   VITE_API_URL=http://localhost:8001
   ```

4. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Test a production build locally**:
   ```bash
   npm run build
   npm run preview
   ```

## Deploying to Cloud Platforms (Vercel, Netlify, Cloudflare Pages, etc.)

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Set to your deployed backend URL (e.g. `https://my-fastapi-backend.onrender.com` without trailing slash).

> **Important**: In Vite, variables starting with `VITE_` are baked into the static bundle at build time. Whenever you change `VITE_API_URL`, trigger a redeploy/rebuild.
