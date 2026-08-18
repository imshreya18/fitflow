import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Flame,
  ArrowRight,
} from "lucide-react"

import Header from "@/components/layout/Header"
import WorkoutCard from "@/components/WorkoutCard"
import GoalCard from "@/components/GoalCard"
import CourseCard from "@/components/CourseCard"
import Card from "@/components/ui/Card"
import { ProgressRing } from "@/components/ui/Progress"

import {
  getCurrentUser,
  getProgress,
  getStreak,
  getGoals,
  getWorkouts,
  getCourses,
} from "@/lib/api"


export default function Home() {

  const [user, setUser] = useState(null)

  const [progress, setProgress] = useState({
    total_workouts: 0,
    total_active_minutes: 0,
    weekly_workouts: 0,
    weekly_active_minutes: 0,
  })

  const [streak, setStreak] = useState(0)
  const [goals, setGoals] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [courses, setCourses] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

  useEffect(() => {

    async function loadDashboard() {

      try {

        setLoading(true)
        setError("")


        // ------------------------------------------
        // CURRENT USER
        // ------------------------------------------

        const currentUser =
          await getCurrentUser()

        console.log(
          "Current user:",
          currentUser
        )

        setUser(currentUser)


        // ------------------------------------------
        // PROGRESS
        // ------------------------------------------

        try {

          const data =
            await getProgress()

          const progressData =
            data?.progress &&
            typeof data.progress === "object"
              ? data.progress
              : {
                  total_workouts: 0,
                  total_active_minutes: 0,
                  weekly_workouts: 0,
                  weekly_active_minutes: 0,
                }

          setProgress({
            total_workouts:
              Number(
                progressData.total_workouts
              ) || 0,

            total_active_minutes:
              Number(
                progressData.total_active_minutes
              ) || 0,

            weekly_workouts:
              Number(
                progressData.weekly_workouts
              ) || 0,

            weekly_active_minutes:
              Number(
                progressData.weekly_active_minutes
              ) || 0,
          })

        } catch (err) {

          console.error(
            "Progress API error:",
            err
          )

          setProgress({
            total_workouts: 0,
            total_active_minutes: 0,
            weekly_workouts: 0,
            weekly_active_minutes: 0,
          })
        }


        // ------------------------------------------
        // STREAK
        // ------------------------------------------

        try {

          const data =
            await getStreak()

          const currentStreak =
            Number(
              data?.streak?.current_streak ??
              data?.current_streak ??
              0
            ) || 0

          setStreak(
            currentStreak
          )

        } catch (err) {

          console.error(
            "Streak API error:",
            err
          )

          setStreak(0)
        }


        // ------------------------------------------
        // GOALS
        // ------------------------------------------

        try {

          const data =
            await getGoals()

          const goalsData =
            Array.isArray(data)
              ? data
              : Array.isArray(data?.goals)
                ? data.goals
                : []

          setGoals(
            goalsData
          )

        } catch (err) {

          console.error(
            "Goals API error:",
            err
          )

          setGoals([])
        }


        // ------------------------------------------
        // WORKOUTS
        // ------------------------------------------

        try {

          const data =
            await getWorkouts()

          const workoutsData =
            Array.isArray(data)
              ? data
              : Array.isArray(data?.workouts)
                ? data.workouts
                : []

          setWorkouts(
            workoutsData
          )

        } catch (err) {

          console.error(
            "Workouts API error:",
            err
          )

          setWorkouts([])
        }


        // ------------------------------------------
        // COURSES
        // ------------------------------------------

        try {

          const data =
            await getCourses()

          const coursesData =
            Array.isArray(data)
              ? data
              : Array.isArray(data?.courses)
                ? data.courses
                : []

          setCourses(
            coursesData
          )

        } catch (err) {

          console.error(
            "Courses API error:",
            err
          )

          setCourses([])
        }

      } catch (err) {

        console.error(
          "Authentication error:",
          err
        )

        setError(
          err?.message ||
          "Unable to connect to the backend."
        )

      } finally {

        setLoading(false)

      }
    }


    loadDashboard()

  }, [])


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[60vh]">

        <p className="text-[var(--text-soft)]">
          Loading your dashboard...
        </p>

      </div>
    )
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (

      <div className="p-5">

        <Header />

        <Card className="p-6 mt-6">

          <h2 className="font-display text-xl font-bold mb-2">
            Unable to load dashboard
          </h2>

          <p className="text-red-500 mb-4">
            {error}
          </p>

          <p className="text-sm text-[var(--text-soft)] mb-4">
            Please make sure:
          </p>

          <ul className="text-sm text-[var(--text-soft)] list-disc ml-5 space-y-1">

            <li>
              FastAPI is running on port 8000
            </li>

            <li>
              You are logged in
            </li>

            <li>
              Your access token exists in localStorage
            </li>

          </ul>

          <button
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] font-semibold"
          >
            Try again
          </button>

        </Card>

      </div>
    )
  }


  // ==================================================
  // GREETING
  // ==================================================

  const hour =
    new Date().getHours()

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 18
        ? "Good afternoon"
        : "Good evening"


  // ==================================================
  // DISPLAY NAME
  // ==================================================

  const displayName =
    user?.name?.trim() ||
    user?.metadata_name?.trim() ||
    user?.email
      ?.split("@")[0]
      ?.trim() ||
    "there"


  // ==================================================
  // TODAY'S WORKOUT
  // ==================================================

  const todaysWorkout =
    workouts[0]


  // ==================================================
  // FIRST GOAL
  // ==================================================

  const firstGoal =
    goals[0]


  return (

    <div>

      <Header />


      {/* ==================================================
          GREETING
      ================================================== */}

      <div className="mb-7">

        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1.5">

          {greeting}, {displayName} 👋

        </h1>

        <p className="text-[var(--text-soft)]">
          Ready to keep your momentum going?
        </p>

      </div>


      {/* ==================================================
          MAIN DASHBOARD
      ================================================== */}

      <div className="grid lg:grid-cols-3 gap-5 mb-6">


        <div className="lg:col-span-2 flex flex-col gap-5">


          {/* ==================================================
              STREAK
          ================================================== */}

          <Card className="p-5 flex items-center justify-between bg-[var(--surface-2)] border-none">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-1">
                Today's Focus
              </p>

              <p className="font-display font-bold text-lg">
                Build consistency
              </p>

            </div>


            <div className="flex items-center gap-1.5 bg-[var(--energy-soft)] text-[var(--energy)] px-3.5 py-2 rounded-full text-sm font-semibold">

              <Flame size={16} />

              {streak} day streak

            </div>

          </Card>


          {/* ==================================================
              WORKOUT
          ================================================== */}

          {todaysWorkout ? (

            <WorkoutCard
              workout={todaysWorkout}
            />

          ) : (

            <Card className="p-6">

              <h3 className="font-display font-bold text-lg mb-1">
                No workout yet
              </h3>

              <p className="text-sm text-[var(--text-soft)]">
                Your workouts will appear here when they are available.
              </p>

            </Card>

          )}


          {/* ==================================================
              PROGRESS + GOAL
          ================================================== */}

          <div className="grid sm:grid-cols-2 gap-5">


            <Card className="p-5 flex items-center gap-5">

              <ProgressRing
                value={
                  progress.weekly_workouts > 0
                    ? Math.min(
                        progress.weekly_workouts * 20,
                        100
                      )
                    : 0
                }
                size={72}
                strokeWidth={7}
              >

                <span className="font-display font-bold text-sm">
                  {progress.total_workouts}
                </span>

              </ProgressRing>


              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-1">
                  Progress
                </p>

                <p className="font-display font-bold text-lg">
                  {progress.total_workouts} workouts
                </p>

                <p className="text-sm text-[var(--text-soft)]">
                  {progress.total_active_minutes} active minutes
                </p>

              </div>

            </Card>


            {firstGoal ? (

              <GoalCard
                goal={firstGoal}
              />

            ) : (

              <Card className="p-5">

                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-2">
                  Goals
                </p>

                <p className="font-display font-bold text-lg">
                  No goals yet
                </p>

                <p className="text-sm text-[var(--text-soft)] mt-1">
                  Create your first fitness goal.
                </p>

              </Card>

            )}

          </div>

        </div>


        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex flex-col gap-5">


          {/* ==================================================
              ACCOUNT
          ================================================== */}

          <Card className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-3">
              Your account
            </p>


            <p className="font-display font-bold text-lg">

              {displayName}

            </p>


            <p className="text-sm text-[var(--text-soft)] mt-1 break-all">

              {user?.email || "Account connected"}

            </p>


            {user?.phone && (

              <p className="text-sm text-[var(--text-soft)] mt-1">

                {user.phone}

              </p>

            )}


            <p className="text-sm text-[var(--text-soft)] mt-2">

              Your FitFlow account is connected.

            </p>

          </Card>


          {/* ==================================================
              OVERVIEW
          ================================================== */}

          <Card className="p-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-3">
              Overview
            </p>


            <div className="grid grid-cols-3 gap-3 text-center">


              <div>

                <p className="font-display font-bold text-xl">
                  {goals.length}
                </p>

                <p className="text-xs text-[var(--text-soft)]">
                  Goals
                </p>

              </div>


              <div>

                <p className="font-display font-bold text-xl">
                  {progress.total_workouts}
                </p>

                <p className="text-xs text-[var(--text-soft)]">
                  Workouts
                </p>

              </div>


              <div>

                <p className="font-display font-bold text-xl">
                  {courses.length}
                </p>

                <p className="text-xs text-[var(--text-soft)]">
                  Courses
                </p>

              </div>


            </div>

          </Card>

        </div>

      </div>


      {/* ==================================================
          COURSES
      ================================================== */}

      <section className="mb-8">

        <div className="flex items-center justify-between mb-4">

          <h2 className="font-display text-xl font-bold">
            Courses for you
          </h2>

          <Link
            to="/app/courses"
            className="text-sm font-medium text-[var(--primary)] flex items-center gap-1"
          >

            See all

            <ArrowRight size={14} />

          </Link>

        </div>


        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">

          {courses.length > 0 ? (

            courses.map((course) => (

              <CourseCard
                key={course.id}
                course={course}
              />

            ))

          ) : (

            <p className="text-sm text-[var(--text-soft)]">
              No courses available yet.
            </p>

          )}

        </div>

      </section>


      {/* ==================================================
          CONNECTION STATUS
      ================================================== */}

      <section>

        <Card className="p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-display font-bold">
                Backend connected
              </p>

              <p className="text-sm text-[var(--text-soft)] mt-1">
                FitFlow is loading data from your FastAPI backend.
              </p>

            </div>

            <div className="w-3 h-3 rounded-full bg-green-500" />

          </div>

        </Card>

      </section>

    </div>
  )
}