import { Injectable, computed, inject, signal } from '@angular/core';
import { Factura, NuevaFactura } from '../interfaces/factura.interface';
import { siguienteNumero, totalFactura } from '../utils/calculos-factura';
import { MovimientoService } from './movimiento.service';

/** Lo que se guarda de cada factura: el estado y la fecha de pago se calculan. */
type FacturaGuardada = Omit<Factura, 'estado' | 'fechaPago'>;

/**
 * Gestiona las facturas y las conecta con Movimientos.
 *
 * Una factura está pagada si existe un movimiento con su `facturaId` (el cobro).
 * Así hay una sola fuente de verdad: si el cobro se borra en Movimientos,
 * la factura vuelve a estar pendiente sin tener que sincronizar nada.
 */
@Injectable({ providedIn: 'root' })
export class FacturaService {
  private readonly movimientoService = inject(MovimientoService);

  // Datos de ejemplo en memoria. La F-2026-001 está cobrada: su ingreso
  // (facturaId: 1) está en los datos de ejemplo de MovimientoService.
  private readonly listaFacturas = signal<FacturaGuardada[]>([
    {
      id: 1,
      numero: 'F-2026-001',
      cliente: 'Estudio Lumen S.L.',
      fechaEmision: '2026-10-05',
      fechaVencimiento: '2026-11-04',
      lineas: [
        { descripcion: 'Diseño de página web', cantidad: 1, precioUnitario: 1200 },
        { descripcion: 'Alojamiento web (1 año)', cantidad: 1, precioUnitario: 120 },
      ],
      tipoIva: 21,
      aplicaIrpf: true,
    },
    {
      id: 2,
      numero: 'F-2026-002',
      cliente: 'Panadería Robles',
      fechaEmision: '2026-10-20',
      fechaVencimiento: '2026-11-10',
      lineas: [{ descripcion: 'Mantenimiento mensual', cantidad: 2, precioUnitario: 90 }],
      tipoIva: 21,
      aplicaIrpf: false,
    },
    {
      id: 3,
      numero: 'F-2026-003',
      cliente: 'Clínica Dental Sonrisa',
      fechaEmision: '2026-11-03',
      fechaVencimiento: '2026-12-03',
      lineas: [
        { descripcion: 'Campaña en redes sociales', cantidad: 1, precioUnitario: 450 },
        { descripcion: 'Sesión de fotos', cantidad: 3, precioUnitario: 60 },
      ],
      tipoIva: 21,
      aplicaIrpf: true,
    },
    {
      id: 4,
      numero: 'F-2026-004',
      cliente: 'Asociación Vecinal Norte',
      fechaEmision: '2026-11-12',
      fechaVencimiento: '2026-12-12',
      lineas: [{ descripcion: 'Taller de formación', cantidad: 4, precioUnitario: 75 }],
      tipoIva: 10,
      aplicaIrpf: false,
    },
  ]);

  /**
   * Todas las facturas con su estado. Se recalcula sola cuando cambian las
   * facturas o los movimientos.
   */
  readonly facturas = computed<Factura[]>(() => {
    const cobros = new Map(
      this.movimientoService
        .movimientos()
        .filter((m) => m.facturaId !== undefined)
        .map((m) => [m.facturaId, m]),
    );
    return this.listaFacturas().map((factura) => {
      const cobro = cobros.get(factura.id);
      return cobro
        ? { ...factura, estado: 'Pagada', fechaPago: cobro.fecha }
        : { ...factura, estado: 'Pendiente' };
    });
  });

  /** Número que recibirá la próxima factura emitida en esa fecha. */
  siguienteNumero(fechaEmision: string): string {
    return siguienteNumero(this.listaFacturas(), fechaEmision);
  }

  /** Crea una factura pendiente con número correlativo y la devuelve. */
  crearFactura(datos: NuevaFactura): Factura {
    const lista = this.listaFacturas();
    const nueva: FacturaGuardada = {
      ...datos,
      lineas: datos.lineas.map((l) => ({ ...l })),
      id: lista.length > 0 ? Math.max(...lista.map((f) => f.id)) + 1 : 1,
      numero: siguienteNumero(lista, datos.fechaEmision),
    };
    this.listaFacturas.update((facturas) => [...facturas, nueva]);
    return { ...nueva, estado: 'Pendiente' };
  }

  /**
   * Registra el cobro de la factura como un Ingreso en Movimientos vinculado
   * a ella (facturaId). Con eso la factura pasa a "Pagada" y el saldo de Inicio
   * se actualiza. Devuelve la factura actualizada, o `null` si no existe o ya
   * estaba pagada.
   */
  marcarPagada(id: number, fechaPago: string): Factura | null {
    const factura = this.buscar(id);
    if (!factura || factura.estado === 'Pagada') {
      return null;
    }

    this.movimientoService.agregarMovimiento({
      concepto: `Cobro factura ${factura.numero} · ${factura.cliente}`,
      categoria: 'Trabajo',
      fecha: fechaPago,
      importe: totalFactura(factura),
      tipo: 'Ingreso',
      facturaId: factura.id,
    });

    return this.buscar(id);
  }

  /**
   * Elimina una factura pendiente. Las pagadas no se pueden eliminar porque
   * tienen un cobro en Movimientos (si se borra ese cobro, vuelven a pendiente).
   */
  eliminarFactura(id: number): boolean {
    const factura = this.buscar(id);
    if (!factura || factura.estado === 'Pagada') {
      return false;
    }
    this.listaFacturas.update((facturas) => facturas.filter((f) => f.id !== id));
    return true;
  }

  /** Número de la factura con ese id (lo usa Movimientos para mostrar el vínculo). */
  numeroDe(id: number): string | undefined {
    return this.listaFacturas().find((f) => f.id === id)?.numero;
  }

  private buscar(id: number): Factura | null {
    return this.facturas().find((f) => f.id === id) ?? null;
  }
}
