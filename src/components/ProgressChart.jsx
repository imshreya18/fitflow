import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import Card from '@/components/ui/Card'
import { weeklyActivity } from '@/data/mockData'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--text)] text-[var(--bg)] text-xs font-medium px-3 py-1.5 rounded-lg">
      {label}: {payload[0].value} min
    </div>
  )
}

export default function ProgressChart() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display font-bold text-lg">Weekly Activity</h3>
        <span className="text-sm text-[var(--text-soft)]">Minutes / day</span>
      </div>
      <div className="h-56 -ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-soft)', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-2)' }} />
            <Bar dataKey="minutes" radius={[8, 8, 8, 8]} maxBarSize={28}>
              {weeklyActivity.map((d, i) => (
                <Cell key={i} fill={d.completed ? 'var(--primary)' : 'var(--surface-3)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
