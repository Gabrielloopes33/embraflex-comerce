import { NextRequest, NextResponse } from 'next/server'
import { getProductByHandle } from "@lib/data/products-wc"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const handle = searchParams.get('handle') || 'teste'

  try {
    console.log('🔧 Testando getProductByHandle para:', handle)
    
    const product = await getProductByHandle(handle)
    
    if (!product) {
      console.log('❌ Produto não encontrado')
      return NextResponse.json({
        success: false,
        message: 'Produto não encontrado',
        handle
      }, { status: 404 })
    }
    
    console.log('✅ Produto encontrado:', product.title)
    
    return NextResponse.json({
      success: true,
      handle,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description?.substring(0, 100),
        thumbnail: product.thumbnail,
        price: product.variants?.[0]?.calculated_price?.calculated_amount
      }
    })
  } catch (error) {
    console.error('❌ Erro na API getProductByHandle:', error)
    return NextResponse.json({
      success: false,
      error: String(error),
      handle
    }, { status: 500 })
  }
}