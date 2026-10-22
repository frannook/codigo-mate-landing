// Saca el GOOGLE_REFRESH_TOKEN una sola vez. Uso: node scripts/google-auth.mjs
// Necesita GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET (de una credencial "Aplicación de escritorio") en .env.local o en el entorno.
// Abre el navegador, pedís permiso con la cuenta del proyecto y el token se muestra SOLO en esta terminal: no se guarda en ningún archivo.

import { createServer } from 'node:http';
import { exec } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';

function env(name) {
  if (process.env[name]) return process.env[name];
  try {
    const m = readFileSync('.env.local', 'utf8').match(new RegExp(`^${name}=(.*)$`, 'm'));
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
  } catch {
    return '';
  }
}

const id = env('GOOGLE_CLIENT_ID');
const secret = env('GOOGLE_CLIENT_SECRET');
if (!id || !secret) {
  console.error('Faltan GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en .env.local (ver docs/PLAN_CONEXIONES.md, paso 1).');
  process.exit(1);
}

const PORT = 53682;
const redirect = `http://127.0.0.1:${PORT}`;
const state = randomBytes(12).toString('hex');
const url =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: id,
    redirect_uri: redirect,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    state
  });

const server = createServer(async (req, res) => {
  const q = new URL(req.url, redirect).searchParams;
  if (!q.get('code') && !q.get('error')) return void res.writeHead(404).end();
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  if (q.get('error') || q.get('state') !== state) {
    res.end('<h2>No se pudo autorizar. Volvé a la terminal.</h2>');
    console.error('Autorización rechazada:', q.get('error') || 'estado inválido');
    return void server.close();
  }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ code: q.get('code'), client_id: id, client_secret: secret, redirect_uri: redirect, grant_type: 'authorization_code' })
    });
    const j = await r.json();
    if (!j.refresh_token) throw new Error(JSON.stringify(j));
    res.end('<h2>Listo. Ya podés cerrar esta pestaña y volver a la terminal.</h2>');
    console.log('\n=== GOOGLE_REFRESH_TOKEN (copialo a Vercel y a .env.local; no lo compartas) ===\n');
    console.log(j.refresh_token + '\n');
  } catch (e) {
    res.end('<h2>Error al obtener el token. Mirá la terminal.</h2>');
    console.error('Error:', e.message);
  }
  server.close();
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('Abriendo el navegador. Si no se abre, copiá este enlace:\n\n' + url + '\n');
  exec(process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`);
});
