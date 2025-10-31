import { Text } from "@medusajs/ui"
import { MappedProduct } from "../../../../types/woocommerce"
import { MockRegion } from "@lib/data/regions-wc"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: MappedProduct
  isFeatured?: boolean
  region: MockRegion
}) {
  // Get the cheapest price from variants
  const cheapestPrice = product.variants && product.variants.length > 0 
    ? product.variants.reduce((min, variant) => {
        const price = variant.calculated_price?.calculated_amount || 0
        return price < min ? price : min
      }, product.variants[0].calculated_price?.calculated_amount || 0)
    : 0

  const formattedPrice = cheapestPrice 
    ? {
        calculated_amount: cheapestPrice,
        currency_code: region.currency_code,
      }
    : null

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice > 0 && (
              <Text className="text-ui-fg-muted" data-testid="price">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: region.currency_code,
                }).format(cheapestPrice / 100)}
              </Text>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
