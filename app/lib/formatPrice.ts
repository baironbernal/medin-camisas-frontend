/**
 * Format the prices to Pesos Colombianos (COP)
 * @param amount - The numeric value (ej: 50000)
 * @returns String formatted (ej: "$ 50.000")
 */
export const formatCOP = (amount: number): string => {
  if (isNaN(amount)) return '$ 0';

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Colombian pesos do not use cents
    maximumFractionDigits: 0,
  }).format(amount);
};