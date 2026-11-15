/**
 * Modelo y contrato de la autenticación de la aplicación.
 *
 * Aquí solo hay tipos: qué datos se manejan, qué operaciones ofrece cualquier
 * sistema de autenticación y qué errores puede lanzar. Es lo único que conoce
 * el componente Login, así que no cambia aunque cambie el almacenamiento.
 */

/** Datos que introduce la persona en el formulario de registro (sin los campos de confirmación). */
export interface DatosRegistro {
  nombre: string;
  email: string;
  /** Formato AAAA-MM-DD. */
  fechaNacimiento: string;
  password: string;
}

/** Datos del usuario que la aplicación puede mostrar. Nunca incluye la contraseña ni su hash. */
export interface UsuarioPublico {
  nombre: string;
  email: string;
  fechaNacimiento: string;
}

/**
 * Contrato que debe cumplir cualquier sistema de autenticación.
 * Es asíncrono (Promise) para que valga igual con localStorage, una API REST o Firebase.
 * Los componentes dependen de este contrato, nunca de una implementación concreta.
 */
export interface ServicioAutenticacion {
  /** Crea una cuenta nueva. Lanza `ErrorAutenticacion` si el correo ya existe. */
  registrar(datos: DatosRegistro): Promise<UsuarioPublico>;
  /** Inicia sesión. Lanza `ErrorAutenticacion` si las credenciales no son válidas. */
  iniciarSesion(email: string, password: string): Promise<UsuarioPublico>;
  /** Cierra la sesión actual. */
  cerrarSesion(): void;
  /** Devuelve el usuario con sesión iniciada, o `null` si no hay ninguno. */
  usuarioActual(): UsuarioPublico | null;
}

export type CodigoErrorAutenticacion =
  'EMAIL_YA_REGISTRADO' | 'CREDENCIALES_INVALIDAS' | 'ENTORNO_NO_SEGURO';

/** Error con un mensaje pensado para mostrarse en pantalla. */
export class ErrorAutenticacion extends Error {
  constructor(
    readonly codigo: CodigoErrorAutenticacion,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorAutenticacion';
  }
}
