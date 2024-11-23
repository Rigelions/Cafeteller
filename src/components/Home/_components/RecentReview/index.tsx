import React from 'react'
import {
  BgIcon,
  BgIcon2,
  Pattern,
  RecentReviewContainer
} from '@/components/Home/_components/RecentReview/RecentReview.style'
import { Underline } from '@/components/Home/_components/AllReview/AllReview.style'

import useReviewsList from '@/components/Home/hooks/useReviewsList'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Maitree } from 'next/font/google';

const Card = dynamic(
  () => import('core_cafeteller/components').then((module) => module.Card),
  { ssr: false }
)

const maitree = Maitree({
  subsets: ["latin", "thai"],
  weight: "400",
});

const RecentReview = () => {
  const { data } = useReviewsList('getRecentReviews')
  const recentsOrder = data?.slice(0, 2) || []

  return (
    <>
      <Pattern img={'/assets/Images/pattern4.jpg'}>
        <div>
          <BgIcon img={'/assets/Images/graphic-element-homepage/Star@1x.svg'} />
          <BgIcon2
            img={'/assets/Images/graphic-element-homepage/Thumbs-up@1x.svg'}
          />
        </div>
      </Pattern>

      <RecentReviewContainer>
        <h2>
          <span>Recent</span> Review
        </h2>
        <Underline style={{ marginBottom: '1.7rem' }} />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2'>
          {recentsOrder.map((r, i) => {
            return (
              <Link href={`/reviews/${r.id}`} key={r.id}>
                <Card
                  description={r.cafe.sublocality_level_1}
                  key={r.id}
                  title={r.cafe.name}
                  src={r.cafe.banner?.url}
                  className='h-96 lg:h-[28rem]'
                  titleProps={{
                    className:
                      `${maitree.className}`
                  }}
                />
              </Link>
            )
          })}
        </div>
      </RecentReviewContainer>
    </>
  )
}

export default RecentReview
