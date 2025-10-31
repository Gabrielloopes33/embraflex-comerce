interface WooCommerceConfig {
  storeUrl: string
  consumerKey: string
  consumerSecret: string
}

const config: WooCommerceConfig = {
  storeUrl: process.env.WOOCOMMERCE_STORE_URL || "http://localhost:8080",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
}

// Base64 encode credentials for Basic Auth
const credentials = Buffer.from(
  `${config.consumerKey}:${config.consumerSecret}`
).toString("base64")

export const wooCommerceApi = {
  baseUrl: `${config.storeUrl}/wp-json/wc/v3`,
  headers: {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  },
}

export default config