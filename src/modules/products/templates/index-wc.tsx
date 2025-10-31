import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { MappedProduct, MappedImage } from "../../../types/woocommerce"
import { MockRegion } from "@lib/data/regions-wc"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: MappedProduct
  region: MockRegion
  countryCode: string
  images: MappedImage[]
}

const ProductTemplateWC: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Convert images to the format expected by ImageGallery
  const convertedImages = images.map((img, index) => ({
    ...img,
    rank: index + 1, // Add required rank property
  }))

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-6">
          <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl font-medium text-ui-fg-base" data-testid="product-title">
              {product.title}
            </h1>
            <p className="text-ui-fg-subtle" data-testid="product-description">
              {product.description}
            </p>
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="text-sm font-medium text-ui-fg-base">SKU:</span>
                <span className="text-sm text-ui-fg-subtle">{product.variants[0].sku || 'N/A'}</span>
              </div>
            )}
          </div>
        </div>
        <div className="block w-full relative">
          <ImageGallery images={convertedImages} />
        </div>
        <div className="flex flex-col small:sticky small:top-48 small:py-0 small:max-w-[300px] w-full py-8 gap-y-12">
          <ProductOnboardingCta />
          <Suspense
            fallback={
              <div className="w-full">
                <div className="flex flex-col gap-y-2">
                  <div className="w-full relative">
                    <div className="flex items-center gap-x-2">
                      <span className="text-ui-fg-base text-lg font-medium">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: region.currency_code,
                        }).format((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100)}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={true}
                    className="w-full h-10 bg-ui-button-neutral text-ui-fg-disabled border border-ui-border-base rounded-md"
                  >
                    Carregando...
                  </button>
                </div>
              </div>
            }
          >
            <div className="w-full">
              <div className="flex flex-col gap-y-2">
                <div className="w-full relative">
                  <div className="flex items-center gap-x-2">
                    <span className="text-ui-fg-base text-lg font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: region.currency_code,
                      }).format((product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100)}
                    </span>
                  </div>
                </div>
                <button className="w-full h-10 bg-ui-button-base text-ui-fg-on-color rounded-md hover:bg-ui-button-base-hover transition-colors">
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-gray-700 text-base-regular">
              Produtos relacionados em breve
            </span>
          </div>
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplateWC