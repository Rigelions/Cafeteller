import React from 'react'
import { Input } from 'antd'

interface NameAutocompleteProps {
  value: string
  onChange: (value: string) => void
}

const NameAutocomplete = ({ value, onChange }: NameAutocompleteProps) => {
  return (
    <Input
      placeholder='ค้นหาด้วยชื่อคาเฟ่'
      style={{ width: '100%' }}
      allowClear
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default NameAutocomplete
