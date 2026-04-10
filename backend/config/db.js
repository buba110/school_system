const { Pool } = require('pg');
const dotenv = require('dotenv');
const dns = require('dns');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL no está definida');

const url = new URL(databaseUrl);
const hostname = url.hostname;
const port = url.port || 5432;
const user = decodeURIComponent(url.username);
const password = decodeURIComponent(url.password);
const database = url.pathname.slice(1);

// Resolver IPv4 de forma síncrona (se ejecuta al inicio, tarda milisegundos)
let ipv4;
try {
  const lookup = dns.lookupSync(hostname, { family: 4 });
  ipv4 = lookup.address;
  console.log(`Resolviendo ${hostname} -> IPv4: ${ipv4}`);
} catch (err) {
  console.error('No se pudo resolver IPv4, usando hostname original', err);
  ipv4 = hostname;
}

const pool = new Pool({
  host: ipv4,
  port: parseInt(port),
  user: user,
  password: password,
  database: database,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
