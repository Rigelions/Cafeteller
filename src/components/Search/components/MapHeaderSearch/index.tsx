import { Col, Row } from 'antd'
import React from 'react'
import styled from 'styled-components'
import NameAutocomplete from '@/components/Search/components/NameAutocomplete'
import TagsSelect from '@/components/Search/components/TagsSelect'
import ProvinceSelect from '@/components/Search/components/ProvinceSelect'
import AmphoeSelect from '@/components/Search/components/AmphoeSelect'
import { Filter } from '@/components/Search/types'

const MapHeader = styled.div`
  box-shadow: 0 2px 6px 0 rgb(0 0 0 / 20%);
  padding: 15px;
  background: #f5f1eb;
  z-index: 1;
  position: relative;

  .ant-row {
    margin-bottom: 0 !important;
  }
`

interface MapHeaderSearchProps {
  className: string
  onFilterChange: (filter: Filter) => void
  filter: Filter
}

const MapHeaderSearch = ({
  className,
  filter,
  onFilterChange
}: MapHeaderSearchProps) => {
  const onChange = (key: keyof Filter) => (value: string | string[]) => {
    const newFilter = { ...filter, [key]: value }
    onFilterChange(newFilter)
  }

  return (
    <MapHeader className={className}>
      <div>
        <Row gutter={[16, 12]} justify='center'>
          <Col span={12}>
            <NameAutocomplete
              value={filter.name || ''}
              onChange={onChange('name')}
            />
          </Col>
          <Col span={12}>
            <TagsSelect
              value={filter.tags || []}
              onValueChange={onChange('tags')}
            />
          </Col>
          <Col xs={12}>
            <ProvinceSelect
              value={filter.provinces || []}
              onValueChange={onChange('provinces')}
            />
          </Col>
          <Col xs={12}>
            <AmphoeSelect
              selectedChangwats={filter.provinces || []}
              value={filter.amphoes || []}
              onValueChange={onChange('amphoes')}
            />
          </Col>
        </Row>
      </div>
    </MapHeader>
  )
}

export default MapHeaderSearch
