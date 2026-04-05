from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Wait, I should make sure the router exists before importing it
# But I can create the structure first.
from app.config import settings
from app.database.mongodb import connect_to_mongo, close_mongo_connection
# router import will happen later

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    logger.info("✓ MongoDB connected")
    yield
    await close_mongo_connection()
    logger.info("✓ MongoDB disconnected")

app = FastAPI(title="SkyVoyage API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder until I create the router
# from app.api.v1.router import router as v1_router
# app.include_router(v1_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
