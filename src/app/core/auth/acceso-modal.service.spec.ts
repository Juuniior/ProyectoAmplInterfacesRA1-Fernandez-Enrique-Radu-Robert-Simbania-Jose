import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { AccesoModalService } from './acceso-modal.service';

describe('AccesoModalService', () => {
  let service: AccesoModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesoModalService);
  });

  it('arranca cerrado y sin motivo', () => {
    expect(service.abierto()).toBe(false);
    expect(service.motivo()).toBeNull();
    expect(service.modoInicial()).toBe('login');
  });

  it('abre el modal con un motivo por defecto al llamar a solicitar()', () => {
    service.solicitar();
    expect(service.abierto()).toBe(true);
    expect(service.motivo()).toContain('Inicia sesión');
    expect(service.modoInicial()).toBe('login');
  });

  it('permite personalizar el motivo y la pestaña inicial', () => {
    service.solicitar('Para crear una factura necesitas iniciar sesión.', 'registro');
    expect(service.abierto()).toBe(true);
    expect(service.motivo()).toBe('Para crear una factura necesitas iniciar sesión.');
    expect(service.modoInicial()).toBe('registro');
  });

  it('cierra el modal y limpia el motivo', () => {
    service.solicitar('Motivo de prueba');
    service.cerrar();
    expect(service.abierto()).toBe(false);
    expect(service.motivo()).toBeNull();
  });
});
