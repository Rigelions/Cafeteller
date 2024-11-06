import React from 'react'
import { Select } from 'antd'

import _changwats from '@/assets/json/changwats.json'
const changwats: Record<string, any> = _changwats

interface ProvinceProps {
  onValueChange: (value: string[]) => void
  value: string[]
}

const ProvinceSelect = ({ value, onValueChange }: ProvinceProps) => {
  return (
    <Select
      mode='multiple'
      maxTagCount='responsive'
      allowClear
      onChange={onValueChange}
      style={{ width: '100%' }}
      optionFilterProp='children'
      placeholder='ค้นหาด้วยจังหวัด'
      optionLabelProp='label'
      value={value}
    >
      {Object.keys(changwats).map((changwatId) => (
        <Select.Option
          key={changwatId}
          value={changwats[changwatId].name.th}
          label={changwats[changwatId].name.th}
        >
          {changwats[changwatId].name.th}
        </Select.Option>
      ))}
    </Select>
  )
}

export default ProvinceSelect
