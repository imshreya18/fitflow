import { useEffect, useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts'

import Card from '@/components/ui/Card'
import { apiFetch } from '@/lib/api'


// ==================================================
// CUSTOM TOOLTIP
// ==================================================

function CustomTooltip({ active, payload, label }) {

  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="bg-[var(--text)] text-[var(--bg)] text-xs font-medium px-3 py-1.5 rounded-lg">
      {label}: {payload[0].value} min
    </div>
  )
}


// ==================================================
// DATE HELPERS
// ==================================================

function getStartOfWeek(date) {

  const result = new Date(date)

  const day = result.getDay()

  const diff = day === 0 ? -6 : 1 - day

  result.setDate(
    result.getDate() + diff
  )

  result.setHours(0, 0, 0, 0)

  return result
}


function getDayName(date) {

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
    }
  )
}


// ==================================================
// PROGRESS CHART
// ==================================================

export default function ProgressChart() {

  const [history, setHistory] = useState([])

  const [loading, setLoading] = useState(true)


  // ==================================================
  // LOAD REAL WORKOUT HISTORY
  // ==================================================

  useEffect(() => {

    async function loadHistory() {

      try {

        const data = await apiFetch(
          '/api/workouts/history/all'
        )

        console.log(
          'REAL WORKOUT HISTORY:',
          data
        )


        const sessions =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.history)
              ? data.history
              : []


        setHistory(sessions)

      } catch (error) {

        console.error(
          'Progress chart error:',
          error
        )

        setHistory([])

      } finally {

        setLoading(false)

      }

    }


    loadHistory()

  }, [])


  // ==================================================
  // BUILD CURRENT WEEK DATA
  // ==================================================

  const weeklyActivity = useMemo(() => {

    const today = new Date()

    const weekStart =
      getStartOfWeek(today)


    const days = Array.from(
      { length: 7 },
      (_, index) => {

        const date =
          new Date(weekStart)

        date.setDate(
          weekStart.getDate() + index
        )

        return date

      }
    )


    return days.map((day) => {

      const dayKey =
        day.toISOString().slice(0, 10)


      let minutes = 0


      history.forEach((session) => {

        // Only completed workouts count
        if (!session?.completed) {
          return
        }


        if (!session?.completed_at) {
          return
        }


        const completedDate =
          new Date(session.completed_at)


        const completedKey =
          completedDate
            .toISOString()
            .slice(0, 10)


        if (completedKey === dayKey) {

          minutes +=
            Number(
              session.duration_minutes
            ) || 0

        }

      })


      return {

        day: getDayName(day),

        minutes,

        completed: minutes > 0,

      }

    })

  }, [history])


  // ==================================================
  // LOADING STATE
  // ==================================================

  if (loading) {

    return (

      <Card className="p-5 sm:p-6">

        <div className="flex items-center justify-between mb-1">

          <h3 className="font-display font-bold text-lg">
            Weekly Activity
          </h3>

          <span className="text-sm text-[var(--text-soft)]">
            Minutes / day
          </span>

        </div>


        <div className="h-56 flex items-center justify-center">

          <p className="text-sm text-[var(--text-soft)]">
            Loading activity...
          </p>

        </div>

      </Card>

    )

  }


  // ==================================================
  // CHART
  // ==================================================

  return (

    <Card className="p-5 sm:p-6">

      <div className="flex items-center justify-between mb-1">

        <h3 className="font-display font-bold text-lg">
          Weekly Activity
        </h3>

        <span className="text-sm text-[var(--text-soft)]">
          Minutes / day
        </span>

      </div>


      <div className="h-56 -ml-3">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <BarChart
            data={weeklyActivity}
            margin={{
              top: 16,
              right: 8,
              left: 0,
              bottom: 0,
            }}
          >

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: 'var(--text-soft)',
                fontSize: 12,
              }}
            />


            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: 'var(--surface-2)',
              }}
            />


            <Bar
              dataKey="minutes"
              radius={[
                8,
                8,
                8,
                8,
              ]}
              maxBarSize={28}
            >

              {weeklyActivity.map(
                (day, index) => (

                  <Cell
                    key={index}
                    fill={
                      day.completed
                        ? 'var(--primary)'
                        : 'var(--surface-3)'
                    }
                  />

                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </Card>

  )

}