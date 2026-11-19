import { TestBed } from '@angular/core/testing';
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

describe('Rutas protegidas', () => {
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
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: AUTENTICACION, useValue: falso },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  describe('sin sesión', () => {
    it.each(['home', 'movimientos', 'facturas', 'informes'])(
      '/%s redirige a /login',
      async (pagina) => {
        await harness.navigateByUrl(`/${pagina}`);
        expect(url()).toBe(`/login?returnUrl=%2F${pagina}`);
      },
    );

    it('la raíz y las rutas desconocidas también acaban en /login', async () => {
      await harness.navigateByUrl('/');
      expect(url()).toContain('/login');
      await harness.navigateByUrl('/no-existe');
      expect(url()).toContain('/login');
    });

    it('/login es accesible', async () => {
      await harness.navigateByUrl('/login', Login);
      expect(url()).toBe('/login');
    });

    it('tras iniciar sesión se vuelve a la página que se pedía', async () => {
      const login = await harness.navigateByUrl('/informes', Login);
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
