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

async function getProductsByMainCategories() {
  try {
    console.log('📂 Buscando todas as categorias...')
    
    // Buscar todas as categorias
    const allCategories = await fetchWooCommerceCategories()
    console.log(`📦 Total de categorias encontradas: ${allCategories.length}`)
    
    // Filtrar categorias principais de produtos (não de quantidade)
    const mainCategories = allCategories.filter((cat) => {
      return !cat.name.includes('Unidades') && 
             !cat.name.startsWith('k-') && 
             cat.name !== 'Uncategorized'
    })

    console.log('🎯 Categorias principais filtradas:', mainCategories.map(cat => `${cat.name} (${cat.count} produtos)`))

    // Buscar produtos para cada categoria
    console.log('\n🔍 Buscando produtos para cada categoria...')
    const categoriesWithProducts = await Promise.all(
      mainCategories.map(async (category) => {
        console.log(`   📦 Buscando produtos para: ${category.name}`)
        
        let products = []
        if (category.count > 0) {
          const result = await fetchWooCommerceProductsByCategory(category.id, 6)
          products = result.products
        }
        
        console.log(`   ✅ ${products.length} produtos encontrados para ${category.name}`)
        
        return {
          id: category.id.toString(),
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          products: products.map(product => ({
            id: product.id.toString(),
            title: product.name,
            handle: product.slug,
            thumbnail: product.images[0]?.src || null,
            description: product.description || product.short_description || null,
          })),
          count: category.count,
          isEmpty: category.count === 0
        }
      })
    )

    // Ordenar: categorias com produtos primeiro
    const finalCategories = categoriesWithProducts.sort((a, b) => {
      if (a.isEmpty && !b.isEmpty) return 1
      if (!a.isEmpty && b.isEmpty) return -1
      return b.count - a.count
    })
    
    console.log('\n📋 RESULTADO FINAL:')
    console.log('═'.repeat(50))
    finalCategories.forEach(category => {
      console.log(`\n📂 ${category.name}:`)
      console.log(`   📊 Total na categoria: ${category.count} produtos`)
      console.log(`   🎯 Exibindo: ${category.products.length} produtos`)
      category.products.forEach((product, index) => {
        console.log(`      ${index + 1}. ${product.title}`)
      })
    })

    return {
      categories: finalCategories
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos por categorias:", error)
    return {
      categories: []
    }
  }
}

// Função principal
async function main() {
  console.log('🚀 Testando função getProductsByMainCategories...')
  console.log('🏪 URL da loja:', wooCommerceConfig.storeUrl)
  
  const result = await getProductsByMainCategories()
  
  console.log('\n📈 ESTATÍSTICAS FINAIS:')
  console.log(`   Total de categorias principais: ${result.categories.length}`)
  console.log(`   Total de produtos exibidos: ${result.categories.reduce((sum, cat) => sum + cat.products.length, 0)}`)
}

main().catch(console.error)