import { Component, LOCALE_ID, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Movimiento } from '../../core/interfaces/movimiento.interface';
import { MovimientoService } from '../../core/services/movimiento.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  private readonly movimientoService = inject(MovimientoService);

  // La señal permite que Home se actualice al cambiar los movimientos.
  get movimientos(): Movimiento[] {
    return this.movimientoService.movimientos();
  }

  // Calcula el total de ingresos.
  get totalIngresos(): number {
    return this.movimientos
      .filter(movimiento => movimiento.tipo === 'Ingreso')
      .reduce((total, movimiento) => total + movimiento.importe, 0);
  }

  // Calcula el total de gastos.
  get totalGastos(): number {
    return this.movimientos
      .filter(movimiento => movimiento.tipo === 'Gasto')
      .reduce((total, movimiento) => total + movimiento.importe, 0);
  }

  // Calcula el saldo actual.
  get saldoActual(): number {
    return this.totalIngresos - this.totalGastos;
  }

  // Devuelve los movimientos ordenados por fecha, del más reciente al más antiguo.
  get ultimosMovimientos(): Movimiento[] {
    return [...this.movimientos].sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }
}
