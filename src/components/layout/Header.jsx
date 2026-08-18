import {
  Link,
  useNavigate,
} from "react-router-dom"

import {
  Bell,
  Leaf,
  ChevronLeft,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import { useAppState } from "@/context/AppStateContext"

import {
  getCurrentUser,
} from "@/lib/api"


export default function Header({
  title,
  back = false,
  subtitle,
}) {

  const {
    unreadCount,
  } = useAppState()

  const navigate =
    useNavigate()

  const [user, setUser] =
    useState(null)


  // ==================================================
  // LOAD CURRENT USER
  // ==================================================

  useEffect(() => {

    let mounted = true

    async function loadUser() {

      try {

        const currentUser =
          await getCurrentUser()

        if (mounted) {
          setUser(currentUser)
        }

      } catch (error) {

        console.error(
          "Header user error:",
          error
        )

      }
    }

    loadUser()

    return () => {
      mounted = false
    }

  }, [])


  // ==================================================
  // AVATAR NAME
  // ==================================================

  const displayName =
    user?.name?.trim() ||
    user?.metadata_name?.trim() ||
    user?.email
      ?.split("@")[0]
      ?.trim() ||
    "U"


  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase()


  return (

    <header className="flex items-center justify-between gap-3 mb-6">

      <div className="flex items-center gap-3 min-w-0">


        {/* ==================================================
            BACK BUTTON
        ================================================== */}

        {back && (

          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] transition-colors shrink-0"
          >

            <ChevronLeft size={22} />

          </button>

        )}


        {/* ==================================================
            MOBILE LOGO
        ================================================== */}

        <div className="lg:hidden flex items-center gap-2 shrink-0">

          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">

            <Leaf
              size={16}
              className="text-[var(--primary-fg)]"
            />

          </div>

        </div>


        {/* ==================================================
            TITLE
        ================================================== */}

        {title && (

          <div className="min-w-0">

            <h1 className="font-display font-bold text-xl truncate">
              {title}
            </h1>

            {subtitle && (

              <p className="text-sm text-[var(--text-soft)] truncate">
                {subtitle}
              </p>

            )}

          </div>

        )}

      </div>


      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <div className="flex items-center gap-2 shrink-0">


        {/* ==================================================
            NOTIFICATIONS
        ================================================== */}

        <Link
          to="/app/notifications"
          aria-label="Notifications"
          className="relative p-2.5 rounded-full hover:bg-[var(--surface-2)] transition-colors"
        >

          <Bell size={20} />

          {unreadCount > 0 && (

            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--energy)]" />

          )}

        </Link>


        {/* ==================================================
            PROFILE
        ================================================== */}

        <Link
          to="/app/profile"
          aria-label={`Profile of ${displayName}`}
          className="w-9 h-9 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-xs font-semibold"
        >

          {avatarLetter}

        </Link>

      </div>

    </header>
  )
}