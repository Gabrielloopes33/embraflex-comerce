import { listProducts } from "@lib/data/products-wc"
import { MockCollection } from "@lib/data/collections-wc"
import { MockRegion } from "@lib/data/regions-wc"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: MockCollection
  region: MockRegion
}) {
  // Fetch real products from WooCommerce
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    pageParam: 1,
    queryParams: { limit: 6 },
    countryCode: "br",
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return (
      <div className="content-container py-12 small:py-24">
        <div className="flex justify-between mb-8">
          <Text className="txt-xlarge">{collection.title}</Text>
          <InteractiveLink href={`/collections/${collection.handle}`}>
            Ver todos
          </InteractiveLink>
        </div>
        <div className="text-center py-8">
          <Text className="txt-medium text-ui-fg-muted">
            Nenhum produto encontrado para esta coleção
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          View all
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
      </ul>
    </div>
  )
}
