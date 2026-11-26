import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import localeEs from '@angular/common/locales/es';
import { Movimiento } from '../../core/interfaces/movimiento.interface';
import { MovimientoService } from '../../core/services/movimiento.service';
import { FacturaService } from '../../core/services/factura.service';
import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import { AccesoModalService } from '../../core/auth/acceso-modal.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css'
})
export class Movimientos {
  private readonly movimientoService = inject(MovimientoService);
  private readonly facturaService = inject(FacturaService);
  private readonly auth = inject(AUTENTICACION);
  private readonly modalAcceso = inject(AccesoModalService);

  // ¿Hay un usuario con sesión iniciada?
  get sesionIniciada(): boolean {
    return this.auth.sesion() !== null;
  }

  // Aviso que se muestra al borrar el cobro de una factura.
  aviso: string | null = null;

  // Lista compartida con Home.
  get movimientos(): Movimiento[] {
    return this.movimientoService.movimientos();
  }

  // Datos del formulario.
  nuevoConcepto = '';
  nuevaCategoria = 'Otros';
  nuevaFecha = this.obtenerFechaActual();
  nuevoImporte: number | null = null;
  nuevoTipo: 'Ingreso' | 'Gasto' = 'Gasto';

  // Filtro seleccionado.
  filtroTipo = 'Todos';

  /** Devuelve la fecha actual en formato YYYY-MM-DD para el input date. */
  private obtenerFechaActual(): string {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
  }

  // Devuelve los movimientos filtrados y ordenados por fecha.
  get movimientosFiltrados(): Movimiento[] {
    return [...this.movimientos]
      .filter(movimiento =>
        this.filtroTipo === 'Todos' || movimiento.tipo === this.filtroTipo
      )
      .sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
  }

  // Calcula el número total de movimientos.
  get cantidadMovimientos(): number {
    return this.movimientos.length;
  }

  // Valida los datos y añade un movimiento al servicio compartido.
  agregarMovimiento(): void {
    if (!this.sesionIniciada) {
      this.modalAcceso.solicitar('Inicia sesión o regístrate para añadir tus propios movimientos.');
      return;
    }

    const concepto = this.nuevoConcepto.trim();
    const importe = Number(this.nuevoImporte);

    if (!concepto || !this.nuevaFecha || !Number.isFinite(importe) || importe <= 0) {
      return;
    }

    this.movimientoService.agregarMovimiento({
      concepto,
      categoria: this.nuevaCategoria,
      fecha: this.nuevaFecha,
      importe,
      tipo: this.nuevoTipo
    });

    // Limpiamos el formulario después de guardar.
    this.nuevoConcepto = '';
    this.nuevaCategoria = 'Otros';
    this.nuevaFecha = this.obtenerFechaActual();
    this.nuevoImporte = null;
    this.nuevoTipo = 'Gasto';
    this.filtroTipo = 'Todos';
  }

  // Número de la factura a la que corresponde el movimiento (si es un cobro).
  numeroFactura(movimiento: Movimiento): string | undefined {
    return movimiento.facturaId !== undefined
      ? this.facturaService.numeroDe(movimiento.facturaId)
      : undefined;
  }

  // Elimina un movimiento por su identificador. Si era el cobro de una factura,
  // esa factura vuelve a estar pendiente (FacturaService lo calcula solo).
  eliminarMovimiento(id: number): void {
    if (!this.sesionIniciada) {
      this.modalAcceso.solicitar('Inicia sesión o regístrate para gestionar y eliminar movimientos.');
      return;
    }

    const movimiento = this.movimientos.find(m => m.id === id);
    const numero = movimiento ? this.numeroFactura(movimiento) : undefined;

    this.movimientoService.eliminarMovimiento(id);

    this.aviso = numero
      ? `Has eliminado el cobro de la factura ${numero}, que vuelve a estar pendiente de cobro.`
      : null;
  }
}
