import { Metadata } from "next"
import { listProducts } from "@lib/data/products-wc"
import Link from 'next/link'
import HeroVideo from "../../../components/hero-video"

export const metadata: Metadata = {
  title: "Embraflex - Embalagens e Soluções",
  description: "Sua loja de embalagens e soluções personalizadas",
}

export default async function Home() {
  // Buscar produtos
  let products: any[] = []
  let errorMessage = ""
  
  try {
    const result = await listProducts({
      queryParams: { limit: 6 },
      countryCode: "br",
    })
    products = result.response.products
  } catch (error) {
    errorMessage = `Erro ao carregar produtos: ${error}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden min-h-[800px] flex items-center">
        {/* Vídeo de Fundo */}
        <HeroVideo src="/videos/13814619_3840_2160_100fps.mp4" />
        
        {/* Overlay para garantir legibilidade do texto */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-30"></div>
        
        {/* Conteúdo */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">Bem-vindo à Embraflex</h1>
          <p className="text-2xl mb-12 drop-shadow-md max-w-3xl mx-auto">Embalagens e soluções personalizadas para seu negócio</p>
          <div className="flex justify-center">
            <Link href="/br/store" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Seção de Produtos */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Nossos Produtos</h2>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              {errorMessage}
            </div>
          )}
          
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} href={`/products/${product.handle}`} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {product.thumbnail ? (
                      <img 
                        src={product.thumbnail} 
                        alt={product.title}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{product.title}</h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description.substring(0, 120)}...</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-600">
                          R$ {((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          Ver Detalhes
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : !errorMessage && (
            <div className="text-center py-12">
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="w-full h-64 bg-gray-300"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded mb-4 w-3/4"></div>
                        <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Seções de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-blue-600 text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-4">Embalagens Personalizadas</h3>
            <p className="text-gray-600">Desenvolvemos embalagens sob medida para suas necessidades específicas</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-blue-600 text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-semibold mb-4">Entrega Rápida</h3>
            <p className="text-gray-600">Entregamos seus produtos com agilidade e segurança em todo o Brasil</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-blue-600 text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold mb-4">Soluções Inovadoras</h3>
            <p className="text-gray-600">Tecnologia e criatividade para criar as melhores soluções em embalagens</p>
          </div>
        </div>
      </div>
    </div>
  )
}
