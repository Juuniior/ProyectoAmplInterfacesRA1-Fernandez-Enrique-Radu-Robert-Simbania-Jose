import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AutenticacionLocal } from './autenticacion-local';
import { AUTENTICACION } from './autenticacion.token';

describe('AUTENTICACION (token)', () => {
  it('por defecto entrega la implementación local', () => {
    expect(TestBed.inject(AUTENTICACION)).toBeInstanceOf(AutenticacionLocal);
  });

  it('se puede sustituir por otra implementación (por ejemplo, en tests)', () => {
    const falso = {
      registrar: async () => ({ nombre: 'x', email: 'x@x.es', fechaNacimiento: '2000-01-01' }),
      iniciarSesion: async () => ({ nombre: 'x', email: 'x@x.es', fechaNacimiento: '2000-01-01' }),
      cerrarSesion: () => undefined,
      usuarioActual: () => null,
    };
    TestBed.configureTestingModule({ providers: [{ provide: AUTENTICACION, useValue: falso }] });
    expect(TestBed.inject(AUTENTICACION)).toBe(falso);
  });
});
