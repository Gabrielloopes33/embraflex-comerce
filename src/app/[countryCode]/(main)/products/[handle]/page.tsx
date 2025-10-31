import { getProductByHandle } from "@lib/data/products-wc"
import { MappedProduct } from '../../../../../types/woocommerce'
import ProductPageClient from './product-client'
import { cache } from 'react'

// Cache da página para evitar múltiplas execuções
const getCachedProductPage = cache(async (handle: string, countryCode: string) => {
  console.log('🎯 Página de produto carregada para:', handle)
  return await getProductByHandle(handle)
})

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export default async function ProductPage(props: Props) {
  const params = await props.params

  try {
    const product = await getCachedProductPage(params.handle, params.countryCode)

    if (!product) {
      console.log('❌ Produto não encontrado:', params.handle)
      return (
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">Produto não encontrado</h1>
          <p>O produto "{params.handle}" não foi encontrado.</p>
        </div>
      )
    }

    console.log('✅ Produto encontrado:', product.title)

    return <ProductPageClient product={product} />
  } catch (error) {
    console.error('❌ Erro na página de produto:', error)
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600">Erro</h1>
        <p>Erro ao carregar o produto: {String(error)}</p>
      </div>
    )
  }
}
