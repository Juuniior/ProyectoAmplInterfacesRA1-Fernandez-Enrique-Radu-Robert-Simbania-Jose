/** Representa un ingreso o un gasto registrado en ContaLite. */
export interface Movimiento {
  id: number;
  concepto: string;
  categoria: string;
  fecha: string;
  importe: number;
  tipo: 'Ingreso' | 'Gasto';
}
