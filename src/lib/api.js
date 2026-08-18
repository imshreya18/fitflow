// ==================================================
// API CONFIGURATION
// ==================================================

// Local development:
// VITE_API_URL is optional.
// When deployed, set VITE_API_URL to your deployed FastAPI URL.
//
// Example:
// VITE_API_URL=https://your-backend.onrender.com

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/$/, "")


// ==================================================
// GENERIC API FETCH
// ==================================================

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("access_token")

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        ...(options.body
          ? {
              "Content-Type": "application/json",
            }
          : {}),

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    }
  )

  let data = {}

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      `API request failed (${response.status})`
    )
  }

  return data
}


// ==================================================
// EMAIL SIGN UP
// ==================================================

export async function signup(
  name,
  email,
  password
) {
  const data = await apiFetch(
    "/api/auth/signup",
    {
      method: "POST",

      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  )

  if (data?.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    )
  }

  if (data?.refresh_token) {
    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    )
  }

  return data
}


// ==================================================
// EMAIL LOGIN
// ==================================================

export async function login(
  email,
  password
) {
  const data = await apiFetch(
    "/api/auth/login",
    {
      method: "POST",

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    }
  )

  if (data?.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    )
  }

  if (data?.refresh_token) {
    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    )
  }

  return data
}


// ==================================================
// PHONE OTP - SEND
// ==================================================

export async function sendPhoneOtp(phone) {
  return apiFetch(
    "/api/auth/phone/send",
    {
      method: "POST",

      body: JSON.stringify({
        phone: phone.trim(),
      }),
    }
  )
}


// ==================================================
// PHONE OTP - VERIFY
// ==================================================

export async function verifyPhoneOtp(
  phone,
  token,
  name = ""
) {
  const data = await apiFetch(
    "/api/auth/phone/verify",
    {
      method: "POST",

      body: JSON.stringify({
        phone: phone.trim(),
        token: token.trim(),
        name: name.trim(),
      }),
    }
  )

  if (data?.access_token) {
    localStorage.setItem(
      "access_token",
      data.access_token
    )
  }

  if (data?.refresh_token) {
    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    )
  }

  return data
}


// ==================================================
// GOOGLE AUTH
// ==================================================

export async function getGoogleAuthUrl() {
  return apiFetch(
    "/api/auth/google"
  )
}


// ==================================================
// LOGOUT
// ==================================================

export function logout() {
  localStorage.removeItem(
    "access_token"
  )

  localStorage.removeItem(
    "refresh_token"
  )
}


// ==================================================
// CURRENT USER
// ==================================================

export async function getCurrentUser() {
  return apiFetch(
    "/api/auth/me"
  )
}


// ==================================================
// UPDATE NAME
// ==================================================

export async function updateName(name) {
  return apiFetch(
    "/api/auth/name",
    {
      method: "PUT",

      body: JSON.stringify({
        name: name.trim(),
      }),
    }
  )
}


// ==================================================
// PROGRESS
// ==================================================

export async function getProgress() {
  return apiFetch(
    "/api/progress/"
  )
}


// ==================================================
// STREAK
// ==================================================

export async function getStreak() {
  return apiFetch(
    "/api/progress/streaks"
  )
}


// ==================================================
// GOALS
// ==================================================

export async function getGoals() {
  return apiFetch(
    "/api/goals/"
  )
}


// ==================================================
// WORKOUTS
// ==================================================

export async function getWorkouts() {
  return apiFetch(
    "/api/workouts/"
  )
}


// ==================================================
// COURSES
// ==================================================

export async function getCourses() {
  return apiFetch(
    "/api/courses/"
  )
}