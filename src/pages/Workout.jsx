import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Music2,
  CheckCircle2,
  PartyPopper,
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { ProgressBar, ProgressRing } from '@/components/ui/Progress'
import { getWorkouts } from '@/lib/api'
import { useAppState } from '@/context/AppStateContext'


export default function Workout() {
  const navigate = useNavigate()
  const { showToast } = useAppState()

  const [exercises, setExercises] = useState([])
  const [workoutTitle, setWorkoutTitle] =
    useState('Today’s Workout')

  const [activeIndex, setActiveIndex] = useState(0)
  const [setsDone, setSetsDone] = useState(0)

  const [resting, setResting] = useState(false)
  const [restTime, setRestTime] = useState(0)

  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ==================================================
  // LOAD REAL USER WORKOUT
  // ==================================================

  useEffect(() => {
    async function loadWorkout() {
      try {
        setLoading(true)
        setError('')

        const data = await getWorkouts()

        console.log(
          'Workout API data:',
          data
        )

        // ------------------------------------------
        // HANDLE DIFFERENT API RESPONSE SHAPES
        // ------------------------------------------

        let workoutList = []

        if (Array.isArray(data)) {
          workoutList = data
        } else if (Array.isArray(data?.workouts)) {
          workoutList = data.workouts
        } else if (Array.isArray(data?.exercises)) {
          workoutList = data.exercises
        } else if (data?.workout) {
          workoutList = [data.workout]
        }

        // ------------------------------------------
        // NO WORKOUT
        // ------------------------------------------

        if (workoutList.length === 0) {
          setExercises([])
          setError(
            'No workout is available for you yet.'
          )
          return
        }

        // ------------------------------------------
        // FIND TODAY'S WORKOUT
        // ------------------------------------------

        const workout =
          workoutList.find(
            (item) =>
              item?.is_today === true ||
              item?.today === true ||
              item?.isToday === true
          ) ||
          workoutList[0]

        // ------------------------------------------
        // WORKOUT TITLE
        // ------------------------------------------

        setWorkoutTitle(
          workout?.title ||
          workout?.name ||
          'Today’s Workout'
        )

        // ------------------------------------------
        // EXERCISES
        // ------------------------------------------

        const apiExercises =
          Array.isArray(workout?.exercises)
            ? workout.exercises
            : Array.isArray(workout?.workout_exercises)
              ? workout.workout_exercises
              : Array.isArray(data?.exercises)
                ? data.exercises
                : Array.isArray(data)
                  ? data
                  : []

        const normalizedExercises =
          apiExercises.map(
            (exercise, index) => ({
              id:
                exercise?.id ??
                exercise?.exercise_id ??
                index,

              name:
                exercise?.name ||
                exercise?.title ||
                `Exercise ${index + 1}`,

              sets:
                Number(
                  exercise?.sets ??
                  exercise?.total_sets ??
                  1
                ),

              reps:
                exercise?.reps ??
                exercise?.repetitions ??
                10,

              unit:
                exercise?.unit ||
                'reps',

              restSeconds:
                Number(
                  exercise?.restSeconds ??
                  exercise?.rest_seconds ??
                  30
                ),

              done: false,
            })
          )

        setExercises(normalizedExercises)

        // ------------------------------------------
        // ACTIVE EXERCISE
        // ------------------------------------------

        const firstActiveIndex =
          normalizedExercises.findIndex(
            (exercise) =>
              exercise.active === true ||
              exercise.current === true
          )

        setActiveIndex(
          firstActiveIndex >= 0
            ? firstActiveIndex
            : 0
        )

        setSetsDone(0)

      } catch (err) {
        console.error(
          'Workout loading error:',
          err
        )

        setError(
          err?.message ||
          'Unable to load your workout.'
        )

      } finally {
        setLoading(false)
      }
    }

    loadWorkout()
  }, [])


  // ==================================================
  // CURRENT EXERCISE
  // ==================================================

  const current =
    exercises[activeIndex]


  // ==================================================
  // REST TIMER
  // ==================================================

  useEffect(() => {
    if (!resting) {
      return
    }

    if (restTime <= 0) {
      setResting(false)
      return
    }

    const timer = setTimeout(() => {
      setRestTime(
        (previous) => previous - 1
      )
    }, 1000)

    return () => clearTimeout(timer)
  }, [resting, restTime])


  // ==================================================
  // COMPLETE SET
  // ==================================================

  const completeSet = () => {
    if (!current) {
      return
    }

    if (setsDone < current.sets) {
      setSetsDone(
        (previous) => previous + 1
      )

      if (current.restSeconds > 0) {
        setResting(true)
        setRestTime(
          current.restSeconds
        )
      }

      return
    }

    goToNext()
  }


  // ==================================================
  // NEXT EXERCISE
  // ==================================================

  const goToNext = () => {
    setExercises(
      (previous) =>
        previous.map(
          (exercise, index) =>
            index === activeIndex
              ? {
                  ...exercise,
                  done: true,
                }
              : exercise
        )
    )

    if (
      activeIndex <
      exercises.length - 1
    ) {
      setActiveIndex(
        (previous) =>
          previous + 1
      )

      setSetsDone(0)
      setResting(false)
      setRestTime(0)

    } else {
      setFinished(true)
    }
  }


  // ==================================================
  // SKIP EXERCISE
  // ==================================================

  const skip = () => {
    showToast(
      'Exercise skipped'
    )

    goToNext()
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <p className="text-sm text-[var(--text-soft)]">
          Loading your workout...
        </p>
      </div>
    )
  }


  // ==================================================
  // ERROR / EMPTY WORKOUT
  // ==================================================

  if (
    !loading &&
    exercises.length === 0
  ) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

        <div className="w-20 h-20 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-6">
          <Music2 size={32} />
        </div>

        <h1 className="font-display text-2xl font-bold mb-2">
          No workout available
        </h1>

        <p className="text-[var(--text-soft)] mb-8 max-w-sm">
          {error ||
            'Complete your onboarding or create a workout to get started.'}
        </p>

        <Button
          size="lg"
          onClick={() =>
            navigate('/app/home')
          }
        >
          Back to Home
        </Button>

      </div>
    )
  }


  // ==================================================
  // WORKOUT COMPLETE
  // ==================================================

  if (finished) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

        <motion.div
          initial={{
            scale: 0.7,
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
          <div className="w-20 h-20 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto mb-6">

            <PartyPopper size={32} />

          </div>
        </motion.div>


        <h1 className="font-display text-2xl font-bold mb-2">
          Workout complete! 🎉
        </h1>


        <p className="text-[var(--text-soft)] mb-8 max-w-xs">
          Great work finishing{' '}
          {workoutTitle}.
          Keep building your consistency!
        </p>


        <div className="flex gap-3">

          <Button
            size="lg"
            onClick={() =>
              navigate('/app/home')
            }
          >
            Back to Home
          </Button>


          <Button
            size="lg"
            variant="secondary"
            onClick={() =>
              navigate('/app/progress')
            }
          >
            View Progress
          </Button>

        </div>

      </div>
    )
  }


  // ==================================================
  // MAIN WORKOUT
  // ==================================================

  return (
    <div className="max-w-lg mx-auto">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="flex items-center justify-between mb-6">

        <button
          type="button"
          onClick={() =>
            navigate('/app/home')
          }
          aria-label="Close workout"
          className="p-2 -ml-2 rounded-full hover:bg-[var(--surface-2)] transition-colors"
        >
          <X size={22} />
        </button>


        <p className="text-sm font-medium text-[var(--text-soft)]">
          Exercise {activeIndex + 1} of{' '}
          {exercises.length}
        </p>


        <button
          type="button"
          onClick={() =>
            navigate('/app/music')
          }
          aria-label="Music"
          className="p-2 -mr-2 rounded-full hover:bg-[var(--surface-2)] transition-colors"
        >
          <Music2 size={20} />
        </button>

      </div>


      {/* ==================================================
          PROGRESS BAR
      ================================================== */}

      <ProgressBar
        value={
          (
            (
              activeIndex +
              (
                current?.sets
                  ? setsDone /
                    current.sets
                  : 0
              )
            ) /
            exercises.length
          ) * 100
        }
        className="mb-8"
      />


      {/* ==================================================
          EXERCISE
      ================================================== */}

      <AnimatePresence mode="wait">

        <motion.div
          key={activeIndex}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -12,
          }}
          transition={{
            duration: 0.3,
          }}
        >

          <p className="text-center text-sm font-semibold text-[var(--primary)] mb-1.5">
            {workoutTitle}
          </p>


          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">
            {current.name}
          </h1>


          <p className="text-center text-[var(--text-soft)] mb-8">
            {current.sets} × {current.reps}
            {current.unit === 'sec'
              ? ' sec'
              : ''}
          </p>


          {/* ==================================================
              REST / SET RING
          ================================================== */}

          <div className="flex justify-center mb-8">

            {resting ? (

              <ProgressRing
                value={
                  current.restSeconds > 0
                    ? (
                        restTime /
                        current.restSeconds
                      ) * 100
                    : 0
                }
                size={180}
                strokeWidth={12}
                color="var(--energy)"
              >

                <div className="text-center">

                  <p className="font-display text-4xl font-bold">
                    {restTime}
                  </p>

                  <p className="text-xs text-[var(--text-soft)] uppercase tracking-wide mt-1">
                    Rest
                  </p>

                </div>

              </ProgressRing>

            ) : (

              <ProgressRing
                value={
                  current.sets > 0
                    ? (
                        setsDone /
                        current.sets
                      ) * 100
                    : 0
                }
                size={180}
                strokeWidth={12}
              >

                <div className="text-center">

                  <p className="font-display text-4xl font-bold">
                    {setsDone}/{current.sets}
                  </p>

                  <p className="text-xs text-[var(--text-soft)] uppercase tracking-wide mt-1">
                    Sets
                  </p>

                </div>

              </ProgressRing>

            )}

          </div>


          {/* ==================================================
              SET INDICATORS
          ================================================== */}

          <div className="flex justify-center gap-2 mb-10">

            {Array.from({
              length: current.sets,
            }).map((_, index) => (

              <div
                key={index}
                className="flex flex-col items-center gap-1.5"
              >

                {index < setsDone ? (

                  <CheckCircle2
                    size={22}
                    className="text-[var(--primary)]"
                  />

                ) : (

                  <div className="w-[22px] h-[22px] rounded-full border-2 border-[var(--border)]" />

                )}

                <span className="text-xs text-[var(--text-soft)]">
                  Set {index + 1}
                </span>

              </div>

            ))}

          </div>

        </motion.div>

      </AnimatePresence>


      {/* ==================================================
          ACTION BUTTONS
      ================================================== */}

      <div className="flex flex-col gap-3">

        <Button
          size="lg"
          onClick={
            resting
              ? () => setResting(false)
              : completeSet
          }
        >
          {resting
            ? 'Skip Rest'
            : setsDone < current.sets
              ? 'Complete Set'
              : 'Next Exercise'}
        </Button>


        <Button
          variant="secondary"
          size="md"
          onClick={skip}
        >
          Skip Exercise
        </Button>

      </div>

    </div>
  )
}