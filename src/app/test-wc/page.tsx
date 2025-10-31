"use client"

import { useState, useEffect } from "react"

export default function TestWooCommerce() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log("🔍 Testando API WooCommerce...")
        
        const response = await fetch('/api/test-woocommerce')
        console.log("📡 Response status:", response.status)
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }
        
        const data = await response.json()
        console.log("✅ Dados recebidos:", data)
        
        setProducts(data.products || [])
        setError(null)
      } catch (err) {
        console.error("❌ Erro:", err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testando WooCommerce API</h1>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste WooCommerce API</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erro:</strong> {error}
        </div>
      )}
      
      <div className="mb-4">
        <strong>Produtos encontrados:</strong> {products.length}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border p-4 rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <p>ID: {product.id}</p>
            <p>Preço: R$ {product.price}</p>
            <p>Status: {product.status}</p>
            {product.images && product.images[0] && (
              <img 
                src={product.images[0].src} 
                alt={product.name}
                className="w-20 h-20 object-cover mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}