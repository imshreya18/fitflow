import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2 } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { cx } from '@/lib/utils'

export default function CommunityPost({ post }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const toggleLike = () => {
    setLiked((v) => !v)
    setLikeCount((c) => (liked ? c - 1 : c + 1))
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center text-xs font-semibold">
            {post.author.split(' ').map((p) => p[0]).join('')}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-medium">{post.author}</p>
            <p className="text-xs text-[var(--text-soft)]">{post.time}</p>
          </div>
        </div>
        <Badge tone="primary">{post.interest}</Badge>
      </div>

      <h3 className="font-display font-semibold leading-snug">{post.title}</h3>

      <div className="flex items-center gap-1 pt-1 -ml-2">
        <button
          onClick={toggleLike}
          className={cx('flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors', liked ? 'text-[var(--energy)]' : 'text-[var(--text-soft)] hover:bg-[var(--surface-2)]')}
        >
          <Heart size={17} className={cx(liked && 'fill-current')} /> {likeCount}
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-[var(--text-soft)] hover:bg-[var(--surface-2)] transition-colors">
          <MessageCircle size={17} /> {post.comments}
        </button>
        <button
          onClick={() => setSaved((v) => !v)}
          className={cx('flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ml-auto', saved ? 'text-[var(--primary)]' : 'text-[var(--text-soft)] hover:bg-[var(--surface-2)]')}
        >
          <Bookmark size={17} className={cx(saved && 'fill-current')} /> Save
        </button>
        <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium text-[var(--text-soft)] hover:bg-[var(--surface-2)] transition-colors">
          <Share2 size={17} />
        </button>
      </div>
    </Card>
  )
}
