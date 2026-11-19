import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TarjetaResumen } from './tarjeta-resumen';

const normal = (texto: string | null | undefined) => (texto ?? '').replace(/\u00a0/g, ' ').trim();

describe('TarjetaResumen', () => {
  let fixture: ComponentFixture<TarjetaResumen>;
  const html = () => fixture.nativeElement as HTMLElement;

  async function poner(entradas: Record<string, unknown>) {
    for (const [nombre, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nombre, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TarjetaResumen] }).compileComponents();
    fixture = TestBed.createComponent(TarjetaResumen);
    fixture.detectChanges();
  });

  it('tiene valores por defecto coherentes', () => {
    const c = fixture.componentInstance;
    expect(c.titulo).toBe('');
    expect(c.importe).toBe(0);
    expect(c.tipo).toBe('saldo');
    expect(c.detalle).toBe('');
    expect(normal(html().querySelector('.resumen__importe')?.textContent)).toBe('0,00 €');
  });

  it('muestra el título y el importe en euros', async () => {
    await poner({ titulo: 'Ingresos', importe: 3399.2 });
    expect(html().querySelector('.resumen__titulo')?.textContent).toContain('Ingresos');
    expect(normal(html().querySelector('.resumen__importe')?.textContent)).toBe('3399,20 €');
  });

  it.each([
    ['ingreso', '↗'],
    ['gasto', '↘'],
    ['saldo', '€'],
  ] as const)('el tipo %s usa su icono y su color', async (tipo, icono) => {
    await poner({ tipo });
    expect(html().querySelector('.resumen__icono')?.textContent).toContain(icono);
    expect(html().querySelector(`.resumen__icono--${tipo}`)).toBeTruthy();
    expect(html().querySelector(`.resumen__importe--${tipo}`)).toBeTruthy();
  });

  it('solo muestra el detalle si se indica', async () => {
    expect(html().querySelector('.resumen__detalle')).toBeFalsy();
    await poner({ detalle: '2 facturas' });
    expect(html().querySelector('.resumen__detalle')?.textContent).toContain('2 facturas');
  });
});
