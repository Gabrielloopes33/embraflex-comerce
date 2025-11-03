// Lê o arquivo .env.local manualmente
const fs = require('fs')
const path = require('path')

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

// Base64 encode credentials for Basic Auth
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
    let allCategories = []
    let page = 1
    let hasMorePages = true
    
    while (hasMorePages) {
      console.log(`🔍 Fazendo requisição para página ${page}:`, `${wooCommerceApi.baseUrl}/products/categories?page=${page}&per_page=100`)
      
      const response = await fetch(`${wooCommerceApi.baseUrl}/products/categories?page=${page}&per_page=100`, {
        headers: wooCommerceApi.headers,
      })

      console.log(`📊 Status da resposta página ${page}:`, response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro na resposta:', errorText)
        throw new Error(`WooCommerce API error: ${response.status}`)
      }

      const categories = await response.json()
      allCategories = allCategories.concat(categories)
      
      // Verifica se há mais páginas pelos headers
      const totalPages = response.headers.get('X-WP-TotalPages')
      hasMorePages = page < parseInt(totalPages || '1')
      page++
    }
    
    console.log('\n✅ Todas as categorias encontradas:')
    console.log('📦 Total de categorias:', allCategories.length)
    
    allCategories.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.name}`)
      console.log(`   ID: ${category.id}`)
      console.log(`   Slug: ${category.slug}`)
      console.log(`   Descrição: ${category.description || 'Sem descrição'}`)
      console.log(`   Parent ID: ${category.parent || 'Categoria raiz'}`)
      console.log(`   Count: ${category.count} produtos`)
      if (category.image) {
        console.log(`   Imagem: ${category.image.src}`)
      }
    })
    
    return allCategories
  } catch (error) {
    console.error("❌ Erro ao buscar categorias do WooCommerce:", error.message)
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 Dicas para resolver problemas de conexão:')
      console.log('1. Verifique se a URL da loja está correta')
      console.log('2. Confirme se a loja WooCommerce está online')
      console.log('3. Verifique as credenciais da API')
    }
    
    return []
  }
}

// Função principal
async function main() {
  console.log('🚀 Testando conexão com WooCommerce...')
  console.log('🏪 URL da loja:', wooCommerceConfig.storeUrl)
  console.log('🔑 Consumer Key:', wooCommerceConfig.consumerKey ? `${wooCommerceConfig.consumerKey.substring(0, 8)}...` : 'NÃO CONFIGURADO')
  console.log('🔐 Consumer Secret:', wooCommerceConfig.consumerSecret ? 'CONFIGURADO' : 'NÃO CONFIGURADO')
  
  const categories = await fetchWooCommerceCategories()
  
  if (categories.length > 0) {
    console.log('\n📋 ANÁLISE DETALHADA DAS CATEGORIAS:')
    console.log('═'.repeat(60))
    
    // Categorias com produtos
    const categoriesWithProducts = categories.filter(cat => cat.count > 0)
    console.log(`\n🛒 CATEGORIAS COM PRODUTOS (${categoriesWithProducts.length}):`)
    categoriesWithProducts
      .sort((a, b) => b.count - a.count)
      .forEach(cat => {
        console.log(`   📦 ${cat.name}: ${cat.count} produtos`)
      })
    
    // Categorias sem produtos
    const categoriesWithoutProducts = categories.filter(cat => cat.count === 0)
    console.log(`\n📭 CATEGORIAS VAZIAS (${categoriesWithoutProducts.length}):`)
    categoriesWithoutProducts.forEach(cat => {
      console.log(`   📦 ${cat.name}`)
    })
    
    // Análise por tipo
    console.log('\n🏷️  ANÁLISE POR TIPO DE CATEGORIA:')
    const quantityCategories = categories.filter(cat => cat.name.includes('Unidades'))
    const productCategories = categories.filter(cat => !cat.name.includes('Unidades') && !cat.name.startsWith('k-') && cat.name !== 'Uncategorized')
    const codeCategories = categories.filter(cat => cat.name.startsWith('k-'))
    
    console.log(`\n   � Categorias por Quantidade (${quantityCategories.length}):`)
    quantityCategories.forEach(cat => {
      console.log(`      • ${cat.name}: ${cat.count} produtos`)
    })
    
    console.log(`\n   🎁 Categorias de Produtos (${productCategories.length}):`)
    productCategories.forEach(cat => {
      console.log(`      • ${cat.name}: ${cat.count} produtos`)
    })
    
    console.log(`\n   🔤 Categorias com Código K (${codeCategories.length}):`)
    codeCategories.forEach(cat => {
      console.log(`      • ${cat.name}: ${cat.count} produtos`)
    })
    
    // Estatísticas gerais
    const totalProducts = categories.reduce((sum, cat) => sum + cat.count, 0)
    console.log(`\n📈 ESTATÍSTICAS GERAIS:`)
    console.log(`   Total de categorias: ${categories.length}`)
    console.log(`   Categorias com produtos: ${categoriesWithProducts.length}`)
    console.log(`   Categorias vazias: ${categoriesWithoutProducts.length}`)
    console.log(`   Total de produtos: ${totalProducts}`)
    console.log(`   Média de produtos por categoria ativa: ${Math.round(totalProducts / categoriesWithProducts.length)} produtos`)
  }
}

main().catch(console.error)