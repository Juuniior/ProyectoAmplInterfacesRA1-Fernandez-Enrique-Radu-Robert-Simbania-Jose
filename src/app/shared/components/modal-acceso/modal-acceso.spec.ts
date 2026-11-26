import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModalAcceso } from './modal-acceso';
import { AUTENTICACION } from '../../../core/auth/autenticacion.token';
import { ServicioAutenticacion, UsuarioPublico } from '../../../core/auth/autenticacion.model';

const ANA: UsuarioPublico = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-05-20',
};

describe('ModalAcceso', () => {
  let fixture: ComponentFixture<ModalAcceso>;
  let component: ModalAcceso;

  beforeEach(async () => {
    const authFalso: ServicioAutenticacion = {
      registrar: vi.fn(async () => ANA),
      iniciarSesion: vi.fn(async () => ANA),
      cerrarSesion: vi.fn(),
      usuarioActual: () => null,
      sesion: signal<UsuarioPublico | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [ModalAcceso],
      providers: [{ provide: AUTENTICACION, useValue: authFalso }],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalAcceso);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('no muestra el diálogo cuando abierto es false', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="dialog"]')).toBeNull();
  });

  it('muestra el diálogo y el motivo cuando abierto es true', () => {
    fixture.componentRef.setInput('abierto', true);
    fixture.componentRef.setInput('motivo', 'Inicia sesión para añadir movimientos.');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[role="dialog"]')).toBeTruthy();
    expect(el.textContent).toContain('Inicia sesión para continuar');
    expect(el.textContent).toContain('Inicia sesión para añadir movimientos.');
  });

  it('emite cerrado al pulsar el botón de cerrar o Escape', () => {
    fixture.componentRef.setInput('abierto', true);
    fixture.detectChanges();

    const espia = vi.fn();
    component.cerrado.subscribe(espia);

    const botonCerrar = (fixture.nativeElement as HTMLElement).querySelector(
      '.modal-acceso__cerrar',
    ) as HTMLButtonElement;
    botonCerrar.click();
    expect(espia).toHaveBeenCalledTimes(1);

    component.alPulsarEscape();
    expect(espia).toHaveBeenCalledTimes(2);
  });

  it('emite sesionIniciada y cerrado cuando el usuario inicia sesión desde el modal', () => {
    const espiaSesion = vi.fn();
    const espiaCerrado = vi.fn();
    component.sesionIniciada.subscribe(espiaSesion);
    component.cerrado.subscribe(espiaCerrado);

    component.alIniciarSesion(ANA);

    expect(espiaSesion).toHaveBeenCalledWith(ANA);
    expect(espiaCerrado).toHaveBeenCalled();
  });
});
