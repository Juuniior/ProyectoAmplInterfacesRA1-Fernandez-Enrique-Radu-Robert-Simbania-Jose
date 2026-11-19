import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BarraCategoria } from './barra-categoria';

describe('BarraCategoria', () => {
  let fixture: ComponentFixture<BarraCategoria>;
  let componente: BarraCategoria;
  const html = () => fixture.nativeElement as HTMLElement;
  const boton = () => html().querySelector('button') as HTMLButtonElement;
  const relleno = () => html().querySelector('.barra__relleno') as HTMLElement;

  async function poner(entradas: Record<string, unknown>) {
    for (const [nombre, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nombre, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BarraCategoria] }).compileComponents();
    fixture = TestBed.createComponent(BarraCategoria);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('tiene valores por defecto coherentes', () => {
    expect(componente.etiqueta).toBe('');
    expect(componente.importe).toBe(0);
    expect(componente.porcentaje).toBe(0);
    expect(componente.tipo).toBe('gasto');
    expect(componente.activa).toBe(false);
  });

  it('muestra la etiqueta y el importe', async () => {
    await poner({ etiqueta: 'Vivienda', importe: 650 });
    expect(html().querySelector('.barra__etiqueta')?.textContent).toContain('Vivienda');
    expect(
      (html().querySelector('.barra__importe')?.textContent ?? '').replace(/\u00a0/g, ' '),
    ).toContain('650,00 €');
  });

  it('el ancho de la barra sigue el porcentaje', async () => {
    await poner({ porcentaje: 40 });
    expect(relleno().style.width).toBe('40%');
  });

  it.each([
    [-20, 0],
    [150, 100],
  ])('recorta el porcentaje %s a %s', async (entrada, esperado) => {
    await poner({ porcentaje: entrada });
    expect(componente.ancho).toBe(esperado);
    expect(relleno().style.width).toBe(`${esperado}%`);
  });

  it('el color depende del tipo', async () => {
    await poner({ tipo: 'ingreso' });
    expect(relleno().classList).toContain('barra__relleno--ingreso');
  });

  it('activa marca la fila y aria-pressed', async () => {
    expect(boton().getAttribute('aria-pressed')).toBe('false');
    await poner({ activa: true });
    expect(boton().getAttribute('aria-pressed')).toBe('true');
    expect(boton().classList).toContain('barra--activa');
  });

  it('al pulsar emite su etiqueta', async () => {
    const emitido = vi.fn();
    componente.seleccionada.subscribe(emitido);
    await poner({ etiqueta: 'Alimentación' });
    boton().click();
    expect(emitido).toHaveBeenCalledWith('Alimentación');
    expect(emitido).toHaveBeenCalledTimes(1);
  });
});
