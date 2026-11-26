import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { BotonCta } from './boton-cta';

describe('BotonCta', () => {
  let component: BotonCta;
  let fixture: ComponentFixture<BotonCta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonCta],
    }).compileComponents();

    fixture = TestBed.createComponent(BotonCta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const enlace = () =>
    (fixture.nativeElement as HTMLElement).querySelector('.boton-cta') as HTMLAnchorElement;

  it('se crea con los valores por defecto (texto "Ver más", primario y deshabilitado)', () => {
    expect(component).toBeTruthy();
    expect(component.texto).toBe('Ver más');
    expect(component.variante).toBe('primario');
    expect(component.deshabilitado).toBe(true);
    expect(enlace().textContent?.trim()).toBe('Ver más');
    expect(enlace().classList.contains('boton-cta--deshabilitado')).toBe(true);
    expect(enlace().getAttribute('aria-disabled')).toBe('true');
    expect(enlace().getAttribute('tabindex')).toBe('-1');
  });

  it('muestra el texto recibido por @Input', () => {
    fixture.componentRef.setInput('texto', 'Crear cuenta');
    fixture.detectChanges();
    expect(enlace().textContent?.trim()).toBe('Crear cuenta');
  });

  it('aplica la clase de la variante secundaria cuando se configura', () => {
    fixture.componentRef.setInput('variante', 'secundario');
    fixture.detectChanges();
    expect(enlace().classList.contains('boton-cta--secundario')).toBe(true);
  });

  it('quita los atributos de bloqueo cuando deshabilitado es false', () => {
    fixture.componentRef.setInput('deshabilitado', false);
    fixture.detectChanges();
    expect(enlace().classList.contains('boton-cta--deshabilitado')).toBe(false);
    expect(enlace().getAttribute('aria-disabled')).toBeNull();
    expect(enlace().getAttribute('tabindex')).toBeNull();
  });
});
