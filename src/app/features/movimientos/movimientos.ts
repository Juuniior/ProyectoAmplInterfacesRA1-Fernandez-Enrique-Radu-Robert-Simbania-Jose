import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';
import { Movimiento } from '../../core/interfaces/movimiento.interface';
import { MovimientoService } from '../../core/services/movimiento.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './movimientos.html',
  styleUrl: './movimientos.css'
})
export class Movimientos {
  private readonly movimientoService = inject(MovimientoService);

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

  // Elimina un movimiento por su identificador.
  eliminarMovimiento(id: number): void {
    this.movimientoService.eliminarMovimiento(id);
  }
}
