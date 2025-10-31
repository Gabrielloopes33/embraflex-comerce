"use server"

// Import WooCommerce functions instead of Medusa
import { listProducts as listProductsWC, listProductsWithSort as listProductsWithSortWC, retrieveProduct as retrieveProductWC, getProductByHandle as getProductByHandleWC } from "./products-wc"
import { getRegion, retrieveRegion } from "./regions-wc"
import { MappedProduct } from "../../types/woocommerce"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: {
    limit?: number
    offset?: number
    category?: string
    search?: string
    orderby?: string
    order?: "asc" | "desc"
  }
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: MappedProduct[]; count: number }
  nextPage: number | null
  queryParams?: any
}> => {
  // For WooCommerce, we don't need region validation like Medusa
  // Just pass through to our WooCommerce function
  return listProductsWC({
    pageParam,
    queryParams,
    countryCode,
    regionId,
  })
}

/**
 * This will fetch products from WooCommerce and sort them based on the sortBy parameter.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: {
    limit?: number
    category?: string
    search?: string
  }
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: MappedProduct[]; count: number }
  nextPage: number | null
  queryParams?: any
}> => {
  // Pass through to our WooCommerce function
  return listProductsWithSortWC({
    page,
    queryParams,
    sortBy,
    countryCode,
  })
}

export const retrieveProduct = async (id: string): Promise<MappedProduct | null> => {
  return retrieveProductWC(id)
}

export const getProductByHandle = async (handle: string): Promise<MappedProduct | null> => {
  return getProductByHandleWC(handle)
}
