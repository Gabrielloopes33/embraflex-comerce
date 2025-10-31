import { wooCommerceApi } from "@lib/woocommerce-config"
import {
  WooCommerceProduct,
  WooCommerceProductsResponse,
  MappedProduct,
  MappedVariant,
  MappedImage,
  MappedOption,
} from "../../types/woocommerce"
import { 
  getCachedRequest, 
  setCachedRequest, 
  getOngoingRequest, 
  setOngoingRequest, 
  removeOngoingRequest 
} from "../cache/product-cache"

// Helper function to map WooCommerce product to Medusa-compatible format
export function mapWooCommerceProduct(product: WooCommerceProduct): MappedProduct {
  return {
    id: product.id.toString(),
    title: product.name,
    handle: product.slug,
    description: product.description || product.short_description || null,
    thumbnail: product.images[0]?.src || null,
    variants: [
      {
        id: product.id.toString(),
        title: "Default",
        sku: product.sku || null,
        inventory_quantity: product.stock_quantity,
        calculated_price: {
          calculated_amount: parseFloat(product.price || "0") * 100, // Convert to cents
          currency_code: "BRL", // Using Brazilian Real
        },
        original_price: parseFloat(product.regular_price || product.price || "0") * 100,
        prices: [
          {
            amount: parseFloat(product.price || "0") * 100,
            currency_code: "BRL",
          },
        ],
        options: [],
        images: product.images.map(mapWooCommerceImage),
      },
    ],
    images: product.images.map(mapWooCommerceImage),
    options: [],
    tags: product.tags?.map((tag: any) => ({ id: tag.id.toString(), value: tag.name })) || [],
    type: product.type ? { id: product.type, value: product.type } : null,
    collection: product.categories[0]
      ? {
          id: product.categories[0].id.toString(),
          title: product.categories[0].name,
        }
      : null,
    created_at: product.date_created,
    updated_at: product.date_modified,
    categories: product.categories?.map((cat: any) => ({
      id: cat.id.toString(),
      name: cat.name,
      handle: cat.slug,
    })),
    metadata: null,
  }
}

function mapWooCommerceImage(image: any): MappedImage {
  return {
    id: image.id?.toString() || Math.random().toString(),
    url: image.src,
    alt_text: image.alt || image.name || null,
  }
}



// Fetch products from WooCommerce API
export async function fetchWooCommerceProducts({
  page = 1,
  per_page = 12,
  category,
  search,
  slug,
  orderby = "date",
  order = "desc",
}: {
  page?: number
  per_page?: number
  category?: string
  search?: string
  slug?: string
  orderby?: string
  order?: "asc" | "desc"
} = {}): Promise<WooCommerceProductsResponse> {
  try {
    // Criar chave de cache única baseada nos parâmetros
    const cacheKey = JSON.stringify({ page, per_page, category, search, slug, orderby, order })
    
    // Verificar cache em memória primeiro
    const cached = getCachedRequest<WooCommerceProductsResponse>(cacheKey)
    if (cached) {
      console.log('📦 Retornando dados do cache para:', slug || search || 'listagem')
      return cached
    }

    // Verificar se já existe uma requisição em andamento para a mesma chave
    const ongoingRequest = getOngoingRequest<WooCommerceProductsResponse>(cacheKey)
    if (ongoingRequest) {
      console.log('⏳ Aguardando requisição em andamento para:', slug || search || 'listagem')
      return await ongoingRequest
    }

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: per_page.toString(),
      orderby,
      order,
      status: "publish",
    })

    if (category) {
      params.append("category", category)
    }
    if (search) {
      params.append("search", search)
    }
    if (slug) {
      params.append("slug", slug)
    }

    // Criar a promessa da requisição e armazenar
    const requestPromise = (async () => {
      try {
        console.log('🌐 Fazendo requisição para WooCommerce API:', slug || search || 'listagem')

        const response = await fetch(`${wooCommerceApi.baseUrl}/products?${params}`, {
          headers: wooCommerceApi.headers,
          next: { revalidate: 300 }, // Cache for 5 minutes
          cache: 'force-cache', // Adicionar cache mais agressivo
        })

        if (!response.ok) {
          throw new Error(`WooCommerce API error: ${response.status}`)
        }

        const products: WooCommerceProduct[] = await response.json()
        const totalHeader = response.headers.get("x-wp-total")
        const totalPagesHeader = response.headers.get("x-wp-totalpages")

        const result = {
          products,
          total: totalHeader ? parseInt(totalHeader, 10) : products.length,
          totalPages: totalPagesHeader ? parseInt(totalPagesHeader, 10) : 1,
        }

        // Armazenar no cache
        setCachedRequest(cacheKey, result)

        return result
      } finally {
        // Remover da lista de requisições em andamento
        removeOngoingRequest(cacheKey)
      }
    })()

    // Armazenar a promessa para evitar requisições duplicadas
    setOngoingRequest(cacheKey, requestPromise)

    return await requestPromise
  } catch (error) {
    console.error("Error fetching WooCommerce products:", error)
    return {
      products: [],
      total: 0,
      totalPages: 0,
    }
  }
}

// Fetch single product from WooCommerce API
export async function fetchWooCommerceProduct(id: string): Promise<WooCommerceProduct | null> {
  try {
    const response = await fetch(`${wooCommerceApi.baseUrl}/products/${id}`, {
      headers: wooCommerceApi.headers,
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching WooCommerce product:", error)
    return null
  }
}

// Fetch categories from WooCommerce API
export async function fetchWooCommerceCategories() {
  try {
    const response = await fetch(`${wooCommerceApi.baseUrl}/products/categories`, {
      headers: wooCommerceApi.headers,
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching WooCommerce categories:", error)
    return []
  }
}