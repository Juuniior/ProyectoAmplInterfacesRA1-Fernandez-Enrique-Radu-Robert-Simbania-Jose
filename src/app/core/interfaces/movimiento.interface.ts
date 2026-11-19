/** Representa un ingreso o un gasto registrado en ContaLite. */
export interface Movimiento {
  id: number;
  concepto: string;
  categoria: string;
  fecha: string;
  importe: number;
  tipo: 'Ingreso' | 'Gasto';
  /**
   * Si el movimiento es el cobro de una factura, id de esa factura.
   * Es lo que une Movimientos con Facturas: una factura está pagada
   * cuando existe un movimiento con su facturaId.
   */
  facturaId?: number;
  /** `true` si viene de los datos de ejemplo de la plantilla, no de la persona. */
  ejemplo?: boolean;
}
