import React, { useRef, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { InboxOutlined, LoadingOutlined, LeftOutlined, SaveOutlined } from '@ant-design/icons'
import Banner from './Banner'

import SimpleVideo from 'plugins/Video/index'
import { loader } from 'plugins/gmap'
import upload from 'plugins/Video/upload'
import { igToBlock } from 'plugins/customfunc'

import amphoes from '../../public/assets/json/amphoes.json'
import changwats from '../../public/assets/json/changwats.json'

const {
  Row,
  Col,
  Upload,
  message,
  Image,
  Spin,
  Button,
  Space,
  Input,
  Typography,
  Select
} = require('antd')

const { Option } = Select
const { Dragger } = Upload
const { Title } = Typography
const { TextArea } = Input

const componentForm = {
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

const restrictCountry = { country: ['th', 'au', 'jp'] }

export default function Editor (props) {
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cafe, setCafe] = useState({
    location_data: {
      province: {},
      district: {}
    },
    placeData: {},
    district: '',
    subdistrict: '',
    selectedTags: []
  })

  let editor, map, autocomplete, marker
  const fillInAddress = () => {
    // Get the place details from the autocomplete object.
    const place = autocomplete.getPlace()
    const placeData = {}
    placeData.name = place.name
    placeData.location = {
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    }
    placeData.details = place.formatted_address
    console.log(place.geometry.location)

    const { google } = window
    if (marker) marker.setMap(null)
    marker = new google.maps.Marker({
      position: place.geometry.location,
      map,
      icon: '/assets/Images/pin.png',
      title: place.name
    })

    map.panTo(place.geometry.location)
    map.setZoom(20)
    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0]
      if (componentForm[addressType]) {
        // eslint-disable-next-line prefer-const
        let val = place.address_components[i][componentForm[addressType]]
        if (addressType === 'locality') {
          addressType = 'sublocality_level_2'
        } else if (addressType === 'administrative_area_level_2') {
          addressType = 'sublocality_level_1'
        }
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
    setCafe({
      ...cafe,
      placeData
    })
  }

  const content = async (post) => {
    const content = {}
    content.blocks = []

    // split caption block in to an array
    let caption = post.caption.split('\n\n')

    // /*
    // header of reviews if there is no header on ig : ชื่อรีวิว instead
    // */
    let header = 'ชื่อรีวิว'
    if (caption[0].includes('\n')) {
      const buffer = caption[0].split('\n')
      caption.shift()
      header = buffer.shift()
      caption = [...buffer, ...caption]
    }

    // push header in to content's block
    content.blocks.push({
      type: 'header',
      data: {
        text: header,
        level: 2
      }
    })
    // content.caption = caption

    // convert ig image, video and carousel to block
    const igBlock = await igToBlock(post)

    content.blocks = [
      ...content.blocks,
      ...caption.map((text) => {
        return {
          type: 'paragraph',
          data: {
            text: text.replace(/&#8232;/g, ' ')
          }
        }
      })
    ]

    if (Array.isArray(igBlock)) {
      content.blocks = [...igBlock, ...content.blocks]
    } else {
      content.blocks = [igBlock, ...content.blocks]
    }
    return content
  }

  const autoInput = useRef()
  useEffect(() => {
    const didMount = async () => {
      setLoading(true)
      const EditorJS = require('@editorjs/editorjs')
      const Header = require('@editorjs/header')
      const List = require('@editorjs/list')
      const ImageTool = require('@editorjs/image')
      try {
        const data = props.selected === undefined ? {} : await content(props.posts.data[props.selected])
        if (document.getElementById('codex-editor')) {
          editor = new EditorJS({
          /**
           * Id of Element that should contain Editor instance
           */
            holder: 'codex-editor',
            tools: {
              header: { class: Header, inlineToolbar: true },
              list: List,
              image: {
                class: ImageTool,
                config: {
                // config uploader of image module
                  uploader: {
                    uploadByFile: async (file) => {
                      const uploadedFile = await upload(file, 'images')
                      return uploadedFile
                    },
                    uploadByUrl: async (file) => {
                      const image = await file
                      return {
                        success: 1,
                        file: {
                          url: image
                        }
                      }
                    }
                  }
                }
              },
              video: SimpleVideo
            },
            placeholder: 'เขียนรีวิวที่นี่!',
            autofocus: true,
            // any ig post selected? empty content, convert caption to content otherwise
            data
          })
        }
        if (!window.google) await loader.load()
        const { google } = window
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8
        })
        console.log(autoInput.current)
        // Create the autocomplete object, restricting the search predictions to
        autocomplete = new google.maps.places.Autocomplete(
          autoInput.current.input,
          {
            types: ['establishment'],
            componentRestrictions: restrictCountry,
            fields: ['address_component', 'formatted_address', 'name', 'geometry']
          }
        )
        // When the user selects an address from the drop-down, populate the
        // address fields in the form.
        autocomplete.addListener('place_changed', fillInAddress)
        setLoading(false)
      } catch (error) {
        console.log(error)
        message.error('load ไม่สำเร็จ')
      }
    }
    didMount()
    return () => { editor && editor.destroy && editor.destroy() }
  }, [])

  // eslint-disable-next-line no-unused-vars
  const saveReview = async () => {
    // save reviews to database
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const review = await editor.save()
    const cafeData = this.$refs.cafe.placeData
    cafeData.tags = this.$refs.cafe.selectedTags

    Object.keys(cafeData).forEach((key) => {
      if (typeof cafeData[key] === 'string') {
        cafeData[key] = cafeData[key].replace(/&#8232;/g, ' ')
      }
    })

    let path = '/review'
    if (this.$route.name === 'review-id-edit') {
      path += '/' + this.$route.params.id
    }
    cafeData.banner = this.banner ? this.banner : {}
    console.log(cafeData)
    const res = await this.$axios.post(
      path,
      JSON.stringify({
        access_token: localStorage.getItem('access_token'),
        post: {
          review,
          cafe: cafeData
        }
      }),
      config
    )
    console.log(res.data)
    this.$router.push('/review/' + res.data)
  }

  const draggerProps = {
    name: 'file',
    async customRequest ({ file, onSuccess, onError }) {
      try {
        const res = await upload(file, 'Image')
        setBanner(res.file.url)
        onSuccess('done')
      } catch (error) {
        onError(() => {
          if (error.response) {
            message.error(error.response.data.error_message)
          } else {
            message.error(error.message)
          }
        })
      }
    },
    onChange (info) {
      const { status } = info.file
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    }
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 30 }} spin />
  const setPlaceData = (val) => {
    setCafe({
      ...cafe,
      placeData: {
        ...cafe.placeData,
        ...val
      }
    })
  }
  const contact = [
    {
      name: 'Open Hour',
      icon: '/assets/Images/icon/Open hours.png',
      input: (
        <Input
          value={cafe.placeData.openhour}
          onChange={e => {
            setPlaceData({ openhour: e.target.value })
          }}
        />
      )
    },
    {
      name: 'parking',
      icon: '/assets/Images/icon/parking.png',
      input: (
        <TextArea
          value={cafe.placeData.parking}
          onChange={e => {
            setPlaceData({ parking: e.target.value })
          }}
        />
      )
    },
    {
      name: 'call',
      icon: '/assets/Images/icon/call.png',
      input: (
        <Input
          value={cafe.placeData.phone}
          onChange={e => {
            setPlaceData({ phone: e.target.value })
          }}
        />)
    },
    {
      name: 'address detail',
      icon: '/assets/Images/icon/address.png',
      input: (
        <TextArea
          value={cafe.placeData.details}
          onChange={e => {
            setPlaceData({ details: e.target.value })
          }}
        />
      )
    },
    {
      name: 'landmark',
      icon: '/assets/Images/icon/location.png',
      input: (
        <Input
          value={cafe.placeData.landmark}
          onChange={e => {
            setPlaceData({ landmark: e.target.value })
          }}
        />
      )
    },
    {
      name: 'ig',
      icon: '/assets/Images/icon/Social/IG.png',
      input: (
        <Input
          value={cafe.placeData.ig}
          onChange={e => {
            setPlaceData({ ig: e.target.value })
          }}
        />
      )
    },
    {
      name: 'fb',
      icon: '/assets/Images/icon/Social/FB.png',
      input: (
        <Input
          value={cafe.placeData.fb}
          onChange={e => {
            setPlaceData({ fb: e.target.value })
          }}
        />
      )
    },
    {
      name: 'tw',
      icon: '/assets/Images/icon/Social/Twitter.png',
      input: (
        <Input
          value={cafe.placeData.tw}
          onChange={e => {
            setPlaceData({ tw: e.target.value })
          }}
        />
      )
    }
  ]
  return (
    <>
      <Col xs={24}>
        {
          banner
            ? <Banner>
                <Image height={'100%'} width={'100%'} style={{ objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = '/assets/Images/placeholder.png' }}
                  alt={'banner'} src={banner} fallback="/assets/Images/placeholder.png" preview={false}
                />
              </Banner>
            : null
        }
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag image to this area to upload</p>
          <p className="ant-upload-hint">
            Support banner for scale 3:4
          </p>
        </Dragger>
      </Col>

      <Col xs={24} md={22} style={{ marginTop: 20 }}>
        <Space size="small" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={props.prev} icon={<LeftOutlined />} />
          <Button type="primary" onClick={props.save} icon={<SaveOutlined />}>บันทึก</Button>
        </Space>
      </Col>
      <Col xs={24} md={22}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <div className="editor-section">
              <div id="codex-editor" style={{ marginTop: 20 }} className="th"></div>
            </div>
            {
              loading
                ? <Spin indicator={antIcon} />
                : null
            }
          </Col>
          <Col className="th" style={{ marginTop: 20 }} xs={24} lg={12}>
            <Row gutter={[0, 16]}>
              <Col xs={4} sm={6} md={4} lg={2}>
                <Title style={{ textAlign: 'center' }} level={5}>
                  ชื่อคาเฟ่
                </Title>
              </Col>
              <Col xs={20} sm={18} md={20} lg={22}>
                <Input
                  ref={autoInput}
                  value={cafe.placeData.name}
                  onChange={(e) => {
                    setPlaceData({
                      name: e.target.value
                    })
                  }}
                  placeholder="Cafe Name"
                  type="text"
                />
              </Col>
              <Col xs={6} md={4} lg={2}>
                <Title style={{ textAlign: 'center' }} level={5}>
                  เลขที่
                </Title>
              </Col>
              <Col xs={18} md={18} lg={10}>
                <Input
                  value={cafe.placeData.street_number}
                  onChange={(e) => {
                    setPlaceData({
                      street_number: e.target.value
                    })
                  }}
                  placeholder="Cafe Name"
                  type="text"
                />
              </Col>
              <Col xs={6} md={4} lg={2}>
                <Title style={{ textAlign: 'center' }} level={5}>
                  รหัสไปรษณีย์
                </Title>
              </Col>
              <Col xs={18} md={18} lg={10}>
                <Input
                  value={cafe.placeData.postal_code}
                  onChange={(e) => {
                    setPlaceData({
                      postal_code: e.target.value
                    })
                  }}
                  placeholder="Cafe Name"
                  type="text"
                />
              </Col>
              <Col xs={6} md={4} lg={2}>
                <Title style={{ textAlign: 'center' }} level={5}>
                  เขต/อำเภอ
                </Title>
              </Col>
              <Col xs={18} md={18} lg={10}>
                <Select
                  showSearch
                  value={cafe.placeData.sublocality_level_1}
                  style={{ width: '100%' }}
                  onChange={(id) => {
                    setPlaceData({
                      administrative_area_level_1: changwats[id.slice(0, 2)].name.th,
                      sublocality_level_1: amphoes[id].name.th
                    })
                  }}
                  optionFilterProp="children"
                  placeholder="ค้นหาอำเภอ/เขต"
                  optionLabelProp="label"
                >
                  {
                    Object.keys(amphoes)
                      .map(amphoe => (
                        <Option key={amphoe} value={amphoe} label={amphoes[amphoe].name.th}>
                          {
                            changwats[amphoes[amphoe].changwat_id].name.th +
                            ' -> ' +
                            amphoes[amphoe].name.th
                          }
                        </Option>
                      ))
                  }
                </Select>
              </Col>
              <Col xs={6} md={4} lg={2}>
                <Title style={{ textAlign: 'center' }} level={5}>
                  จังหวัด
                </Title>
              </Col>
              <Col xs={18} md={18} lg={10}>
                <Select
                  showSearch
                  value={cafe.placeData.administrative_area_level_1}
                  style={{ width: '100%' }}
                  onChange={(id) => {
                    setPlaceData({
                      administrative_area_level_1: changwats[id].name.th
                    })
                  }}
                  optionFilterProp="children"
                  placeholder="จังหวัด"
                  optionLabelProp="label"
                >
                  {
                    Object.keys(changwats)
                      .map(changwat => (
                        <Option key={changwat} value={changwat} label={changwats[changwat].name.th}>
                          {
                            changwats[changwat].name.th
                          }
                        </Option>
                      ))
                  }
                </Select>
              </Col>
            </Row>
            {/* contact box */}
            <Row>
              <Col span={24}>
                <ContactInfo>
                  {
                    contact.map(block => (
                      <Row key={block.name}>
                        <Col span={4}>
                          <Image src={block.icon} preview={false} height={30} width={30} />
                        </Col>
                        <Col span={20}>
                          {block.input}
                        </Col>
                      </Row>
                    ))
                  }
                  <Map id="map" />
                </ContactInfo>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  )
}

