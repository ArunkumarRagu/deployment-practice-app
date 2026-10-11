# Fullstack Deployment Practice App 🚀

A minimal, production-ready sample project featuring a **React (Vite)** frontend and a **Python (FastAPI)** backend with an in-memory mock database.

This project is specifically structured to practice deploying fullstack applications to cloud platforms (Vercel, Netlify, Render, Railway, Fly.io, AWS EC2, etc.) without requiring Docker or an external remote database.

---

## Project Structure

```text
deployment-practice-app/
├── backend/
│   ├── main.py            # FastAPI app (CORS, health check, mock database CRUD)
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Example environment variables (PORT, ALLOWED_ORIGINS)
│   └── README.md          # Backend-specific instructions
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Live health status + mock DB checklist UI
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Modern dark/light responsive styling
│   ├── package.json       # React & Vite dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── .env               # Local environment config
│   ├── .env.example       # Example environment config (VITE_API_URL)
│   └── README.md          # Frontend-specific instructions
└── README.md              # Main guide (this file)
```

---

## Quickstart: Running Locally

### 1. Start the Backend (Terminal 1)

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server on port 8001
uvicorn main:app --reload --port 8001
```
- API Health check: [http://localhost:8001/health](http://localhost:8001/health)
- Interactive API Docs: [http://localhost:8001/docs](http://localhost:8001/docs)

*(Note: We use port 8001 by default to prevent conflicts with local container tools like Portainer).*

### 2. Start the Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- App UI: [http://localhost:5173](http://localhost:5173)

When both are running, the frontend will display a **🟢 Backend: Connected** badge and show your mock tasks!

---

## How to Practice Deployment

### Recommended Practice Workflow:
1. **Deploy Backend first**:
   - Push your code to GitHub.
   - Choose a platform like **Render**, **Railway**, or **Fly.io**.
   - Set Root Directory to `backend`.
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Copy your deployed backend URL (e.g. `https://my-backend.onrender.com`).
   - Test in your browser: `https://my-backend.onrender.com/health` should return `{"status": "healthy"}`.

2. **Deploy Frontend second**:
   - Choose a platform like **Vercel**, **Netlify**, or **Cloudflare Pages**.
   - Set Root Directory to `frontend`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable:
     - Key: `VITE_API_URL`
     - Value: `https://my-backend.onrender.com` (your live backend URL, no trailing slash).
   - Click Deploy!

3. **Verify Connection**:
   - Open your deployed frontend URL.
   - Check if the badge shows **🟢 Backend: Connected**.
   - Add and check off items in the checklist.

---

## Deployment Gotchas & Tips

| Gotcha | Why it happens | How to solve |
|---|---|---|
| **CORS Error** | Browser blocks cross-origin requests from frontend domain to backend domain. | Set `ALLOWED_ORIGINS` in backend to include your frontend URL (or `*`). |
| **Port Binding Error** | Cloud platforms dynamically assign a port via `$PORT`. | `main.py` uses `os.getenv("PORT", 8001)` and binds to `0.0.0.0`. |
| **404 on API calls in production** | Frontend still pointing to `http://localhost:8001`. | Set `VITE_API_URL` in your frontend hosting dashboard and trigger a rebuild. |
| **Trailing Slash Mismatch** | Double slashes like `https://api.com//api/items`. | `App.jsx` automatically strips trailing slashes from `VITE_API_URL`. |
