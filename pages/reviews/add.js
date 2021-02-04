import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import axios from 'axios'
import { RightOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons'

import Reviews from 'components/reviews/Editor'

let {
  Row,
  Typography,
  Col,
  Steps,
  Skeleton,
  Image,
  Button,
  Card
} = require('antd')
const { Meta } = Card
const { Title } = Typography
const { Step } = Steps

Row = styled(Row)`
  font-family: Georgia;
`

const Link = styled.div`
  width: 100%;
  height: 250px;
  padding: 25px;
`

const Wrapper = styled.div`
  min-height: 80vh;
  margin: 10px 0;
`

export default function add () {
  const [step, setStep] = useState(0)
  const [posts, setPosts] = useState(null)
  const [selected, setSelected] = useState(undefined)

  const getIGPosts = async path => {
    setPosts(null)
    const posts = await axios.get(path)
    console.log(posts.data)
    setPosts(posts.data)
  }

  useEffect(() => {
    const didMount = async () => {
      await getIGPosts(
        'https://graph.instagram.com/me/media?fields=thumbnail_url,id,caption,media_url,media_type,permalink&access_token=' +
        localStorage.getItem('access_token')
      )
    }
    didMount()
  }, [])

  const igPosts = (
    <>
      <Col xs={24} md={22} style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={() => {
          setSelected(undefined)
          setStep(1)
        }} icon={<PlusOutlined />}>ข้ามขั้นตอนนี้</Button>
        <Button disabled={posts === null || !posts.paging.previous} onClick={() => getIGPosts(posts.paging.previous)} icon={<LeftOutlined />} />
        <Button disabled={posts === null || !posts.paging.next } onClick={() => getIGPosts(posts.paging.next)} icon={<RightOutlined />} />
      </Col>
      <Col xs={24} md={22}>
        {
          posts === null
            ? <Skeleton active paragraph={false} />
            : <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
              {
                posts.data.map((post, i) => (
                  <Col className="th" key={post.id} xs={12} md={6} lg={4}>
                    <Card
                      hoverable
                      bodyStyle={{
                        minHeight: 250,
                        padding: 0
                      }}
                      style={{ width: '100%', minHeight: '100%' }}
                      cover={<Image
                        src={
                          post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url
                        }
                        alt="Avatar"
                      />}
                    >
                      <Link onClick={() => {
                        setSelected(i)
                        setStep(1)
                      }}>
                        <Meta title={post.caption && post.caption.split('\n')[0]} description={ post.caption } />
                      </Link>
                    </Card>
                  </Col>
                ))
              }
            </Row>
        }
      </Col>
    </>
  )

  const stepsContent = () => {
    switch (step) {
      case 0:
        return igPosts
      case 1:
        return (
          <Reviews
            posts={posts}
            selected={selected}
            prev={() => {
              setStep(0)
              setSelected(undefined)
            }}
          />
        )
      default:
        break
    }
  }

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/assets/css/editor.css" />
      </Head>
      <Wrapper>
        <Row justify="center" align="top">
          <Col xs={24} md={22}><Title level={3}>Add Review</Title></Col>
          <Col xs={24} md={22}>
            <Steps className="th" current={step} responsive="true">
              <Step title="เลือกโพสต์จาก Instagram" description="เลือกโพสต์ตั้งต้นจาก Instagram" />
              <Step title="เขียนรีวิว" />
              <Step title="Save เรียบร้อย"/>
            </Steps>
          </Col>
          {stepsContent()}
        </Row>
      </Wrapper>
    </>
  )
}