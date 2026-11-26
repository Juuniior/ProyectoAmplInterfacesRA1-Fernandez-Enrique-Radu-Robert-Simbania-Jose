import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { routes } from './app.routes';
import { ServicioAutenticacion, UsuarioPublico } from './core/auth/autenticacion.model';
import { AUTENTICACION } from './core/auth/autenticacion.token';
import { Login } from './features/login/login';

const ANA: UsuarioPublico = {
  nombre: 'Ana',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-01-01',
};

describe('Rutas de la aplicación (navegación con y sin sesión)', () => {
  let usuario: UsuarioPublico | null;
  let harness: RouterTestingHarness;
  const url = () => TestBed.inject(Router).url;

  beforeEach(async () => {
    usuario = null;
    const falso: ServicioAutenticacion = {
      registrar: vi.fn(),
      iniciarSesion: vi.fn(async () => (usuario = ANA)),
      cerrarSesion: vi.fn(),
      usuarioActual: () => usuario,
      sesion: signal<UsuarioPublico | null>(null),
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: AUTENTICACION, useValue: falso },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  describe('sin sesión (modo vista previa)', () => {
    it.each(['home', 'movimientos', 'facturas', 'informes'])(
      'permite navegar libremente a /%s sin iniciar sesión',
      async (pagina) => {
        await harness.navigateByUrl(`/${pagina}`);
        expect(url()).toBe(`/${pagina}`);
      },
    );

    it('la raíz y las rutas desconocidas llevan a /home', async () => {
      await harness.navigateByUrl('/');
      expect(url()).toBe('/home');
      await harness.navigateByUrl('/no-existe');
      expect(url()).toBe('/home');
    });

    it('/login es accesible', async () => {
      await harness.navigateByUrl('/login', Login);
      expect(url()).toBe('/login');
    });

    it('tras iniciar sesión en /login con returnUrl se vuelve a la página indicada', async () => {
      const login = await harness.navigateByUrl('/login?returnUrl=%2Finformes', Login);
      login.formLogin.setValue({ email: 'ana@ejemplo.com', password: 'contraseña-segura' });
      await login.iniciarSesion();
      expect(url()).toBe('/informes');
    });
  });

  describe('con sesión', () => {
    beforeEach(() => {
      usuario = ANA;
    });

    it.each(['home', 'movimientos', 'facturas', 'informes'])('/%s se abre', async (pagina) => {
      await harness.navigateByUrl(`/${pagina}`);
      expect(url()).toBe(`/${pagina}`);
    });

    it('la raíz lleva a Inicio', async () => {
      await harness.navigateByUrl('/');
      expect(url()).toBe('/home');
    });
  });
});
