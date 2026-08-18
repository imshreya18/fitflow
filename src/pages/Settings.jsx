import { useEffect, useState } from 'react'
import {
  User,
  Bell,
  Heart,
  Palette,
  Eye,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Switch from '@/components/ui/Switch'
import ThemeSelector from '@/components/ThemeSelector'

import { getCurrentUser, getGoals, logout } from '@/lib/api'
import { useTheme } from '@/context/ThemeContext'


// ==================================================
// SECTION
// ==================================================

function Section({ icon: Icon, title, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Icon
          size={16}
          className="text-[var(--text-soft)]"
        />

        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-soft)]">
          {title}
        </h2>
      </div>

      {children}
    </div>
  )
}


// ==================================================
// ROW
// ==================================================

function Row({
  label,
  sub,
  right,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-2)] rounded-2xl transition-colors text-left"
    >
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {label}
        </p>

        {sub && (
          <p className="text-sm text-[var(--text-soft)] truncate">
            {sub}
          </p>
        )}
      </div>

      {right}
    </button>
  )
}


// ==================================================
// SETTINGS
// ==================================================

export default function Settings() {
  const {
    reducedMotion,
    setReducedMotion,
    fontScale,
    setFontScale,
  } = useTheme()

  const [user, setUser] = useState(null)
  const [goal, setGoal] = useState('Your goal')

  const [loading, setLoading] = useState(true)

  const [notifWorkout, setNotifWorkout] =
    useState(true)

  const [notifStreak, setNotifStreak] =
    useState(true)

  const [notifCommunity, setNotifCommunity] =
    useState(false)


  // ==================================================
  // LOAD REAL USER DATA
  // ==================================================

  useEffect(() => {
    async function loadSettingsData() {
      try {
        setLoading(true)

        // ------------------------------------------
        // CURRENT USER
        // ------------------------------------------

        const currentUser =
          await getCurrentUser()

        console.log(
          'Settings user:',
          currentUser
        )

        setUser(currentUser)


        // ------------------------------------------
        // USER GOALS
        // ------------------------------------------

        try {
          const goalsData =
            await getGoals()

          console.log(
            'Settings goals:',
            goalsData
          )

          const goals =
            Array.isArray(goalsData)
              ? goalsData
              : Array.isArray(goalsData?.goals)
                ? goalsData.goals
                : []

          if (goals.length > 0) {
            const firstGoal = goals[0]

            setGoal(
              firstGoal?.title ||
              firstGoal?.name ||
              firstGoal?.goal ||
              'Your goal'
            )
          }
        } catch (goalError) {
          console.error(
            'Settings goals error:',
            goalError
          )

          setGoal('Your goal')
        }

      } catch (error) {
        console.error(
          'Settings user error:',
          error
        )

        setUser(null)

      } finally {
        setLoading(false)
      }
    }

    loadSettingsData()
  }, [])


  // ==================================================
  // REAL USER VALUES
  // ==================================================

  const displayName =
    user?.name?.trim() ||
    user?.user_metadata?.name?.trim() ||
    user?.email?.split('@')[0] ||
    'User'

  const email =
    user?.email ||
    ''

  const phone =
    user?.phone ||
    ''


  // ==================================================
  // LOGOUT
  // ==================================================

  function handleLogout() {
    logout()

    window.location.href = '/'
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Header
          back
          title="Settings"
        />

        <div className="flex items-center justify-center py-16">
          <p className="text-sm text-[var(--text-soft)]">
            Loading settings...
          </p>
        </div>
      </div>
    )
  }


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="max-w-2xl mx-auto">

      <Header
        back
        title="Settings"
      />


      {/* ==================================================
          ACCOUNT
      ================================================== */}

      <Section
        icon={User}
        title="Account"
      >
        <Card className="p-2">

          <Row
            label={displayName}
            sub={email}
            right={
              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />
            }
          />

          <Row
            label="Phone / Email"
            sub={
              phone
                ? phone
                : email || 'No email available'
            }
            right={
              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />
            }
          />

        </Card>
      </Section>


      {/* ==================================================
          PREFERENCES
      ================================================== */}

      <Section
        icon={Heart}
        title="Preferences"
      >
        <Card className="p-2">

          <Row
            label="Workout preferences"
            sub="Manage your workout preferences"
            right={
              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />
            }
          />

          <Row
            label="Current goal"
            sub={goal}
            right={
              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />
            }
          />

        </Card>
      </Section>


      {/* ==================================================
          NOTIFICATIONS
      ================================================== */}

      <Section
        icon={Bell}
        title="Notifications"
      >
        <Card className="p-2">

          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">
              Workout reminders
            </span>

            <Switch
              checked={notifWorkout}
              onChange={setNotifWorkout}
              label="Workout reminders"
            />
          </div>


          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">
              Streak alerts
            </span>

            <Switch
              checked={notifStreak}
              onChange={setNotifStreak}
              label="Streak alerts"
            />
          </div>


          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">
              Community activity
            </span>

            <Switch
              checked={notifCommunity}
              onChange={setNotifCommunity}
              label="Community activity"
            />
          </div>

        </Card>
      </Section>


      {/* ==================================================
          APPEARANCE
      ================================================== */}

      <Section
        icon={Palette}
        title="Appearance"
      >
        <ThemeSelector />
      </Section>


      {/* ==================================================
          ACCESSIBILITY
      ================================================== */}

      <Section
        icon={Eye}
        title="Accessibility"
      >
        <Card className="p-2">

          <div className="flex items-center gap-3 px-4 py-3.5">
            <span className="flex-1 font-medium">
              Reduced motion
            </span>

            <Switch
              checked={reducedMotion}
              onChange={setReducedMotion}
              label="Reduced motion"
            />
          </div>


          <div className="px-4 py-3.5">

            <div className="flex items-center justify-between mb-2">

              <span className="font-medium">
                Font size
              </span>

              <span className="text-sm text-[var(--text-soft)]">
                {Math.round(fontScale * 100)}%
              </span>

            </div>


            <input
              type="range"
              min={0.85}
              max={1.3}
              step={0.05}
              value={fontScale}
              onChange={(e) =>
                setFontScale(
                  Number(e.target.value)
                )
              }
              className="w-full accent-[var(--primary)]"
              aria-label="Font size"
            />

          </div>

        </Card>
      </Section>


      {/* ==================================================
          PRIVACY
      ================================================== */}

      <Section
        icon={Shield}
        title="Privacy"
      >
        <Card className="p-2">

          <Row
            label="Privacy settings"
            sub="Manage your data & visibility"
            right={
              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />
            }
          />

        </Card>
      </Section>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 font-medium px-4 py-3 hover:bg-red-500/5 rounded-xl transition-colors w-full mb-6"
      >
        <LogOut size={17} />

        Log out
      </button>

    </div>
  )
}