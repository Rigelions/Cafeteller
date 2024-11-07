import React, { useEffect } from 'react'
import { Col, message } from 'antd'
import { uploadImageService } from '@/services/media/images'
import { TAGS } from '@/components/Reviews/AddReviewController/constants'

import CafeDetail from '../CafeDetail'
import Editor from './EditorMF'
import CafeLocation from '@/components/Reviews/AddReviewController/_components/CafeLocation'
import IGModal from '@/components/Reviews/AddReviewController/_components/IGModal'
import { IGPost } from '@/components/Reviews/types'
import { convertIGToBlock } from '@/components/Reviews/AddReviewController/_components/IGModal/helper'
import { Button } from '@/components/ui/MF'
import { useAtom } from 'jotai'
import { cafeAtom } from '@/components/Reviews/AddReviewController/atom/cafe'
import { cloneDeep } from '@/utils/object'
import {
  doc,
  setDoc,
  getFirestore,
  serverTimestamp,
  collection,
  increment
} from '@firebase/firestore'
import { useRouter } from 'next/router'
import { ReviewsPayload } from '@/types/reviews'
import useLoadingOverlay from '@/hooks/useLoadingOverlay'
import { reviewAtom } from '@/components/Reviews/AddReviewController/atom/review'

const ReviewsEditor = () => {
  const [cafe] = useAtom(cafeAtom)
  const [review] = useAtom(reviewAtom)
  const setLoading = useLoadingOverlay()
  const editorRef = React.useRef<any>(null)
  const router = useRouter()
  const { id } = router.query

  const isCreate = !id
  const isUpdate = !!id

  const onSave = async () => {
    const review = await editorRef.current?.save()
    const cafeData = cloneDeep(cafe)

    Object.keys(cafeData).forEach((key) => {
      if (typeof cafeData[key] === 'string') {
        cafeData[key] = cafeData[key].replace(/&#8232;/g, ' ')
        cafeData[key] = cafeData[key].replace(/\u2028/g, '')
      }
    })

    const cafeID = cafeData.id

    const db = getFirestore()
    const reviewRef = isUpdate
      ? doc(db, 'reviews', id as string)
      : doc(collection(db, 'reviews'))
    const cafeRef = isUpdate
      ? doc(db, 'cafes', cafeID)
      : doc(collection(db, 'cafes'))
    const payload: ReviewsPayload = {
      cafe: cafeRef,
      createDate: serverTimestamp(),
      updateDate: serverTimestamp(),
      version: 'v2',
      review
    }

    if (isUpdate) {
      delete payload.createDate
    }

    setLoading(true)
    await Promise.all([
      setDoc(reviewRef, payload, { merge: true }),
      setDoc(
        cafeRef,
        {
          ...cafeData,
          name_search: cafeData.name.toLowerCase(),
          createDate: serverTimestamp(),
          updateDate: serverTimestamp(),
          reviews: reviewRef
        },
        { merge: true }
      ),
      isCreate
        ? setDoc(
            doc(db, 'meta', 'reviews'),
            {
              // +1
              amount: increment(1)
            },
            { merge: true }
          )
        : () => {}
    ])

    message.success('บันทึกสำเร็จ')

    router.push(`/reviews/${reviewRef.id}`).then(() => setLoading(false))
  }

  const onLoadPostInstagram = async (data: IGPost) => {
    setLoading(true)
    const convertedData = await convertIGToBlock(data)

    const editor = editorRef.current.getEditorRef()
    editor.blocks.insertMany(convertedData.blocks)
    setLoading(false)
  }

  useEffect(() => {
    if (review && editorRef.current) {
      const editor = editorRef.current.getEditorRef()

      if (!editor.blocks) return

      // clear editor
      editor.blocks.clear()
      editor.blocks.render({
        blocks: review.review?.blocks || []
      })
    }
  }, [review, editorRef.current])

  return (
    <>
      <Col className='pl-20 py-5' span={15}>
        <Editor
          saveRef={editorRef}
          uploadCallback={async (file: File) => {
            return await uploadImageService(file)
          }}
        />
      </Col>

      <Col className='pr-8 py-5' span={9}>
        <div className='flex items-center'>
          <IGModal onSelect={onLoadPostInstagram} />

          <Button
            onClick={onSave}
            type='primary'
            className='inline-flex items-center mx-2'
          >
            Save
          </Button>
        </div>

        <CafeLocation />

        <CafeDetail tags={TAGS} />
      </Col>
    </>
  )
}

export default ReviewsEditor
