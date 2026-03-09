'use client'

import { ProductDetail } from '@/types/product-detail'
import { GalleryDetail } from '../gallery/gallery'
import { BtnAddToCart } from '../btnAddToCart'
import { useProductDetail } from '@/app/hooks/useProductDetail'
import { formatCOP } from '@/app/lib/formatPrice'

interface ProductDetailProps {
  data: ProductDetail;
}

export const WrapperDetail = ({ data }: ProductDetailProps) => {
  const {
    colors,
    sizes,
    availableSizes,
    selectedColor,
    selectedSize,
    selectedVariant,
    currentImages,
    currentPrice,
    isComplete,
    selectColor,
    selectSize,
  } = useProductDetail(data)

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div className="w-full">
          <GalleryDetail images={currentImages} />
        </div>

        <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">{data.name}</h1>
            <p className="text-2xl font-medium">{formatCOP(currentPrice)}</p>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-wide">
                Select Color
                {selectedColor && <span className="text-secondary font-normal"> - {selectedColor}</span>}
              </p>
              <div className="flex flex-wrap gap-3">  
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => selectColor(color.name)}
                    className={`w-10 h-10 rounded-full transition-all duration-200
                      ${selectedColor === color.name
                        ? 'border-primary border-2 scale-110 shadow-md'
                        : 'border-1 border-gray-200 hover:border-gray-400'
                      }
                    `}
                    style={{ backgroundColor: color.hex_color }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-wide">Select Size</p>
              <div className="flex gap-3">
                {sizes.map((size) => {
                  const isAvailable = availableSizes.includes(size)
                  return (
                    <button
                      key={size}
                      disabled={!isAvailable}
                      onClick={() => selectSize(size)}
                      className={`px-4 py-2 border rounded transition
                        ${selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300'
                        }
                        ${!isAvailable
                          ? 'opacity-30 cursor-not-allowed'
                          : 'hover:border-primary hover:bg-primary hover:text-white'
                        }
                      `}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            {isComplete ? (
              <>
                <BtnAddToCart 
                  variant={selectedVariant!} 
                  productName={data.name}
                  productImages={data.images ?? []}
                />
                <button className="w-full bg-accent text-dark font-medium py-3 rounded-full hover:bg-primary hover:text-white transition-colors duration-200">
                  Comprar ahora
                </button>
              </>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-full cursor-not-allowed">
                Seleccionar opciones
              </button>
            )}
          </div>

          {data.description && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-secondary text-sm leading-relaxed">{data.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
