import React, { useEffect } from 'react'
import { Col, Input, message, Row, Select, Typography } from 'antd'
import { cafeAtom } from '@/components/Reviews/AddReviewController/atom/cafe'
import { useAtom } from 'jotai'
import { Cafe } from '@/types'
import { TitleProps } from 'antd/es/typography/Title'

import _amphoes from '@/assets/json/amphoes.json'
import _changwats from '@/assets/json/changwats.json'
import useMap from '@/hooks/map/useMap'
import { Autocomplete } from '@/components/ui/Map'
import useMarker from '@/hooks/map/useMarker'

const amphoes: Record<string, any> = _amphoes
const changwats: Record<string, any> = _changwats

const { Title } = Typography
const { Option } = Select

const COMPONENT_FORM = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'long_name',
  administrative_area_level_2: 'short_name',
  sublocality_level_1: 'short_name',
  sublocality_level_2: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
}

interface CafeLocationProps {}

const CafeLocation = ({}: CafeLocationProps) => {
  const mapDivRef = React.useRef<HTMLDivElement>(null)
  const [cafe, setCafe] = useAtom(cafeAtom)

  const [options, setOptions] = React.useState({
    center: {
      lat: 13.736717,
      lng: 100.523186
    },
    zoom: 15,
    mapId: 'add-review-map'
  })

  const { mapRef } = useMap({
    element: mapDivRef,
    options
  })

  const { marker } = useMarker({
    map: mapRef,
    options: {
      position: {
        lng: options.center.lng,
        lat: options.center.lat
      },
      title: 'Cafe Location'
    }
  })

  useEffect(() => {
    // get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        mapRef.current?.panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })

        if (!marker.current) return
        marker.current.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    }
  }, [mapRef.current, marker.current])

  const setPlaceData = (data: Partial<Cafe>) => {
    setCafe((prev) => ({
      ...prev,
      ...data
    }))
  }

  const onPlaceChanged = (place: google.maps.places.PlaceResult) => {
    try {
      const placeData: Partial<Cafe> = {}
      placeData.name = place.name

      if (!place.geometry?.location) {
        message.error('Place not found').then()
        return
      }

      placeData.location = {
        lat: place.geometry.location.lat(),
        lon: place.geometry.location.lng()
      }
      placeData.details = place.formatted_address

      // Get each component of the address from the place details,
      // and then fill-in the corresponding field on the form.
      if (!place.address_components) {
        return
      }

      for (let i = 0; i < place.address_components.length; i++) {
        let addressType = place.address_components[i]
          .types[0] as keyof typeof COMPONENT_FORM

        if (COMPONENT_FORM[addressType]) {
          // eslint-disable-next-line prefer-const
          let val =
            place.address_components[i][
              COMPONENT_FORM[
                addressType
              ] as keyof google.maps.GeocoderAddressComponent
            ]
          if (addressType === 'locality') {
            addressType = 'sublocality_level_2'
          } else if (addressType === 'administrative_area_level_2') {
            addressType = 'sublocality_level_1'
          }

          if (typeof val != 'string') return

          val = val.replace('อำเภอ', '')
          val = val.replace('อ.', '')
          val = val.replace('เขต', '')
          val = val.replace('แขวง', '')
          val = val.replace('ตำบล', '')
          val = val.replace('จังหวัด', '')
          val = val.replace('จ.', '')
          val = val.trim()

          placeData[addressType] = val
        }
      }

      mapRef.current?.panTo(place.geometry.location)
      if (marker.current) marker.current.position = place.geometry.location

      setPlaceData(placeData)

      mapRef.current?.panTo(place.geometry.location)
      mapRef.current?.setZoom(20)
    } catch (error) {
      console.log(error)
    }
  }

  const titleProps: TitleProps = {
    className: '!mb-0 mt-2',
    level: 5
  }

  return (
    <>
      <Row gutter={[16, 0]}>
        <Col span={24}>
          <Title {...titleProps}>ชื่อคาเฟ่</Title>
        </Col>
        <Col span={24}>
          <Autocomplete
            value={cafe.name}
            onPlaceChanged={onPlaceChanged}
            onChange={(e) => {
              setPlaceData({
                name: e.target.value
              })
            }}
            placeholder='Cafe Name'
            type='text'
          />
        </Col>
        <Col span={24}>
          <Title {...titleProps}>เลขที่</Title>
        </Col>
        <Col span={24}>
          <Input
            value={cafe.street_number}
            onChange={(e) => {
              setPlaceData({
                street_number: e.target.value
              })
            }}
            placeholder='Cafe Name'
            type='text'
          />
        </Col>
        <Col span={24}>
          <Title {...titleProps}>รหัสไปรษณีย์</Title>
        </Col>
        <Col span={24}>
          <Input
            value={cafe.postal_code}
            onChange={(e) => {
              setPlaceData({
                postal_code: e.target.value
              })
            }}
            placeholder='Cafe Name'
            type='text'
          />
        </Col>
        <Col span={24}>
          <Title {...titleProps}>เขต/อำเภอ</Title>
        </Col>
        <Col span={24}>
          <Select
            showSearch
            value={cafe.sublocality_level_1}
            style={{ width: '100%' }}
            onChange={(id) => {
              setPlaceData({
                administrative_area_level_1: changwats[id.slice(0, 2)].name.th,
                sublocality_level_1: amphoes[id].name.th
              })
            }}
            optionFilterProp='children'
            placeholder='ค้นหาอำเภอ/เขต'
            optionLabelProp='label'
          >
            {Object.keys(amphoes).map((amphoe) => (
              <Option
                key={amphoe}
                value={amphoe}
                label={amphoes[amphoe].name.th}
              >
                {changwats[amphoes[amphoe].changwat_id].name.th +
                  ' -> ' +
                  amphoes[amphoe].name.th}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={24}>
          <Title {...titleProps}>จังหวัด</Title>
        </Col>

        <Col span={24}>
          <Select
            showSearch
            value={cafe.administrative_area_level_1}
            style={{ width: '100%' }}
            onChange={(id) => {
              setPlaceData({
                administrative_area_level_1: changwats[id].name.th
              })
            }}
            optionFilterProp='children'
            placeholder='จังหวัด'
            optionLabelProp='label'
          >
            {Object.keys(changwats).map((changwat) => (
              <Option
                key={changwat}
                value={changwat}
                label={changwats[changwat].name.th}
              >
                {changwats[changwat].name.th}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Row className='mt-2'>
        <div
          ref={mapDivRef}
          className='w-full h-[400px] bg-gray-500 border-b-2 border-[#d2c5b8]'
        />
      </Row>
    </>
  )
}

export default CafeLocation
