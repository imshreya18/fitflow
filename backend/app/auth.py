from fastapi import (
    Depends,
    HTTPException,
    APIRouter,
)
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)
from pydantic import BaseModel

from app.database.connection import supabase


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)

security = HTTPBearer()


# ==================================================
# SCHEMAS
# ==================================================

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class PhoneSendRequest(BaseModel):
    phone: str


class PhoneVerifyRequest(BaseModel):
    phone: str
    token: str
    name: str = ""


class UpdateNameRequest(BaseModel):
    name: str


# ==================================================
# HELPER - GET USER NAME
# ==================================================

def get_user_name(user):
    """
    Get name from Supabase metadata.

    Supports:
    name
    full_name
    display_name
    """

    if not user:
        return None

    metadata = getattr(
        user,
        "user_metadata",
        None,
    ) or {}

    name = (
        metadata.get("name")
        or metadata.get("full_name")
        or metadata.get("display_name")
    )

    if name:
        return str(name).strip()

    return None


# ==================================================
# HELPER - EMAIL FALLBACK NAME
# ==================================================

def get_email_fallback_name(user):
    """
    If an old account has no stored name,
    use the part before @ as a temporary display name.

    Example:
    priyanshichouhan782@gmail.com
    ->
    Priyanshichouhan782
    """

    email = getattr(
        user,
        "email",
        None,
    )

    if not email:
        return "there"

    email = email.strip()

    if "@" not in email:
        return email

    username = email.split("@")[0]

    if not username:
        return "there"

    return username


# ==================================================
# GET BEST DISPLAY NAME
# ==================================================

def get_display_name(user):
    """
    Priority:

    1. name
    2. full_name
    3. display_name
    4. email username
    """

    metadata_name = get_user_name(user)

    if metadata_name:
        return metadata_name

    return get_email_fallback_name(user)


# ==================================================
# EMAIL SIGNUP
# ==================================================

