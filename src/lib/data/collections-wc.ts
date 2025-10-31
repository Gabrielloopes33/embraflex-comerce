"use server"

// Mock collections for WooCommerce compatibility
export interface MockCollection {
  id: string
  handle: string
  title: string
  products?: any[]
}

const mockCollections: MockCollection[] = [
  {
    id: "col_1",
    handle: "featured",
    title: "Featured Products",
    products: []
  },
  {
    id: "col_2", 
    handle: "new-arrivals",
    title: "New Arrivals",
    products: []
  },
  {
    id: "col_3",
    handle: "best-sellers",
    title: "Best Sellers", 
    products: []
  }
]

export const listCollections = async (params?: any) => {
  // Return mock data for now
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  return {
    collections: mockCollections,
    count: mockCollections.length
  }
}

export const getCollectionByHandle = async (handle: string): Promise<MockCollection | null> => {
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  return mockCollections.find(col => col.handle === handle) || null
}

export const retrieveCollection = async (id: string): Promise<MockCollection | null> => {
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  return mockCollections.find(col => col.id === id) || null
}