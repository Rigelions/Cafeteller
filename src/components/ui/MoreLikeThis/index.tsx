import React from 'react'
import { Col, Row } from 'antd'
import Link from 'next/link'

import { MoreReview, MoreReviewCard, Underline } from './MoreLikeThis.style'

import { Review } from '@/types'
import dynamic from 'next/dynamic'
import useSimilarCafe from '@/hooks/useSimilarCafe'
import useViewport from '@/hooks/useViewport'
import { breakpoints } from '@/utils/breakpoints'
import { maitree } from '@/utils/font'

const Card = dynamic(
  () => import('core_cafeteller/components').then((module) => module.Card),
  {
    ssr: false
  }
)

interface MoreLikeThisProps {
  tags: string[]
  id: string
}

const MoreLikeThis = ({ tags, id }: MoreLikeThisProps) => {
  const { width } = useViewport()
  const { similarCafe } = useSimilarCafe({
    tags,
    id
  })

  const moreLikeThisCount = similarCafe?.length || 0
  const moreLikeThisAmount = width >= breakpoints.lg ? 3 : 2
  const shouldShowMoreLikeThis = moreLikeThisCount > moreLikeThisAmount

  return (
    <MoreReview>
      <h2>
        <span>More</span> Like This
      </h2>
      <Underline style={{ marginBottom: 12 }} />
      <Row gutter={{ xs: 10, sm: 12, md: 20 }}>
        {shouldShowMoreLikeThis &&
          similarCafe?.slice(0, moreLikeThisAmount).map((review, index) => (
            <Col key={review.id + '-link'} xs={12} md={8}>
              <MoreReviewCard>
                <Link href={`/reviews/${review.id}`}>
                  <a className='flex-center card-shadow'>
                    <Card
                      className='h-60 md:h-80 lg:h-[23rem]'
                      key={review.id}
                      titleProps={{
                        className: `text-[1rem] my-0 leading-5 md:leading-6 lg:leading-8 md:my-2 md:text-xl lg:text-[1.4rem] ${maitree.className}`
                      }}
                      descriptionProps={{
                        className: `text-2xl my-0 lg:my-4 lg:text-[1.8rem] ${maitree.className}`
                      }}
                      src={(review as Review).cafe.banner.url}
                      title={(review as Review).cafe.name}
                      description={(review as Review).cafe.sublocality_level_1}
                    />
                  </a>
                </Link>
              </MoreReviewCard>
            </Col>
          ))}
      </Row>
    </MoreReview>
  )
}

export default MoreLikeThis
