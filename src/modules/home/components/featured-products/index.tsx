import { MockCollection } from "@lib/data/collections-wc"
import { MockRegion } from "@lib/data/regions-wc"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: MockCollection[]
  region: MockRegion
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail collection={collection} region={region} />
    </li>
  ))
}
