/// <reference types="node" />
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AutenticacionLocal } from './autenticacion-local';
import { DatosRegistro, ErrorAutenticacion } from './autenticacion.model';

const DATOS: DatosRegistro = {
  nombre: 'Ana Pérez',
  email: 'ana@ejemplo.com',
  fechaNacimiento: '2000-05-20',
  password: 'contraseña-segura',
};

/** Devuelve el error que lanza una promesa (falla si no lanza ninguno). */
async function errorDe(promesa: Promise<unknown>): Promise<ErrorAutenticacion> {
  try {
    await promesa;
  } catch (e) {
    return e as ErrorAutenticacion;
  }
  throw new Error('Se esperaba un error y la promesa se resolvió');
}

describe('AutenticacionLocal', () => {
  let servicio: AutenticacionLocal;

  beforeEach(() => {
    // jsdom no incluye Web Crypto (crypto.subtle): se usa el de Node.
    vi.stubGlobal('crypto', webcrypto);
    localStorage.clear();
    sessionStorage.clear();
    servicio = new AutenticacionLocal();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('registra un usuario y devuelve solo sus datos públicos', async () => {
    const usuario = await servicio.registrar(DATOS);
    expect(usuario).toEqual({
      nombre: 'Ana Pérez',
      email: 'ana@ejemplo.com',
      fechaNacimiento: '2000-05-20',
    });
    expect(Object.keys(usuario)).not.toContain('password');
  });

  it('nunca guarda la contraseña en texto plano, solo su hash con sal', async () => {
    await servicio.registrar(DATOS);
    const guardado = localStorage.getItem('app.usuarios') ?? '';
    expect(guardado).not.toContain(DATOS.password);
    const [usuario] = JSON.parse(guardado);
    expect(usuario.hashPassword).toMatch(/^[0-9a-f]{64}$/);
    expect(usuario.sal).toMatch(/^[0-9a-f]{32}$/);
  });

  it('la misma contraseña da hashes distintos en usuarios distintos (sal)', async () => {
    await servicio.registrar(DATOS);
    await servicio.registrar({ ...DATOS, email: 'luis@ejemplo.com' });
    const [a, b] = JSON.parse(localStorage.getItem('app.usuarios') ?? '[]');
    expect(a.hashPassword).not.toBe(b.hashPassword);
  });

  it('normaliza el correo (espacios y mayúsculas) al registrar', async () => {
    const usuario = await servicio.registrar({ ...DATOS, email: '  ANA@Ejemplo.COM ' });
    expect(usuario.email).toBe('ana@ejemplo.com');
  });

  it('rechaza un registro con un correo ya existente', async () => {
    await servicio.registrar(DATOS);
    const error = await errorDe(servicio.registrar({ ...DATOS, email: 'ANA@ejemplo.com' }));
    expect(error).toBeInstanceOf(ErrorAutenticacion);
    expect(error.codigo).toBe('EMAIL_YA_REGISTRADO');
  });

  it('inicia sesión con credenciales correctas y guarda la sesión', async () => {
    await servicio.registrar(DATOS);
    const usuario = await servicio.iniciarSesion(' Ana@ejemplo.com', DATOS.password);
    expect(usuario.nombre).toBe('Ana Pérez');
    expect(servicio.usuarioActual()).toEqual(usuario);
  });

  it('rechaza una contraseña incorrecta', async () => {
    await servicio.registrar(DATOS);
    const error = await errorDe(servicio.iniciarSesion(DATOS.email, 'otra-contraseña'));
    expect(error.codigo).toBe('CREDENCIALES_INVALIDAS');
    expect(servicio.usuarioActual()).toBeNull();
  });

  it('rechaza un correo no registrado con el mismo error que una contraseña mala', async () => {
    const error = await errorDe(servicio.iniciarSesion('nadie@ejemplo.com', 'lo-que-sea'));
    expect(error.codigo).toBe('CREDENCIALES_INVALIDAS');
    expect(error.message).toBe('Correo o contraseña incorrectos.');
  });

  it('cierra la sesión', async () => {
    await servicio.registrar(DATOS);
    await servicio.iniciarSesion(DATOS.email, DATOS.password);
    servicio.cerrarSesion();
    expect(servicio.usuarioActual()).toBeNull();
  });

  it('usuarioActual devuelve null si no hay sesión o los datos están corruptos', () => {
    expect(servicio.usuarioActual()).toBeNull();
    sessionStorage.setItem('app.sesion', '{esto no es json');
    expect(servicio.usuarioActual()).toBeNull();
  });

  it('ignora los usuarios guardados si localStorage está corrupto', async () => {
    localStorage.setItem('app.usuarios', 'basura');
    const usuario = await servicio.registrar(DATOS);
    expect(usuario.email).toBe(DATOS.email);
  });

  it('avisa si el navegador no ofrece Web Crypto (entorno no seguro)', async () => {
    vi.stubGlobal('crypto', { getRandomValues: webcrypto.getRandomValues.bind(webcrypto) });
    const error = await errorDe(servicio.registrar(DATOS));
    expect(error.codigo).toBe('ENTORNO_NO_SEGURO');
  });
});
