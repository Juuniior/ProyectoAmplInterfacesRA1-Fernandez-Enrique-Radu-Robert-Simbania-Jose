# ContaLite

Aplicación web desarrollada con **Angular** para gestionar de forma sencilla los ingresos, gastos y facturas de un usuario. El proyecto se realiza para el módulo **Ampliación de Desarrollo de Interfaces (RA1)** del ciclo de Desarrollo de Aplicaciones Multiplataforma.

**Autores:** Enrique Fernández, Robert Radu y José Simbaña.

---

## 1. Objetivo de la aplicación

ContaLite permite llevar un control básico de la actividad económica desde una interfaz web. El usuario puede registrar ingresos y gastos, crear facturas, consultar su estado de cobro y visualizar resúmenes de su actividad.

La aplicación está organizada por páginas y componentes reutilizables. La navegación entre páginas se realiza mediante **Angular Router**.

## 2. Funcionalidades

### Inicio (`/home`)

- Muestra un resumen de ingresos, gastos y saldo.
- Presenta los movimientos recientes.
- Informa cuando se están utilizando datos de ejemplo.

### Movimientos (`/movimientos`)

- Permite registrar ingresos y gastos indicando concepto, categoría, fecha e importe.
- Muestra los movimientos ordenados por fecha.
- Permite filtrar por tipo de movimiento y eliminar registros.
- Identifica los ingresos que proceden del cobro de una factura.

### Facturas (`/facturas`)

- Permite crear facturas con una o varias líneas.
- Calcula la base imponible, el IVA y, cuando corresponde, la retención de IRPF.
- Asigna una numeración correlativa por año.
- Permite buscar y filtrar facturas por su estado.
- Al registrar el cobro de una factura, crea el ingreso correspondiente en Movimientos.

### Informes (`/informes`)

- Resume ingresos, gastos y saldo.
- Permite consultar la información por periodo: histórico, mes o año.
- Agrupa los movimientos por categoría y muestra su distribución.
- Presenta el estado y los importes de las facturas.

### Acceso y registro (`/login` y ventana emergente)

- Incluye formularios de inicio de sesión y creación de cuenta.
- Valida los datos introducidos.
- Permite navegar por toda la aplicación sin iniciar sesión en modo vista previa (con datos de demostración) y abre una ventana emergente (`ModalAcceso`) cuando el usuario intenta realizar una acción que requiere sesión.

## 3. Tecnologías utilizadas

- **Angular 22**: framework principal y organización de la aplicación mediante componentes.
- **TypeScript**: lógica, modelos, servicios y tipado de datos.
- **HTML**: plantillas de los componentes.
- **CSS**: estilos y adaptación de la interfaz.
- **Angular Router**: navegación entre páginas.
- **Formularios de Angular**: gestión y validación de formularios.
- **Signals de Angular**: gestión reactiva del estado en los servicios y componentes.
- **Vitest**: ejecución de las pruebas unitarias configuradas en el proyecto.
- **localStorage y sessionStorage**: persistencia local de los datos y de la sesión en el navegador.

## 4. Organización del proyecto

