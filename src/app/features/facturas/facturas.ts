import { Component, LOCALE_ID, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  EstadoVisible,
  Factura,
  RETENCION_IRPF,
  TipoIva,
  TotalesFactura,
} from '../../core/interfaces/factura.interface';
import { FacturaService } from '../../core/services/factura.service';
import { formatearEuros } from '../../core/utils/formato';
import {
  aFechaIso,
  calcularTotales,
  estadoVisible,
  subtotalLinea,
  sumarDias,
  totalFactura,
} from '../../core/utils/calculos-factura';

registerLocaleData(localeEs);

export type FiltroEstado = 'Todas' | EstadoVisible;

/** Días de plazo de pago que se proponen por defecto. */
const PLAZO_PAGO_DIAS = 30;

/** La fecha de vencimiento no puede ser anterior a la de emisión. */
function vencimientoPosterior(grupo: AbstractControl): ValidationErrors | null {
  const emision: string = grupo.get('fechaEmision')?.value;
  const vencimiento: string = grupo.get('fechaVencimiento')?.value;
  if (!emision || !vencimiento) {
    return null;
  }
  return vencimiento < emision ? { vencimientoAnterior: true } : null;
}

/** Fila de la tabla: la factura con los datos calculados que se muestran. */
interface FilaFactura {
  factura: Factura;
  estado: EstadoVisible;
  total: number;
}

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, DecimalPipe, RouterLink],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {
  private readonly facturaService = inject(FacturaService);
  private readonly fb = inject(FormBuilder);

  readonly tiposIva: TipoIva[] = [21, 10, 4];
  readonly retencionIrpf = RETENCION_IRPF;
  readonly filtros: FiltroEstado[] = ['Todas', 'Pendiente', 'Vencida', 'Pagada'];

  // ---------- Listado ----------

  readonly filtro = signal<FiltroEstado>('Todas');
  readonly busqueda = signal('');
  /** Mensaje de confirmación tras crear o cobrar una factura. */
  readonly aviso = signal<{ texto: string; enlaceMovimientos: boolean } | null>(null);

  /** Todas las facturas con su estado visible y su total, de la más reciente a la más antigua. */
  private readonly filas = computed<FilaFactura[]>(() => {
    const hoy = this.hoy();
    return this.facturaService
      .facturas()
      .map((factura) => ({
        factura,
        estado: estadoVisible(factura, hoy),
        total: totalFactura(factura),
      }))
      .sort((a, b) =>
        b.factura.fechaEmision.localeCompare(a.factura.fechaEmision) ||
        b.factura.numero.localeCompare(a.factura.numero),
      );
  });

  /** Filas que pasan el filtro de estado y la búsqueda por cliente o número. */
  readonly facturasFiltradas = computed(() => {
    const filtro = this.filtro();
    const texto = this.busqueda().trim().toLowerCase();
    return this.filas().filter(
      (fila) =>
        (filtro === 'Todas' || fila.estado === filtro) &&
        (!texto ||
          fila.factura.cliente.toLowerCase().includes(texto) ||
          fila.factura.numero.toLowerCase().includes(texto)),
    );
  });

  /** Datos de las tarjetas de resumen. */
  readonly resumen = computed(() => {
    const mesActual = this.hoy().slice(0, 7);
    const filas = this.filas();
    const suma = (lista: FilaFactura[]) => lista.reduce((t, f) => t + f.total, 0);
    const vencidas = filas.filter((f) => f.estado === 'Vencida');
    return {
      facturadoMes: suma(filas.filter((f) => f.factura.fechaEmision.startsWith(mesActual))),
      pendienteCobro: suma(filas.filter((f) => f.factura.estado === 'Pendiente')),
      vencidasCantidad: vencidas.length,
      vencidasImporte: suma(vencidas),
    };
  });

  /** Cuántas facturas hay en cada estado (para los botones de filtro). */
  readonly conteo = computed(() => {
    const conteo: Record<FiltroEstado, number> = { Todas: 0, Pendiente: 0, Vencida: 0, Pagada: 0 };
    for (const fila of this.filas()) {
      conteo.Todas++;
      conteo[fila.estado]++;
    }
    return conteo;
  });

  // ---------- Formulario de nueva factura ----------

  readonly formulario = this.fb.nonNullable.group(
    {
      cliente: ['', [Validators.required, Validators.minLength(2)]],
      fechaEmision: [this.hoy(), Validators.required],
      fechaVencimiento: [sumarDias(this.hoy(), PLAZO_PAGO_DIAS), Validators.required],
      tipoIva: this.fb.nonNullable.control<TipoIva>(21),
      aplicaIrpf: [false],
      lineas: this.fb.array([this.crearLinea()]),
    },
    { validators: vencimientoPosterior },
  );

  get lineas(): FormArray {
    return this.formulario.controls.lineas;
  }

  /** Número que tendrá la factura, según el año de la fecha de emisión. */
  get numeroPrevisto(): string {
    const fecha = this.formulario.controls.fechaEmision.value || this.hoy();
    return this.facturaService.siguienteNumero(fecha);
  }

  /** Totales recalculados en directo mientras se rellena el formulario. */
  get totales(): TotalesFactura {
    const { lineas, tipoIva, aplicaIrpf } = this.formulario.getRawValue();
    return calcularTotales(this.normalizarLineas(lineas), Number(tipoIva), aplicaIrpf);
  }

  subtotal(indice: number): number {
    const { cantidad, precioUnitario } = this.lineas.at(indice).getRawValue();
    return subtotalLinea({ cantidad: Number(cantidad), precioUnitario: Number(precioUnitario) });
  }

  agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  /** Quita una línea. Siempre debe quedar al menos una. */
  quitarLinea(indice: number): void {
    if (this.lineas.length > 1) {
      this.lineas.removeAt(indice);
    }
  }

  /** ¿Hay que mostrar el error de este campo? (solo tras tocarlo) */
  campoInvalido(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }

  crearFactura(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = this.formulario.getRawValue();
    const factura = this.facturaService.crearFactura({
      cliente: datos.cliente.trim(),
      fechaEmision: datos.fechaEmision,
      fechaVencimiento: datos.fechaVencimiento,
      tipoIva: Number(datos.tipoIva) as TipoIva,
      aplicaIrpf: datos.aplicaIrpf,
      lineas: this.normalizarLineas(datos.lineas).map((l) => ({
        ...l,
        descripcion: l.descripcion.trim(),
      })),
    });

    this.reiniciarFormulario();
    this.filtro.set('Todas');
    this.busqueda.set('');
    this.aviso.set({ texto: `Factura ${factura.numero} creada para ${factura.cliente}.`, enlaceMovimientos: false });
  }

  marcarPagada(factura: Factura): void {
    const pagada = this.facturaService.marcarPagada(factura.id, this.hoy());
    if (!pagada) {
      return;
    }
    const importe = formatearEuros(totalFactura(pagada));
    this.aviso.set({
      texto: `${pagada.numero} marcada como pagada. Se ha añadido un ingreso de ${importe} en`,
      enlaceMovimientos: true,
    });
  }

  eliminar(factura: Factura): void {
    if (this.facturaService.eliminarFactura(factura.id)) {
      this.aviso.set({ texto: `Factura ${factura.numero} eliminada.`, enlaceMovimientos: false });
    }
  }

  /** Fecha de hoy (AAAA-MM-DD). Es un método para poder simular la fecha en los tests. */
  protected hoy(): string {
    return aFechaIso(new Date());
  }

  private crearLinea() {
    return this.fb.group({
      descripcion: this.fb.nonNullable.control('', Validators.required),
      cantidad: this.fb.control<number | null>(1, [Validators.required, Validators.min(1)]),
      precioUnitario: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01)]),
    });
  }

  private normalizarLineas(
    lineas: { descripcion: string; cantidad: number | null; precioUnitario: number | null }[],
  ) {
    return lineas.map((l) => ({
      descripcion: l.descripcion,
      cantidad: Number(l.cantidad) || 0,
      precioUnitario: Number(l.precioUnitario) || 0,
    }));
  }

  private reiniciarFormulario(): void {
    this.formulario.reset({
      cliente: '',
      fechaEmision: this.hoy(),
      fechaVencimiento: sumarDias(this.hoy(), PLAZO_PAGO_DIAS),
      tipoIva: 21,
      aplicaIrpf: false,
    });
    // Después del reset: se deja una única línea nueva con sus valores por defecto.
    this.lineas.clear();
    this.lineas.push(this.crearLinea());
  }
}
