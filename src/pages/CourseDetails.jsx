import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, BarChart3, ListChecks, CheckCircle2, Circle, Play } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import VideoPlayer from '@/components/VideoPlayer'
import { courses, courseLessons } from '@/data/mockData'
import { useAppState } from '@/context/AppStateContext'

export default function CourseDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useAppState()
  const course = courses.find((c) => c.id === id) || courses[0]
  const lessons = courseLessons[id] || courseLessons.c1

  return (
    <div>
      <Header back title={course.title} />

      <VideoPlayer title={lessons.find((l) => l.active)?.title || lessons[0].title} className="mb-6" />

      <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-soft)] mb-5">
        <span className="flex items-center gap-1.5"><Clock size={16} /> {course.duration}</span>
        <span className="flex items-center gap-1.5"><ListChecks size={16} /> {course.lessons} workouts</span>
        <span className="flex items-center gap-1.5"><BarChart3 size={16} /> {course.level}</span>
        <span className="flex items-center gap-1.5"><Star size={16} className="text-[var(--energy)] fill-current" /> {course.rating}</span>
      </div>

      <p className="text-[var(--text-soft)] leading-relaxed mb-6 max-w-2xl">
        A guided, {course.duration.toLowerCase()} program taught by {course.instructor} — built to help you build strength,
        confidence, and a sustainable habit, one session at a time. No equipment required.
      </p>

      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <p className="font-display font-semibold">Course Progress</p>
          <span className="text-sm font-semibold text-[var(--primary)]">{course.progress}%</span>
        </div>
        <ProgressBar value={course.progress} />
      </Card>

      <Button size="lg" className="w-full mb-8" onClick={() => { showToast('Course started'); navigate('/app/workout') }}>
        <Play size={18} fill="currentColor" /> Start Course
      </Button>

      <h2 className="font-display text-lg font-bold mb-4">Lessons</h2>
      <div className="flex flex-col gap-2.5">
        {lessons.map((lesson, i) => (
          <Card
            key={lesson.id}
            className={`p-4 flex items-center gap-4 ${lesson.active ? 'border-[var(--primary)]' : ''}`}
          >
            <div className="w-14 h-14 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0 relative overflow-hidden">
              {lesson.done ? (
                <CheckCircle2 size={22} className="text-[var(--primary)]" />
              ) : (
                <Play size={18} className="text-[var(--text-soft)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-soft)] mb-0.5">Day {i + 1}</p>
              <p className="font-medium truncate">{lesson.title}</p>
            </div>
            <span className="text-sm text-[var(--text-soft)] shrink-0">{lesson.duration}</span>
            {lesson.done ? (
              <CheckCircle2 size={20} className="text-[var(--primary)] shrink-0" />
            ) : (
              <Circle size={20} className="text-[var(--border)] shrink-0" />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
