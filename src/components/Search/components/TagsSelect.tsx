import React from 'react'
import { Select } from 'antd'
import { TAGS } from '@/components/Reviews/AddReviewController/constants'

interface TagsSelectProps {
  onValueChange: (value: string[]) => void
  value: string[]
}

const TagsSelect = ({ value, onValueChange }: TagsSelectProps) => {
  return (
    <Select
      showSearch
      onChange={onValueChange}
      mode='multiple'
      allowClear
      maxTagCount='responsive'
      optionFilterProp='children'
      placeholder='ค้นหาด้วยประเภท'
      style={{ width: '100%' }}
      value={value}
    >
      {TAGS.map((r) => (
        <Select.Option value={r.value} key={r.key}>
          {r.value}
        </Select.Option>
      ))}
    </Select>
  )
}

export default TagsSelect
