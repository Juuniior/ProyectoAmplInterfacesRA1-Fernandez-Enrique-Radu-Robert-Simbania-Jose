/**
 * Estado de cobro. No se guarda: una factura está "Pagada" cuando existe en
 * Movimientos un ingreso con su `facturaId` (ver FacturaService).
 */
export type EstadoFactura = 'Pendiente' | 'Pagada';

/**
 * Estado que se muestra en pantalla. "Vencida" no se guarda: se calcula
 * a partir de la fecha de vencimiento (ver `estadoVisible`).
 */
export type EstadoVisible = EstadoFactura | 'Vencida';

/** Tipos de IVA vigentes en España: general, reducido y superreducido. */
export type TipoIva = 21 | 10 | 4;

/** Retención de IRPF habitual en facturas de profesionales autónomos. */
export const RETENCION_IRPF = 15;

/** Una línea de concepto dentro de una factura. */
export interface LineaFactura {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
}

/** Factura emitida a un cliente. */
export interface Factura {
  id: number;
  /** Número correlativo por año, por ejemplo `F-2026-001`. */
  numero: string;
  cliente: string;
  /** Formato AAAA-MM-DD. */
  fechaEmision: string;
  /** Formato AAAA-MM-DD. */
  fechaVencimiento: string;
  lineas: LineaFactura[];
  tipoIva: TipoIva;
  /** Si se aplica la retención de IRPF (`RETENCION_IRPF`). */
  aplicaIrpf: boolean;
  estado: EstadoFactura;
  /** Fecha del movimiento de cobro (AAAA-MM-DD). Solo existe cuando está pagada. */
  fechaPago?: string;
}

/** Datos que hacen falta para crear una factura (el resto lo pone el servicio). */
export type NuevaFactura = Omit<Factura, 'id' | 'numero' | 'estado' | 'fechaPago'>;

/** Importes calculados de una factura. */
export interface TotalesFactura {
  baseImponible: number;
  cuotaIva: number;
  retencionIrpf: number;
  total: number;
}
