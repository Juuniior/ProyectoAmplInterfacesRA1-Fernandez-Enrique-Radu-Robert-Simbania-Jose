# Login y registro (`app-login`)

Pantalla de acceso con dos pestañas, **Iniciar sesión** y **Registrarse**, usada en la ruta `/login`.
Está hecha con formularios reactivos de Angular y no sabe dónde se guardan los usuarios: eso lo decide
un servicio que se inyecta.

## Estructura

```
src/app/
├── core/auth/
│   ├── autenticacion.model.ts     Tipos y contrato (DatosRegistro, UsuarioPublico, ServicioAutenticacion, ErrorAutenticacion)
│   ├── autenticacion-local.ts     Implementación en el navegador (localStorage + sessionStorage + hash PBKDF2)
│   └── autenticacion.token.ts     Token AUTENTICACION: decide qué implementación recibe la app
└── features/login/
    └── login.ts / .html / .css    Componente de página
```

El componente depende del **contrato** (`ServicioAutenticacion`), nunca de la clase concreta. Para pasar a
una API REST o a Firebase solo hay que crear otra clase que cumpla el contrato y cambiar la línea
`factory` de `autenticacion.token.ts`.

## Uso del componente

```html
<app-login
  modoInicial="registro"
  (sesionIniciada)="alEntrar($event)"
  (sesionCerrada)="alSalir()"
  (cuentaCreada)="alRegistrar($event)"
/>
```

En la aplicación se carga por ruta (`{ path: 'login', component: Login }`), por lo que normalmente no se
escribe la etiqueta a mano.

### Entradas (`@Input`)

| Nombre        | Tipo                    | Por defecto | Descripción                             |
| ------------- | ----------------------- | ----------- | --------------------------------------- |
| `modoInicial` | `'login' \| 'registro'` | `'login'`   | Pestaña con la que arranca la pantalla. |
| `enModal`     | `boolean`               | `false`     | Si es `true`, adapta el diseño a una ventana emergente y no redirige al iniciar sesión. |

### Salidas (`@Output`)

| Nombre           | Valor emitido    | Cuándo se emite                  |
| ---------------- | ---------------- | -------------------------------- |
| `sesionIniciada` | `UsuarioPublico` | Al iniciar sesión correctamente. |
| `sesionCerrada`  | —                | Al pulsar «Cerrar sesión».       |
| `cuentaCreada`   | `UsuarioPublico` | Al crear una cuenta nueva.       |

### Métodos públicos

| Método                                     | Descripción                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `cambiarModo(modo)`                        | Cambia de pestaña y limpia el error y el mensaje.                                                  |
| `registrar()`                              | Valida el registro y crea la cuenta. Si va bien, pasa a la pestaña de login con el correo relleno. |
| `iniciarSesion()`                          | Valida el login e inicia sesión.                                                                   |
| `cerrarSesion()`                           | Cierra la sesión y vuelve a la pestaña de login.                                                   |
| `invalido(campo)` / `loginInvalido(campo)` | Indican si un campo debe mostrarse con error (solo tras tocarlo).                                  |
| `noCoinciden(error, campo)`                | Indica si un par de campos de confirmación no coincide.                                            |

## Validaciones del registro

- Nombre: obligatorio, mínimo 3 caracteres.
- Correo: obligatorio y con formato válido; debe repetirse y coincidir (sin distinguir mayúsculas ni espacios).
- Fecha de nacimiento: obligatoria y no puede ser futura.
- Contraseña: obligatoria, mínimo 8 caracteres; debe repetirse y coincidir.

## Contrato del servicio de autenticación

```ts
interface ServicioAutenticacion {
  registrar(datos: DatosRegistro): Promise<UsuarioPublico>;
  iniciarSesion(email: string, password: string): Promise<UsuarioPublico>;
  cerrarSesion(): void;
  usuarioActual(): UsuarioPublico | null;
}
```

Los errores esperables se lanzan como `ErrorAutenticacion`, con un `codigo` y un mensaje listo para
mostrar en pantalla:

