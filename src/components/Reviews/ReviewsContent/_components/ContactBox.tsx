import React from 'react'
import { Row, Col, Image } from 'antd'
import { maitree } from '@/utils/font'

interface CafeData {
  openhour?: string
  parking?: string
  phone?: string
  details?: string
  landmark?: string
}

interface ContactBoxProps {
  cafeData: CafeData
}

const ContactBox: React.FC<ContactBoxProps> = ({ cafeData }) => {
  const contactItems = [
    {
      key: 'openhour',
      icon: '/assets/Images/icon/Open hours.png',
      height: 30,
      width: 30
    },
    {
      key: 'parking',
      icon: '/assets/Images/icon/Parking.png',
      height: 35,
      width: 35
    },
    {
      key: 'phone',
      icon: '/assets/Images/icon/Call.png',
      height: 30,
      width: 30
    },
    {
      key: 'details',
      icon: '/assets/Images/icon/Address.png',
      height: 30,
      width: 30
    },
    {
      key: 'landmark',
      icon: '/assets/Images/icon/Location.png',
      height: 30,
      width: 30
    }
  ]

  const contactBoxRaw = contactItems
    .filter(
      (item) => typeof cafeData[item.key as keyof CafeData] !== 'undefined'
    )
    .map((item, index) => (
      <Row key={index}>
        <Col span={4}>
          <Image
            src={item.icon}
            preview={false}
            height={item.height}
            width={item.width}
          />
        </Col>
        <Col span={20}  className={maitree.className}>
          {item.key === 'landmark'
            ? (cafeData.landmark || '').replace(/&#8232;/g, '')
            : cafeData[item.key as keyof CafeData]}
        </Col>
      </Row>
    ))

  return <>{contactBoxRaw}</>
}

export default ContactBox
