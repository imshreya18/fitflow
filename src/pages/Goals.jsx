import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Circle, Plus, Pencil } from 'lucide-react'

import Header from '@/components/layout/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ProgressRing } from '@/components/ui/Progress'
import { getGoals } from '@/lib/api'
import { useAppState } from '@/context/AppStateContext'

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const { showToast } = useAppState()

  useEffect(() => {
    async function loadGoals() {
      try {
        setLoading(true)

        const data = await getGoals()

        console.log('Goals API response:', data)

        const userGoals = Array.isArray(data)
          ? data
          : Array.isArray(data?.goals)
            ? data.goals
            : []

        setGoals(userGoals)
      } catch (error) {
        console.error('Failed to load goals:', error)
        setGoals([])
        showToast('Failed to load your goals')
      } finally {
        setLoading(false)
      }
    }

    loadGoals()
  }, [showToast])

  const normalizedGoals = useMemo(() => {
    return goals.map((goal, index) => {
      const target = Number(goal?.target ?? 0)
      const current = Number(goal?.current ?? 0)

      let progress = Number(goal?.progress ?? 0)

      if (
        !goal?.progress &&
        target > 0
      ) {
        progress = Math.round(
          Math.min(
            (current / target) * 100,
            100
          )
        )
      }

      return {
        ...goal,

        id: goal?.id ?? index,

        title:
          goal?.title ||
          goal?.name ||
          goal?.goal ||
          'Fitness Goal',

        emoji:
          goal?.emoji ||
          '🎯',

        target,

        current,

        unit:
          goal?.unit ||
          '',

        progress: Math.max(
          0,
          Math.min(progress, 100)
        ),

        primary:
          Boolean(goal?.primary) ||
          Boolean(goal?.is_primary),
      }
    })
  }, [goals])

  const primary =
    normalizedGoals.find(
      (goal) => goal.primary
    ) ||
    normalizedGoals[0] ||
    null

  const otherGoals =
    normalizedGoals.filter(
      (goal) => goal.id !== primary?.id
    )

  const milestones = useMemo(() => {
    if (!primary) {
      return []
    }

    const progress = primary.progress

    return [
      {
        id: 'milestone-25',
        title: 'Reach 25% of your goal',
        done: progress >= 25,
      },
      {
        id: 'milestone-50',
        title: 'Reach 50% of your goal',
        done: progress >= 50,
      },
      {
        id: 'milestone-75',
        title: 'Reach 75% of your goal',
        done: progress >= 75,
      },
      {
        id: 'milestone-100',
        title: 'Complete your main goal',
        done: progress >= 100,
      },
    ]
  }, [primary])

  if (loading) {
    return (
      <div>
        <Header
          title="Goals"
          subtitle="Set the pace, we'll help you keep it."
        />

        <Card className="p-8 text-center">
          <p className="text-[var(--text-soft)]">
            Loading your goals...
          </p>
        </Card>
      </div>
    )
  }

  if (!primary) {
    return (
      <div>
        <Header
          title="Goals"
          subtitle="Set the pace, we'll help you keep it."
        />

        <Card className="p-8 text-center">
          <div className="text-4xl mb-3">
            🎯
          </div>

          <h2 className="font-display text-xl font-bold mb-2">
            No goals yet
          </h2>

          <p className="text-[var(--text-soft)] mb-5">
            Create your first fitness goal to start
            tracking your progress.
          </p>

          <Button
            variant="secondary"
            onClick={() =>
              showToast('Goal creator opened')
            }
          >
            <Plus size={15} />
            Add Goal
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Header
        title="Goals"
        subtitle="Set the pace, we'll help you keep it."
      />

      {/* PRIMARY GOAL */}

      <Card className="p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center gap-6 bg-[var(--primary)] border-none">

        <ProgressRing
          value={primary.progress}
          size={110}
          strokeWidth={9}
          color="white"
          trackColor="rgba(255,255,255,0.25)"
        >
          <span className="font-display font-bold text-xl text-white">
            {primary.progress}%
          </span>
        </ProgressRing>

        <div className="flex-1 text-center sm:text-left">

          <p className="text-white/70 text-sm font-medium mb-1">
            {primary.emoji} Main Goal
          </p>

          <h1 className="font-display text-2xl font-bold text-white mb-2">
            {primary.title}
          </h1>

          <p className="text-white/80">
            Target: {primary.target} {primary.unit}
            {' · '}
            Current: {primary.current}
          </p>

        </div>

        <Button
          variant="secondary"
          className="bg-white/15 text-white hover:bg-white/25 shrink-0"
          onClick={() =>
            showToast('Goal editor opened')
          }
        >
          <Pencil size={15} />
          Edit Goal
        </Button>

      </Card>

      {/* MILESTONES */}

      <h2 className="font-display text-lg font-bold mb-4">
        Milestones
      </h2>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">

        {milestones.map((milestone) => (
          <Card
            key={milestone.id}
            className={`p-4 flex items-center gap-3 ${
              milestone.done
                ? 'bg-[var(--primary-soft)] border-none'
                : ''
            }`}
          >

            {milestone.done ? (
              <CheckCircle2
                size={22}
                className="text-[var(--primary)] shrink-0"
              />
            ) : (
              <Circle
                size={22}
                className="text-[var(--border)] shrink-0"
              />
            )}

            <span
              className={`font-medium ${
                milestone.done
                  ? 'text-[var(--primary)]'
                  : 'text-[var(--text-soft)]'
              }`}
            >
              {milestone.title}
            </span>

          </Card>
        ))}

      </div>

      {/* OTHER GOALS */}

      <div className="flex items-center justify-between mb-4">

        <h2 className="font-display text-lg font-bold">
          Other Goals
        </h2>

        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            showToast('New goal creator opened')
          }
        >
          <Plus size={15} />
          Add Goal
        </Button>

      </div>

      {otherGoals.length === 0 ? (
        <Card className="p-5">
          <p className="text-sm text-[var(--text-soft)]">
            You don't have any other goals yet.
          </p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">

          {otherGoals.map((goal) => (
            <Card
              key={goal.id}
              className="p-5 flex items-center gap-4"
            >

              <ProgressRing
                value={goal.progress}
                size={60}
                strokeWidth={6}
              >
                <span className="text-xs font-bold">
                  {goal.progress}%
                </span>
              </ProgressRing>

              <div>

                <p className="font-display font-semibold">
                  {goal.emoji} {goal.title}
                </p>

                <p className="text-sm text-[var(--text-soft)]">
                  {goal.current} / {goal.target}{' '}
                  {goal.unit}
                </p>

              </div>

            </Card>
          ))}

        </div>
      )}

    </div>
  )
}
