import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import { getStreak } from '@/lib/api'
import { cx } from '@/lib/utils'

export default function Streaks() {
  const [streakData, setStreakData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStreak() {
      try {
        const data = await getStreak()

        console.log('Streak data:', data)

        setStreakData(data)
      } catch (error) {
        console.error('Streak loading error:', error)
        setStreakData(null)
      } finally {
        setLoading(false)
      }
    }

    loadStreak()
  }, [])

  // --------------------------------------------------
  // HANDLE DIFFERENT BACKEND RESPONSE SHAPES
  // --------------------------------------------------

  const currentStreak =
    streakData?.current_streak ??
    streakData?.currentStreak ??
    streakData?.streak ??
    0

  const longestStreak =
    streakData?.longest_streak ??
    streakData?.longestStreak ??
    0

  const calendar =
    Array.isArray(streakData?.streak_calendar)
      ? streakData.streak_calendar
      : Array.isArray(streakData?.streakCalendar)
        ? streakData.streakCalendar
        : Array.isArray(streakData?.calendar)
          ? streakData.calendar
          : []

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div>
        <Header
          title="Streaks"
          subtitle="Consistency over perfection."
        />

        <div className="flex items-center justify-center py-20">
          <p className="text-[var(--text-soft)]">
            Loading your streak...
          </p>
        </div>
      </div>
    )
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div>
      <Header
        title="Streaks"
        subtitle="Consistency over perfection."
      />

      {/* ==================================================
          CURRENT STREAK
      ================================================== */}

      <Card className="p-8 sm:p-10 flex flex-col items-center text-center mb-6 bg-[var(--surface-2)] border-none">

        <motion.div
          initial={{
            scale: 0.8,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            bounce: 0.5,
          }}
        >
          <Flame
            size={56}
            className="text-[var(--energy)] mb-2"
            fill="var(--energy)"
          />
        </motion.div>

        <p className="font-display text-6xl font-bold mb-1">
          {currentStreak}
        </p>

        <p className="font-semibold text-[var(--text-soft)] mb-3">
          Day Streak
        </p>

        <p className="text-[var(--text-soft)] max-w-sm">
          {currentStreak > 0
            ? `You've shown up ${currentStreak} ${
                currentStreak === 1 ? 'day' : 'days'
              } in a row. That's the kind of consistency that builds lasting habits.`
            : "You don't have a streak yet. Complete a workout today to start one!"}
        </p>

      </Card>


      {/* ==================================================
          STREAK CALENDAR
      ================================================== */}

      <Card className="p-5 sm:p-6 mb-6">

        <h3 className="font-display font-bold text-lg mb-4">
          Last 5 Weeks
        </h3>

        {calendar.length > 0 ? (
          <>
            <div className="grid grid-cols-7 gap-2">

              {calendar.map((value, index) => {

                const completed =
                  value === 1 ||
                  value === true ||
                  value?.completed === true

                return (
                  <div
                    key={index}
                    className={cx(
                      'aspect-square rounded-lg',
                      completed
                        ? 'bg-[var(--primary)]'
                        : 'bg-[var(--surface-3)]'
                    )}
                    title={
                      completed
                        ? 'Completed'
                        : 'Missed'
                    }
                  />
                )
              })}

            </div>

            <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-soft)]">

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[var(--primary)]" />
                Completed
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-[var(--surface-3)]" />
                Missed
              </span>

            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--text-soft)]">
            No workout history available yet.
          </p>
        )}

      </Card>


      {/* ==================================================
          STREAK STATS
      ================================================== */}

      <Card className="p-5 sm:p-6 mb-6">

        <div className="grid grid-cols-2 gap-4">

          <div>
            <p className="font-display text-2xl font-bold">
              {currentStreak}
            </p>

            <p className="text-xs text-[var(--text-soft)] mt-1">
              Current streak
            </p>
          </div>

          <div>
            <p className="font-display text-2xl font-bold">
              {longestStreak}
            </p>

            <p className="text-xs text-[var(--text-soft)] mt-1">
              Longest streak
            </p>
          </div>

        </div>

      </Card>


      {/* ==================================================
          MOTIVATION
      ================================================== */}

      <Card className="p-5 sm:p-6 bg-[var(--primary-soft)] border-none">

        <p className="text-[var(--primary)] font-medium leading-relaxed">
          One missed day doesn't erase your progress.
          What matters is showing up again tomorrow.
        </p>

      </Card>

    </div>
  )
}