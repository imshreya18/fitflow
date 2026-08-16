import { Link } from 'react-router-dom'
import { Flame, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import WorkoutCard from '@/components/WorkoutCard'
import QuoteCard from '@/components/QuoteCard'
import GoalCard from '@/components/GoalCard'
import CourseCard from '@/components/CourseCard'
import InterestChip from '@/components/InterestChip'
import CommunityPost from '@/components/CommunityPost'
import Card from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/Progress'
import {
  user,
  todaysWorkout,
  courses,
  interestCategories,
  communityPosts,
  goals,
} from '@/data/mockData'

export default function Home() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <Header />

      <div className="mb-7">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1.5">
          {greeting}, {user.name} 👋
        </h1>
        <p className="text-[var(--text-soft)]">Ready to keep your momentum going?</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card className="p-5 flex items-center justify-between bg-[var(--surface-2)] border-none">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-1">Today's Focus</p>
              <p className="font-display font-bold text-lg">Build consistency</p>
            </div>
            <div className="flex items-center gap-1.5 bg-[var(--energy-soft)] text-[var(--energy)] px-3.5 py-2 rounded-full text-sm font-semibold">
              <Flame size={16} /> {user.currentStreak} day streak
            </div>
          </Card>

          <WorkoutCard workout={todaysWorkout} />

          <div className="grid sm:grid-cols-2 gap-5">
            <Card className="p-5 flex items-center gap-5">
              <ProgressRing value={(todaysWorkout.minutesDone / todaysWorkout.minutesGoal) * 100} size={72} strokeWidth={7}>
                <span className="font-display font-bold text-sm">{todaysWorkout.minutesDone}/{todaysWorkout.minutesGoal}</span>
              </ProgressRing>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-1">Daily Progress</p>
                <p className="font-display font-bold text-lg">{todaysWorkout.minutesDone} / {todaysWorkout.minutesGoal} min</p>
                <p className="text-sm text-[var(--text-soft)]">Almost there today</p>
              </div>
            </Card>

            <GoalCard goal={goals[0]} />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <QuoteCard />
          <Card className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-soft)] mb-3">This week</p>
            <div className="flex items-center justify-between mb-4">
              <span className="font-display font-bold text-2xl">{user.completedThisWeek}/{user.weeklyGoalDays}</span>
              <span className="text-sm text-[var(--text-soft)]">workouts done</span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-lg ${i < user.completedThisWeek ? 'bg-[var(--primary)]' : 'bg-[var(--surface-3)]'}`}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Courses for you</h2>
          <Link to="/app/courses" className="text-sm font-medium text-[var(--primary)] flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold">Explore what interests you</h2>
          <Link to="/app/community" className="text-sm font-medium text-[var(--primary)] flex items-center gap-1">
            See all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-5 -mx-1 px-1">
          {interestCategories.map((c) => (
            <InterestChip key={c.id} emoji={c.emoji} label={c.label} active={user.interests.includes(c.label)} onClick={() => {}} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {communityPosts.slice(0, 2).map((p) => (
            <CommunityPost key={p.id} post={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
