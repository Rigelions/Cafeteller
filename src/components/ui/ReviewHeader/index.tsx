import React from 'react'
import { TitleBox, TitlePattern } from './review-header.style'
import { Divider, Typography } from 'antd'
import Show from '@/components/ui/Show'

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
        <Divider className='text-neutral-900'>Preview Header</Divider>
      </Show>

      <Title level={2} className='article-header'>
        {cafeName}
      </Title>
      <TitleBox>
        <TitlePattern key={0} img={'/assets/Images/pattern4.jpg'} />
        <Title level={4} className='article-header'>
          {cafeArea}
        </Title>
        <TitlePattern key={1} img={'/assets/Images/pattern4.jpg'} />
      </TitleBox>

      <Show when={preview}>
        <Divider className='text-neutral-900'>End Preview Header</Divider>
      </Show>
    </>
  )
}

export default ReviewHeader
