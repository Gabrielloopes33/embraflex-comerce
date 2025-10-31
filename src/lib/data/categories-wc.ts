"use server"

// Mock categories for WooCommerce compatibility
export interface MockCategory {
  id: string
  name: string
  handle: string
  parent_category?: MockCategory | null
  category_children?: MockCategory[]
}

const mockCategories: MockCategory[] = [
  {
    id: "cat_1",
    name: "Clothing",
    handle: "clothing",
    parent_category: null,
    category_children: [
      {
        id: "cat_1_1",
        name: "T-Shirts",
        handle: "t-shirts"
      },
      {
        id: "cat_1_2", 
        name: "Jeans",
        handle: "jeans"
      }
    ]
  },
  {
    id: "cat_2",
    name: "Electronics",
    handle: "electronics", 
    parent_category: null,
    category_children: [
      {
        id: "cat_2_1",
        name: "Phones",
        handle: "phones"
      },
      {
        id: "cat_2_2",
        name: "Laptops", 
        handle: "laptops"
      }
    ]
  },
  {
    id: "cat_3",
    name: "Home & Garden",
    handle: "home-garden",
    parent_category: null,
    category_children: []
  }
]

export const listCategories = async (): Promise<MockCategory[]> => {
  // Return mock data for now
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  return mockCategories
}

export const getCategoryByHandle = async (handle: string): Promise<MockCategory | null> => {
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  // Search in both parent and child categories
  for (const category of mockCategories) {
    if (category.handle === handle) {
      return category
    }
    
    if (category.category_children) {
      const child = category.category_children.find(child => child.handle === handle)
      if (child) {
        return { ...child, parent_category: category }
      }
    }
  }
  
  return null
}

export const retrieveCategory = async (id: string): Promise<MockCategory | null> => {
  await new Promise(resolve => setTimeout(resolve, 10)) // Simulate async
  
  // Search in both parent and child categories
  for (const category of mockCategories) {
    if (category.id === id) {
      return category
    }
    
    if (category.category_children) {
      const child = category.category_children.find(child => child.id === id)
      if (child) {
        return { ...child, parent_category: category }
      }
    }
  }
  
  return null
}