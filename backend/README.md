# Python Backend (FastAPI)

A lightweight FastAPI backend with built-in CORS configuration, `/health` endpoint, and in-memory mock database.

## Local Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a virtual environment & activate it**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   uvicorn main:app --reload --port 8001
   ```
   Or run directly:
   ```bash
   python3 main.py
   ```

5. **Verify**:
   - API Welcome: [http://localhost:8001](http://localhost:8001)
   - Health Check: [http://localhost:8001/health](http://localhost:8001/health)
   - Interactive Swagger Docs: [http://localhost:8001/docs](http://localhost:8001/docs)
   - Items API: [http://localhost:8001/api/items](http://localhost:8001/api/items)

> **Note on Port 8001**: Port 8001 is used by default because port 8000 is often reserved by local Docker containers (like Portainer). You can override this anytime with the `PORT` environment variable.

## Deploying to Cloud Platforms (Render, Railway, Fly.io, etc.)

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `PORT`: Usually injected automatically by platforms like Render/Railway.
  - `ALLOWED_ORIGINS`: Set to your deployed frontend domain (e.g. `https://my-frontend.vercel.app`) or `*`.
