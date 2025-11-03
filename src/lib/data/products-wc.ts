"use server"

import { cache } from "react"
import { 
  fetchWooCommerceProducts, 
  mapWooCommerceProduct, 
  fetchWooCommerceProduct,
  fetchWooCommerceCategories,
  fetchWooCommerceProductsByCategory 
} from "./woocommerce"
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

// Função para buscar produtos organizados por linhas de produto
export async function getProductsByProductLines(): Promise<{
  productLines: Array<{
    id: string
    name: string
    slug: string
    description: string
    products: MappedProduct[]
    count: number
    isEmpty?: boolean
    lineType: 'economica' | 'premium' | 'personalizada' | 'especial'
    icon: string
    color: string
  }>
}> {
  try {
    // Buscar todas as categorias
    const allCategories = await fetchWooCommerceCategories()
    
    // Mapear categorias para linhas de produto conforme estrutura da tabela
    const productLineMapping: Record<string, {
      lineType: 'economica' | 'premium' | 'personalizada' | 'especial'
      icon: string
      color: string
      displayName: string
      description: string
    }> = {
      'sacoladepapel': {
        lineType: 'economica',
        icon: '🛍️',
        color: 'blue',
        displayName: 'Sacolas de Papel - Linha Econômica',
        description: 'Sacolas de papel com excelente custo-benefício, ideais para o dia a dia do seu negócio'
      },
      'caixas': {
        lineType: 'premium',
        icon: '📦',
        color: 'green',
        displayName: 'Caixas Personalizadas - Linha Premium',
        description: 'Caixas sob medida com acabamento premium para destacar sua marca'
      },
      'delivery': {
        lineType: 'especial',
        icon: '🚚',
        color: 'orange',
        displayName: 'Sacos Delivery - Linha Especial',
        description: 'Soluções especializadas para delivery com praticidade e resistência'
      },
      'plastico': {
        lineType: 'personalizada',
        icon: '🎨',
        color: 'purple',
        displayName: 'Sacolas Plásticas - Linha Personalizada',
        description: 'Sacolas plásticas totalmente customizáveis com sua identidade visual'
      }
    }

    // Filtrar e organizar categorias por linhas de produto
    const productLines = []
    
    for (const category of allCategories) {
      const mapping = productLineMapping[category.slug]
      if (mapping) {
        let products: any[] = []
        
        if (category.count > 0) {
          const result = await fetchWooCommerceProductsByCategory(category.id, 6)
          products = result.products.map(mapWooCommerceProduct)
        }
        
        productLines.push({
          id: category.id.toString(),
          name: mapping.displayName,
          slug: category.slug,
          description: mapping.description,
          products: products,
          count: category.count,
          isEmpty: category.count === 0,
          lineType: mapping.lineType,
          icon: mapping.icon,
          color: mapping.color
        })
      }
    }

    // Ordenar por prioridade: Econômica > Premium > Especial > Personalizada
    const lineOrder = ['economica', 'premium', 'especial', 'personalizada']
    const sortedLines = productLines.sort((a, b) => {
      const orderA = lineOrder.indexOf(a.lineType)
      const orderB = lineOrder.indexOf(b.lineType)
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      // Se mesmo tipo, ordenar por quantidade de produtos
      return b.count - a.count
    })

    console.log('📊 Linhas de produto encontradas:', sortedLines.map(line => `${line.name} (${line.count} produtos)`))

    return {
      productLines: sortedLines
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos por linhas:", error)
    return {
      productLines: []
    }
  }
}

// Manter a função original para compatibilidade
export async function getProductsByMainCategories(): Promise<{
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string
    products: MappedProduct[]
    count: number
    isEmpty?: boolean
  }>
}> {
  try {
    const result = await getProductsByProductLines()
    
    return {
      categories: result.productLines.map(line => ({
        id: line.id,
        name: line.name,
        slug: line.slug,
        description: line.description,
        products: line.products,
        count: line.count,
        isEmpty: line.isEmpty
      }))
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos por categorias:", error)
    return {
      categories: []
    }
  }
}