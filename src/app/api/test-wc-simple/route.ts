import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Verificar se as variáveis de ambiente estão carregadas
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET

    console.log('🔍 Verificando variáveis de ambiente:')
    console.log('Store URL:', storeUrl ? '✅ Definida' : '❌ Não definida')
    console.log('Consumer Key:', consumerKey ? '✅ Definida' : '❌ Não definida')
    console.log('Consumer Secret:', consumerSecret ? '✅ Definida' : '❌ Não definida')

    if (!storeUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({
        success: false,
        error: 'Variáveis de ambiente WooCommerce não configuradas',
        env: {
          storeUrl: !!storeUrl,
          consumerKey: !!consumerKey,
          consumerSecret: !!consumerSecret,
        }
      }, { status: 400 })
    }

    // Testar conexão básica
    const testUrl = `${storeUrl}/wp-json/wc/v3/products?per_page=1`
    console.log('🌐 Testando URL:', testUrl)

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      }
    })

    console.log('📊 Status:', response.status)
    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('❌ Erro:', responseText)
      return NextResponse.json({
        success: false,
        error: `HTTP ${response.status}`,
        details: responseText,
        url: testUrl
      }, { status: response.status })
    }

    const data = JSON.parse(responseText)
    console.log('✅ Sucesso! Produtos encontrados:', Array.isArray(data) ? data.length : 'Resposta inválida')

    return NextResponse.json({
      success: true,
      message: 'Conexão WooCommerce funcionando!',
      productsCount: Array.isArray(data) ? data.length : 0,
      firstProduct: Array.isArray(data) && data[0] ? {
        id: data[0].id,
        name: data[0].name,
        price: data[0].price
      } : null
    })

  } catch (error) {
    console.error('💥 Erro:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}