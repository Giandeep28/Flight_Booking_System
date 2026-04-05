from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import UserCreate, UserInDB, Token
from app.database.mongodb import get_database
from app.core.security import verify_password, get_password_hash, create_access_token
from datetime import timedelta
import logging

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_in: UserCreate):
    db = get_database()
    user_exists = await db.users.find_one({"email": user_in.email})
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_db = {
        "email": user_in.email,
        "username": user_in.username,
        "full_name": user_in.full_name,
        "phone": user_in.phone,
        "hashed_password": get_password_hash(user_in.password),
        "is_active": True,
        "is_admin": False,
        "created_at": timedelta(days=0) # Placeholder
    }
    
    result = await db.users.insert_one(user_db)
    access_token = create_access_token(data={"sub": user_in.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = get_database()
    user = await db.users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["username"]})
    return {"access_token": access_token, "token_type": "bearer"}
