// WooCommerce configuration instead of Medusa SDK
import { wooCommerceApi } from "./woocommerce-config"

// Mock SDK object to maintain compatibility
export const sdk = {
  client: {
    fetch: async (url: string, options: any) => {
      // This is a fallback - most WooCommerce calls will go through our dedicated functions
      throw new Error("Direct SDK calls not supported with WooCommerce. Use dedicated WooCommerce functions.")
    }
  }
}

// Export WooCommerce configuration for use in components
export { wooCommerceApi }

// Default configuration
export const config = {
  baseUrl: process.env.WOOCOMMERCE_STORE_URL || "http://localhost:8080",
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET || "",
}