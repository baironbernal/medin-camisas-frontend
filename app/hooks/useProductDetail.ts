'use client'

import { useMemo, useState, useEffect } from 'react'
import { ProductDetail } from '@/types/product-detail'
import { useCartStore } from '../store/useCartStore'

// The backend builds combination_index keys with '|' as separator in fixed order:
// "Talla|Color|Material"  (Material segment is absent when the product has no Material attribute)
// Using '|' avoids ambiguity when attribute values contain '-' (e.g. "Azul-Oscuro")
const KEY_SEP = '|'

export function useProductDetail(data: ProductDetail) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantitySelected, setQuantitySelected] = useState<number>(1)

  const { available_attributes, variants, combination_index } = data
  const colors   = available_attributes?.['Color']    ?? []
  const sizes    = available_attributes?.['Talla']    ?? []
  const material = available_attributes?.['Material']?.[0] ?? null

  // All combination_index entries as a stable array
  const entries = useMemo(() => Object.entries(combination_index), [combination_index])

  // Tallas disponibles para el color seleccionado.
  // Key format: "Talla|Color" or "Talla|Color|Material"
  // Split by KEY_SEP → index 0 is always size, index 1 is always color.
  const availableSizes = useMemo(() => {
    if (!selectedColor) return []

    return entries
      .filter(([key]) => {
        const parts = key.split(KEY_SEP)
        // index 1 is always the color segment (guaranteed by backend fixed order)
        return parts[1] === selectedColor
      })
      .map(([key]) => key.split(KEY_SEP)[0]) // index 0 is always the size segment
  }, [selectedColor, entries])

  // Build the lookup key matching exactly the backend format.
  // Only append material segment when the product actually has one.
  const exactKey = useMemo(() => {
    if (!selectedSize || !selectedColor) return ''
    const parts = [selectedSize, selectedColor]
    if (material) parts.push(material)
    return parts.join(KEY_SEP)
  }, [selectedSize, selectedColor, material])

  // Variante seleccionada (combinación exacta)
  const selectedVariant = useMemo(() => {
    if (!exactKey) return null
    const id = combination_index[exactKey]?.variant_id
    return variants.find(v => v.id === id) ?? null
  }, [exactKey, combination_index, variants])

  // Stock disponible
  const quantityAvailable = useMemo(() => {
    if (!exactKey) return 0
    return combination_index[exactKey]?.stock ?? 0
  }, [exactKey, combination_index])

  // Imágenes actuales: variante exacta si existe, sino primera variante del color seleccionado
  const currentImages = useMemo(() => {
    if (selectedVariant) return selectedVariant.images

    if (selectedColor) {
      const firstComboWithColor = entries.find(([key]) => {
        const parts = key.split(KEY_SEP)
        return parts[1] === selectedColor
      })
      if (firstComboWithColor) {
        const variantId = firstComboWithColor[1].variant_id
        return variants.find(v => v.id === variantId)?.images ?? variants[0].images
      }
    }

    return variants[0]?.images ?? []
  }, [selectedVariant, selectedColor, entries, variants])

  // Cuántas unidades de esta variante ya están en el carrito
  const cart = useCartStore(state => state.cart)
  const inCartQuantity = useMemo(() => {
    if (!selectedVariant) return 0
    return cart.find(item => item.id === selectedVariant.id)?.quantity ?? 0
  }, [cart, selectedVariant])

  // Stock restante que el usuario puede añadir
  const remainingStock = Math.max(0, quantityAvailable - inCartQuantity)

  // Helpers de UI
  const currentPrice = selectedVariant?.price ?? variants[0]?.price ?? 0
  const isComplete   = !!selectedVariant && remainingStock > 0

  // Reset cantidad al cambiar de variante
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
    setQuantitySelected,
  }
}
