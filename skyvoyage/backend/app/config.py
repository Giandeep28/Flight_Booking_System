import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "your_secret_key_here_minimum_32_chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 24 * 60
    
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "skyvoyage"
    
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")
    
    AMADEUS_CLIENT_ID: str = os.getenv("AMADEUS_CLIENT_ID", "placeholder")
    AMADEUS_CLIENT_SECRET: str = os.getenv("AMADEUS_CLIENT_SECRET", "placeholder")

    class Config:
        env_file = ".env"

settings = Settings()
