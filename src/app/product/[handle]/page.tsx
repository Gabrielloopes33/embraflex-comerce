import { getProductByHandle } from "@lib/data/products-wc"

export default async function SimpleProductPage({
  params
}: {
  params: { handle: string }
}) {
  try {
    console.log('🎯 Página simples de produto carregada para handle:', params.handle)
    
    const product = await getProductByHandle(params.handle)
    
    if (!product) {
      console.log('❌ Produto não encontrado')
      return (
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold text-red-600">Produto não encontrado</h1>
          <p>O produto "{params.handle}" não foi encontrado.</p>
        </div>
      )
    }
    
    console.log('✅ Produto encontrado para página:', product.title)
    
    return (
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {product.thumbnail ? (
              <img 
                src={product.thumbnail} 
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Sem imagem disponível</span>
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">
                R$ {((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
              </span>
            </div>
            
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    )
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