@router.post("/signup")
def signup(data: SignupRequest):

    try:

        name = data.name.strip()
        email = data.email.strip().lower()

        # ------------------------------------------
        # VALIDATION
        # ------------------------------------------

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Name is required",
            )

        if not email:
            raise HTTPException(
                status_code=400,
                detail="Email is required",
            )

        if len(data.password) < 6:
            raise HTTPException(
                status_code=400,
                detail="Password must be at least 6 characters",
            )

        # ------------------------------------------
        # CREATE USER
        # ------------------------------------------

        response = supabase.auth.sign_up(
            {
                "email": email,
                "password": data.password,
                "options": {
                    "data": {
                        "name": name,
                        "full_name": name,
                        "display_name": name,
                    }
                },
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=400,
                detail="Unable to create account",
            )

        # ------------------------------------------
        # EMAIL CONFIRMATION REQUIRED
        # ------------------------------------------

        if not response.session:

            return {
                "success": True,
                "message": (
                    "Account created. "
                    "Please verify your email before logging in."
                ),
                "requires_confirmation": True,
                "user_id": str(
                    response.user.id
                ),
                "email": response.user.email,
                "name": name,
            }

        # ------------------------------------------
        # SESSION CREATED
        # ------------------------------------------

        return {
            "success": True,
            "message": "Account created successfully",
            "requires_confirmation": False,
            "access_token": (
                response.session.access_token
            ),
            "refresh_token": (
                response.session.refresh_token
            ),
            "user_id": str(
                response.user.id
            ),
            "email": response.user.email,
            "phone": getattr(
                response.user,
                "phone",
                None,
            ),
            "name": name,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Signup error:",
            repr(e),
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ==================================================
# EMAIL LOGIN
# ==================================================

@router.post("/login")
def login(data: LoginRequest):

    try:

        email = data.email.strip().lower()

        response = supabase.auth.sign_in_with_password(
            {
                "email": email,
                "password": data.password,
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password",
            )

        if not response.session:
            raise HTTPException(
                status_code=401,
                detail="Login session was not created",
            )

        # ------------------------------------------
        # GET NAME
        # ------------------------------------------

        name = get_display_name(
            response.user
        )

        return {
            "success": True,
            "message": "Login successful",
            "access_token": (
                response.session.access_token
            ),
            "refresh_token": (
                response.session.refresh_token
            ),
            "user_id": str(
                response.user.id
            ),
            "email": response.user.email,
            "phone": getattr(
                response.user,
                "phone",
                None,
            ),
            "name": name,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Login error:",
            repr(e),
        )

        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


# ==================================================
# SEND PHONE OTP
# ==================================================

@router.post("/phone/send")
def send_phone_otp(
    data: PhoneSendRequest,
):

    try:

        phone = data.phone.strip()

        if not phone:
            raise HTTPException(
                status_code=400,
                detail="Phone number is required",
            )

        supabase.auth.sign_in_with_otp(
            {
                "phone": phone,
            }
        )

        return {
            "success": True,
            "message": "OTP sent successfully",
            "phone": phone,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Phone OTP error:",
            repr(e),
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ==================================================
# VERIFY PHONE OTP
# ==================================================

@router.post("/phone/verify")
def verify_phone_otp(
    data: PhoneVerifyRequest,
):

    try:

        phone = data.phone.strip()
        token = data.token.strip()
        name = data.name.strip()

        if not phone:
            raise HTTPException(
                status_code=400,
                detail="Phone number is required",
            )

        if not token:
            raise HTTPException(
                status_code=400,
                detail="OTP is required",
            )

        # ------------------------------------------
        # VERIFY OTP
        # ------------------------------------------

        response = supabase.auth.verify_otp(
            {
                "phone": phone,
                "token": token,
                "type": "sms",
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid OTP",
            )

        if not response.session:
            raise HTTPException(
                status_code=401,
                detail="Phone authentication failed",
            )

        # ------------------------------------------
        # SAVE PHONE USER NAME
        # ------------------------------------------

        final_name = None

        if name:

            try:

                update_response = (
                    supabase.auth.update_user(
                        {
                            "data": {
                                "name": name,
                                "full_name": name,
                                "display_name": name,
                            }
                        }
                    )
                )

                updated_user = (
                    getattr(
                        update_response,
                        "user",
                        None,
                    )
                    or response.user
                )

                final_name = get_display_name(
                    updated_user
                )

            except Exception as e:

                print(
                    "Phone name update error:",
                    repr(e),
                )

                final_name = name

        else:

            final_name = get_display_name(
                response.user
            )

        return {
            "success": True,
            "message": (
                "Phone authentication successful"
            ),
            "access_token": (
                response.session.access_token
            ),
            "refresh_token": (
                response.session.refresh_token
            ),
            "user_id": str(
                response.user.id
            ),
            "email": getattr(
                response.user,
                "email",
                None,
            ),
            "phone": getattr(
                response.user,
                "phone",
                phone,
            ),
            "name": final_name,
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Phone verification error:",
            repr(e),
        )

        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


# ==================================================
# GOOGLE AUTH
# ==================================================

@router.get("/google")
def google_auth():

    try:

        response = supabase.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {
                    "redirect_to":
                        "http://localhost:5173/auth/callback",
                },
            }
        )

        return {
            "success": True,
            "url": response.url,
        }

    except Exception as e:

        print(
            "Google auth error:",
            repr(e),
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ==================================================
# UPDATE CURRENT USER NAME
# ==================================================

@router.put("/name")
def update_name(
    data: UpdateNameRequest,
    user=Depends(
        lambda credentials=Depends(security):
        get_current_user(credentials)
    ),
):

    try:

        name = data.name.strip()

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Name is required",
            )

        # ------------------------------------------
        # Update Supabase Auth Metadata
        # ------------------------------------------

        response = supabase.auth.update_user(
            {
                "data": {
                    "name": name,
                    "full_name": name,
                    "display_name": name,
                }
            }
        )

        if not response.user:
            raise HTTPException(
                status_code=400,
                detail="Unable to update name",
            )

        return {
            "success": True,
            "message": "Name updated successfully",
            "user_id": str(
                response.user.id
            ),
            "name": get_display_name(
                response.user
            ),
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Update name error:",
            repr(e),
        )

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ==================================================
# CURRENT USER DEPENDENCY
# ==================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
):

    token = credentials.credentials

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is required",
        )

    try:

        response = supabase.auth.get_user(
            token
        )

        if not response.user:

            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token",
            )

        return response.user

    except HTTPException:
        raise

    except Exception as e:

        print(
            "Auth verification error:",
            repr(e),
        )

        raise HTTPException(
            status_code=401,
            detail=(
                "Invalid or expired "
                "authentication token"
            ),
        )


# ==================================================
# CURRENT USER /ME
# ==================================================

@router.get("/me")
def get_me(
    user=Depends(get_current_user),
):

    # ------------------------------------------
    # Get name from metadata
    # ------------------------------------------

    metadata_name = get_user_name(
        user
    )

    # ------------------------------------------
    # Fallback for old users
    # ------------------------------------------

    display_name = get_display_name(
        user
    )

    return {
        "authenticated": True,
        "user_id": str(
            user.id
        ),
        "email": getattr(
            user,
            "email",
            None,
        ),
        "phone": getattr(
            user,
            "phone",
            None,
        ),
        "name": display_name,
        "metadata_name": metadata_name,
    }