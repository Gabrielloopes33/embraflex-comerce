// Teste simples para verificar se a API WooCommerce está funcionando

import { wooCommerceApi } from "../woocommerce-config"

export async function testWooCommerceConnection() {
  try {
    console.log("🔍 Testando conexão WooCommerce...")
    console.log("URL:", wooCommerceApi.baseUrl)
    
    const response = await fetch(`${wooCommerceApi.baseUrl}/products?per_page=5`, {
      headers: wooCommerceApi.headers,
    })

    console.log("📡 Status da resposta:", response.status)
    console.log("📋 Headers da resposta:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ Erro na API:", errorText)
      throw new Error(`WooCommerce API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log("✅ Produtos encontrados:", data.length)
    console.log("📦 Primeiro produto:", data[0] ? {
      id: data[0].id,
      name: data[0].name,
      price: data[0].price,
      status: data[0].status
    } : "Nenhum produto encontrado")

    return data
  } catch (error) {
    console.error("💥 Erro no teste WooCommerce:", error)
    throw error
  }
}