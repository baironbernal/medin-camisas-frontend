'use client'

import { useMemo, useState, useEffect } from 'react'
import { ProductDetail } from '@/types/product-detail'
import { useCartStore } from '../store/useCartStore'

export function useProductDetail(data: ProductDetail) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantitySelected, setQuantitySelected] = useState<number>(1)

  const { available_attributes, variants, combination_index } = data
  const colors = available_attributes?.['Color'] ?? []
  const sizes = available_attributes?.['Talla'] ?? []
  const material = available_attributes?.['Material']?.[0] ?? null

  // 1. Obtenemos todas las combinaciones como un array una sola vez para facilitar las búsquedas
  const entries = useMemo(() => Object.entries(combination_index), [combination_index])

  // 2. Tallas disponibles para el color seleccionado
  const availableSizes = useMemo(() => {
    if (!selectedColor) return []
    return entries
      .filter(([key]) => key.split('-').includes(selectedColor))
      .map(([key]) => key.split('-')[0])
  }, [selectedColor, entries])

  const exactKey = useMemo(() => {
    return `${selectedSize}-${selectedColor}-${material}`;
  }, [selectedSize, selectedColor, material])

  // 3. Variante seleccionada (Combinación exacta)
  const selectedVariant = useMemo(() => {
    if (!selectedColor || !selectedSize || !material) return null
    const id = combination_index[exactKey]?.variant_id
    return variants.find(v => v.id === id) ?? null
  }, [selectedColor, selectedSize, material, variants, combination_index, exactKey])

  // 3b. Stock disponible (derivado, sin side effects)
  const quantityAvailable = useMemo(() => {
    if (!selectedColor || !selectedSize || !material) return 0
    return combination_index[exactKey]?.stock ?? 0
  }, [selectedColor, selectedSize, material, combination_index, exactKey])

  // 4. Imágenes actuales: Buscamos cualquier variante que coincida con el color si no hay selección completa
  const currentImages = useMemo(() => {
    if (selectedVariant) return selectedVariant.images
    
    if (selectedColor) {
      // Buscamos la primera combinación que contenga el color seleccionado
      const firstComboWithColor = entries.find(([key]) => key.split('-').includes(selectedColor))
      if (firstComboWithColor) {
        const variantId = firstComboWithColor[1].variant_id
        return variants.find(v => v.id === variantId)?.images ?? variants[0].images
      }
    }
    
    return variants[0]?.images ?? []
  }, [selectedVariant, selectedColor, entries, variants])

  // 5. How many of this variant are already in the cart
  const cart = useCartStore(state => state.cart)
  const inCartQuantity = useMemo(() => {
    if (!selectedVariant) return 0
    return cart.find(item => item.id === selectedVariant.id)?.quantity ?? 0
  }, [cart, selectedVariant])

  // 6. Remaining stock the user can actually add
  const remainingStock = Math.max(0, quantityAvailable - inCartQuantity)

  // 7. Helpers de UI
  const currentPrice = selectedVariant?.price ?? variants[0]?.price ?? 0
  const isComplete = !!selectedVariant && remainingStock > 0

  // Reset quantity selection whenever the variant changes
  useEffect(() => {
    setQuantitySelected(1)
  }, [selectedVariant])

  const selectColor = (color: string) => {
    setSelectedColor(color)
    setSelectedSize(null)
  }

  const selectSize = (size: string) => setSelectedSize(size)



  return {
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
    quantityAvailable,
    remainingStock,
    inCartQuantity,
    quantitySelected,
    setQuantitySelected
  }
}