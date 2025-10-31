/**
 * Sistema de cache singleton para produtos
 * Evita múltiplas instâncias de cache em desenvolvimento
 */

import { MappedProduct } from "../../types/woocommerce"

interface CacheEntry<T> {
  data: T
  timestamp: number
}

interface ProductCacheManager {
  products: Map<string, CacheEntry<MappedProduct | null>>
  requests: Map<string, CacheEntry<any>>
  ongoingRequests: Map<string, Promise<any>>
}

// Usar globalThis para manter o cache entre reloads em desenvolvimento
declare global {
  var __productCache: ProductCacheManager | undefined
}

function createCacheManager(): ProductCacheManager {
  return {
    products: new Map(),
    requests: new Map(),
    ongoingRequests: new Map(),
  }
}

// Singleton do cache
export const productCache: ProductCacheManager = 
  globalThis.__productCache ?? createCacheManager()

if (process.env.NODE_ENV === 'development') {
  globalThis.__productCache = productCache
}

// Configurações de cache
export const CACHE_DURATION = {
  PRODUCT: 10 * 60 * 1000, // 10 minutos para produtos individuais
  PRODUCTS_LIST: 5 * 60 * 1000, // 5 minutos para listas
  API_REQUESTS: 5 * 60 * 1000, // 5 minutos para requisições da API
}

// Helpers para cache
export function getCachedProduct(handle: string): MappedProduct | null | undefined {
  const cached = productCache.products.get(handle)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION.PRODUCT) {
    console.log('📦 Cache hit para produto:', handle)
    return cached.data
  }
  return undefined
}

export function setCachedProduct(handle: string, product: MappedProduct | null): void {
  productCache.products.set(handle, { data: product, timestamp: Date.now() })
}

export function getCachedRequest<T>(key: string): T | undefined {
  const cached = productCache.requests.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION.API_REQUESTS) {
    console.log('📦 Cache hit para requisição:', key.substring(0, 50) + '...')
    return cached.data
  }
  return undefined
}

export function setCachedRequest<T>(key: string, data: T): void {
  productCache.requests.set(key, { data, timestamp: Date.now() })
}

export function getOngoingRequest<T>(key: string): Promise<T> | undefined {
  return productCache.ongoingRequests.get(key)
}

export function setOngoingRequest<T>(key: string, promise: Promise<T>): void {
  productCache.ongoingRequests.set(key, promise)
}

export function removeOngoingRequest(key: string): void {
  productCache.ongoingRequests.delete(key)
}

// Cleanup de cache antigo (executar periodicamente)
export function cleanupCache(): void {
  const now = Date.now()
  
  // Limpar produtos antigos
  productCache.products.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_DURATION.PRODUCT) {
      productCache.products.delete(key)
    }
  })
  
  // Limpar requisições antigas
  productCache.requests.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_DURATION.API_REQUESTS) {
      productCache.requests.delete(key)
    }
  })
  
  console.log('🧹 Cache limpo - produtos:', productCache.products.size, 'requisições:', productCache.requests.size)
}

// Executar limpeza a cada 5 minutos
if (typeof window === 'undefined') { // Apenas no server-side
  setInterval(cleanupCache, 5 * 60 * 1000)
}