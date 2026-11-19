import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Login } from './login';
import { AUTENTICACION } from '../../core/auth/autenticacion.token';
import {
  ErrorAutenticacion,
  ServicioAutenticacion,
  UsuarioPublico,
} from '../../core/auth/autenticacion.model';

const ANA: UsuarioPublico = { nombre: 'Ana Pérez', email: 'ana@ejemplo.com', fechaNacimiento: '2000-05-20' };

function servicioFalso(): ServicioAutenticacion {
  return {
    registrar: vi.fn(async () => ANA),
    iniciarSesion: vi.fn(async () => ANA),
    cerrarSesion: vi.fn(),
    usuarioActual: vi.fn(() => null),
    sesion: signal<UsuarioPublico | null>(null),
  };
}

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let auth: ServicioAutenticacion;
  let router: Router;

  beforeEach(async () => {
    auth = servicioFalso();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [{ provide: AUTENTICACION, useValue: auth }],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function rellenarRegistro(cambios: Record<string, string> = {}) {
    component.formRegistro.setValue({
      nombre: 'Ana Pérez',
      email: 'ana@ejemplo.com',
      confirmarEmail: 'ANA@ejemplo.com ',
      fechaNacimiento: '2000-05-20',
      password: 'contraseña-segura',
      confirmarPassword: 'contraseña-segura',
      ...cambios,
    });
  }

  it('arranca en la pestaña de login', () => {
    expect(component.modo()).toBe('login');
  });

  it('respeta modoInicial', async () => {
    const f = TestBed.createComponent(Login);
    f.componentRef.setInput('modoInicial', 'registro');
    await f.whenStable();
    expect(f.componentInstance.modo()).toBe('registro');
  });

  it('cambiarModo limpia error y mensaje', () => {
    component.error.set('x');
    component.mensaje.set('y');
    component.cambiarModo('registro');
    expect(component.modo()).toBe('registro');
    expect(component.error()).toBeNull();
    expect(component.mensaje()).toBeNull();
  });

  it('valida nombre, fecha futura y contraseña corta', () => {
    rellenarRegistro({ nombre: 'An', fechaNacimiento: '2999-01-01', password: '123', confirmarPassword: '123' });
    const c = component.formRegistro.controls;
    expect(c.nombre.hasError('minlength')).toBe(true);
    expect(c.fechaNacimiento.hasError('fechaFutura')).toBe(true);
    expect(c.password.hasError('minlength')).toBe(true);
  });

  it('detecta correos y contraseñas que no coinciden', () => {
    rellenarRegistro({ confirmarEmail: 'otro@ejemplo.com', confirmarPassword: 'distinta-123' });
    expect(component.formRegistro.hasError('emailsDistintos')).toBe(true);
    expect(component.formRegistro.hasError('passwordsDistintas')).toBe(true);
  });

  it('no llama al servicio si el registro no es válido', async () => {
    await component.registrar();
    expect(auth.registrar).not.toHaveBeenCalled();
    expect(component.invalido('nombre')).toBe(true);
  });

  it('registra, emite cuentaCreada y pasa al login con el correo relleno', async () => {
    const emitido = vi.fn();
    component.cuentaCreada.subscribe(emitido);
    rellenarRegistro();
    await component.registrar();
    expect(auth.registrar).toHaveBeenCalledWith({
      nombre: 'Ana Pérez',
      email: 'ana@ejemplo.com',
      fechaNacimiento: '2000-05-20',
      password: 'contraseña-segura',
    });
    expect(emitido).toHaveBeenCalledWith(ANA);
    expect(component.modo()).toBe('login');
    expect(component.formLogin.controls.email.value).toBe(ANA.email);
  });

  it('muestra el error del servicio al registrar', async () => {
    vi.mocked(auth.registrar).mockRejectedValueOnce(
      new ErrorAutenticacion('EMAIL_YA_REGISTRADO', 'Ya existe una cuenta con ese correo electrónico.'),
    );
    rellenarRegistro();
    await component.registrar();
    expect(component.error()).toBe('Ya existe una cuenta con ese correo electrónico.');
  });

  it('inicia sesión y emite sesionIniciada', async () => {
    const emitido = vi.fn();
    component.sesionIniciada.subscribe(emitido);
    component.formLogin.setValue({ email: 'ana@ejemplo.com', password: 'contraseña-segura' });
    await component.iniciarSesion();
    expect(component.usuario()).toEqual(ANA);
    expect(emitido).toHaveBeenCalledWith(ANA);
  });

  it('muestra error con credenciales inválidas', async () => {
    vi.mocked(auth.iniciarSesion).mockRejectedValueOnce(
      new ErrorAutenticacion('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.'),
    );
    component.formLogin.setValue({ email: 'ana@ejemplo.com', password: 'mala' });
    await component.iniciarSesion();
    expect(component.usuario()).toBeNull();
    expect(component.error()).toBe('Correo o contraseña incorrectos.');
  });

  it('cierra sesión y emite sesionCerrada', () => {
    const emitido = vi.fn();
    component.sesionCerrada.subscribe(emitido);
    component.usuario.set(ANA);
    component.cerrarSesion();
    expect(auth.cerrarSesion).toHaveBeenCalled();
    expect(component.usuario()).toBeNull();
    expect(emitido).toHaveBeenCalled();
  });

  it('recupera la sesión guardada tras el primer renderizado', async () => {
    vi.mocked(auth.usuarioActual).mockReturnValue(ANA);
    const f = TestBed.createComponent(Login);
    await f.whenStable();
    expect(f.componentInstance.usuario()).toEqual(ANA);
  });

  describe('redirección tras iniciar sesión', () => {
    async function entrar(returnUrl?: string) {
      if (returnUrl !== undefined) {
        fixture.componentRef.setInput('returnUrl', returnUrl);
      }
      component.formLogin.setValue({ email: 'ana@ejemplo.com', password: 'contraseña-segura' });
      await component.iniciarSesion();
    }

    it('sin returnUrl va a Inicio', async () => {
      await entrar();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    });

    it('con returnUrl interno vuelve a esa página', async () => {
      await entrar('/informes');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/informes');
    });

    it.each(['//malo.com', 'https://malo.com', '/' + String.fromCharCode(92) + 'malo.com', 'informes'])(
      'ignora el returnUrl no seguro %s',
      async (url) => {
        await entrar(url);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
      },
    );

    it('si las credenciales fallan no navega', async () => {
      vi.mocked(auth.iniciarSesion).mockRejectedValue(
        new ErrorAutenticacion('CREDENCIALES_INVALIDAS', 'Correo o contraseña incorrectos.'),
      );
      await entrar('/informes');
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
