import React from 'react'
import { Select } from 'antd'

import _amphoes from '@/assets/json/amphoes.json'
const amphoes: Record<string, any> = _amphoes

import _changwats from '@/assets/json/changwats.json'
import { isArrayNotEmpty } from '@/utils/array'
const changwats: Record<string, any> = _changwats

interface AmphoeSelectProps {
  selectedChangwats?: string[]
  value: string[]
  onValueChange: (value: string[]) => void
}

const AmphoeSelect = ({
  selectedChangwats,
  value,
  onValueChange
}: AmphoeSelectProps) => {
  return (
    <Select
      mode='multiple'
      allowClear
      maxTagCount='responsive'
      style={{ width: '100%' }}
      onChange={onValueChange}
      value={value}
      optionFilterProp='children'
      placeholder='ค้นหาด้วยอำเภอ/เขต'
      optionLabelProp='label'
    >
      {Object.keys(amphoes)
        .filter((amphoeId) => {
          const province = changwats[amphoes[amphoeId].changwat_id].name.th
          if (!isArrayNotEmpty(selectedChangwats)) return true
          return selectedChangwats?.includes(province)
        })
        .map((amphoe) => (
          <Select.Option
            key={amphoe}
            value={amphoes[amphoe].name.th}
            label={amphoes[amphoe].name.th}
          >
            {`${isArrayNotEmpty(selectedChangwats) ? changwats[amphoes[amphoe].changwat_id].name.th + ' -> ' : ''}${amphoes[amphoe].name.th}`}
          </Select.Option>
        ))}
    </Select>
  )
}

export default AmphoeSelect
