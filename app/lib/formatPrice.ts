/**
 * Format the prices to Pesos Colombianos (COP)
 * @param value - The numeric value or string (ej: 50000 or "50000")
 * @returns String formatted (ej: "$ 50.000")
 */
export const formatCOP = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '$ 0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};