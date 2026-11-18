# Facturas (`app-facturas`)

Página de la ruta `/facturas` para emitir facturas, controlar los cobros y registrarlos.

## Estructura

```
src/app/
├── core/
│   ├── interfaces/factura.interface.ts  Factura, LineaFactura, estados, tipos de IVA, TotalesFactura
│   ├── services/factura.service.ts      Lista de facturas (signal), crear, marcar como pagada, eliminar
│   └── utils/calculos-factura.ts        Funciones puras: totales, IVA/IRPF, estado vencido, numeración
└── features/facturas/
    └── facturas.ts / .html / .css       Componente de página
```

## Qué hace

- **Resumen**: facturado este mes, pendiente de cobro y facturas vencidas (número e importe).
- **Listado** ordenado de la más reciente a la más antigua, con filtro por estado y búsqueda por cliente o número.
- **Estados**: *Pagada* o *Pendiente* se calculan a partir de Movimientos (ver abajo); *Vencida* es una
  pendiente cuyo vencimiento ya pasó.
- **Nueva factura** con formularios reactivos y un `FormArray` de líneas (descripción, cantidad, precio).
  Siempre queda al menos una línea.
- **Cálculo en directo** de base imponible, IVA (21, 10 o 4 %), retención de IRPF opcional (15 %) y total.
  Total = base + IVA − IRPF. Los importes se redondean a céntimos.
- **Numeración automática** correlativa por año: `F-2026-001`, `F-2026-002`… Se reinicia cada año.
- **Marcar como pagada**: añade en Movimientos un *Ingreso* vinculado a la factura (`facturaId`), así que
  aparece en Movimientos y el saldo de Inicio se actualiza.
- **Eliminar**: solo facturas pendientes; las pagadas tienen su cobro en Movimientos.

## Conexión con Movimientos

La factura **no guarda si está pagada**. `FacturaService` lo calcula: una factura está pagada si en
`MovimientoService` existe un movimiento con su `facturaId`, y la fecha de pago es la de ese movimiento.

- Cobrar una factura crea ese movimiento.
- En Movimientos, los cobros llevan una etiqueta «Factura F-…» que enlaza a Facturas.
- Si se borra un cobro en Movimientos, la factura vuelve sola a pendiente (o vencida) y se avisa en pantalla.

Al haber una sola fuente de verdad, las dos páginas no se pueden desincronizar.

## Validaciones

- Cliente: obligatorio, mínimo 2 caracteres.
- Fechas de emisión y vencimiento obligatorias; el vencimiento no puede ser anterior a la emisión.
- Cada línea: descripción obligatoria, cantidad ≥ 1 y precio > 0.

## Pruebas

| Archivo                                  | Qué comprueba                                                                 |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| `core/utils/calculos-factura.spec.ts`    | Redondeo, subtotales, IVA, IRPF, estado vencido, numeración y fechas.         |
| `core/services/factura.service.spec.ts`  | Crear, numerar, cobrar (crea el ingreso vinculado), estado según Movimientos, borrar el cobro, eliminar. |
| `features/facturas/facturas.spec.ts`     | Listado, resumen, filtros, búsqueda, líneas, totales, validaciones y acciones. Fija la fecha con `vi.setSystemTime`. |
