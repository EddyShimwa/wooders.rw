import { Product } from './product'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
  products?: Product[]
}
