"use client"

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { MappedProduct } from '../../../../../types/woocommerce'

// Tipos para as opções de customização
interface FormatOption {
  id: string
  label: string
  dimensions: string
  priceMultiplier: number
}

interface PrintOption {
  id: string
  label: string
  priceMultiplier: number
}

interface ColorOption {
  id: string
  label: string
  color: string
  priceMultiplier: number
}

// Dados mockados das opções (podem vir de uma API)
const formatOptions: FormatOption[] = [
  { id: 'small', label: 'L 13,5 x A 9 x P 17,95 cm', dimensions: '13,5 x 9 x 17,95 cm', priceMultiplier: 1 },
  { id: 'medium', label: 'L 26 x A 9 x P 18 cm', dimensions: '26 x 9 x 18 cm', priceMultiplier: 1.2 },
  { id: 'large', label: 'L 26 x A 6 x P 21 cm', dimensions: '26 x 6 x 21 cm', priceMultiplier: 1.4 },
]

const printOptions: PrintOption[] = [
  { id: 'externa', label: 'Externa', priceMultiplier: 1 },
  { id: 'interna', label: 'Interna', priceMultiplier: 1.1 },
  { id: 'ambas', label: 'Externa e Interna', priceMultiplier: 1.3 },
]

const colorOptions: ColorOption[] = [
  { id: '4x0', label: '4+0 (Frente colorida)', color: '#FFD700', priceMultiplier: 1 },
  { id: '4x4', label: '4+4 (Frente e verso coloridas)', color: '#FF6B6B', priceMultiplier: 1.2 },
  { id: '1x0', label: '1+0 (Preto e branco)', color: '#000000', priceMultiplier: 0.8 },
]

interface Props {
  product: MappedProduct
}

export default function ProductPageClient({ product }: Props) {
  // Estados para as opções selecionadas
  const [selectedFormat, setSelectedFormat] = useState<string>(formatOptions[0].id)
  const [selectedPrint, setSelectedPrint] = useState<string>(printOptions[0].id)
  const [selectedColor, setSelectedColor] = useState<string>(colorOptions[0].id)
  const [quantity, setQuantity] = useState<number>(25)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Preço base do produto
  const basePrice = (product.variants?.[0]?.calculated_price?.calculated_amount || 0) / 100

  // Cálculo do preço final
  const finalPrice = useMemo(() => {
    const formatMultiplier = formatOptions.find(f => f.id === selectedFormat)?.priceMultiplier || 1
    const printMultiplier = printOptions.find(p => p.id === selectedPrint)?.priceMultiplier || 1
    const colorMultiplier = colorOptions.find(c => c.id === selectedColor)?.priceMultiplier || 1
    
    return basePrice * formatMultiplier * printMultiplier * colorMultiplier
  }, [basePrice, selectedFormat, selectedPrint, selectedColor])

  const totalPrice = finalPrice * quantity

  // Imagens do produto
  const images = product.images || []
  const hasImages = images.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <span className="text-gray-500">Home</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-500">Produtos</span>
          <span className="mx-2 text-gray-400">{'>'}</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          {/* Galeria de Imagens - Esquerda */}
          <div className="lg:col-span-4">
            {/* Imagem Principal */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              {hasImages ? (
                <div className="aspect-square relative">
                  <Image
                    src={images[currentImageIndex]?.url || product.thumbnail || '/placeholder.jpg'}
                    alt={product.title}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Sem imagem disponível</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {hasImages && images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square relative bg-white rounded-lg p-2 border-2 transition-all ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-contain rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configurações - Centro */}
          <div className="lg:col-span-5">
            {/* Título e Preço */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="text-sm text-gray-600 mb-4">25 unidades por</div>
              <div className="text-3xl font-bold text-blue-600">
                R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-lg text-gray-500 ml-2">/ unit</span>
              </div>

              {product.description && (
                <div className="mt-4 text-gray-600 text-sm">
                  <div dangerouslySetInnerHTML={{ __html: product.description.substring(0, 150) + '...' }} />
                </div>
              )}
            </div>

            {/* Configuração - Formato */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4">Formato</h3>
              <div className="grid grid-cols-1 gap-3">
                {formatOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value={option.id}
                      checked={selectedFormat === option.id}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                    </div>
                    {option.priceMultiplier !== 1 && (
                      <div className="text-sm text-gray-500">
                        +{((option.priceMultiplier - 1) * 100).toFixed(0)}%
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Configuração - Impressão */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4">Impressão</h3>
              <div className="grid grid-cols-1 gap-3">
                {printOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="print"
                      value={option.id}
                      checked={selectedPrint === option.id}
                      onChange={(e) => setSelectedPrint(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                    </div>
                    {option.priceMultiplier !== 1 && (
                      <div className="text-sm text-gray-500">
                        +{((option.priceMultiplier - 1) * 100).toFixed(0)}%
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Configuração - Cores */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <h3 className="text-lg font-semibold mb-4">Cores</h3>
              <div className="grid grid-cols-1 gap-3">
                {colorOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={option.id}
                      checked={selectedColor === option.id}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="mr-3 text-blue-600"
                    />
                    <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: option.color }}></div>
                    <div className="flex-1">
                      <div className="font-medium">{option.label}</div>
                    </div>
                    {option.priceMultiplier !== 1 && (
                      <div className="text-sm text-gray-500">
                        {option.priceMultiplier < 1 ? '-' : '+'}
                        {Math.abs((option.priceMultiplier - 1) * 100).toFixed(0)}%
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Card de Resumo Fixo - Direita */}
          <div className="lg:col-span-3">
            <div 
              className="sticky z-10" 
              style={{ 
                top: '5rem',
                position: 'sticky',
                height: 'fit-content',
                maxHeight: 'calc(100vh - 2rem)'
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                <h3 className="text-lg font-semibold mb-4">Resumo</h3>
                
                {/* Quantidade */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Quantidade</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border rounded px-2 py-1"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Preço por unidade */}
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className="text-gray-600">Preço por unidade</span>
                  <span className="font-medium">
                    R$ {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-6 text-lg font-bold border-t pt-4">
                  <span>Total</span>
                  <span className="text-blue-600">
                    R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Estimativa de frete */}
                <div className="mb-6 text-sm text-gray-600">
                  <span>Estimativa de frete</span>
                  <button className="ml-2 text-blue-600 hover:underline">Simular frete</button>
                </div>

                {/* Botão de comprar */}
                <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4">
                  🛒 Comprar
                </button>

                {/* Informações adicionais */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="mr-2">📦</span>
                    <span>Envio da arte: É possível fazer o upload do seu arquivo na próxima página ou após concluir o pedido.</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">✨</span>
                    <span>Designer Embraflex: Contrate montagem e ajustes de artes após concluir o seu pedido.</span>
                  </div>
                
                </div>

                {/* Configuração escolhida */}
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold mb-2 text-sm">Configuração escolhida</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>{formatOptions.find(f => f.id === selectedFormat)?.label}</div>
                    <div>Externa: 4+0 corte-vinco</div>
                    <div>Laminação Fosca Externa</div>
                    <div>Acoplagem em Onda E (Verso Branco)</div>
                    <div>Hot Stamping Dourado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}