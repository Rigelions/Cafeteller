import React from 'react'
import { Carousel } from 'antd'
import { Banner } from './CarouselBanner.style'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import { getReviewsBanner } from '@/services/list'
import Link from 'next/link'

const Image = dynamic(
  () => import('core_cafeteller/components').then((module) => module.LazyImage),
  { ssr: false }
)

const CarouselBanner = () => {
  const { data } = useSWR('getReviewsBanner', () => getReviewsBanner())

  return (
    <Carousel>
      <Banner>
        <Image
          className='inner-image'
          placeholderClassName='inner-image'
          style={{ objectFit: 'cover', width: '100%' }}
          src='/assets/Images/COVER1.jpg'
          preview={false}
        />
      </Banner>

      {data?.map((item, i) => (
        <Link key={item.id + '-banner'} href={`/reviews/${item.review_id}`}>
          <div style={{ overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: 0, height: 0 }}>
              <h1
                style={{
                  position: 'absolute',
                  top: '-1vh',
                  left: '-5vw',
                  zIndex: 100,
                  background: 'white',
                  paddingLeft: '15vw',
                  paddingRight: '50vw',
                  color: '#233d77',
                  fontSize: '4vw',
                  fontFamily: 'Confidante',
                  fontWeight: 'normal',
                  transform: 'rotate(-15deg)'
                }}
              >
                {item.tags.includes('Recommended') && (
                  <>
                    Recommended
                    <br />
                  </>
                )}
                {i < 2 && <>Recent</>}
              </h1>
            </div>
            <Banner>
              <Image
                className='inner-image'
                style={{ objectFit: 'cover' }}
                src={item.banner.url}
                preview={false}
              />
            </Banner>
          </div>
        </Link>
      ))}
    </Carousel>
  )
}

export default CarouselBanner
