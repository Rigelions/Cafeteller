import React from 'react'
import { TitleBox, TitlePattern } from './review-header.style'
import { Divider, Typography } from 'antd'
import Show from '@/components/ui/Show'
import classNames from 'classnames'
import { maitree } from '@/utils/font'

const { Title } = Typography

interface ReviewHeaderProps {
  cafeName: string
  cafeArea: string
  preview?: boolean
}

const ReviewHeader = ({
  cafeName,
  cafeArea,
  preview = false
}: ReviewHeaderProps) => {
  return (
    <>
      <Show when={preview}>
        <Divider
          className={classNames(['text-neutral-900', maitree.className])}
        >
          Preview Header
        </Divider>
      </Show>

      <Title
        level={2}
        className={classNames(['article-header', maitree.className])}
      >
        {cafeName}
      </Title>

      <TitleBox>
        <TitlePattern key={0} img={'/assets/Images/pattern4.jpg'} />
        <Title
          level={4}
          className={classNames(['article-header', maitree.className])}
        >
          {cafeArea}
        </Title>
        <TitlePattern key={1} img={'/assets/Images/pattern4.jpg'} />
      </TitleBox>

      <Show when={preview}>
        <Divider
          className={classNames(['text-neutral-900', maitree.className])}
        >
          End Preview Header
        </Divider>
      </Show>
    </>
  )
}

export default ReviewHeader
