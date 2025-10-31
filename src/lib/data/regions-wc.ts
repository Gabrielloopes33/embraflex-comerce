"use server"

// Since WooCommerce doesn't have regions like Medusa, we'll create mock region functions
// to maintain compatibility with the existing frontend structure

export interface MockRegion {
  id: string
  name: string
  currency_code: string
  countries: Array<{
    id: string
    iso_2: string
    display_name: string
  }>
}

// Simplified for Brazil only
const mockRegions: MockRegion[] = [
  {
    id: "reg_br",
    name: "Brasil",
    currency_code: "BRL",
    countries: [
      { id: "br", iso_2: "br", display_name: "Brasil" }
    ]
  }
]

const regionMap = new Map<string, MockRegion>()

// Initialize the region map
mockRegions.forEach((region) => {
  region.countries.forEach((country) => {
    regionMap.set(country.iso_2, region)
  })
})

export const listRegions = async (): Promise<MockRegion[]> => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 10))
  return mockRegions
}

export const retrieveRegion = async (id: string): Promise<MockRegion | null> => {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 10))
  return mockRegions.find(region => region.id === id) || null
}

export const getRegion = async (countryCode: string): Promise<MockRegion | null> => {
  try {
    // Return cached region if available
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode) || null
    }

    // Default to US region if country not found
    return regionMap.get("us") || mockRegions[0] || null
  } catch (e: any) {
    console.error("Error getting region:", e)
    return null
  }
}