import React from 'react'
import { Row, Col, Image } from 'antd'
import {
  Container,
  FooterCenterBot,
  FooterCenterTop,
  Pattern,
  SocialBar
} from './Footer.style'
import { Facebook, Instagram, Twitter } from '@/icons'
import { useAtom } from 'jotai/index'
import { showFooterAtom } from '@/atom/navbar'

const Footer: React.FC = () => {
  const [shouldShowFooter] = useAtom(showFooterAtom)

  if (!shouldShowFooter) return null

  return (
    <>
      <Row justify='center' id='footer'>
        <Col xs={24} xl={24} xxl={24}>
          <Container>
            <Row>
              <Col xs={6} md={6} xl={7}>
                <Pattern img={'/assets/Images/pattern3.jpg'} />
              </Col>
              <Col xs={12} md={12} xl={10}>
                <FooterCenterTop>cafeteller</FooterCenterTop>
                <FooterCenterBot>find us at</FooterCenterBot>
              </Col>
              <Col xs={6} md={6} xl={7}>
                <Pattern img={'/assets/Images/pattern3.jpg'} />
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ backgroundColor: '#1e315c' }}>
                <Row justify='center'>
                  <Col xs={16} md={8}>
                    <SocialBar>
                      <a href='https://www.facebook.com/cafeteller'>
                        <Facebook className='h-7 w-7 text-icons-nav' />
                      </a>
                      <a href='https://instagram.com/cafeteller'>
                        <Instagram className='h-7 w-7 text-icons-nav' />
                      </a>
                      <a href='https://x.com/cafeteller'>
                        <Twitter className='h-7 w-7 text-icons-nav' />
                      </a>
                    </SocialBar>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </>
  )
}

export default Footer
