const FORMATO_EUROS = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

/** Da formato de euros en español: `1234.5` -> `1234,50 €`. */
export function formatearEuros(importe: number): string {
  return FORMATO_EUROS.format(importe);
}
