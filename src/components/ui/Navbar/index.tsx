import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Row, Col, Image, Menu, Dropdown } from 'antd'
import { AlignLeftOutlined } from '@ant-design/icons'
import Link from 'next/link'
import {
  Container,
  SocialBar,
  SocialButton,
  SocialBarBot,
  ReviewBar,
  ReviewBarText,
  HoverableScroll,
  HoverableInnerScroll,
  SearchBar,
  SearchText,
  Logo,
  N2,
  N2Scroll
} from './Navbar.style'
import { Facebook, Instagram, ReviewFace, Search, Twitter } from '@/icons'
import classNames from 'classnames'
import { createPortal } from 'react-dom'
import { HIDE_NAVBAR_ROUTE } from '@/utils/hideNavbarRoute'

const SocialBarMenu = (
  <Menu>
    <Menu.Item>
      <a href='https://www.instagram.com/cafeteller/'>
        <Image
          src='/assets/Images/icon/Social/IG.png'
          preview={false}
          height={30}
          width={30}
        />
      </a>
    </Menu.Item>
    <Menu.Item>
      <a href='https://www.facebook.com/cafeteller/'>
        <Image
          src='/assets/Images/icon/Social/FB.png'
          preview={false}
          height={30}
          width={30}
        />
      </a>
    </Menu.Item>
    <Menu.Item>
      <a href='https://twitter.com/CAFETELLER'>
        <Image
          src='/assets/Images/icon/Social/Twitter.png'
          preview={false}
          height={30}
          width={30}
        />
      </a>
    </Menu.Item>
  </Menu>
)

interface NavbarProps {
  container?: React.RefObject<HTMLDivElement>
}

