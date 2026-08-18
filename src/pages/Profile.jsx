import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings,
  Flame,
  Dumbbell,
  Target,
  BarChart3,
  Clock,
  ChevronRight,
  LogOut,
} from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

import {
  getCurrentUser,
  getGoals,
  getStreak,
  getProgress,
  logout,
} from '@/lib/api'


const links = [
  {
    to: '/app/goals',
    label: 'Goals',
    icon: Target,
  },
  {
    to: '/app/streaks',
    label: 'Streaks',
    icon: Flame,
  },
  {
    to: '/app/progress',
    label: 'Progress',
    icon: BarChart3,
  },
  {
    to: '/app/settings',
    label: 'Settings',
    icon: Settings,
  },
]


export default function Profile() {
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState([])
  const [streak, setStreak] = useState(null)
  const [progress, setProgress] = useState(null)

  const [loading, setLoading] = useState(true)


  // ==================================================
  // LOAD REAL USER DATA
  // ==================================================

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)

        // ----------------------------------------------
        // CURRENT USER
        // ----------------------------------------------

        const userData = await getCurrentUser()

        console.log('PROFILE USER:', userData)

        setUser(userData)


        // ----------------------------------------------
        // GOALS
        // ----------------------------------------------

        try {
          const goalsData = await getGoals()

          console.log('PROFILE GOALS:', goalsData)

          const realGoals = Array.isArray(goalsData)
            ? goalsData
            : Array.isArray(goalsData?.goals)
              ? goalsData.goals
              : []

          setGoals(realGoals)
        } catch (error) {
          console.error(
            'Profile goals error:',
            error
          )

          setGoals([])
        }


        // ----------------------------------------------
        // STREAK
        // ----------------------------------------------

        try {
          const streakData = await getStreak()

          console.log(
            'PROFILE STREAK:',
            streakData
          )

          setStreak(
            streakData?.streak ||
            streakData ||
            null
          )
        } catch (error) {
          console.error(
            'Profile streak error:',
            error
          )

          setStreak(null)
        }


        // ----------------------------------------------
        // PROGRESS
        // ----------------------------------------------

        try {
          const progressData = await getProgress()

          console.log(
            'PROFILE PROGRESS:',
            progressData
          )

          setProgress(
            progressData?.progress ||
            progressData ||
            null
          )
        } catch (error) {
          console.error(
            'Profile progress error:',
            error
          )

          setProgress(null)
        }

      } catch (error) {
        console.error(
          'Profile loading error:',
          error
        )
      } finally {
        setLoading(false)
      }
    }


    loadProfile()
  }, [])


  // ==================================================
  // DISPLAY NAME
  // ==================================================

  const displayName =
    user?.name?.trim() ||
    user?.user_metadata?.name?.trim() ||
    user?.email?.split('@')[0] ||
    'User'


  // ==================================================
  // INITIALS
  // ==================================================

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) =>
          part.charAt(0).toUpperCase()
      )
      .join('') || 'U'


  // ==================================================
  // EMAIL
  // ==================================================

  const email =
    user?.email || ''


  // ==================================================
  // GOAL
  // ==================================================

  const primaryGoal =
    goals.find(
      (goal) =>
        goal?.primary === true
    ) ||
    goals[0] ||
    null


  const goalName =
    primaryGoal?.title ||
    primaryGoal?.name ||
    primaryGoal?.goal ||
    'Your goal'


  // ==================================================
  // FITNESS LEVEL
  // ==================================================

  const fitnessLevel =
    user?.user_metadata?.fitness_level ||
    user?.user_metadata?.fitnessLevel ||
    'Beginner'


  // ==================================================
  // WORKOUT PREFERENCE
  // ==================================================

  const workoutPreference =
    user?.user_metadata?.workout_preference ||
    user?.user_metadata?.workoutPreference ||
    '30 min'


  // ==================================================
  // STREAK DATA
  // ==================================================

  const currentStreak =
    streak?.current_streak ??
    progress?.current_streak ??
    0


  const longestStreak =
    streak?.longest_streak ??
    progress?.longest_streak ??
    0


  // ==================================================
  // WORKOUT COUNT
  // ==================================================

  const totalWorkouts =
    progress?.total_workouts ??
    progress?.completed_workouts ??
    progress?.workouts_completed ??
    0


  // ==================================================
  // WEEKLY GOAL
  // ==================================================

  const weeklyGoalDays =
    progress?.weekly_goal_days ??
    user?.user_metadata?.weekly_goal_days ??
    0


  // ==================================================
  // LOGOUT
  // ==================================================

  function handleLogout() {
    logout()

    window.location.href = '/login'
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div>
        <Header />

        <div className="flex items-center justify-center py-20">
          <p className="text-[var(--text-soft)]">
            Loading your profile...
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

      <Header />


      {/* ==================================================
          PROFILE HEADER
      ================================================== */}

      <div className="flex flex-col items-center text-center mb-8">

        {/* Avatar */}

        <div className="w-24 h-24 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-3xl font-display font-bold mb-4">
          {initials}
        </div>


        {/* Name */}

        <h1 className="font-display text-2xl font-bold mb-1">
          {displayName}
        </h1>


        {/* Email */}

        <p className="text-[var(--text-soft)] mb-4">
          {email}
        </p>


        {/* Badges */}

        <div className="flex flex-wrap justify-center gap-2">

          <Badge tone="primary">
            {goalName}
          </Badge>

          <Badge>
            {fitnessLevel}
          </Badge>

          <Badge>
            {workoutPreference}/session
          </Badge>

        </div>

      </div>


      {/* ==================================================
          STATS
      ================================================== */}

      <div className="grid grid-cols-3 gap-3 mb-8">

        {/* Streak */}

        <Card className="p-4 text-center">

          <p className="font-display text-xl font-bold flex items-center justify-center gap-1">

            <Flame
              size={16}
              className="text-[var(--energy)]"
            />

            {currentStreak}

          </p>

          <p className="text-xs text-[var(--text-soft)] mt-1">
            Day streak
          </p>

        </Card>


        {/* Workouts */}

        <Card className="p-4 text-center">

          <p className="font-display text-xl font-bold">
            {totalWorkouts}
          </p>

          <p className="text-xs text-[var(--text-soft)] mt-1">
            Workouts
          </p>

        </Card>


        {/* Weekly Goal */}

        <Card className="p-4 text-center">

          <p className="font-display text-xl font-bold">
            {weeklyGoalDays}/wk
          </p>

          <p className="text-xs text-[var(--text-soft)] mt-1">
            Weekly goal
          </p>

        </Card>

      </div>


      {/* ==================================================
          PROFILE LINKS
      ================================================== */}

      <Card className="p-2 mb-6">

        {links.map(
          ({
            to,
            label,
            icon: Icon,
          }) => (

            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--surface-2)] rounded-2xl transition-colors"
            >

              <Icon
                size={18}
                className="text-[var(--text-soft)]"
              />

              <span className="flex-1 font-medium">
                {label}
              </span>

              <ChevronRight
                size={18}
                className="text-[var(--text-soft)]"
              />

            </Link>

          )
        )}

      </Card>


      {/* ==================================================
          WORKOUT INFORMATION
      ================================================== */}

      <Card className="p-2 mb-4">

        <div className="flex items-center gap-3 px-4 py-3.5">

          <Dumbbell
            size={18}
            className="text-[var(--text-soft)]"
          />

          <div className="flex-1">

            <p className="font-medium">
              Workout preference
            </p>

            <p className="text-sm text-[var(--text-soft)]">
              {workoutPreference} sessions
            </p>

          </div>

        </div>


        <div className="flex items-center gap-3 px-4 py-3.5">

          <Clock
            size={18}
            className="text-[var(--text-soft)]"
          />

          <div className="flex-1">

            <p className="font-medium">
              Longest streak
            </p>

            <p className="text-sm text-[var(--text-soft)]">
              {longestStreak} days
            </p>

          </div>

        </div>

      </Card>


      {/* ==================================================
          LOGOUT
      ================================================== */}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 font-medium px-4 py-3 hover:bg-red-500/5 rounded-xl transition-colors w-full"
      >

        <LogOut size={17} />

        Log out

      </button>

    </div>
  )
}