El código de la aplicación se encuentra principalmente en `src/app/` y está dividido en las siguientes carpetas:

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/          Autenticación, contrato del servicio y guard de rutas
│   │   ├── interfaces/    Interfaces y modelos de Movimiento y Factura
│   │   ├── services/      Servicios para gestionar movimientos y facturas
│   │   └── utils/         Funciones auxiliares y cálculos de facturas e informes
│   ├── features/
│   │   ├── home/          Página de inicio
│   │   ├── movimientos/   Gestión de ingresos y gastos
│   │   ├── facturas/      Creación y gestión de facturas
│   │   ├── informes/      Resúmenes e informes
│   │   └── login/         Inicio de sesión y registro
│   ├── shared/
│   │   └── components/    Componentes visuales reutilizables
│   ├── app.config.ts      Configuración principal de Angular
│   └── app.routes.ts      Definición de las rutas
├── public/                Recursos públicos
└── styles.css             Estilos globales
```

### Componentes presentacionales reutilizables

Los componentes presentacionales reciben información mediante propiedades de entrada (`@Input`) y, cuando necesitan comunicar una acción al componente que los contiene, emiten eventos (`@Output`). De esta forma, la presentación queda separada de la lógica de las páginas.

| Componente | Función | Entradas y eventos principales |
|---|---|---|
| `TarjetaResumen` | Muestra un indicador económico, como ingresos, gastos o saldo. | `titulo`, `importe`, `tipo`, `detalle` (`@Input`). |
| `BarraCategoria` | Representa visualmente el importe y porcentaje de una categoría. | `etiqueta`, `importe`, `porcentaje`, `tipo`, `activa` (`@Input`); `seleccionada` (`@Output`). |
| `SelectorPeriodo` | Permite elegir el periodo que se desea consultar. | `opciones`, `valor`, `etiqueta` (`@Input`); `valorCambiado` (`@Output`). |
| `BotonCta` | Botón reutilizable para acciones destacadas. | `texto`, `variante`, `deshabilitado` (`@Input`). |
| `ModalAcceso` | Ventana emergente para iniciar sesión o registrarse al pulsar acciones sin sesión. | `abierto`, `motivo`, `modoInicial` (`@Input`); `cerrado`, `sesionIniciada` (`@Output`). |
| `Header` | Cabecera y navegación principal de la aplicación. | Componente visual compartido. |
| `Footer` | Pie de página compartido. | Componente visual compartido. |

Los detalles de las propiedades, métodos, eventos, ejemplos de uso y pruebas se explican en la documentación específica de cada funcionalidad, enlazada en el apartado 8.

## 5. Requisitos previos

Para instalar y ejecutar el proyecto se necesita:

- **Node.js** en una versión compatible con Angular 22.
- **npm**, incluido con Node.js.
- Un navegador web actualizado.

Se recomienda comprobar las versiones instaladas con:

```bash
node -v
npm -v
```

> **Importante:** Angular 22 requiere una versión de Node.js compatible con sus requisitos oficiales. Si la instalación de dependencias muestra un error `EBADENGINE`, hay que actualizar Node.js a una versión admitida antes de continuar.

## 6. Instalación y ejecución

1. Descomprimir el proyecto y abrir una terminal en la carpeta raíz, donde se encuentra `package.json`.
2. Instalar las dependencias:

   ```bash
   npm install
   ```

   Si se desea instalar exactamente a partir del archivo de bloqueo de dependencias, también se puede utilizar `npm ci`.

3. Iniciar el servidor de desarrollo:

   ```bash
   npm start
   ```

   También se puede ejecutar `npx ng serve`.

4. Abrir en el navegador:

   ```text
   http://localhost:4200/
   ```

El servidor de desarrollo actualiza la aplicación cuando se modifican los archivos fuente.

## 7. Construcción y pruebas

### Construir la aplicación

Para generar la compilación de producción:

```bash
npm run build
```

Angular genera los archivos de salida en la carpeta `dist/`.

### Ejecutar las pruebas unitarias

Para ejecutar las pruebas configuradas con Vitest:

```bash
npm test
```

Las pruebas se encuentran junto a los componentes, servicios y utilidades, en archivos con extensión `.spec.ts`. Comprueban, entre otros aspectos, la creación de componentes, sus entradas y eventos, las validaciones de formularios, los cálculos y el comportamiento de los servicios.

## 8. Documentación complementaria

En la carpeta `docs/` se amplía la explicación del funcionamiento y uso de las principales partes de la aplicación:

- [Movimientos](docs/movimientos.md): registro, listado, filtros, eliminación y datos por usuario.
- [Facturas](docs/facturas.md): creación, validaciones, cálculos y relación entre facturas y movimientos.
- [Informes](docs/informes.md): periodos, resúmenes, agrupación por categorías y componentes presentacionales.
- [Login y registro](docs/login-registro.md): formularios, propiedades, eventos, servicio de autenticación, sesión y protección de rutas.

## 9. Almacenamiento y alcance de la autenticación

ContaLite es una aplicación de práctica que almacena información en el navegador. Los movimientos y las facturas se guardan localmente y se aíslan por cuenta. La sesión utiliza el almacenamiento de sesión del navegador.

El inicio de sesión y el registro se implementan mediante `AutenticacionLocal`. La contraseña no se almacena en texto plano: se guarda un hash derivado mediante PBKDF2-SHA256 con una sal aleatoria. No obstante, **esto no sustituye a un sistema de autenticación con servidor**. Al estar los datos en el navegador, esta implementación sirve para el alcance académico del proyecto, pero no debe considerarse una solución de seguridad para producción.

La primera vez que se utiliza una cuenta pueden aparecer registros de ejemplo para facilitar la prueba de las funcionalidades. Estos datos se identifican en la interfaz.

## 10. Rutas de la aplicación

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | Inicio de sesión y registro | Pública |
| `/home` | Inicio | Pública (vista previa sin sesión / datos propios con sesión) |
| `/movimientos` | Movimientos | Pública (vista previa; añadir o eliminar solicita sesión en ventana emergente) |
| `/facturas` | Facturas | Pública (vista previa; crear, cobrar o eliminar solicita sesión en ventana emergente) |
| `/informes` | Informes | Pública (vista previa sin sesión / datos propios con sesión) |

La ruta raíz (`/`) redirige a `/home`. Las rutas desconocidas también redirigen a Inicio.

---

**Proyecto académico — Ampliación de Desarrollo de Interfaces, RA1.**
