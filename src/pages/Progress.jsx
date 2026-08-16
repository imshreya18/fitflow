import { Link } from 'react-router-dom'
import { Flame, CalendarCheck, Clock, Target, TrendingUp, Award, ArrowRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import StatCard from '@/components/StatCard'
import ProgressChart from '@/components/ProgressChart'
import { user } from '@/data/mockData'

export default function Progress() {
  return (
    <div>
      <Header title="Your Progress" subtitle="Every workout counts." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} label="Day streak" value={user.currentStreak} tone="energy" />
        <StatCard icon={CalendarCheck} label="Workouts this week" value={`${user.completedThisWeek}/${user.weeklyGoalDays}`} tone="primary" />
        <StatCard icon={Clock} label="Active time" value="2h 15m" tone="neutral" />
        <StatCard icon={Target} label="Goal progress" value={`${user.goalProgress}%`} tone="primary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>

        <Card className="p-5 sm:p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-[var(--primary)]" />
            <h3 className="font-display font-bold text-lg">Consistency</h3>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[var(--text-soft)]">This week</span>
            <span className="font-display font-bold text-xl">80%</span>
          </div>
          <div className="h-2 rounded-full bg-[var(--surface-3)] mb-4 overflow-hidden">
            <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '80%' }} />
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[var(--text-soft)]">Last week</span>
            <span className="font-display font-semibold text-[var(--text-soft)]">65%</span>
          </div>
          <div className="mt-auto bg-[var(--primary-soft)] text-[var(--primary)] text-sm rounded-xl p-3.5 leading-snug">
            You're becoming more consistent. Keep the streak alive!
          </div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award size={18} className="text-[var(--primary)]" />
            <h3 className="font-display font-bold text-lg">Personal Records</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-display text-xl font-bold">{user.longestStreak} days</p>
              <p className="text-xs text-[var(--text-soft)]">Longest streak</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">Friday</p>
              <p className="text-xs text-[var(--text-soft)]">Most active day</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">{user.totalWorkouts}</p>
              <p className="text-xs text-[var(--text-soft)]">Total workouts</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold">2h 15m</p>
              <p className="text-xs text-[var(--text-soft)]">Total active time</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-3">
          <Link to="/app/goals" className="flex items-center justify-between p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] card-shadow hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-[var(--primary)]" />
              <span className="font-medium">View your Goals</span>
            </div>
            <ArrowRight size={18} className="text-[var(--text-soft)]" />
          </Link>
          <Link to="/app/streaks" className="flex items-center justify-between p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] card-shadow hover:-translate-y-0.5 transition-transform">
            <div className="flex items-center gap-3">
              <Flame size={20} className="text-[var(--energy)]" />
              <span className="font-medium">View your Streak</span>
            </div>
            <ArrowRight size={18} className="text-[var(--text-soft)]" />
          </Link>
        </div>
      </div>
    </div>
  )
}
