# Movimientos (`app-movimientos`)

Página de la ruta `/movimientos` para registrar ingresos y gastos, verlos y borrarlos.

## Estructura

```
src/app/
├── core/
│   ├── interfaces/movimiento.interface.ts   Movimiento (concepto, categoría, fecha, importe, tipo, facturaId)
│   ├── services/movimiento.service.ts       Lista por usuario (signal + localStorage)
│   └── services/factura.service.ts          Solo para el vínculo facturaId → número de factura
└── features/movimientos/
    └── movimientos.ts / .html / .css        Componente de página
```

## Qué hace

- **Añadir movimiento**: formulario con concepto, categoría, fecha, importe y tipo (Ingreso/Gasto).
  Solo guarda si el importe es un número mayor que 0 y el concepto no está vacío.
- **Listado** ordenado del más reciente al más antiguo, con filtro por tipo (Todos / Ingreso / Gasto).
- **Eliminar**: borra el movimiento. Si era el cobro de una factura, esa factura vuelve a estar
  pendiente (el vínculo lo resuelve `FacturaService`) y se avisa en pantalla.
- Un movimiento puede venir de una factura cobrada: aparece con una etiqueta «Factura F-…»
  que enlaza a Facturas.

## Datos por usuario

Cada cuenta guarda **sus propios movimientos** en `localStorage` bajo la clave
`app.movimientos.<correo>`. Al iniciar sesión, el servicio carga solo lo de esa persona;
al cerrarla, deja de mostrar esos datos. Dos usuarios no comparten los movimientos:
lo que añade o borra uno no afecta al otro.

- La primera vez que entra un usuario nuevo, recibe una copia de los movimientos y facturas
  de ejemplo; en pantalla se marcan con la etiqueta **«Ejemplo»** y con un aviso en Inicio,
  para que no se confundan con datos reales. Puede borrarlos o modificarlos.
- Al no haber sesión (por ejemplo, en los tests), se usa un usuario ficticio `demo@contalite.local`.

## Pruebas

| Archivo                                                     | Qué comprueba                                                                              |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `core/services/movimiento.service.spec.ts`                  | Datos iniciales, añadir con id único y eliminar.                                           |
| `core/services/aislamiento-usuarios.spec.ts`                | Que cada usuario ve solo sus movimientos y facturas, y que persisten tras cerrar la sesión. |
| `features/movimientos/movimientos.spec.ts`                  | Formulario, filtros, orden, vínculo con facturas y aviso al borrar un cobro.                |