Editor.propTypes = {
  // ...prop type definitions here
  posts: PropTypes.object,
  selected: PropTypes.number,
  prev: PropTypes.func,
  save: PropTypes.func
}

const ContactInfo = styled.div`
  font-size: 1rem;
  border-top: 2px solid #d2c5b8;
  background-color: #f5f1eb;
  font-family: 'Maitree', serif;
  .ant-row {
    border-bottom: 2px solid #d2c5b8;
    padding-top: 12px;
    padding-bottom: 12px;
    padding-left: 20px;
    padding-right: 20px;
    margin: 0;
    align-items: center;
  }
  .ant-image {
    display: block;
  }
  @media (min-width: 768px) {
    border: 2px solid #d2c5b8;
    border-bottom:0;
    margin-bottom: 0px;
    font-size: 1.1rem;
    .ant-row {
      padding-top: 17px;
      padding-bottom: 17px;
      padding-left: 20px;
      padding-right: 20px;
      margin: 0;
      align-items: center;
    }
  }
  @media (min-width: 992px) {
    border: 2px solid #d2c5b8;
    margin-bottom: 20px;
    border-bottom: 0;
  }

`
const Map = styled.div`
  width: 100%;
  height: 400px;
  background: grey;
  border-bottom: 2px solid #d2c5b8;
`