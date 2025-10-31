/**
 * Utilitário de debounce para requisições
 * Evita múltiplas requisições muito próximas
 */

type DebouncedFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>

interface PendingCall<T> {
  resolve: (value: T) => void
  reject: (error: Error) => void
}

const debounceMap = new Map<string, {
  timeout: NodeJS.Timeout
  pendingCalls: PendingCall<any>[]
}>()

export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number = 100,
  keyGenerator?: (...args: Parameters<T>) => string
): DebouncedFunction<T> {
  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve, reject) => {
      // Gerar chave única para o debounce
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
      
      // Se já existe um debounce para essa chave, cancelar
      const existing = debounceMap.get(key)
      if (existing) {
        clearTimeout(existing.timeout)
        existing.pendingCalls.push({ resolve, reject })
      } else {
        debounceMap.set(key, {
          timeout: setTimeout(() => {}, delay), // placeholder
          pendingCalls: [{ resolve, reject }]
        })
      }

      // Criar novo timeout
      const timeout = setTimeout(async () => {
        const entry = debounceMap.get(key)
        if (!entry) return

        try {
          const result = await func(...args)
          entry.pendingCalls.forEach(call => call.resolve(result))
        } catch (error) {
          entry.pendingCalls.forEach(call => call.reject(error as Error))
        } finally {
          debounceMap.delete(key)
        }
      }, delay)

      // Atualizar o timeout no mapa
      const entry = debounceMap.get(key)!
      entry.timeout = timeout
    })
  }
}

export function createProductDebouncer() {
  return debounceAsync(
    async (handle: string, fetchFunction: (handle: string) => Promise<any>) => {
      return await fetchFunction(handle)
    },
    150, // 150ms de debounce
    (handle) => `product-${handle}`
  )
}