const Navbar: React.FC = ({ container }: NavbarProps) => {
  const router = useRouter()
  const pathName = router.pathname
  const [scrolled, setScrolled] = useState(false)
  const [navColxs, setNavColxs] = useState([7, 7])
  const [navCollg, setNavCollg] = useState([6, 5])
  const [buttonText, setButtonText] = useState(['', ''])
  const [navBgColor, setNavBgColor] = useState(['', ''])
  const [defaultHover, setDefaultHover] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const CheckPath = () => {
    if (pathName === '/search') {
      searchHover()
      searchClick()
    } else {
      reviewHover()
      reviewClick()
    }
  }

  const handleScroll = () => {
    // if container is provided; check the scroll position of the container
    const offset = container?.current?.scrollTop || window.scrollY

    if (offset > 200) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  const searchClick = () => {
    setDefaultHover('search')
    setRefreshKey((oldKey) => oldKey + 1)
  }

  const reviewClick = () => {
    reviewHover()
    setDefaultHover('review')
    setRefreshKey((oldKey) => oldKey + 1)
  }

  const searchHover = () => {
    setNavColxs([3, 11])
    setNavCollg([2, 9])
    setButtonText(['', 'Search'])
    setNavBgColor(['', 'nav-brown-bgcolor'])
  }

  const reviewHover = () => {
    setNavColxs([11, 3])
    setNavCollg([9, 2])
    setButtonText(['Reviews', ''])
    setNavBgColor(['nav-brown-bgcolor', ''])
  }

  const defaultNavClass = ['']
  const scrollNavClass = ['navbar-scroll']
  if (scrolled) {
    scrollNavClass.push('scrolled')
  }
  if (pathName === '/reviews/[id]' || pathName === '/search') {
    scrollNavClass.push('scrolled-from-start')
    defaultNavClass.push('nav-hide')
  }

  useEffect(() => {
    CheckPath()
  }, [])

  useEffect(() => {
    const searchButton = Object.values(
      document.getElementsByClassName('search-hover')
    )
    const reviewButton = Object.values(
      document.getElementsByClassName('review-hover')
    )
    const logoButton = Object.values(
      document.getElementsByClassName('logo-hover')
    )

    searchButton.forEach((element) => {
      element.addEventListener('mouseenter', searchHover)
      element.addEventListener('click', searchClick)
    })

    reviewButton.forEach((element) => {
      element.addEventListener('mouseenter', reviewHover)
      element.addEventListener('click', reviewClick)
    })

    logoButton.forEach((element) => {
      element.addEventListener('click', reviewClick)
    })

    if (defaultHover === 'search') {
      reviewButton.forEach((element) => {
        element.addEventListener('mouseleave', searchHover)
      })
      document.body.classList.add('search-page')
    } else {
      searchButton.forEach((element) => {
        element.addEventListener('mouseleave', reviewHover)
      })
      document.body.classList.remove('search-page')
    }

    return () => {
      searchButton.forEach((element) => {
        element.removeEventListener('mouseenter', searchHover)
        element.removeEventListener('click', searchClick)
      })
      reviewButton.forEach((element) => {
        element.removeEventListener('mouseenter', reviewHover)
        element.removeEventListener('click', reviewClick)
      })
      logoButton.forEach((element) => {
        element.removeEventListener('click', reviewClick)
      })
      reviewButton.forEach((element) => {
        element.removeEventListener('mouseleave', searchHover)
      })
      searchButton.forEach((element) => {
        element.removeEventListener('mouseleave', reviewHover)
      })
    }
  }, [refreshKey])

  const portalRef = React.useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    // scroll container is ref or window if not provide
    const scrollContainer = container?.current || window

    portalRef.current = document.querySelector('#navbar-portal')

    scrollContainer.addEventListener('scroll', handleScroll)
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [container])

  const navbarIsHiding = HIDE_NAVBAR_ROUTE.includes(pathName)
  const portal = portalRef.current

  const ScrolledNavbar = (
    <Row justify='center' className={scrollNavClass.join(' ')}>
      <Col span={0} xs={0} lg={3}>
        <Link className='logo-hover' href={'/'}>
          <Logo img={'/assets/Images/logo-rotate.png'}></Logo>
          <Image
            src='/assets/Images/logo-rotate.png'
            preview={false}
            height={80}
            width={80}
          />
        </Link>
      </Col>
      <Col span={6} xs={6} lg={5} className='flex-center border-left'>
        <Link href={'/'}>
          <N2Scroll img={'/assets/Images/logo-rotate-05opa.png'}>
            <h1 className='logo-hover'>CAFETELLER</h1>
          </N2Scroll>
        </Link>
      </Col>
      <Col
        span={7}
        xs={navColxs[0]}
        lg={navCollg[0]}
        id='review-hover'
        className='review-hover border-left'
      >
        <Link href={'/'}>
          <HoverableScroll style={{ height: '100%' }} bgColor={navBgColor[0]}>
            <HoverableInnerScroll>
              <ReviewFace
                className={classNames([
                  'h-6 w-6',
                  navBgColor[1] === 'nav-brown-bgcolor'
                    ? 'text-icons-active'
                    : 'text-icons-default'
                ])}
              />

              <span>{buttonText[0]}</span>
            </HoverableInnerScroll>
          </HoverableScroll>
        </Link>
      </Col>
      <Col
        span={7}
        xs={navColxs[1]}
        lg={navCollg[1]}
        id='search-hover'
        className='search-hover border-left'
      >
        <Link href={'/search'}>
          <HoverableScroll style={{ height: '100%' }} bgColor={navBgColor[1]}>
            <HoverableInnerScroll>
              <Search
                className={classNames([
                  'h-6 w-6',
                  navBgColor[1] === 'nav-brown-bgcolor'
                    ? 'text-icons-active'
                    : 'text-icons-default'
                ])}
              />
              <span>{buttonText[1]}</span>
            </HoverableInnerScroll>
          </HoverableScroll>
        </Link>
      </Col>
      <Col xs={0} lg={5} className='border-left'>
        <SocialBar style={{ height: '100%' }}>
          <a href='https://www.instagram.com/cafeteller/'>
            <Instagram className='h-8 w-8 text-icons-nav' />
          </a>
          <a href='https://www.facebook.com/cafeteller/'>
            <Facebook className='h-8 w-8 text-icons-nav' />
          </a>
          <a href='https://twitter.com/CAFETELLER'>
            <Twitter className='h-8 w-8 text-icons-nav' />
          </a>
        </SocialBar>
      </Col>
      <Col span={4} xs={4} lg={0}>
        <Dropdown
          overlay={SocialBarMenu}
          getPopupContainer={() => document.getElementById('scrollBut') as any}
          trigger={['click']}
          placement='bottomCenter'
        >
          <SocialButton className='nav-social-button-scroll' id='scrollBut'>
            <AlignLeftOutlined style={{ color: 'white', fontSize: '2.3em' }} />
          </SocialButton>
        </Dropdown>
      </Col>
    </Row>
  )

  return (
    <>
      <Row justify='center' className={defaultNavClass.join(' ')}>
        <Col xs={24} lg={22} xxl={18}>
          <Container>
            <Row className='nav-row'>
              <Col xs={0} md={6} className='nav-box n1'>
                <Link className='logo-hover' href={'/'}>
                  <Logo img={'/assets/Images/logo-rotate.png'}></Logo>
                  <Image
                    src='/assets/Images/logo-rotate.png'
                    preview={false}
                    height={150}
                  />
                </Link>
              </Col>
              <Col xs={19} md={12} className='nav-box n2'>
                <N2 img={'/assets/Images/logo-rotate-05opa.png'}>
                  <h1>CAFETELLER</h1>
                  <h3 style={{ fontStyle: 'italic' }}>
                    &quot;Because good cafés deserve a shout out&quot;
                  </h3>
                </N2>
              </Col>
              <Col xs={5} md={6} className='nav-box n3'>
                <Row>
                  <Col xs={0} md={24}>
                    <SocialBar>
                      <a href='https://www.instagram.com/cafeteller/'>
                        <Instagram className='h-8 w-8 text-icons-nav' />
                      </a>
                      <a href='https://www.facebook.com/cafeteller/'>
                        <Facebook className='h-8 w-8 text-icons-nav' />
                      </a>
                      <a href='https://twitter.com/CAFETELLER'>
                        <Twitter className='h-8 w-8 text-icons-nav' />
                      </a>
                    </SocialBar>
                  </Col>
                  <Col xs={24} md={0}>
                    <Dropdown
                      overlay={SocialBarMenu}
                      trigger={['click']}
                      placement='bottomCenter'
                    >
                      <SocialButton className='nav-social-button'>
                        <AlignLeftOutlined
                          style={{ color: 'white', fontSize: '3em' }}
                        />
                      </SocialButton>
                    </Dropdown>
                  </Col>
                  <Col xs={24} md={24}>
                    <SocialBarBot img={'/assets/Images/pattern2.jpg'} />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='nav-row n2'>
              <Col xs={19} md={12} className='nav-box n4 review-hover'>
                <Link href={'/'}>
                  <ReviewBar className={navBgColor[0]}>
                    <ReviewFace
                      className={classNames([
                        'h-7 w-7',
                        navBgColor[0] === 'nav-brown-bgcolor'
                          ? 'text-icons-active'
                          : 'text-icons-default'
                      ])}
                    />

                    <ReviewBarText>Reviews</ReviewBarText>
                  </ReviewBar>
                </Link>
              </Col>
              <Col xs={5} md={12} className='nav-box n5 search-hover'>
                <Link href={'/search'}>
                  <SearchBar className={navBgColor[1]}>
                    <Search
                      className={classNames([
                        'h-7 w-7',
                        navBgColor[1] === 'nav-brown-bgcolor'
                          ? 'text-icons-active'
                          : 'text-icons-default'
                      ])}
                    />

                    <SearchText>Search</SearchText>
                  </SearchBar>
                </Link>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>

      {!navbarIsHiding && ScrolledNavbar}
      {navbarIsHiding && portal && createPortal(ScrolledNavbar, portal)}
    </>
  )
}

export default Navbar
