import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioPublico, ErrorAutenticacion } from '../../core/auth/autenticacion.model';
import { AUTENTICACION } from '../../core/auth/autenticacion.token';

export type ModoAcceso = 'login' | 'registro';

/** Comprueba que dos campos tienen el mismo valor. Devuelve `{ [error]: true }` si no coinciden. */
function camposIguales(
  campo: string,
  confirmacion: string,
  error: string,
  normalizar: (v: string) => string = (v) => v,
): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value ?? '';
    const b = grupo.get(confirmacion)?.value ?? '';
    if (!a || !b) {
      return null;
    }
    return normalizar(a) === normalizar(b) ? null : { [error]: true };
  };
}

/** La fecha (AAAA-MM-DD) no puede ser posterior a hoy. */
function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  const valor: string = control.value;
  if (!valor) {
    return null;
  }
  const hoy = new Date();
  const hoyTexto = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, '0'),
    String(hoy.getDate()).padStart(2, '0'),
  ].join('-');
  return valor > hoyTexto ? { fechaFutura: true } : null;
}

const normalizarEmail = (v: string) => v.trim().toLowerCase();

/** Pantalla de acceso con pestañas de inicio de sesión y registro. */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly auth = inject(AUTENTICACION);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  /** Pestaña con la que arranca la pantalla. */
  @Input() modoInicial: ModoAcceso = 'login';

  /**
   * Página a la que volver tras iniciar sesión. La rellena el router con `?returnUrl=...`
   * cuando `autenticadoGuard` redirige aquí. Si no hay (o no es una ruta interna), se va a Inicio.
   */
  @Input() returnUrl?: string;

  @Output() sesionIniciada = new EventEmitter<UsuarioPublico>();
  @Output() sesionCerrada = new EventEmitter<void>();
  @Output() cuentaCreada = new EventEmitter<UsuarioPublico>();

  readonly modo = signal<ModoAcceso>('login');
  readonly usuario = signal<UsuarioPublico | null>(null);
  readonly error = signal<string | null>(null);
  readonly mensaje = signal<string | null>(null);
  readonly enviando = signal(false);

  readonly formLogin = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly formRegistro = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      confirmarEmail: ['', Validators.required],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', Validators.required],
    },
    {
      validators: [
        camposIguales('email', 'confirmarEmail', 'emailsDistintos', normalizarEmail),
        camposIguales('password', 'confirmarPassword', 'passwordsDistintas'),
      ],
    },
  );

  constructor() {
    // La sesión vive en sessionStorage: se lee solo en el navegador, tras el primer
    // renderizado, para que el HTML del servidor (SSR) y el del cliente coincidan.
    afterNextRender(() => this.usuario.set(this.auth.usuarioActual()));
  }

  ngOnInit(): void {
    // Por defecto se muestra "Iniciar sesión". El `?? 'login'` asegura que un
    // valor indefinido (p. ej. durante el renderizado del servidor, donde el
    // @Input puede no aplicarse) deja siempre la pestaña de login seleccionada
    // y su formulario visible, en lugar de ninguna pestaña marcada.
    this.modo.set(this.modoInicial ?? 'login');
  }

  cambiarModo(modo: ModoAcceso): void {
    this.modo.set(modo);
    this.error.set(null);
    this.mensaje.set(null);
  }

  async registrar(): Promise<void> {
    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      return;
    }
    const { nombre, email, fechaNacimiento, password } = this.formRegistro.getRawValue();
    await this.ejecutar(async () => {
      const usuario = await this.auth.registrar({ nombre, email, fechaNacimiento, password });
      this.formRegistro.reset();
      this.cambiarModo('login');
      this.formLogin.reset({ email: usuario.email, password: '' });
      this.mensaje.set('Cuenta creada. Ya puedes iniciar sesión.');
      this.cuentaCreada.emit(usuario);
    });
  }

  async iniciarSesion(): Promise<void> {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }
    const { email, password } = this.formLogin.getRawValue();
    await this.ejecutar(async () => {
      const usuario = await this.auth.iniciarSesion(email, password);
      this.usuario.set(usuario);
      this.formLogin.reset();
      this.sesionIniciada.emit(usuario);
      await this.router.navigateByUrl(this.destino());
    });
  }

  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.usuario.set(null);
    this.cambiarModo('login');
    this.sesionCerrada.emit();
  }

  /** ¿Se muestra con error este campo del registro? (solo tras tocarlo) */
  invalido(campo: keyof typeof this.formRegistro.controls): boolean {
    const control = this.formRegistro.controls[campo];
    return control.invalid && control.touched;
  }

  /** ¿Se muestra con error este campo del login? (solo tras tocarlo) */
  loginInvalido(campo: keyof typeof this.formLogin.controls): boolean {
    const control = this.formLogin.controls[campo];
    return control.invalid && control.touched;
  }

  /** ¿No coincide el par de campos de confirmación? */
  noCoinciden(
    error: 'emailsDistintos' | 'passwordsDistintas',
    campo: keyof typeof this.formRegistro.controls,
  ): boolean {
    return this.formRegistro.hasError(error) && this.formRegistro.controls[campo].touched;
  }

  /** Destino tras iniciar sesión: `returnUrl` si es una ruta interna segura; si no, Inicio. */
  private destino(): string {
    const url = this.returnUrl ?? '';
    const esInterna = url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\');
    return esInterna ? url : '/home';
  }

  /** Ejecuta una operación del servicio mostrando su error en pantalla si falla. */
  private async ejecutar(operacion: () => Promise<void>): Promise<void> {
    this.error.set(null);
    this.mensaje.set(null);
    this.enviando.set(true);
    try {
      await operacion();
    } catch (e) {
      this.error.set(
        e instanceof ErrorAutenticacion ? e.message : 'Ha ocurrido un error inesperado.',
      );
    } finally {
      this.enviando.set(false);
    }
  }
}
