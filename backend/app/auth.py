from fastapi import Depends, HTTPException, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from app.database.connection import supabase


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

security = HTTPBearer()


# --------------------------------------------------
# LOGIN SCHEMA
# --------------------------------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@router.post("/login")
def login(data: LoginRequest):

    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })

        if not response.session:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "user_id": str(response.user.id),
            "email": response.user.email
        }

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )


# --------------------------------------------------
# GET CURRENT USER DEPENDENCY
# --------------------------------------------------

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        response = supabase.auth.get_user(token)

        if not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        return response.user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token"
        )


# --------------------------------------------------
# GET CURRENT USER
# --------------------------------------------------

@router.get("/me")
def get_me(user=Depends(get_current_user)):

    return {
        "authenticated": True,
        "user_id": str(user.id),
        "email": user.email
    }