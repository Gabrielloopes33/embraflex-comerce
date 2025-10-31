// WooCommerce Product Types
export interface WooCommerceImage {
  id: number
  src: string
  name: string
  alt: string
}

export interface WooCommerceCategory {
  id: number
  name: string
  slug: string
}

export interface WooCommerceAttribute {
  id: number
  name: string
  position: number
  visible: boolean
  variation: boolean
  options: string[]
}

export interface WooCommerceVariation {
  id: number
  sku: string
  price: string
  regular_price: string
  sale_price: string
  stock_quantity: number | null
  in_stock: boolean
  attributes: Array<{
    id: number
    name: string
    option: string
  }>
  image?: WooCommerceImage
}

export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: "simple" | "grouped" | "external" | "variable"
  status: "draft" | "pending" | "private" | "publish"
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  stock_status: "instock" | "outofstock" | "onbackorder"
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  related_ids: number[]
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: WooCommerceCategory[]
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  images: WooCommerceImage[]
  attributes: WooCommerceAttribute[]
  default_attributes: any[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  meta_data: Array<{
    id: number
    key: string
    value: any
  }>
}

// Mapped types for compatibility with existing Medusa structure
export interface MappedProduct {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  variants: MappedVariant[]
  images: MappedImage[]
  options: MappedOption[]
  tags: Array<{ id: string; value: string }>
  type?: { id: string; value: string } | null
  collection?: { id: string; title: string } | null
  created_at: string
  updated_at: string
  categories?: Array<{ id: string; name: string; handle: string }>
  metadata: Record<string, any> | null
}

export interface MappedVariant {
  id: string
  title: string
  sku: string | null
  inventory_quantity: number | null
  calculated_price: {
    calculated_amount: number
    currency_code: string
  }
  original_price: number
  prices: Array<{
    amount: number
    currency_code: string
  }>
  options: Array<{ option_id: string; value: string }>
  images?: MappedImage[]
}

export interface MappedImage {
  id: string
  url: string
  alt_text: string | null
}

export interface MappedOption {
  id: string
  title: string
  values: Array<{
    id: string
    value: string
  }>
}

export interface WooCommerceProductsResponse {
  products: WooCommerceProduct[]
  total: number
  totalPages: number
}