import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { autenticadoGuard } from './autenticado.guard';
import { ServicioAutenticacion, UsuarioPublico } from './autenticacion.model';
import { AUTENTICACION } from './autenticacion.token';

const ANA: UsuarioPublico = {
  nombre: 'Ana',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-01-01',
};

describe('autenticadoGuard', () => {
  let usuario: UsuarioPublico | null;

  beforeEach(() => {
    usuario = null;
    const falso: ServicioAutenticacion = {
      registrar: vi.fn(),
      iniciarSesion: vi.fn(),
      cerrarSesion: vi.fn(),
      usuarioActual: () => usuario,
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AUTENTICACION, useValue: falso }],
    });
  });

  function ejecutar(url: string) {
    return TestBed.runInInjectionContext(() =>
      autenticadoGuard({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot),
    );
  }

  it('deja pasar si hay sesión iniciada', () => {
    usuario = ANA;
    expect(ejecutar('/informes')).toBe(true);
  });

  it('sin sesión redirige a /login', () => {
    const resultado = ejecutar('/informes');
    expect(resultado).toBeInstanceOf(UrlTree);
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toContain('/login');
  });

  it('sin sesión guarda la página pedida en returnUrl', () => {
    const resultado = ejecutar('/movimientos') as UrlTree;
    expect(TestBed.inject(Router).serializeUrl(resultado)).toBe('/login?returnUrl=%2Fmovimientos');
  });

  it('conserva los parámetros de la página pedida', () => {
    const resultado = ejecutar('/facturas?estado=Pendiente') as UrlTree;
    expect(resultado.queryParams['returnUrl']).toBe('/facturas?estado=Pendiente');
  });
});
