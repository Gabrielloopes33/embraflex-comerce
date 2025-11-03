const fs = require('fs')
const path = require('path')

// Lê o arquivo .env.local manualmente
let envVars = {}
try {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8')
    envFile.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
      }
    })
  }
} catch (error) {
  console.warn('⚠️  Não foi possível ler o arquivo .env.local:', error.message)
}

const wooCommerceConfig = {
  storeUrl: envVars.WOOCOMMERCE_STORE_URL || process.env.WOOCOMMERCE_STORE_URL || "http://localhost:8080",
  consumerKey: envVars.WOOCOMMERCE_CONSUMER_KEY || process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: envVars.WOOCOMMERCE_CONSUMER_SECRET || process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
}

const credentials = Buffer.from(
  `${wooCommerceConfig.consumerKey}:${wooCommerceConfig.consumerSecret}`
).toString("base64")

const wooCommerceApi = {
  baseUrl: `${wooCommerceConfig.storeUrl}/wp-json/wc/v3`,
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
}

async function fetchWooCommerceCategories() {
  try {
    const response = await fetch(`${wooCommerceApi.baseUrl}/products/categories?per_page=100`, {
      headers: wooCommerceApi.headers,
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching WooCommerce categories:", error)
    return []
  }
}

async function fetchWooCommerceProductsByCategory(categoryId, limit = 6) {
  try {
    const params = new URLSearchParams({
      category: categoryId.toString(),
      per_page: limit.toString(),
      status: "publish",
      orderby: "date",
      order: "desc"
    })

    const response = await fetch(`${wooCommerceApi.baseUrl}/products?${params}`, {
      headers: wooCommerceApi.headers,
    })

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`)
    }

    const products = await response.json()
    const totalHeader = response.headers.get("x-wp-total")

    return {
      products,
      total: totalHeader ? parseInt(totalHeader, 10) : products.length,
    }
  } catch (error) {
    console.error("Error fetching WooCommerce products by category:", error)
    return {
      products: [],
      total: 0,
    }
  }
}

async function getProductsByProductLines() {
  try {
    console.log('📊 Buscando produtos organizados por linhas...')
    
    // Buscar todas as categorias
    const allCategories = await fetchWooCommerceCategories()
    console.log(`📦 Total de categorias encontradas: ${allCategories.length}`)
    
    // Mapear categorias para linhas de produto conforme estrutura da tabela
    const productLineMapping = {
      'sacoladepapel': {
        lineType: 'economica',
        icon: '🛍️',
        color: 'blue',
        displayName: 'Sacolas de Papel - Linha Econômica',
        description: 'Sacolas de papel com excelente custo-benefício, ideais para o dia a dia do seu negócio'
      },
      'caixas': {
        lineType: 'premium',
        icon: '📦',
        color: 'green',
        displayName: 'Caixas Personalizadas - Linha Premium',
        description: 'Caixas sob medida com acabamento premium para destacar sua marca'
      },
      'delivery': {
        lineType: 'especial',
        icon: '🚚',
        color: 'orange',
        displayName: 'Sacos Delivery - Linha Especial',
        description: 'Soluções especializadas para delivery com praticidade e resistência'
      },
      'plastico': {
        lineType: 'personalizada',
        icon: '🎨',
        color: 'purple',
        displayName: 'Sacolas Plásticas - Linha Personalizada',
        description: 'Sacolas plásticas totalmente customizáveis com sua identidade visual'
      }
    }

    // Filtrar e organizar categorias por linhas de produto
    const productLines = []
    
    for (const category of allCategories) {
      const mapping = productLineMapping[category.slug]
      if (mapping) {
        console.log(`🔍 Processando linha: ${mapping.displayName}`)
        
        let products = []
        if (category.count > 0) {
          console.log(`   📦 Buscando ${category.count} produtos...`)
          const result = await fetchWooCommerceProductsByCategory(category.id, 6)
          products = result.products.map(product => ({
            id: product.id.toString(),
            title: product.name,
            handle: product.slug,
            thumbnail: product.images[0]?.src || null,
            description: product.description || product.short_description || null,
          }))
        } else {
          console.log(`   📭 Linha vazia (preparando estrutura)`)
        }
        
        productLines.push({
          id: category.id.toString(),
          name: mapping.displayName,
          slug: category.slug,
          description: mapping.description,
          products: products,
          count: category.count,
          isEmpty: category.count === 0,
          lineType: mapping.lineType,
          icon: mapping.icon,
          color: mapping.color
        })
      }
    }

    // Ordenar por prioridade: Econômica > Premium > Especial > Personalizada
    const lineOrder = ['economica', 'premium', 'especial', 'personalizada']
    const sortedLines = productLines.sort((a, b) => {
      const orderA = lineOrder.indexOf(a.lineType)
      const orderB = lineOrder.indexOf(b.lineType)
      
      if (orderA !== orderB) {
        return orderA - orderB
      }
      
      return b.count - a.count
    })

    console.log('\n🏷️  LINHAS DE PRODUTO ORGANIZADAS:')
    console.log('═'.repeat(60))
    
    sortedLines.forEach((line, index) => {
      console.log(`\n${index + 1}. ${line.icon} ${line.name}`)
      console.log(`   📊 Tipo: ${line.lineType.toUpperCase()}`)
      console.log(`   🎨 Cor: ${line.color}`)
      console.log(`   📦 Produtos: ${line.count} (exibindo: ${line.products.length})`)
      console.log(`   📝 Descrição: ${line.description}`)
      console.log(`   🏷️  Status: ${line.isEmpty ? 'EM DESENVOLVIMENTO' : 'ATIVO'}`)
      
      if (line.products.length > 0) {
        console.log(`   🛍️  Produtos destacados:`)
        line.products.forEach((product, pIndex) => {
          console.log(`      ${pIndex + 1}. ${product.title}`)
        })
      }
    })

    console.log('\n📈 ESTATÍSTICAS FINAIS:')
    console.log(`   Total de linhas configuradas: ${sortedLines.length}`)
    console.log(`   Linhas ativas: ${sortedLines.filter(line => !line.isEmpty).length}`)
    console.log(`   Linhas em desenvolvimento: ${sortedLines.filter(line => line.isEmpty).length}`)
    console.log(`   Total de produtos exibidos: ${sortedLines.reduce((sum, line) => sum + line.products.length, 0)}`)

    return {
      productLines: sortedLines
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos por linhas:", error)
    return {
      productLines: []
    }
  }
}

// Função principal
async function main() {
  console.log('🚀 Testando estrutura de Linhas de Produto (baseada na tabela PDF)...')
  console.log('🏪 URL da loja:', wooCommerceConfig.storeUrl)
  
  const result = await getProductsByProductLines()
  
  if (result.productLines.length > 0) {
    console.log('\n🎯 RESUMO EXECUTIVO:')
    console.log('─'.repeat(40))
    console.log('✅ Estrutura de linhas implementada com sucesso!')
    console.log('🛍️  Linha Econômica: Produtos de entrada com ótimo custo-benefício')
    console.log('💎 Linha Premium: Produtos de alta qualidade e acabamento')
    console.log('🚀 Linha Especial: Soluções específicas para necessidades únicas')
    console.log('🎨 Linha Personalizada: Produtos totalmente customizáveis')
  } else {
    console.log('❌ Nenhuma linha de produto configurada')
  }
}

main().catch(console.error)