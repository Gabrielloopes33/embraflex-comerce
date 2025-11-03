const c = require("ansi-colors")

const requiredEnvs = [
  {
    key: "WOOCOMMERCE_STORE_URL",
    description:
      "URL da sua loja WooCommerce (ex: https://sualoja.com.br)",
  },
  {
    key: "WOOCOMMERCE_CONSUMER_KEY",
    description:
      "Consumer Key da API REST do WooCommerce. Gere em: WooCommerce > Configurações > Avançado > REST API",
  },
  {
    key: "WOOCOMMERCE_CONSUMER_SECRET",
    description:
      "Consumer Secret da API REST do WooCommerce. Gere em: WooCommerce > Configurações > Avançado > REST API",
  },
]

function checkEnvVariables() {
  const missingEnvs = requiredEnvs.filter(function (env) {
    return !process.env[env.key]
  })

  if (missingEnvs.length > 0) {
    console.error(
      c.red.bold("\n🚫 Error: Missing required environment variables\n")
    )

    missingEnvs.forEach(function (env) {
      console.error(c.yellow(`  ${c.bold(env.key)}`))
      if (env.description) {
        console.error(c.dim(`    ${env.description}\n`))
      }
    })

    console.error(
      c.yellow(
        "\nPlease set these variables in your .env file or environment before starting the application.\n"
      )
    )

    process.exit(1)
  }
}

module.exports = checkEnvVariables
