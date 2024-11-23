import React, { useState, useRef, useEffect } from 'react'
import { Col, Row } from 'antd'
import Link from 'next/link'
import styled from 'styled-components'
import dynamic from 'next/dynamic'
import MapHeaderSearch from '@/components/Search/components/MapHeaderSearch'
import {
  MapSearchMenu,
  MapSearchMenuContainer,
  Pattern1
} from '@/components/Search/Search.style'
import useMap from '@/hooks/map/useMap'
import { Cafe } from '@/types'
import MarkerPopup from '@/components/Search/components/MarkerPopup'
import { Filter } from '@/components/Search/types'
import { getCafeService } from '@/components/Search/services'
import useDebounce from '@/hooks/useDebounce'
import useFloatingSpinner from '@/hooks/useFloatingSpinner'
import { maitree } from '@/utils/font'

const ControlFooter = dynamic(
  () => import('./components/ControlFooter').then((module) => module),
  { ssr: false }
)
const Card = dynamic(
  () => import('core_cafeteller/components').then((module) => module.Card),
  { ssr: false }
)

const Map = styled.div`
  width: 100%;
  background: gray;
  box-shadow: inset 0 0 10px #000000;
  position: fixed !important;
  height: calc(100vh - 196px);
  @media (min-width: 768px) {
    height: calc(100% - 112px);
    position: relative !important;
  }
`
const MapContainer = styled.div`
  height: calc(100vh - 200px);
  /* margin-top: 25px; */
  @media (min-width: 768px) {
    margin-right: 0;
    height: 100%;
    border: 1px #bcbcbc solid;
  }
  @media (min-width: 1025px) {
    margin-right: 1em;
  }
`

const SearchReview = styled.div`
  display: none;
  width: 96%;
  margin: auto;
  margin-top: 40px;

  .ant-col {
    display: flex !important;
    justify-content: center;
  }

  h2 {
    font-size: 1.5rem;
    text-align: center;
    font-family: 'Times New Roman';

    span {
      color: #233d77;
    }
  }

  @media (min-width: 768px) {
    margin-left: -1px;
    display: block;
    width: 101%;
    margin-top: 0;
    border: 1px solid #bcbcbc;
    /* background-color: #f5f1eb; */
    h2 {
      font-family: 'Georgia';
      margin-bottom: 0;
      padding: 10px;
      font-size: 1.8rem;
      background-color: #f5f1eb;

      span {
      }
    }
  }
  @media (min-width: 1024px) {
    margin-left: 0;
    width: 100%;
  }
`

const SearchReviewCard = styled.div`
  margin-top: 15px;
  width: 95%;
`

export default function Search() {
  const [filteredCafe, setFilteredCafe] = useState<Cafe[]>([])
  const mapElRef = useRef<HTMLElement | null>(null)

  const setLoading = useFloatingSpinner()
  const [filter, setFilter] = useState<Filter>({
    provinces: ['กรุงเทพมหานคร']
  })
  const [options] = useState({
    center: { lat: 13.736717, lng: 100.523186 },
    zoom: 10,
    mapId: 'map-search'
  })

  const { mapRef } = useMap({
    element: mapElRef,
    options
  })

  const getCafe = async () => {
    const data = await getCafeService(filter)

    setFilteredCafe(data.data)

    setLoading(false)
  }
  const [getCafeDebounced, cancel] = useDebounce(getCafe, 500)

  useEffect(() => {
    setLoading(true)

    cancel()
    getCafeDebounced()
  }, [filter])

  return (
    <>
      <ControlFooter />
      <MarkerPopup map={mapRef} cafes={filteredCafe} />

      <Row justify='center' className='search-wrap'>
        <Col xs={24} lg={22} xxl={18}>
          <Row>
            <Col xs={24} md={17} xxl={18}>
              <MapContainer>
                <MapHeaderSearch
                  className='hidden md:block'
                  filter={filter}
                  onFilterChange={setFilter}
                />
                <Map
                  ref={mapElRef as React.RefObject<HTMLDivElement>}
                  id='map'
                  className='map-search'
                />
              </MapContainer>
            </Col>
            <Col xs={24} md={{ span: 7 }} xxl={{ span: 6 }}>
              <SearchReview>
                <h2>
                  <span>{filteredCafe.length}</span> Reviews
                </h2>

                <Row style={{ overflowY: 'scroll', height: '87vh' }}>
                  {filteredCafe.map((c) => (
                    <Col key={c.id} xs={24}>
                      <SearchReviewCard>
                        <Link href={`/reviews/${c.review_id}`}>
                          <Card
                            description={c.sublocality_level_1}
                            key={c.id}
                            title={c.name}
                            src={c.banner?.url}
                            className='h-96 lg:h-[28rem]'
                            titleProps={{
                              className: `${maitree.className}`
                            }}
                            descriptionProps={{
                              className: `${maitree.className}`
                            }}
                          />
                        </Link>
                      </SearchReviewCard>
                    </Col>
                  ))}
                </Row>
              </SearchReview>
            </Col>
          </Row>
        </Col>
      </Row>

      <MapSearchMenuContainer id='search-menu-mobile'>
        <Pattern1 img={'/assets/Images/pattern6.jpg'}>
          <MapSearchMenu>
            <h2>
              <span>{filteredCafe.length}</span> Reviews
            </h2>

            <MapHeaderSearch
              filter={filter}
              onFilterChange={setFilter}
              className='block md:hidden shadow-none mb-2'
            />
            <Row gutter={[10, 12]}>
              {filteredCafe.map((c) => {
                return (
                  <Col key={c + '-link'} xs={24}>
                    <Link href={`/reviews/${c.review_id}`}>
                      <Card
                        description={c.sublocality_level_1}
                        key={c.id}
                        title={c.name}
                        src={c.banner?.url}
                        className='h-96 lg:h-[28rem]'
                        titleProps={{
                          className: `${maitree.className}`
                        }}
                        descriptionProps={{
                          className: `${maitree.className}`
                        }}
                      />
                    </Link>
                  </Col>
                )
              })}
            </Row>
          </MapSearchMenu>
        </Pattern1>
      </MapSearchMenuContainer>
    </>
  )
}
