import {
  EstadoVisible,
  Factura,
  LineaFactura,
  RETENCION_IRPF,
  TotalesFactura,
} from '../interfaces/factura.interface';

/**
 * Funciones puras para los cálculos de las facturas. Al no depender de Angular
 * se pueden usar desde el servicio, desde el componente y desde los tests.
 */

/** Redondea a céntimos evitando errores como 0.1 + 0.2 = 0.30000000000000004. */
export function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/** Importe de una línea: cantidad × precio unitario. */
export function subtotalLinea(linea: Pick<LineaFactura, 'cantidad' | 'precioUnitario'>): number {
  return redondear((linea.cantidad || 0) * (linea.precioUnitario || 0));
}

/**
 * Calcula base imponible, IVA, retención de IRPF y total.
 * Total = base + IVA − IRPF.
 */
export function calcularTotales(
  lineas: Pick<LineaFactura, 'cantidad' | 'precioUnitario'>[],
  tipoIva: number,
  aplicaIrpf: boolean,
): TotalesFactura {
  const baseImponible = redondear(lineas.reduce((suma, l) => suma + subtotalLinea(l), 0));
  const cuotaIva = redondear((baseImponible * tipoIva) / 100);
  const retencionIrpf = aplicaIrpf ? redondear((baseImponible * RETENCION_IRPF) / 100) : 0;
  const total = redondear(baseImponible + cuotaIva - retencionIrpf);
  return { baseImponible, cuotaIva, retencionIrpf, total };
}

/** Atajo para obtener el total de una factura ya guardada. */
export function totalFactura(factura: Factura): number {
  return calcularTotales(factura.lineas, factura.tipoIva, factura.aplicaIrpf).total;
}

/** Una factura pendiente cuya fecha de vencimiento ya pasó se muestra como "Vencida". */
export function estadoVisible(factura: Factura, hoy: string): EstadoVisible {
  if (factura.estado === 'Pendiente' && factura.fechaVencimiento < hoy) {
    return 'Vencida';
  }
  return factura.estado;
}

/** Fecha en formato AAAA-MM-DD (hora local). */
export function aFechaIso(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Suma días a una fecha AAAA-MM-DD. */
export function sumarDias(fechaIso: string, dias: number): string {
  const [anio, mes, dia] = fechaIso.split('-').map(Number);
  return aFechaIso(new Date(anio, mes - 1, dia + dias));
}

/**
 * Siguiente número de factura para el año de `fechaEmision`.
 * La numeración es correlativa y empieza de nuevo cada año: F-2026-001, F-2026-002…
 */
export function siguienteNumero(facturas: Pick<Factura, 'numero'>[], fechaEmision: string): string {
  const anio = fechaEmision.slice(0, 4);
  const prefijo = `F-${anio}-`;
  const ultimo = facturas
    .filter((f) => f.numero.startsWith(prefijo))
    .map((f) => Number(f.numero.slice(prefijo.length)))
    .reduce((max, n) => Math.max(max, n), 0);
  return prefijo + String(ultimo + 1).padStart(3, '0');
}
