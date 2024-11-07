import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useLoadingOverlay from '@/hooks/useLoadingOverlay'
import { cafeAtom } from '@/components/Reviews/AddReviewController/atom/cafe'
import { useAtom } from 'jotai'
import { reviewAtom } from '@/components/Reviews/AddReviewController/atom/review'
import { getReviewByID } from '@/components/Reviews/services'

const useFetchReview = () => {
  const query = useRouter().query
  const id = query.id as string
  const showLoading = useLoadingOverlay()
  const [, setCafeData] = useAtom(cafeAtom)
  const [, setReviewData] = useAtom(reviewAtom)

  useEffect(() => {
    const fetchReview = async () => {
      if (id) {
        showLoading(true)
        const { review, cafe } = await getReviewByID(id)

        setCafeData(cafe)
        setReviewData(review)
        showLoading(false)
      } else {
        setCafeData({})
        setReviewData({})
      }
    }

    fetchReview().then()
  }, [id])
}

export default useFetchReview
