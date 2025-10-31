import { NextResponse } from 'next/server'
import { wooCommerceApi } from '../../../lib/woocommerce-config'

export async function GET() {
  try {
    console.log('🔍 Testando conexão WooCommerce...')
    console.log('📡 URL:', wooCommerceApi.baseUrl)
    console.log('🔑 Headers:', { 
      ...wooCommerceApi.headers, 
      Authorization: '***HIDDEN***' 
    })

    const response = await fetch(`${wooCommerceApi.baseUrl}/products?per_page=5&status=publish`, {
      headers: wooCommerceApi.headers,
    })

    console.log('📊 Status da resposta:', response.status)
    console.log('📋 Headers da resposta:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na API:', errorText)
      
      return NextResponse.json({
        success: false,
        error: `WooCommerce API error: ${response.status}`,
        details: errorText,
        config: {
          url: wooCommerceApi.baseUrl,
          hasAuth: !!wooCommerceApi.headers.Authorization,
        }
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('✅ Produtos encontrados:', data.length)
    console.log('📦 Primeiro produto:', data[0] ? {
      id: data[0].id,
      name: data[0].name,
      price: data[0].price,
      status: data[0].status
    } : 'Nenhum produto encontrado')

    return NextResponse.json({
      success: true,
      products: data,
      count: data.length,
      config: {
        url: wooCommerceApi.baseUrl,
        hasAuth: !!wooCommerceApi.headers.Authorization,
      }
    })

  } catch (error) {
    console.error('💥 Erro no teste WooCommerce:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      config: {
        url: wooCommerceApi.baseUrl,
        hasAuth: !!wooCommerceApi.headers.Authorization,
      }
    }, { status: 500 })
  }
}