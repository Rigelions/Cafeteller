import React from 'react'
import { Col, Row } from 'antd'
import { Facebook } from '@/icons'
import { maitree } from '@/utils/font'

interface CafeData {
  name: string
  fb?: string
}

interface VisitPageProps {
  cafeData: CafeData
}

const VisitPage = ({ cafeData }: VisitPageProps) => {
  return (
    <Row key={5}>
      <Col span={4}>
        <Facebook className='h-8 w-8 text-icons-nav' />
      </Col>
      <Col span={20} className={maitree.className}>
        Visit <a href={cafeData.fb}>{cafeData.name}</a>&apos;s page
      </Col>
    </Row>
  )
}

export default VisitPage
