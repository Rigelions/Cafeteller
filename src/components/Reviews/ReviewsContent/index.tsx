import React from 'react'

import Head from 'next/head'
import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Space, Button, Row, Col, Image, Typography } from 'antd'
import axios from '@/utils/axios'

import Banner from '@/components/Reviews/components/Banner'
import { Review } from '@/types'
import useProfile from '@/hooks/useProfile'
import {
  deleteDoc,
  doc,
  getFirestore,
  increment,
  setDoc
} from '@firebase/firestore'

const { Title } = Typography

import dynamic from 'next/dynamic'
import {
  TitleBox,
  TitlePattern
} from '@/components/Reviews/ReviewsContent/content.style'
import useGenerateContent from '@/components/Reviews/ReviewsContent/hooks/useGenerateContent'
import Show from '@/components/ui/Show'

const MoreLikeThis = dynamic(() => import('@/components/ui/MoreLikeThis'), {
  ssr: false
})
const CafeInformation = dynamic(() => import('./_components/CafeInformation'), {
  ssr: false
})
const Desktop = dynamic(() => import('@/components/ui/Show/Desktop'), {
  ssr: false
})
const ShareBox = dynamic(() => import('./_components/ShareBox'), { ssr: false })
// This function gets called at build time
export async function getServerSideProps(context: { params: { id: any } }) {
  // Call an external API endpoint to get posts
  const id = context.params.id
  try {
    const { data } = await axios.get(`/reviews/${id}`)

    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
      props: {
        reviews: {
          [id]: data
        }
      }
    }
  } catch (error) {
    console.log('Error')
    console.log({ error })
    return {
      props: {
        reviews: {}
      }
    }
  }
}

interface ReviewDetailProps {
  reviews: Record<string, Review>
}

