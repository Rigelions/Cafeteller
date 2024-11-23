import React, { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import useReviewsList from '@/components/Home/hooks/useReviewsList'
import { DisplayReviewRow, Review } from '@/types'
import { useRouter } from 'next/router'
import useReviewRowHeight from '@/components/Home/hooks/useReviewRowHeight'
import Link from 'next/link'
import { Maitree } from 'next/font/google';

const CoffeeLoader = dynamic(
  () =>
    import('core_cafeteller/components').then((module) => module.CoffeeLoader),
  { ssr: false }
)

const Card = dynamic(
  () => import('core_cafeteller/components').then((module) => module.Card),
  {
    ssr: false
  }
)

const AddCard = dynamic(
  () => import('core_cafeteller/components').then((module) => module.AddCard),
  {
    ssr: false
  }
)

const OVERSCAN = 8

const maitree = Maitree({
  subsets: ["latin", "thai"],
  weight: "400",
});

interface LayoutProps {
  header?: React.ReactNode
  footer?: React.ReactNode
  outerRef?: React.MutableRefObject<HTMLDivElement | null>
}

const Layout = ({ header, footer, outerRef }: LayoutProps) => {
  const ROW_HEIGHT = useReviewRowHeight()
  const router = useRouter()
  const {
    rows,
    rowsID,
    data,
    isLoading: loading,
    setUpdateDate
  } = useReviewsList('getReviewsList')

  const [visibleData, setVisibleData] = useState<DisplayReviewRow[]>([])
  const [visibleID, setVisibleID] = useState<string[]>([])
  const [startRow, setStartRow] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const requestRef = useRef<number | null>(null)

  const loadMoreData = useCallback(async () => {
    const lastEntry = data[data.length - 1]

    if (lastEntry?.id === 'add-review') return

    setUpdateDate((lastEntry as Review)?.updateDate)
  }, [data])

  const updateVisibleData = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = containerRef.current
      const visibleRows = Math.ceil(clientHeight / ROW_HEIGHT)
      const newStartRow = Math.max(
        Math.floor((scrollTop - 896.69) / ROW_HEIGHT) - OVERSCAN,
        0
      )

      const lastIndex = Math.min(
        newStartRow + visibleRows + OVERSCAN * 2,
        rows.length
      )
      setStartRow(newStartRow)
      setVisibleData(rows.slice(newStartRow, lastIndex))
      setVisibleID(rowsID.slice(newStartRow, lastIndex))
    }
  }, [rows])

  useEffect(() => {
    updateVisibleData()
  }, [rows, updateVisibleData])

  const handleScroll = useCallback(() => {
    if (!loading && containerRef.current) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
      requestRef.current = requestAnimationFrame(() => {
        const {
          scrollTop = 0,
          scrollHeight = 0,
          clientHeight = 0
        } = containerRef.current || {}

        if (scrollTop + clientHeight >= scrollHeight - ROW_HEIGHT - 120) {
          // 120 is the height of the Footer
          loadMoreData().then()
        }
        updateVisibleData()
      })
    }
  }, [loading, updateVisibleData])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [handleScroll])

  return (
    <div
      className='h-screen w-screen overflow-y-auto overflow-x-hidden'
      ref={(el) => {
        if (el) {
          containerRef.current = el
        }
        if (outerRef) outerRef.current = el
      }}
    >
      <div className='relative' style={{ height: rows.length * ROW_HEIGHT }}>
        <div
          style={{
            transform: `translateY(${startRow * ROW_HEIGHT}px)`
          }}
        >
          {header}

          {visibleData.map((item, index) => (
            <div
              key={visibleID[index]}
              className='grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 px-5 md:px-20 lg:px-[13%] my-4 lg:my-6'
            >
              {item.map((review, index) => {
                if (review.id === 'add-review')
                  return (
                    <AddCard
                      key='add-review'
                      className='h-60 md:h-80 lg:h-[23rem]'
                      title='Add Review'
                      onClick={() => {
                        router.push('/reviews/add').then()
                      }}
                    />
                  )

                // if title longer than 15 characters, it will be cut off
                const title = (review as Review).cafe.name
                const titleCutOff =
                  title.length > 25 ? title.slice(0, 25) + '...' : title

                return (
                  <Link href={`reviews/${(review as Review).id}`}>
                    <Card
                      className='h-60 md:h-80 lg:h-[23rem]'
                      key={review.id}
                      titleProps={{
                        className:
                          `text-[1rem] my-0 leading-5 md:leading-6 lg:leading-8 md:my-2 md:text-xl lg:text-[1.4rem] ${maitree.className}`
                      }}
                      descriptionProps={{
                        className:
                          'text-2xl my-0 lg:my-4 lg:text-[1.8rem] worksans-font'
                      }}
                      src={(review as Review).cafe.banner?.url}
                      title={titleCutOff}
                      description={(review as Review).cafe.sublocality_level_1}
                    />
                  </Link>
                )
              })}
            </div>
          ))}

          {loading && (
            <div className='h-40 flex items-center justify-center'>
              <CoffeeLoader />
            </div>
          )}

          {footer}
        </div>
      </div>
    </div>
  )
}

export default Layout
