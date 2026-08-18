import { useEffect, useState } from 'react'

import Header from '@/components/layout/Header'
import InterestChip from '@/components/InterestChip'
import CommunityPost from '@/components/CommunityPost'

import {
  interestCategories,
  communityPosts,
} from '@/data/mockData'

import { getCurrentUser } from '@/lib/api'


export default function Community() {

  // ==================================================
  // USER
  // ==================================================

  const [user, setUser] = useState(null)

  const [followed, setFollowed] = useState([])

  const [filter, setFilter] = useState(null)


  // ==================================================
  // LOAD REAL LOGGED-IN USER
  // ==================================================

  useEffect(() => {

    async function loadUser() {

      try {

        const currentUser =
          await getCurrentUser()

        console.log(
          'Community user:',
          currentUser
        )

        setUser(currentUser)


        // ------------------------------------------
        // GET USER INTERESTS
        // ------------------------------------------

        const interests =
          Array.isArray(
            currentUser?.interests
          )
            ? currentUser.interests
            : Array.isArray(
                currentUser?.user_metadata?.interests
              )
              ? currentUser.user_metadata.interests
              : []


        setFollowed(interests)

      } catch (err) {

        console.error(
          'Community user error:',
          err
        )

        setUser(null)
        setFollowed([])

      }

    }

    loadUser()

  }, [])


  // ==================================================
  // TOGGLE INTEREST
  // ==================================================

  const toggleFollow = (label) => {

    setFollowed(
      (previous) =>
        previous.includes(label)

          ? previous.filter(
              (interest) =>
                interest !== label
            )

          : [
              ...previous,
              label,
            ]
    )

  }


  // ==================================================
  // FILTER POSTS
  // ==================================================

  const posts =
    filter

      ? communityPosts.filter(
          (post) =>
            post.interest === filter
        )

      : communityPosts


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div className="max-w-3xl mx-auto">

      <Header
        back
        title="Explore what interests you"
        subtitle="A community-inspired feed, just for your goals"
      />


      {/* ==================================================
          INTERESTS
      ================================================== */}

      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-7 -mx-1 px-1">

        {interestCategories.map(
          (category) => (

            <InterestChip
              key={category.id}

              emoji={category.emoji}

              label={category.label}

              active={
                followed.includes(
                  category.label
                )
              }

              onClick={() =>
                toggleFollow(
                  category.label
                )
              }
            />

          )
        )}

      </div>


      {/* ==================================================
          COMMUNITY HEADER
      ================================================== */}

      <div className="flex items-center justify-between mb-4">

        <h2 className="font-display text-lg font-bold">
          Fitness Community
        </h2>


        {filter && (

          <button
            type="button"
            onClick={() =>
              setFilter(null)
            }
            className="text-sm font-medium text-[var(--primary)]"
          >
            Clear filter
          </button>

        )}

      </div>


      {/* ==================================================
          COMMUNITY POSTS
      ================================================== */}

      <div className="grid sm:grid-cols-2 gap-4">

        {posts.length > 0 ? (

          posts.map(
            (post) => (

              <CommunityPost
                key={post.id}
                post={post}
              />

            )
          )

        ) : (

          <div className="sm:col-span-2 text-center py-12">

            <p className="text-[var(--text-soft)]">
              No community posts found.
            </p>

          </div>

        )}

      </div>

    </div>

  )

}