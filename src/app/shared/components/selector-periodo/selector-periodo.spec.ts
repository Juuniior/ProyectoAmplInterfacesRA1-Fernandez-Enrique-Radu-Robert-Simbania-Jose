import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SelectorPeriodo } from './selector-periodo';

const OPCIONES = [
  { valor: 'todo', etiqueta: 'Todo' },
  { valor: 'mes', etiqueta: 'Este mes' },
  { valor: 'anio', etiqueta: 'Este año' },
];

describe('SelectorPeriodo', () => {
  let fixture: ComponentFixture<SelectorPeriodo>;
  let componente: SelectorPeriodo;
  const html = () => fixture.nativeElement as HTMLElement;
  const botones = () => Array.from(html().querySelectorAll<HTMLButtonElement>('button'));

  async function poner(entradas: Record<string, unknown>) {
    for (const [nombre, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(nombre, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SelectorPeriodo] }).compileComponents();
    fixture = TestBed.createComponent(SelectorPeriodo);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('sin opciones no muestra botones', () => {
    expect(componente.opciones).toEqual([]);
    expect(botones()).toHaveLength(0);
  });

  it('muestra un botón por opción', async () => {
    await poner({ opciones: OPCIONES });
    expect(botones().map((b) => b.textContent?.trim())).toEqual(['Todo', 'Este mes', 'Este año']);
  });

  it('marca como activa solo la opción elegida', async () => {
    await poner({ opciones: OPCIONES, valor: 'mes' });
    expect(botones().map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'false',
      'true',
      'false',
    ]);
    expect(botones()[1].classList).toContain('selector__opcion--activa');
  });

  it('emite el valor de la opción pulsada', async () => {
    const emitido = vi.fn();
    componente.valorCambiado.subscribe(emitido);
    await poner({ opciones: OPCIONES, valor: 'todo' });
    botones()[2].click();
    expect(emitido).toHaveBeenCalledWith('anio');
  });

  it('no emite si se pulsa la opción que ya estaba elegida', async () => {
    const emitido = vi.fn();
    componente.valorCambiado.subscribe(emitido);
    await poner({ opciones: OPCIONES, valor: 'todo' });
    botones()[0].click();
    expect(emitido).not.toHaveBeenCalled();
  });

  it('usa la etiqueta como nombre accesible del grupo', async () => {
    expect(html().querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Periodo');
    await poner({ etiqueta: 'Periodo del informe' });
    expect(html().querySelector('[role="group"]')?.getAttribute('aria-label')).toBe(
      'Periodo del informe',
    );
  });
});
