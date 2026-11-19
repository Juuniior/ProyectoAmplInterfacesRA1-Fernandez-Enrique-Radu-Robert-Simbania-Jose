import { describe, expect, it } from 'vitest';
import { formatearEuros } from './formato';

/** Intl separa el importe y el símbolo con un espacio duro: se normaliza para comparar. */
const normal = (texto: string) => texto.replace(/\u00a0/g, ' ');

describe('formatearEuros', () => {
  it('usa coma decimal, dos decimales y el símbolo €', () => {
    expect(normal(formatearEuros(1234.5))).toBe('1234,50 €');
    expect(normal(formatearEuros(0))).toBe('0,00 €');
  });

  it('agrupa los miles a partir de cinco cifras (norma española)', () => {
    expect(normal(formatearEuros(12345.6))).toBe('12.345,60 €');
  });

  it('formatea importes negativos', () => {
    expect(normal(formatearEuros(-85))).toContain('85,00');
    expect(formatearEuros(-85)).toContain('-');
  });
});
