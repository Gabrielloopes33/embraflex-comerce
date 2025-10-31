import { NextRequest, NextResponse } from 'next/server'
import { listProducts } from "@lib/data/products-wc"

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 API de teste chamada')
    
    const result = await listProducts({
      queryParams: { limit: 3 },
      countryCode: "br",
    })
    
    console.log('✅ API: produtos encontrados:', result.response.products.length)
    
    return NextResponse.json({
      success: true,
      count: result.response.products.length,
      products: result.response.products.map(p => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        price: p.variants?.[0]?.calculated_price?.calculated_amount
      }))
    })
  } catch (error) {
    console.error('❌ Erro na API:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}