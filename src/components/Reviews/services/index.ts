import { Cafe, Review } from '@/types'
import {
  getCafeByRefRepo,
  getReviewsByIDRepo
} from '@/components/Reviews/repositories'

export const convertBlocksV1toV2 = (blocks: any) => {
  return blocks.map((block: any) => {
    switch (block.type) {
      case 'image':
        return {
          type: 'image',
          data: {
            data: [
              {
                src: {
                  urls: {
                    ['@1024']: block.data.file.url,
                    ['@720']: block.data.file.url,
                    ['@1980']: block.data.file.url
                  }
                },
                captions: block.data.caption
              }
            ]
          }
        }
      default:
        return block
    }
  })
}

export const getReviewByID = async (
  id: string
): Promise<{
  review: Review
  cafe: Cafe
}> => {
  try {
    const reviewSnap = await getReviewsByIDRepo(id)
    const result = {} as {
      review: Review
      cafe: Cafe
    }

    if (reviewSnap.exists()) {
      const reviewData = reviewSnap.data()
      result.review = reviewData as Review

      console.log({ reviewData })

      if (result.review.version !== 'v2') {
        result.review.review.blocks = convertBlocksV1toV2(
          result.review.review.blocks
        )
      }

      // If there's a reference to cafe, fetch the referenced document
      if (reviewData.cafe) {
        const cafeRef = reviewData.cafe
        const cafeSnap = await getCafeByRefRepo(cafeRef)
        if (cafeSnap.exists()) {
          result.cafe = {
            id: cafeSnap.id,
            ...(cafeSnap.data() || {})
          } as Cafe
        }
      }

      return result
    } else {
      console.log('No such review found!')
      return result
    }
  } catch (error) {
    console.error('Error fetching review:', error)
    return {
      review: {} as Review,
      cafe: {} as Cafe
    }
  }
}
