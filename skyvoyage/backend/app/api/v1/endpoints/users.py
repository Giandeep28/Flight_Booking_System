from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserInDB, UserBase
from app.database.mongodb import get_database
from app.core.security import get_current_user
from bson import ObjectId

router = APIRouter()

@router.get("/me")
async def get_me(current_user: str = Depends(get_current_user)):
    db = get_database()
    user = await db.users.find_one({"username": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return user data without hashed password
    return {
        "username": user["username"],
        "email": user["email"],
        "full_name": user.get("full_name"),
        "phone": user.get("phone")
    }

@router.put("/me")
async def update_me(user_update: UserBase, current_user: str = Depends(get_current_user)):
    db = get_database()
    result = await db.users.update_one(
        {"username": current_user},
        {"$set": user_update.dict(exclude_unset=True)}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Update failed")
    return {"message": "Profile updated successfully"}
