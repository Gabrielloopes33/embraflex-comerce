import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: string
    page?: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const categorySlug = params.category[0] || 'produtos'

  // Mapear slugs para nomes amigáveis
  const categoryNames: Record<string, string> = {
    'sacoladepapel': 'Sacolas de Papel - Linha Econômica',
    'caixas': 'Caixas Personalizadas - Linha Premium',
    'delivery': 'Sacos Delivery - Linha Especial',
    'plastico': 'Sacolas Plásticas - Linha Personalizada'
  }

  const title = categoryNames[categorySlug] || 'Produtos'

  return {
    title: `${title} | Embraflex`,
    description: `Confira nossa ${title.toLowerCase()} com os melhores preços e qualidade.`,
  }
}

export default async function CategoryPage(props: Props) {
  const params = await props.params
  const categorySlug = params.category[0]

  // Mapear slugs para informações da categoria
  const categoryInfo: Record<string, { 
    name: string
    description: string
    icon: string 
  }> = {
    'sacoladepapel': {
      name: 'Sacolas de Papel - Linha Econômica',
      description: 'Sacolas de papel com excelente custo-benefício, ideais para o dia a dia do seu negócio',
      icon: '🛍️'
    },
    'caixas': {
      name: 'Caixas Personalizadas - Linha Premium',
      description: 'Caixas sob medida com acabamento premium para destacar sua marca',
      icon: '📦'
    },
    'delivery': {
      name: 'Sacos Delivery - Linha Especial',
      description: 'Soluções especializadas para delivery com praticidade e resistência',
      icon: '🚚'
    },
    'plastico': {
      name: 'Sacolas Plásticas - Linha Personalizada',
      description: 'Sacolas plásticas totalmente customizáveis com sua identidade visual',
      icon: '🎨'
    }
  }

  const category = categoryInfo[categorySlug]
  
  if (!category) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{category.icon}</div>
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{category.description}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-12 text-center border-2 border-blue-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Página de Categoria em Desenvolvimento
        </h2>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Estamos trabalhando para trazer uma experiência completa de navegação por categorias.
          Por enquanto, veja todos os produtos disponíveis em nossa loja.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/${params.countryCode}/store`}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            Ver Todos os Produtos
          </Link>
          <Link 
            href={`/${params.countryCode}`}
            className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
}
