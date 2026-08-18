import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Flame,
  CalendarCheck,
  Clock,
  Target,
  TrendingUp,
  Award,
  ArrowRight,
} from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import StatCard from '@/components/StatCard'
import ProgressChart from '@/components/ProgressChart'

import {
  getProgress,
  getStreak,
  getGoals,
} from '@/lib/api'


export default function Progress() {

  const [progress, setProgress] = useState(null)
  const [streak, setStreak] = useState(null)
  const [goals, setGoals] = useState([])

  const [loading, setLoading] = useState(true)


  // ==================================================
  // LOAD REAL PROGRESS
  // ==================================================

  useEffect(() => {

    async function loadProgress() {

      try {

        const [
          progressData,
          streakData,
          goalsData,
        ] = await Promise.all([
          getProgress(),
          getStreak(),
          getGoals(),
        ])


        console.log(
          'PROGRESS DATA:',
          progressData
        )

        console.log(
          'STREAK DATA:',
          streakData
        )

        console.log(
          'GOALS DATA:',
          goalsData
        )


        // ----------------------------------------------
        // PROGRESS
        // ----------------------------------------------

        if (progressData?.progress) {

          setProgress(
            progressData.progress
          )

        } else {

          setProgress(
            progressData
          )

        }


        // ----------------------------------------------
        // STREAK
        // ----------------------------------------------

        if (streakData?.streak) {

          setStreak(
            streakData.streak
          )

        } else {

          setStreak(
            streakData
          )

        }


        // ----------------------------------------------
        // GOALS
        // ----------------------------------------------

        const goalList =
          Array.isArray(goalsData)
            ? goalsData
            : Array.isArray(goalsData?.goals)
              ? goalsData.goals
              : []


        setGoals(goalList)

      } catch (error) {

        console.error(
          'Progress loading error:',
          error
        )

      } finally {

        setLoading(false)

      }

    }


    loadProgress()

  }, [])


  // ==================================================
  // REAL VALUES
  // ==================================================

  const currentStreak =
    streak?.current_streak || 0

  const longestStreak =
    streak?.longest_streak || 0

  const totalWorkouts =
    progress?.total_workouts || 0

  const weeklyWorkouts =
    progress?.weekly_workouts || 0

  const weeklyActiveMinutes =
    progress?.weekly_active_minutes || 0


  // ==================================================
  // GOAL
  // ==================================================

  const firstGoal =
    goals.length > 0
      ? goals[0]
      : null


  const weeklyGoalDays =
    firstGoal?.target_days ||
    firstGoal?.weekly_goal_days ||
    firstGoal?.frequency ||
    0


  // ==================================================
  // ACTIVE TIME
  // ==================================================

  function formatMinutes(minutes) {

    const value =
      Number(minutes) || 0

    const hours =
      Math.floor(value / 60)

    const mins =
      value % 60

    if (hours > 0) {
      return `${hours}h ${mins}m`
    }

    return `${mins}m`
  }


  // ==================================================
  // GOAL PROGRESS
  // ==================================================

  const goalProgress =
    weeklyGoalDays > 0
      ? Math.min(
          100,
          Math.round(
            (weeklyWorkouts /
              weeklyGoalDays) *
            100
          )
        )
      : 0


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div>

        <Header
          title="Your Progress"
          subtitle="Every workout counts."
        />

        <div className="flex justify-center py-20">

          <p className="text-[var(--text-soft)]">
            Loading progress...
          </p>

        </div>

      </div>

    )

  }


  return (

    <div>

      <Header
        title="Your Progress"
        subtitle="Every workout counts."
      />


      {/* ==================================================
          REAL STATS
      ================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <StatCard
          icon={Flame}
          label="Day streak"
          value={currentStreak}
          tone="energy"
        />


        <StatCard
          icon={CalendarCheck}
          label="Workouts this week"
          value={
            weeklyGoalDays > 0
              ? `${weeklyWorkouts}/${weeklyGoalDays}`
              : weeklyWorkouts
          }
          tone="primary"
        />


        <StatCard
          icon={Clock}
          label="Active time"
          value={formatMinutes(
            weeklyActiveMinutes
          )}
          tone="neutral"
        />


        <StatCard
          icon={Target}
          label="Goal progress"
          value={`${goalProgress}%`}
          tone="primary"
        />

      </div>


      {/* ==================================================
          CHART + CONSISTENCY
      ================================================== */}

      <div className="grid lg:grid-cols-3 gap-5 mb-6">

        <div className="lg:col-span-2">

          <ProgressChart />

        </div>


        <Card className="p-5 sm:p-6 flex flex-col">

          <div className="flex items-center gap-2 mb-4">

            <TrendingUp
              size={18}
              className="text-[var(--primary)]"
            />

            <h3 className="font-display font-bold text-lg">
              Consistency
            </h3>

          </div>


          <div className="flex items-center justify-between mb-3">

            <span className="text-sm text-[var(--text-soft)]">
              This week
            </span>

            <span className="font-display font-bold text-xl">
              {goalProgress}%
            </span>

          </div>


          <div className="h-2 rounded-full bg-[var(--surface-3)] mb-4 overflow-hidden">

            <div
              className="h-full bg-[var(--primary)] rounded-full"
              style={{
                width: `${goalProgress}%`,
              }}
            />

          </div>


          <div className="flex items-center justify-between mb-4">

            <span className="text-sm text-[var(--text-soft)]">
              Workouts completed
            </span>

            <span className="font-display font-semibold text-[var(--text-soft)]">

              {weeklyWorkouts}

            </span>

          </div>


          <div className="mt-auto bg-[var(--primary-soft)] text-[var(--primary)] text-sm rounded-xl p-3.5 leading-snug">

            {weeklyWorkouts > 0
              ? "You're making progress. Keep the momentum going!"
              : "Complete your first workout to start tracking your progress!"
            }

          </div>

        </Card>

      </div>


      {/* ==================================================
          PERSONAL RECORDS
      ================================================== */}

      <div className="grid sm:grid-cols-2 gap-5">

        <Card className="p-5 sm:p-6">

          <div className="flex items-center gap-2 mb-4">

            <Award
              size={18}
              className="text-[var(--primary)]"
            />

            <h3 className="font-display font-bold text-lg">
              Personal Records
            </h3>

          </div>


          <div className="grid grid-cols-2 gap-4">


            <div>

              <p className="font-display text-xl font-bold">

                {longestStreak} days

              </p>

              <p className="text-xs text-[var(--text-soft)]">
                Longest streak
              </p>

            </div>


            <div>

              <p className="font-display text-xl font-bold">

                {weeklyWorkouts}

              </p>

              <p className="text-xs text-[var(--text-soft)]">
                This week
              </p>

            </div>


            <div>

              <p className="font-display text-xl font-bold">

                {totalWorkouts}

              </p>

              <p className="text-xs text-[var(--text-soft)]">
                Total workouts
              </p>

            </div>


            <div>

              <p className="font-display text-xl font-bold">

                {formatMinutes(
                  progress?.total_active_minutes || 0
                )}

              </p>

              <p className="text-xs text-[var(--text-soft)]">
                Total active time
              </p>

            </div>


          </div>

        </Card>


        {/* ==================================================
            LINKS
        ================================================== */}

        <div className="flex flex-col gap-3">

          <Link
            to="/app/goals"
            className="flex items-center justify-between p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] card-shadow hover:-translate-y-0.5 transition-transform"
          >

            <div className="flex items-center gap-3">

              <Target
                size={20}
                className="text-[var(--primary)]"
              />

              <span className="font-medium">
                View your Goals
              </span>

            </div>

            <ArrowRight
              size={18}
              className="text-[var(--text-soft)]"
            />

          </Link>


          <Link
            to="/app/streaks"
            className="flex items-center justify-between p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] card-shadow hover:-translate-y-0.5 transition-transform"
          >

            <div className="flex items-center gap-3">

              <Flame
                size={20}
                className="text-[var(--energy)]"
              />

              <span className="font-medium">
                View your Streak
              </span>

            </div>

            <ArrowRight
              size={18}
              className="text-[var(--text-soft)]"
            />

          </Link>

        </div>

      </div>

    </div>

  )

}