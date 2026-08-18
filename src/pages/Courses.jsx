import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'

import Header from '@/components/layout/Header'
import CourseCard from '@/components/CourseCard'

import { getCourses } from '@/lib/api'


export default function Courses() {

  // ==================================================
  // COURSES
  // ==================================================

  const [courses, setCourses] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')


  // ==================================================
  // FILTERS
  // ==================================================

  const [category, setCategory] =
    useState('Recommended')

  const [query, setQuery] =
    useState('')


  // ==================================================
  // LOAD COURSES FROM BACKEND
  // ==================================================

  useEffect(() => {

    async function loadCourses() {

      try {

        setLoading(true)
        setError('')

        const data =
          await getCourses()

        console.log(
          'Courses API:',
          data
        )

        // ------------------------------------------
        // HANDLE DIFFERENT API RESPONSE SHAPES
        // ------------------------------------------

        const courseList =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.courses)
              ? data.courses
              : Array.isArray(data?.data)
                ? data.data
                : []

        setCourses(courseList)

      } catch (err) {

        console.error(
          'Courses loading error:',
          err
        )

        setCourses([])

        setError(
          err?.message ||
          'Unable to load courses'
        )

      } finally {

        setLoading(false)

      }

    }

    loadCourses()

  }, [])


  // ==================================================
  // CREATE CATEGORIES FROM REAL COURSES
  // ==================================================

  const courseCategories = useMemo(() => {

    const categories = courses
      .map((course) => course?.category)
      .filter(Boolean)

    return [
      'Recommended',
      ...Array.from(
        new Set(categories)
      ),
    ]

  }, [courses])


  // ==================================================
  // FILTER COURSES
  // ==================================================

  const filtered = useMemo(() => {

    const search =
      query.trim().toLowerCase()

    return courses.filter((course) => {

      const matchesCategory =
        category === 'Recommended'
          ? true
          : course?.category === category

      const title =
        String(
          course?.title || ''
        ).toLowerCase()

      const instructor =
        String(
          course?.instructor || ''
        ).toLowerCase()

      const description =
        String(
          course?.description || ''
        ).toLowerCase()

      const matchesQuery =
        !search ||
        title.includes(search) ||
        instructor.includes(search) ||
        description.includes(search)

      return (
        matchesCategory &&
        matchesQuery
      )

    })

  }, [
    courses,
    category,
    query,
  ])


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div>

        <Header
          title="Courses"
          subtitle="Find your next favorite workout"
        />

        <div className="flex items-center justify-center py-20">

          <p className="text-[var(--text-soft)]">
            Loading courses...
          </p>

        </div>

      </div>

    )

  }


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div>

      <Header
        title="Courses"
        subtitle="Find your next favorite workout"
      />


      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="flex items-center gap-3 mb-5">

        <div className="flex-1 relative">

          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-soft)]"
          />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search courses or instructors"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--surface-2)] border border-transparent focus:border-[var(--primary)] focus:bg-[var(--surface)] outline-none text-sm transition-colors"
          />

        </div>


        <button
          type="button"
          className="p-3 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors"
          aria-label="Filters"
        >

          <SlidersHorizontal
            size={17}
          />

        </button>

      </div>


      {/* ==================================================
          CATEGORIES
      ================================================== */}

      {courseCategories.length > 1 && (

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6 -mx-1 px-1">

          {courseCategories.map(
            (cat) => (

              <button
                key={cat}
                type="button"
                onClick={() =>
                  setCategory(cat)
                }
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors shrink-0 ${
                  category === cat
                    ? 'bg-[var(--primary)] text-[var(--primary-fg)] border-[var(--primary)]'
                    : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
                }`}
              >

                {cat}

              </button>

            )
          )}

        </div>

      )}


      {/* ==================================================
          API ERROR
      ================================================== */}

      {error && (

        <div className="mb-5 p-4 rounded-2xl bg-red-500/5 border border-red-500/20">

          <p className="text-sm text-red-500">
            {error}
          </p>

        </div>

      )}


      {/* ==================================================
          COURSES
      ================================================== */}

      {filtered.length === 0 ? (

        <div className="text-center py-16 text-[var(--text-soft)]">

          <p className="font-display text-lg font-semibold mb-1 text-[var(--text)]">
            No courses found
          </p>

          <p className="text-sm">
            Try a different search or category.
          </p>

        </div>

      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {filtered.map(
            (course) => (

              <CourseCard
                key={course.id}
                course={course}
                wide
              />

            )
          )}

        </div>

      )}

    </div>

  )

}