export default function ReviewContent({ reviews }: ReviewDetailProps) {
  const router = useRouter()

  const { id: _id } = router.query
  const id = _id as string

  const { content } = useGenerateContent({
    cafetellerVersion: reviews?.[id]?.version || 'v1',
    blocks: reviews?.[id] ? [...reviews[id].review.blocks] : []
  })

  const { isAdmin } = useProfile()

  const banner = reviews?.[id].cafe.banner || {}

  return (
    <>
      <Head>
        <title>Cafeteller || {reviews[id].cafe.name}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content={
            reviews[id].cafe.description ||
            'Because good cafés deserve a shout out'
          }
        />
        <meta name='robots' content='all' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0'
        ></meta>
        <meta charSet='UTF-8'></meta>

        <meta
          property='og:title'
          content={`Cafeteller || ${reviews[id].cafe.name}`}
        />
        <meta
          property='og:description'
          content={
            reviews[id].cafe.description ||
            'Because good cafés deserve a shout out'
          }
        />
        <meta
          property='og:image'
          content={banner.url || '/assets/Images/COVER1.jpg'}
        />
      </Head>

      <Container>
        <Row align='middle' justify='center'>
          <Col xs={24} xxl={18}>
            {isAdmin ? (
              <Space className='my-2' size='small'>
                <Button
                  onClick={() => {
                    router.push('/reviews/edit/' + id)
                  }}
                >
                  Edit Review
                </Button>
                <Button
                  onClick={async () => {
                    const db = getFirestore()
                    const router = useRouter()

                    const reviewDocRef = doc(db, 'reviews', id)
                    const cafeDocRef = doc(
                      db,
                      'cafes',
                      reviews[id].cafe.id || ''
                    )

                    await deleteDoc(reviewDocRef)
                    await deleteDoc(cafeDocRef)

                    await setDoc(
                      doc(db, 'meta', 'reviews'),
                      {
                        // +1
                        amount: increment(-1)
                      },
                      { merge: true }
                    )

                    router.push('/')
                  }}
                  danger
                >
                  Delete
                </Button>
              </Space>
            ) : null}
            <Banner>
              <Image
                height={'100%'}
                width={'100%'}
                style={{ objectFit: 'cover' }}
                // onError={(e) => {
                //   e.target.onerror = null
                //   e.target.src = '/assets/Images/placeholder.png'
                // }}
                alt={reviews[id].cafe.name}
                src={reviews[id].cafe.banner?.url}
                fallback='/assets/Images/placeholder.png'
                preview={false}
                placeholder={
                  <Image
                    height={'100%'}
                    width={'100%'}
                    alt={reviews[id].cafe.name}
                    style={{ objectFit: 'cover' }}
                    src={'/assets/Images/placeholder.png'}
                    preview={false}
                  />
                }
              />
            </Banner>

            <Row justify='space-around'>
              <Col xs={24} md={19} lg={15} xxl={16}>
                <Content>
                  {/* Cafe's name and location section*/}
                  <Show when={reviews?.[id]?.version === 'v2'}>
                    <Title level={2} className='article-header'>
                      {reviews[id].cafe.name}
                    </Title>
                    <TitleBox>
                      <TitlePattern
                        key={0}
                        img={'/assets/Images/pattern4.jpg'}
                      />
                      <Title level={4} className='article-header'>
                        {reviews[id].cafe.sublocality_level_1}
                      </Title>
                      <TitlePattern
                        key={1}
                        img={'/assets/Images/pattern4.jpg'}
                      />
                    </TitleBox>
                  </Show>

                  {content}

                  <ForWork>
                    <Image
                      src='/assets/Images/icon/Contact.png'
                      preview={false}
                      height={30}
                      width={25}
                    />
                    <span>
                      {' '}
                      For Work please contact{' '}
                      <a href='https://lin.ee/rDKbdQt'>&quot;here&quot;</a>
                    </span>
                  </ForWork>
                </Content>

                <Desktop>
                  <ShareBox cafeShareData={reviews[id].cafe} />
                </Desktop>
              </Col>

              <Col xs={24} md={19} lg={8} xxl={7}>
                <CafeInformation cafeData={reviews[id].cafe} />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Pattern img={'/assets/Images/pattern5.jpg'}></Pattern>
          </Col>

          <Col xs={24} md={22} xxl={18}>
            <MoreLikeThis tags={reviews[id].cafe.tags} id={id} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

const Container = styled.div``

const Pattern = styled.div<{ img: string }>`
  background-size: 75%;
  border-bottom: 2px solid #d2c5b8;
  height: 70px;
  background-image: url(${(props) => props.img});
  background-size: 100%;
  @media (min-width: 768px) {
    background-size: 44%;
    height: 80px;
    border: 2px solid #d2c5b8;
  }
  @media (min-width: 1200px) {
    background-size: 17%;
  }
`

const ForWork = styled.div`
  margin-bottom: 4% !important;
  padding: 5%;
  display: flex;
  font-family: 'Maitree', serif;
  margin: 0;
  align-items: center;
  font-size: 16px;
  a {
    color: #1890ff;
  }
  img {
    border: 0 !important;
  }
  span {
    padding-left: 10px;
  }
  @media (min-width: 768px) {
    font-size: 20px;
    padding: 5% 0%;
  }
  @media (max-width: 992px) {
    padding-bottom: 4% !important;
  }
`

const Content = styled.div`
  p {
    font-size: 16px;
    margin: 0;
    word-break: break-word;
    font-family: 'Maitree', serif;
    padding: 5%;
  }
  .content-wrap {
    width: 100%;
    height: 100%;
  }
  h4.article-header {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    text-align: center;
    font-weight: 400;
    font-family: 'Work Sans', sans-serif;
    font-size: 1.2em;
    white-space: nowrap;
    padding: 5px;
  }
  h2.article-header {
    font-size: 1.7em;
    margin-top: 10px;
    padding: 20px;
    padding-bottom: 0;
    padding-top: 10px;
    text-align: center;
    font-family: 'Georgia';
    color: #1e315c;
  }
  .divide-image {
    width: 10px;
  }
  img {
    // width: 90%;
  }
  .image-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin: 10px 0;
    .image-container-img {
      padding-bottom: 125%;
      width: 100%;
      height: 0;
      position: relative;
    }
  }
  .image-container-2 {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin: 10px 0;
    .image-container-img {
      padding-bottom: 125%;
      width: 100%;
      height: 0;
      position: relative;
      /* overflow: hidden; */
    }
  }
  .caption {
    text-align: center;
    font-size: 12px;
    margin: 5px;
    margin-bottom: 0px;
    font-family: maitree;
    font-weight: 400;
    color: black;
  }
  img {
    height: 100%;
  }

  .caption-wrap {
    /* border: 1px solid #9e9e9e; */
    height: 100%;
    /* min-height: 100%; */
  }
  @media (max-width: 300px) {
    h2.article-header {
      white-space: inherit;
      font-size: 1.2rem;
    }
    h4.article-header {
      white-space: inherit;
      font-size: 0.9rem;
    }
  }
  @media (min-width: 562px) {
    .divide-image {
      width: 15px;
    }
  }
  @media (min-width: 768px) {
    p {
      font-size: 20px;
      padding: 0;
      padding-top: 3%;
      padding-bottom: 4%;
    }
    h2.article-header {
      padding: 0;
      font-size: 2.8rem;
      color: black;
      text-align: start;
      margin: 0px;
      margin-bottom: 5px;
    }
    .caption {
      text-align: center;
      font-size: 15px;
      margin: 8px;
      margin-top: 12px;
      border: 1px solid #9e9e9e;
      margin: 0;
      padding: 10px;
    }

    .caption-border {
      /* border: 1px solid #9e9e9e; */
      /* margin: 3px; */
    }
    .image-container {
      display: flex;
      justify-content: space-evenly;
      margin: 10px 0;
      padding-top: 20px;
    }
    .image-container-2 {
      display: flex;
      justify-content: space-evenly;
      margin: 10px 0;
      padding-top: 20px;
    }
    .divide-image {
      width: 20px;
    }
    img {
      // width: 90%;
      border: 1px solid #9e9e9e;
    }
  }
`
