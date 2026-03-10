'use client'

import { ProductDetail } from '@/types/product-detail'
import { GalleryDetail } from '../gallery/gallery'
import { BtnAddToCart } from '../btnAddToCart'
import { useProductDetail } from '@/app/hooks/useProductDetail'
import { formatCOP } from '@/app/lib/formatPrice'
import { Truck, Percent, Package } from 'lucide-react'

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
    exactKey,
    selectColor,
    selectSize,
  } = useProductDetail(data)

  const defaultDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  return (
    <section className="w-full container mx-auto px-6 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        <div className="w-full">
          <GalleryDetail images={currentImages} />
        </div>

        <div className="flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-primary">{data.name}</h1>
            <p className="text-2xl font-medium text-primary">{formatCOP(currentPrice)}</p>
          </div>

          {colors.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium uppercase tracking-wide text-primary">
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
              <p className="text-sm font-medium uppercase tracking-wide text-primary">Select Size</p>
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
                  productImages={currentImages ?? []}
                  combinationName={exactKey}
                />
                <button className="w-full bg-black text-white font-medium py-3 rounded-full hover:bg-dark-alt transition-colors duration-200">
                  Comprar ahora
                </button>
              </>
            ) : (
              <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-full cursor-not-allowed">
                Seleccionar opciones
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
               <h3 className="text-base font-semibold text-primary">Descripción:</h3>
               <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {data.description || defaultDescription}
               </p>
            </div>

            <div className="bg-accent-light/50 border border-gray-200 rounded-xl p-6 mt-4 flex flex-col gap-4">
               <div className="flex items-center gap-4">
                  <Truck size={24} className="text-primary shrink-0" />
                  <p className="text-sm text-primary">Tiempo de entrega de <span className="font-bold">2-4 dias</span></p>
               </div>
               
               <div className="h-px bg-gray-200 border-t border-dashed w-full" />
               
               <div className="flex items-center gap-4">
                  <Percent size={24} className="text-primary shrink-0" />
                  <p className="text-sm text-primary">Regístrate y <span className="font-bold">conviértete en mayorista</span> para acceder a mejores precios</p>
               </div>

               <div className="h-px bg-gray-200 border-t border-dashed w-full" />

               <div className="flex items-center gap-4">
                  <Package size={24} className="text-primary shrink-0" />
                  <p className="text-sm text-primary font-medium tracking-tight">Envios a Nivel Nacional</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