| Código                   | Significado                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `EMAIL_YA_REGISTRADO`    | Ya existe una cuenta con ese correo.                                  |
| `CREDENCIALES_INVALIDAS` | Correo o contraseña incorrectos (mismo mensaje para los dos casos).   |
| `ENTORNO_NO_SEGURO`      | El navegador no ofrece Web Crypto (hay que usar `localhost` o HTTPS). |

## Seguridad: qué hace y qué no

`AutenticacionLocal` **nunca guarda la contraseña**: guarda su hash PBKDF2-SHA256 (100 000 iteraciones)
con una sal aleatoria distinta para cada usuario. Aun así es una implementación **de práctica**: los datos
viven en el navegador y cualquiera con las herramientas de desarrollo (F12) puede ver el hash, copiarlo o
editar los usuarios. Proteger de verdad un login exige un servidor.

La sesión se guarda en `sessionStorage` y se lee después del primer renderizado (`afterNextRender`) para
que el HTML del servidor (SSR) y el del navegador coincidan.

## Pruebas

```bash
npm test          # ng test (Vitest)
```

| Archivo                                 | Qué comprueba                                                                                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/login/login.spec.ts`          | Estado inicial, entradas y salidas, cambio de pestaña, cada validación, registro y login con éxito y con error, cierre de sesión, recuperación de la sesión. Usa un servicio de autenticación falso. |
| `core/auth/autenticacion-local.spec.ts` | Registro, hash con sal (la contraseña no se guarda), normalización del correo, correo duplicado, login correcto e incorrecto, cierre de sesión, datos corruptos, entorno sin Web Crypto.             |
| `core/auth/autenticacion.token.spec.ts` | Implementación por defecto y sustitución del servicio.                                                                                                                                               |

## Navegación sin sesión (modo vista previa) y ventana emergente (`ModalAcceso`)

Todas las páginas (`/home`, `/movimientos`, `/facturas` e `/informes`) son accesibles sin necesidad de iniciar sesión, mostrando los datos de demostración de `demo@contalite.local` (sin avisos ni etiquetas amarillas de ejemplo mientras no se haya iniciado sesión).

Cuando un usuario sin sesión pulsa un botón que modifica datos (añadir o eliminar un movimiento, crear, cobrar o eliminar una factura), `AccesoModalService` abre la ventana emergente `<app-modal-acceso>`, que incrusta `<app-login [enModal]="true">` para que pueda iniciar sesión o registrarse sin perder la página en la que estaba.

Además, se incluye el *guard* funcional `src/app/core/auth/autenticado.guard.ts` por si se desea exigir sesión antes de entrar a una ruta concreta.

```ts
// app.routes.ts
{ path: 'informes', component: Informes, canActivate: [autenticadoGuard] }
```

| Situación | Resultado |
|---|---|
| Hay sesión | Se abre la página. |
| No hay sesión | Redirige a `/login?returnUrl=<página pedida>`. |
| Se inicia sesión en `/login` | `Login` navega a `returnUrl`, o a `/home` si no hay. |

- `returnUrl` llega a `Login` como `@Input` gracias a `withComponentInputBinding()` (en `app.config.ts`).
  Solo se acepta si es una ruta interna (empieza por `/` y no por `//` ni `/\`); si no, se ignora.
- La sesión está en `sessionStorage`, que no existe en el servidor. Por eso en `app.routes.server.ts` solo
  `/login` se prerenderiza y el resto de rutas usan `RenderMode.Client`: el navegador ejecuta el guard.
- Es una protección de interfaz, no de seguridad: los datos de ContaLite viven en el navegador.
- Para proteger una página nueva basta con añadir `canActivate: [autenticadoGuard]` a su ruta.

Pruebas: `core/auth/autenticado.guard.spec.ts` (el guard solo) y `app.routes.spec.ts` (cada página con y
sin sesión, y la vuelta a la página pedida tras iniciar sesión).
