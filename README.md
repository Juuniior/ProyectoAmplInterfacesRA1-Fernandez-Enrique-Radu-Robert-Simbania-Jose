# ContaLite

Aplicación Angular para registrar ingresos y gastos (Proyecto Ampliación de Interfaces · RA1).

**Autores:** Enrique Fernández, Robert Radu y José Simbaña.

## Estructura

```
src/app/
├── core/
│   ├── auth/          Autenticación (contrato, implementación local, token y guard de rutas)
│   ├── interfaces/    Modelos de datos (Movimiento, Factura)
│   ├── services/      Servicios compartidos (MovimientoService, FacturaService)
│   └── utils/         Cálculos de facturas (funciones puras)
├── features/          Páginas: home, movimientos, facturas, informes, login
└── shared/components/ Componentes reutilizables: header, footer, boton-cta, tarjeta-resumen, barra-categoria, selector-periodo
```

Más detalle en [`docs/login-registro.md`](docs/login-registro.md) (login, registro y protección de rutas), [`docs/facturas.md`](docs/facturas.md) y [`docs/informes.md`](docs/informes.md).

Todas las páginas menos `/login` exigen iniciar sesión.

## Angular CLI

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
