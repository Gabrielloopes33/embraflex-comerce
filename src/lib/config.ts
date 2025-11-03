import Medusa from "@medusajs/js-sdk"

// Defaults to standard port for Medusa server
// Use uma URL de mock para evitar erro de conexão no build
let MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "https://mock-medusa-backend.example.com"

// SDK do Medusa (opcional - usado apenas se você tiver um backend Medusa)
// Configuração mínima para evitar erros durante o build
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: false, // Desabilitar debug no build
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test",
})
