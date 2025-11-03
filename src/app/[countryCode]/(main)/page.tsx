import { Metadata } from "next"
import { getProductsByProductLines } from "@lib/data/products-wc"
import Link from 'next/link'
import HeroVideo from "../../../components/hero-video"

export const metadata: Metadata = {
  title: "Embraflex - Embalagens e Soluções",
  description: "Sua loja de embalagens e soluções personalizadas",
}

export default async function Home() {
  // Buscar produtos organizados por linhas de produto
  let productLines: Array<{
    id: string
    name: string
    slug: string
    description: string
    products: any[]
    count: number
    isEmpty?: boolean
    lineType: 'economica' | 'premium' | 'personalizada' | 'especial'
    icon: string
    color: string
  }> = []
  let errorMessage = ""
  
  try {
    const result = await getProductsByProductLines()
    productLines = result.productLines
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
          <div className="flex justify-center gap-4">
            <Link href="/br/store" className="inline-block bg-white text-[#4DBAAD] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Ver Todos os Produtos
            </Link>
            <Link href="/br/store" className="inline-block bg-[#4DBAAD] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#3da99c] transition-colors shadow-lg">
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Seção de Benefícios/Garantias */}
        <div className="mb-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Primeira Compra */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="bg-[#4DBAAD]/10 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-[#4DBAAD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Primeira compra?</h3>
              <p className="text-sm text-gray-600 mb-3">Seu cupom tá aqui!</p>
              <button className="text-[#4DBAAD] font-semibold hover:text-[#3da99c] transition-colors text-sm">
                Confira
              </button>
            </div>

            {/* Frete */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="bg-[#C3006A]/10 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-[#C3006A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Frete até 100% OFF</h3>
              <p className="text-sm text-gray-600 mb-3">Use <span className="font-semibold">FRETE100OFF</span></p>
              <button className="text-[#C3006A] font-semibold hover:text-[#a00058] transition-colors text-sm">
                Regras
              </button>
            </div>

            {/* Compra Segura */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="bg-[#4DBAAD]/10 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-[#4DBAAD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Compra Segura</h3>
              <p className="text-sm text-gray-600 mb-3">Satisfação garantida</p>
              <button className="text-[#4DBAAD] font-semibold hover:text-[#3da99c] transition-colors text-sm">
                Entenda
              </button>
            </div>

            {/* Indique e Ganhe */}
            <div className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="bg-[#C3006A]/10 rounded-full p-4 mb-4">
                <svg className="w-8 h-8 text-[#C3006A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Indique e Ganhe</h3>
              <p className="text-sm text-gray-600 mb-3">$$$ extra para você</p>
              <button className="text-[#C3006A] font-semibold hover:text-[#a00058] transition-colors text-sm">
                Confira
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Produtos por Linhas */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Nossas Linhas de Produto</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções em embalagens organizadas por linhas, desde opções econômicas até produtos premium personalizados
            </p>
          </div>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
              {errorMessage}
            </div>
          )}
          
          {productLines.length > 0 ? (
            <div className="space-y-20">
              {productLines.map((productLine) => {
                // Definir cores baseadas no tipo de linha
                const getColorClasses = (color: string, lineType: string) => {
                  const colorMap: Record<string, { 
                    bg: string, 
                    border: string, 
                    button: string, 
                    buttonHover: string,
                    badge: string,
                    badgeText: string 
                  }> = {
                    blue: { 
                      bg: 'from-[#4DBAAD]/10 to-[#4DBAAD]/20', 
                      border: 'border-[#4DBAAD]/30', 
                      button: 'bg-[#4DBAAD] hover:bg-[#3da99c]', 
                      buttonHover: 'hover:bg-[#4DBAAD]/5',
                      badge: 'bg-[#4DBAAD]/20',
                      badgeText: 'text-[#4DBAAD]'
                    },
                    green: { 
                      bg: 'from-[#4DBAAD]/10 to-[#4DBAAD]/20', 
                      border: 'border-[#4DBAAD]/30', 
                      button: 'bg-[#4DBAAD] hover:bg-[#3da99c]', 
                      buttonHover: 'hover:bg-[#4DBAAD]/5',
                      badge: 'bg-[#4DBAAD]/20',
                      badgeText: 'text-[#4DBAAD]'
                    },
                    orange: { 
                      bg: 'from-[#C3006A]/10 to-[#C3006A]/20', 
                      border: 'border-[#C3006A]/30', 
                      button: 'bg-[#C3006A] hover:bg-[#a00058]', 
                      buttonHover: 'hover:bg-[#C3006A]/5',
                      badge: 'bg-[#C3006A]/20',
                      badgeText: 'text-[#C3006A]'
                    },
                    purple: { 
                      bg: 'from-[#C3006A]/10 to-[#C3006A]/20', 
                      border: 'border-[#C3006A]/30', 
                      button: 'bg-[#C3006A] hover:bg-[#a00058]', 
                      buttonHover: 'hover:bg-[#C3006A]/5',
                      badge: 'bg-[#C3006A]/20',
                      badgeText: 'text-[#C3006A]'
                    }
                  }
                  return colorMap[color] || colorMap.blue
                }

                const colors = getColorClasses(productLine.color, productLine.lineType)

                return (
                  <div key={productLine.id} className={`product-line-section bg-gradient-to-br ${colors.bg} rounded-3xl p-8 ${colors.border} border-2`}>
                    {/* Header da Linha de Produto */}
                    <div className="mb-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="text-5xl">{productLine.icon}</div>
                          <div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-2">{productLine.name}</h3>
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${colors.badge} ${colors.badgeText}`}>
                              {productLine.lineType === 'economica' && 'Linha Econômica'}
                              {productLine.lineType === 'premium' && 'Linha Premium'}
                              {productLine.lineType === 'especial' && 'Linha Especial'}
                              {productLine.lineType === 'personalizada' && 'Linha Personalizada'}
                            </span>
                          </div>
                        </div>
                        {!productLine.isEmpty ? (
                          <Link 
                            href={`/br/categories/${productLine.slug}`}
                            className={`${colors.button} text-white px-8 py-3 rounded-xl transition-colors font-medium shadow-lg`}
                          >
                            Ver Todos ({productLine.count})
                          </Link>
                        ) : (
                          <span className="bg-gray-300 text-gray-600 px-8 py-3 rounded-xl text-sm font-medium">
                            Em breve
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed max-w-5xl">
                        {productLine.description}
                      </p>
                    </div>

                    {/* Grid de Produtos ou Placeholder */}
                    {!productLine.isEmpty ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {productLine.products.map((product: any) => (
                          <Link key={product.id} href={`/products/${product.handle}`} className="block group">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                              {product.thumbnail ? (
                                <div className="relative overflow-hidden">
                                  <img 
                                    src={product.thumbnail} 
                                    alt={product.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                                  <div className={`absolute top-4 left-4 ${colors.badge} ${colors.badgeText} px-3 py-1 rounded-full text-xs font-semibold`}>
                                    {productLine.lineType === 'economica' && 'Econômica'}
                                    {productLine.lineType === 'premium' && 'Premium'}
                                    {productLine.lineType === 'especial' && 'Especial'}
                                    {productLine.lineType === 'personalizada' && 'Personalizada'}
                                  </div>
                                </div>
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-5xl text-gray-400 mb-2">{productLine.icon}</div>
                                    <span className="text-gray-500 text-sm">Imagem em breve</span>
                                  </div>
                                </div>
                              )}
                              <div className="p-6">
                                <h4 className="text-xl font-semibold mb-3 text-gray-800 line-clamp-2 group-hover:text-gray-600 transition-colors">
                                  {product.title}
                                </h4>
                                {product.description && (
                                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {product.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                  </p>
                                )}
                                <div className="flex justify-between items-center">
                                  <span className="text-2xl font-bold text-gray-800">
                                    R$ {((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                                  </span>
                                  <span className={`${colors.badge} ${colors.badgeText} px-4 py-2 rounded-full text-sm font-medium group-hover:opacity-80 transition-opacity`}>
                                    Ver Detalhes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      /* Placeholder para linhas vazias */
                      <div className="bg-white/50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                        <div className="text-6xl text-gray-400 mb-4">🏗️</div>
                        <h4 className="text-xl font-semibold text-gray-600 mb-2">
                          {productLine.lineType === 'economica' && 'Linha Econômica em Desenvolvimento'}
                          {productLine.lineType === 'premium' && 'Linha Premium em Desenvolvimento'}
                          {productLine.lineType === 'especial' && 'Linha Especial em Desenvolvimento'}
                          {productLine.lineType === 'personalizada' && 'Linha Personalizada em Desenvolvimento'}
                        </h4>
                        <p className="text-gray-500 mb-6 max-w-2xl mx-auto">
                          {productLine.description} Estamos preparando produtos incríveis para esta linha!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <button className={`${colors.button} text-white px-6 py-2 rounded-lg transition-colors`}>
                            Notificar quando disponível
                          </button>
                          <Link href="/br/store" className={`border-2 ${colors.border} text-gray-700 px-6 py-2 rounded-lg ${colors.buttonHover} transition-colors`}>
                            Ver produtos disponíveis
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : !errorMessage && (
            <div className="text-center py-16">
              <div className="animate-pulse space-y-16">
                {[1,2].map((categoryIndex) => (
                  <div key={categoryIndex} className="category-skeleton">
                    <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[1,2,3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                          <div className="w-full h-64 bg-gray-300"></div>
                          <div className="p-6">
                            <div className="h-6 bg-gray-300 rounded mb-3"></div>
                            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                            <div className="h-4 bg-gray-300 rounded mb-4 w-1/2"></div>
                            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Seções de Informações */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-[#4DBAAD]/10 to-[#4DBAAD]/20 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#4DBAAD] text-white text-4xl mb-6 w-16 h-16 rounded-full flex items-center justify-center mx-auto">📦</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Embalagens Personalizadas</h3>
            <p className="text-gray-700">Desenvolvemos embalagens sob medida para suas necessidades específicas, destacando sua marca com qualidade e estilo</p>
          </div>
          <div className="bg-gradient-to-br from-[#C3006A]/10 to-[#C3006A]/20 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#C3006A] text-white text-4xl mb-6 w-16 h-16 rounded-full flex items-center justify-center mx-auto">🚚</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Entrega Rápida</h3>
            <p className="text-gray-700">Entregamos seus produtos com agilidade e segurança em todo o Brasil, garantindo que cheguem no prazo</p>
          </div>
          <div className="bg-gradient-to-br from-[#4DBAAD]/10 to-[#4DBAAD]/20 p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#4DBAAD] text-white text-4xl mb-6 w-16 h-16 rounded-full flex items-center justify-center mx-auto">💡</div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Soluções Inovadoras</h3>
            <p className="text-gray-700">Tecnologia e criatividade para criar as melhores soluções em embalagens para o seu negócio</p>
          </div>
        </div>

        {/* Call to Action adicional */}
        <div className="mt-16 bg-gradient-to-r from-[#4DBAAD] to-[#C3006A] rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Precisa de uma Solução Personalizada?</h3>
          <p className="text-xl mb-8 opacity-90">Fale com nossos especialistas e descubra como podemos ajudar seu negócio a se destacar</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/br/store" 
              className="bg-white text-[#4DBAAD] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Ver Catálogo Completo
            </Link>
            <Link 
              href="/br/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#C3006A] transition-all shadow-lg"
            >
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
