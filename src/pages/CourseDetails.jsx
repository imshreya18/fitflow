import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Star,
  Clock,
  BarChart3,
  ListChecks,
  CheckCircle2,
  Circle,
  Play,
} from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import VideoPlayer from '@/components/VideoPlayer'

import { getCourses } from '@/lib/api'
import { useAppState } from '@/context/AppStateContext'


export default function CourseDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const { showToast } = useAppState()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')


  // ==================================================
  // LOAD COURSE FROM BACKEND
  // ==================================================

  useEffect(() => {

    async function loadCourse() {

      try {

        setLoading(true)
        setError('')

        const data = await getCourses()

        console.log(
          'Course Details API:',
          data
        )

        const courses =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.courses)
              ? data.courses
              : Array.isArray(data?.data)
                ? data.data
                : []

        const foundCourse =
          courses.find(
            (item) =>
              String(item?.id) === String(id)
          )

        if (!foundCourse) {

          setError(
            'Course not found.'
          )

          setCourse(null)

          return
        }

        setCourse(foundCourse)

      } catch (err) {

        console.error(
          'Course details loading error:',
          err
        )

        setError(
          err?.message ||
          'Unable to load course.'
        )

        setCourse(null)

      } finally {

        setLoading(false)

      }

    }

    loadCourse()

  }, [id])


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div>

        <Header
          back
          title="Course"
        />

        <div className="flex items-center justify-center py-20">

          <p className="text-[var(--text-soft)]">
            Loading course...
          </p>

        </div>

      </div>

    )

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error || !course) {

    return (

      <div>

        <Header
          back
          title="Course"
        />

        <div className="text-center py-20">

          <p className="font-display text-lg font-semibold mb-2">
            Course not found
          </p>

          <p className="text-sm text-[var(--text-soft)] mb-5">
            {error || 'This course could not be loaded.'}
          </p>

          <Button
            onClick={() =>
              navigate('/app/courses')
            }
          >
            Back to Courses
          </Button>

        </div>

      </div>

    )

  }


  // ==================================================
  // LESSONS
  // ==================================================

  const lessons =
    Array.isArray(course.lessons)
      ? course.lessons
      : Array.isArray(course.courseLessons)
        ? course.courseLessons
        : []


  // ==================================================
  // ACTIVE LESSON
  // ==================================================

  const activeLesson =
    lessons.find(
      (lesson) =>
        lesson?.active
    ) ||
    lessons.find(
      (lesson) =>
        !lesson?.done
    ) ||
    lessons[0]


  // ==================================================
  // COURSE VALUES
  // ==================================================

  const duration =
    course.duration ||
    '—'

  const lessonCount =
    course.lessons_count ??
    course.lesson_count ??
    (Array.isArray(lessons)
      ? lessons.length
      : 0)

  const level =
    course.level ||
    '—'

  const rating =
    course.rating ??
    '—'

  const progress =
    Number(
      course.progress ??
      course.progress_percent ??
      0
    )


  // ==================================================
  // DESCRIPTION
  // ==================================================

  const description =
    course.description ||
    `A guided ${String(duration).toLowerCase()} program taught by ${
      course.instructor || 'your FitFlow coach'
    }, designed to help you build strength, confidence, and a sustainable fitness habit.`


  return (

    <div>

      <Header
        back
        title={course.title || 'Course'}
      />


      {/* ==================================================
          VIDEO
      ================================================== */}

      <VideoPlayer
        title={
          activeLesson?.title ||
          course.title ||
          'Course'
        }
        className="mb-6"
      />


      {/* ==================================================
          COURSE STATS
      ================================================== */}

      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-soft)] mb-5">

        <span className="flex items-center gap-1.5">

          <Clock size={16} />

          {duration}

        </span>


        <span className="flex items-center gap-1.5">

          <ListChecks size={16} />

          {lessonCount} workouts

        </span>


        <span className="flex items-center gap-1.5">

          <BarChart3 size={16} />

          {level}

        </span>


        <span className="flex items-center gap-1.5">

          <Star
            size={16}
            className="text-[var(--energy)] fill-current"
          />

          {rating}

        </span>

      </div>


      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <p className="text-[var(--text-soft)] leading-relaxed mb-6 max-w-2xl">

        {description}

      </p>


      {/* ==================================================
          COURSE PROGRESS
      ================================================== */}

      <Card className="p-5 mb-6">

        <div className="flex items-center justify-between mb-2.5">

          <p className="font-display font-semibold">
            Course Progress
          </p>

          <span className="text-sm font-semibold text-[var(--primary)]">
            {progress}%
          </span>

        </div>

        <ProgressBar
          value={progress}
        />

      </Card>


      {/* ==================================================
          START COURSE
      ================================================== */}

      <Button
        size="lg"
        className="w-full mb-8"
        onClick={() => {

          showToast(
            'Course started'
          )

          navigate('/app/workout')

        }}
      >

        <Play
          size={18}
          fill="currentColor"
        />

        Start Course

      </Button>


      {/* ==================================================
          LESSONS
      ================================================== */}

      <h2 className="font-display text-lg font-bold mb-4">
        Lessons
      </h2>


      {lessons.length === 0 ? (

        <Card className="p-6 text-center">

          <p className="text-[var(--text-soft)]">
            No lessons available for this course yet.
          </p>

        </Card>

      ) : (

        <div className="flex flex-col gap-2.5">

          {lessons.map(
            (lesson, i) => (

              <Card
                key={
                  lesson?.id ??
                  `${course.id}-lesson-${i}`
                }
                className={`p-4 flex items-center gap-4 ${
                  lesson?.active
                    ? 'border-[var(--primary)]'
                    : ''
                }`}
              >

                <div className="w-14 h-14 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0 relative overflow-hidden">

                  {lesson?.done ? (

                    <CheckCircle2
                      size={22}
                      className="text-[var(--primary)]"
                    />

                  ) : (

                    <Play
                      size={18}
                      className="text-[var(--text-soft)]"
                    />

                  )}

                </div>


                <div className="flex-1 min-w-0">

                  <p className="text-xs text-[var(--text-soft)] mb-0.5">

                    Day {i + 1}

                  </p>

                  <p className="font-medium truncate">

                    {lesson?.title ||
                      `Lesson ${i + 1}`}

                  </p>

                </div>


                {lesson?.duration && (

                  <span className="text-sm text-[var(--text-soft)] shrink-0">

                    {lesson.duration}

                  </span>

                )}


                {lesson?.done ? (

                  <CheckCircle2
                    size={20}
                    className="text-[var(--primary)] shrink-0"
                  />

                ) : (

                  <Circle
                    size={20}
                    className="text-[var(--border)] shrink-0"
                  />

                )}

              </Card>

            )
          )}

        </div>

      )}

    </div>

  )

}