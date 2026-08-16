import { useState } from 'react'
import Header from '@/components/layout/Header'
import InterestChip from '@/components/InterestChip'
import CommunityPost from '@/components/CommunityPost'
import { interestCategories, communityPosts, user } from '@/data/mockData'

export default function Community() {
  const [followed, setFollowed] = useState(user.interests)
  const [filter, setFilter] = useState(null)

  const toggleFollow = (label) => {
    setFollowed((prev) => (prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]))
  }

  const posts = filter ? communityPosts.filter((p) => p.interest === filter) : communityPosts

  return (
    <div className="max-w-3xl mx-auto">
      <Header back title="Explore what interests you" subtitle="A community-inspired feed, just for your goals" />

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-7 -mx-1 px-1">
        {interestCategories.map((c) => (
          <InterestChip
            key={c.id}
            emoji={c.emoji}
            label={c.label}
            active={followed.includes(c.label)}
            onClick={() => toggleFollow(c.label)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold">Fitness Community</h2>
        {filter && (
          <button onClick={() => setFilter(null)} className="text-sm font-medium text-[var(--primary)]">
            Clear filter
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {posts.map((p) => (
          <CommunityPost key={p.id} post={p} />
        ))}
      </div>
    </div>
  )
}
