export type Filter = {
  id: number
  code: string
  name: string
  data_type: string
  is_required: boolean
  sort_order: number
  created_at: string
  updated_at: string
  values: Value[]
}

export type Value = {
  id: number
  attribute_id: number
  value: string
  code: string
  hex_color?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
