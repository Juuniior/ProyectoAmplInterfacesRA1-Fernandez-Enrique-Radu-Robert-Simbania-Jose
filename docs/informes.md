# Informes (`app-informes`)

Página `/informes` (protegida por `autenticadoGuard`). Resume el dinero del periodo elegido y el estado de
las facturas. **Solo lee** de `MovimientoService` y `FacturaService`: no modifica datos, y se recalcula sola
cuando cambian (todo está hecho con señales).

## Qué muestra

1. **Selector de periodo:** Todo, Este mes o Este año.
2. **Resumen:** ingresos, gastos y saldo del periodo.
3. **Gastos e ingresos por categoría:** barras de mayor a menor. Al pulsar una barra se abre debajo la lista
   de movimientos de esa categoría (más recientes primero); al pulsarla otra vez, se cierra.
4. **Estado de las facturas:** pendientes de cobro, vencidas y cobradas, con su número y su importe total
   (IVA e IRPF incluidos). Este bloque **no depende del periodo**: es la situación de cobro actual.

Si no hay movimientos en el periodo se muestra un aviso en lugar de las barras.

## Estructura

```
core/utils/calculos-informe.ts   Funciones puras: filtrarPorPeriodo, sumarPorTipo, agruparPorCategoria, resumirFacturas
core/utils/formato.ts            formatearEuros (1234,50 €)
features/informes/               Página (lógica y plantilla)
shared/components/
├── tarjeta-resumen/             Presentacional: título + importe + detalle
├── barra-categoria/             Presentacional: una barra del gráfico (botón)
└── selector-periodo/            Presentacional: grupo de botones para elegir una opción
```

La página decide qué mostrar; los tres componentes pequeños solo pintan lo que reciben y avisan con eventos.

## Componentes presentacionales

### `app-tarjeta-resumen`

| `@Input`  | Tipo                              | Por defecto | Descripción                                                   |
| --------- | --------------------------------- | ----------- | ------------------------------------------------------------- |
| `titulo`  | `string`                          | `''`        | Título de la tarjeta.                                         |
| `importe` | `number`                          | `0`         | Importe en euros.                                             |
| `tipo`    | `'ingreso' \| 'gasto' \| 'saldo'` | `'saldo'`   | Color e icono.                                                |
| `detalle` | `string`                          | `''`        | Texto pequeño bajo el importe (si está vacío, no se muestra). |

```html
<app-tarjeta-resumen titulo="Ingresos" tipo="ingreso" [importe]="3399.2" detalle="3 movimientos" />
```

### `app-barra-categoria`

| `@Input`     | Tipo                   | Por defecto | Descripción                                              |
| ------------ | ---------------------- | ----------- | -------------------------------------------------------- |
| `etiqueta`   | `string`               | `''`        | Nombre de la categoría.                                  |
| `importe`    | `number`               | `0`         | Importe en euros.                                        |
| `porcentaje` | `number`               | `0`         | Longitud de la barra (0-100; se recorta fuera de rango). |
| `tipo`       | `'ingreso' \| 'gasto'` | `'gasto'`   | Color de la barra.                                       |
| `activa`     | `boolean`              | `false`     | Resalta la fila (`aria-pressed`).                        |

| `@Output`      | Valor                  | Cuándo             |
| -------------- | ---------------------- | ------------------ |
| `seleccionada` | `string` (la etiqueta) | Al pulsar la fila. |

```html
<app-barra-categoria
  etiqueta="Vivienda"
  [importe]="650"
  [porcentaje]="88"
  [activa]="elegida === 'Vivienda'"
  (seleccionada)="elegida = $event"
/>
```

### `app-selector-periodo`

| `@Input`   | Tipo                                    | Por defecto | Descripción                   |
| ---------- | --------------------------------------- | ----------- | ----------------------------- |
| `opciones` | `{ valor: string; etiqueta: string }[]` | `[]`        | Botones disponibles.          |
| `valor`    | `string`                                | `''`        | `valor` de la opción elegida. |
| `etiqueta` | `string`                                | `'Periodo'` | Nombre accesible del grupo.   |

| `@Output`       | Valor    | Cuándo                                       |
| --------------- | -------- | -------------------------------------------- |
| `valorCambiado` | `string` | Al pulsar una opción distinta de la elegida. |

```html
<app-selector-periodo
  [opciones]="opciones"
  [valor]="periodo()"
  (valorCambiado)="cambiarPeriodo($event)"
/>
```

## Pruebas

| Archivo                               | Qué comprueba                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `core/utils/calculos-informe.spec.ts` | Filtro por periodo, sumas, agrupación y orden por categoría, porcentajes, estados de facturas (vencida frente a pendiente).              |
| `core/utils/formato.spec.ts`          | Formato de euros en español.                                                                                                             |
| `features/informes/informes.spec.ts`  | Totales, cambio de periodo, detalle de una categoría, periodo vacío, reacción a cambios de los servicios. La fecha se fija a 18/11/2026. |
| `shared/components/*/*.spec.ts`       | Valores por defecto, `@Input`, `@Output` y accesibilidad de cada componente.                                                             |
