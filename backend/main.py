import os
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Deployment Practice API",
    description="A lightweight sample backend for testing local and cloud deployments",
    version="1.0.0",
)

# Configure CORS - allows frontend on any port/domain to connect
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if origins_env == "*":
    origins = ["*"]
    allow_credentials = False
else:
    origins = [orig.strip() for orig in origins_env.split(",") if orig.strip()]
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic schemas
class ItemCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default="", max_length=255)

class Item(BaseModel):
    id: int
    title: str
    description: str
    completed: bool
    created_at: str

# In-Memory Mock Database
mock_db: List[dict] = [
    {
        "id": 1,
        "title": "Configure backend environment variables",
        "description": "Ensure PORT and ALLOWED_ORIGINS are set correctly",
        "completed": True,
        "created_at": "2026-10-11T12:00:00Z",
    },
    {
        "id": 2,
        "title": "Verify /health endpoint",
        "description": "Check if healthcheck responds with HTTP 200 OK",
        "completed": True,
        "created_at": "2026-10-11T12:05:00Z",
    },
    {
        "id": 3,
        "title": "Configure frontend VITE_API_URL",
        "description": "Point the frontend to the deployed backend URL",
        "completed": False,
        "created_at": "2026-10-11T12:10:00Z",
    },
    {
        "id": 4,
        "title": "Deploy frontend to Vercel or Netlify",
        "description": "Build static assets and publish client app",
        "completed": False,
        "created_at": "2026-10-11T12:15:00Z",
    },
    {
        "id": 5,
        "title": "Verify end-to-end integration",
        "description": "Ensure browser requests successfully reach the backend API",
        "completed": False,
        "created_at": "2026-10-11T12:20:00Z",
    },
]
current_id_counter = 5

@app.get("/")
def read_root():
    """Welcome endpoint providing basic API information."""
    return {
        "service": "deployment-practice-backend",
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "health": "/health",
            "items": "/api/items"
        }
    }

@app.get("/health")
def health_check():
    """Health check endpoint used by deployment platforms and frontend monitoring."""
    return {
        "status": "healthy",
        "service": "deployment-practice-backend",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "environment": os.getenv("ENVIRONMENT", "development"),
        "cors_origins": origins,
    }

@app.get("/api/items", response_model=List[Item])
def get_items():
    """Fetch all items from the mock database."""
    return mock_db

@app.post("/api/items", response_model=Item, status_code=201)
def create_item(payload: ItemCreate):
    """Create a new item in the mock database."""
    global current_id_counter
    current_id_counter += 1
    new_item = {
        "id": current_id_counter,
        "title": payload.title.strip(),
        "description": payload.description.strip() if payload.description else "",
        "completed": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    mock_db.append(new_item)
    return new_item

@app.patch("/api/items/{item_id}/toggle", response_model=Item)
def toggle_item(item_id: int):
    """Toggle completed status of an item."""
    for item in mock_db:
        if item["id"] == item_id:
            item["completed"] = not item["completed"]
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/api/items/{item_id}", status_code=200)
def delete_item(item_id: int):
    """Delete an item from the mock database."""
    for index, item in enumerate(mock_db):
        if item["id"] == item_id:
            removed = mock_db.pop(index)
            return {"message": f"Item '{removed['title']}' deleted successfully", "id": item_id}
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
