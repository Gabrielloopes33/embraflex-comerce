"use server"

import { cache } from "react"
import { fetchWooCommerceProducts, mapWooCommerceProduct, fetchWooCommerceProduct } from "./woocommerce"
import { MappedProduct } from "../../types/woocommerce"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getCachedProduct, setCachedProduct } from "../cache/product-cache"
import { createProductDebouncer } from "../util/debounce"

export async function listProducts({
  pageParam = 1,
  queryParams,
  countryCode,
}: {
  pageParam?: number
  queryParams?: { limit?: number; [key: string]: any }
  countryCode?: string
}): Promise<{
  response: { products: MappedProduct[]; count: number }
  nextPage: number | null
  queryParams?: any
}> {
  try {
    console.log('🛒 Buscando produtos da WooCommerce API...')
    
    const limit = queryParams?.limit || 12

    const { products: wooProducts, total } = await fetchWooCommerceProducts({
      page: pageParam,
      per_page: limit,
    })

    console.log(`✅ Encontrados ${wooProducts.length} produtos de ${total} totais`)

    // Map WooCommerce products to Medusa-compatible format
    const products = wooProducts.map(mapWooCommerceProduct)

    const nextPage = total > (pageParam * limit) ? pageParam + 1 : null

    return {
      response: {
        products,
        count: total,
      },
      nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error)
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
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
  try {
    const limit = queryParams?.limit || 12

    // Map sort options to WooCommerce parameters
    let orderby = "date"
    let order: "asc" | "desc" = "desc"

    switch (sortBy) {
      case "price_asc":
        orderby = "price"
        order = "asc"
        break
      case "price_desc":
        orderby = "price"
        order = "desc"
        break
      case "created_at":
      default:
        orderby = "date"
        order = "desc"
        break
    }

    const { products: wooProducts, total } = await fetchWooCommerceProducts({
      page,
      per_page: limit,
      category: queryParams?.category,
      search: queryParams?.search,
      orderby,
      order,
    })

    // Map WooCommerce products to Medusa-compatible format
    const products = wooProducts.map(mapWooCommerceProduct)

    const nextPage = total > (page * limit) ? page + 1 : null

    return {
      response: {
        products,
        count: total,
      },
      nextPage,
      queryParams,
    }
  } catch (error) {
    console.error("Error listing products with sort:", error)
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
}

export const retrieveProduct = async (id: string): Promise<MappedProduct | null> => {
  try {
    const wooProduct = await fetchWooCommerceProduct(id)
    
    if (!wooProduct) {
      return null
    }

    return mapWooCommerceProduct(wooProduct)
  } catch (error) {
    console.error("Error retrieving product:", error)
    return null
  }
}

// Debouncer para evitar múltiplas requisições muito próximas
const debouncedProductFetch = createProductDebouncer()

// Função interna para buscar produto
async function fetchProductByHandleInternal(handle: string): Promise<MappedProduct | null> {
  try {
    // Verificar cache primeiro
    const cached = getCachedProduct(handle)
    if (cached !== undefined) {
      console.log('🎯 Produto retornado do cache:', handle)
      return cached
    }

    console.log('🔍 Buscando produto por handle:', handle)
    
    // Try to search by slug parameter first - mais eficiente
    const { products: wooProducts } = await fetchWooCommerceProducts({
      per_page: 1, // Reduzir para 1, já que estamos buscando por slug específico
      slug: handle,
    })

    console.log('📦 Produtos encontrados na busca:', wooProducts.length)

    let resultProduct: MappedProduct | null = null

    if (wooProducts.length > 0) {
      // Find the product with exact slug match
      const exactMatch = wooProducts.find(p => p.slug === handle)
      
      if (exactMatch) {
        console.log('✅ Produto encontrado:', exactMatch.name)
        resultProduct = mapWooCommerceProduct(exactMatch)
      }
    }

    // Só fazer fallback se realmente não encontrar
    if (!resultProduct) {
      console.log('🔄 Tentando busca por texto...')
      const fallbackResult = await fetchWooCommerceProducts({
        per_page: 20, // Reduzir quantidade
        search: handle,
      })
      
      if (fallbackResult.products.length > 0) {
        // Find exact slug match in fallback results
        const exactMatch = fallbackResult.products.find(p => p.slug === handle)
        if (exactMatch) {
          console.log('✅ Produto encontrado no fallback:', exactMatch.name)
          resultProduct = mapWooCommerceProduct(exactMatch)
        }
      }
    }

    if (!resultProduct) {
      console.log('❌ Produto não encontrado:', handle)
    }

    // Armazenar no cache (mesmo que seja null)
    setCachedProduct(handle, resultProduct)

    return resultProduct
  } catch (error) {
    console.error("❌ Erro ao buscar produto por handle:", error)
    return null
  }
}

// Usar React.cache para evitar múltiplas renderizações na mesma requisição
const getCachedProductByHandle = cache(async (handle: string): Promise<MappedProduct | null> => {
  // Verificar cache primeiro
  const cached = getCachedProduct(handle)
  if (cached !== undefined) {
    console.log('🎯 Produto retornado do cache:', handle)
    return cached
  }

  // Usar debouncer para evitar requisições muito próximas
  return await debouncedProductFetch(handle, fetchProductByHandleInternal)
})

// Exportar a função wrapper que usa cache
export const getProductByHandle = getCachedProductByHandle