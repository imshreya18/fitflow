import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import Header from '@/components/layout/Header'
import CourseCard from '@/components/CourseCard'
import { courses, courseCategories } from '@/data/mockData'

export default function Courses() {
  const [category, setCategory] = useState('Recommended')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory = category === 'Recommended' ? true : c.category === category
      const matchesQuery = c.title.toLowerCase().includes(query.toLowerCase()) || c.instructor.toLowerCase().includes(query.toLowerCase())
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div>
      <Header title="Courses" subtitle="Find your next favorite workout" />

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-soft)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses or instructors"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none text-sm transition-colors"
          />
        </div>
        <button className="p-3 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors" aria-label="Filters">
          <SlidersHorizontal size={17} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 -mx-1 px-1">
        {courseCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors shrink-0 ${
              category === cat
                ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
                : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-soft)]">
          <p className="font-display text-lg font-semibold mb-1 text-[var(--text)]">No courses found</p>
          <p className="text-sm">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} wide />
          ))}
        </div>
      )}
    </div>
  )
}
