import { listProducts } from "@lib/data/products-wc"

export default async function TestProducts() {
  console.log('🧪 Testando produtos...')
  
  try {
    const result = await listProducts({
      queryParams: { limit: 3 },
      countryCode: "br",
    })
    
    console.log('✅ Teste concluído. Produtos encontrados:', result.response.products.length)
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Teste de Produtos WooCommerce</h1>
        <p className="mb-4">Produtos encontrados: {result.response.products.length}</p>
        
        <div className="space-y-4">
          {result.response.products.map((product) => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.title}</h3>
              <p>ID: {product.id}</p>
              <p>Handle: {product.handle}</p>
              {product.thumbnail && <p>Imagem: ✅</p>}
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('❌ Erro no teste:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Erro no Teste</h1>
        <p>{String(error)}</p>
      </div>
    )
  }
}