import React from 'react'
import styled from 'styled-components'
import ReviewsEditor from '@/components/Reviews/AddReviewController/_components/ReviewsEditor'
import ProtectedRoute from '@/components/ProtectedRoute'
import useFetchReview from '@/components/Reviews/AddReviewController/hooks/useFetchReview'
import withMeta from '@/hoc/withMeta'
import { maitree } from '@/utils/font'

let { Row, Typography, Col } = require('antd')
const { Title } = Typography

Row = styled(Row)`
  font-family: Georgia;
`

const Wrapper = styled.div`
  min-height: 80vh;
  margin: 10px 0;
`

function Add() {
  useFetchReview()

  return (
    <>
      <ProtectedRoute>
        <Wrapper className={maitree.variable}>
          <Row justify='center' align='top'>
            <Col xs={24} md={22}>
              <Title level={3}>Add Review</Title>
            </Col>

            <ReviewsEditor />
          </Row>
        </Wrapper>
      </ProtectedRoute>
    </>
  )
}

export default withMeta(Add, {
  title: 'Add Review',
  description: 'Add Review',
  keywords: ['Add Review']
})
