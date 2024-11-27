import React from 'react'

import withMeta from '@/hoc/withMeta'
import NavbarContainer from '@/components/ui/NavbarContainer'
import Footer from '@/components/ui/Footer'
import AllReview from '@/components/Home/_components/AllReview'
import RecentReview from '@/components/Home/_components/RecentReview'
import CarouselBanner from '@/components/Home/_components/CarouselBanner'
import dynamic from 'next/dynamic'
import { bannerURL } from '@/utils/constants'

const Layout = dynamic(() => import('./Layout'), { ssr: false })

function Home() {
  const container = React.useRef<HTMLDivElement | null>(null)

  return (
    <Layout
      outerRef={container}
      header={
        <>
          <NavbarContainer container={container} />
          <CarouselBanner />
          <RecentReview />
          <AllReview />
        </>
      }
      footer={<Footer />}
    />
  )
}

export default withMeta(Home, {
  title: 'Home',
  description: 'Because good cafés deserve a shout out',
  keywords: ['home', 'page', 'cafeteller'],
  metaTags: [
    // Standard meta tags
    { name: 'image', content: bannerURL },
    { name: 'keywords', content: 'home, page, cafeteller' },
    { name: 'robots', content: 'all' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    // Open Graph meta tags
    { property: 'og:title', content: 'Home' },
    {
      property: 'og:description',
      content: 'Because good cafés deserve a shout out'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: bannerURL },
    {
      property: 'og:url',
      content: process.env.NEXT_PUBLIC_REDIRECT_IG_URL || ''
    }, // Replace with the page's URL
    { property: 'og:site_name', content: 'Cafeteller' },
    // Twitter Card data
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Home' },
    {
      name: 'twitter:description',
      content: 'Because good cafés deserve a shout out'
    },
    { name: 'twitter:image', content: bannerURL },
    { name: 'twitter:site', content: '@Cafeteller' } // Replace with your Twitter handle
  ]
})
