const { Pool } = require('pg');
const dotenv = require('dotenv');
const dns = require('dns');
const { promisify } = require('util');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL no está definida');

// Extraer componentes de la URL
const url = new URL(databaseUrl);
const hostname = url.hostname;
const port = url.port || 5432;
const user = decodeURIComponent(url.username);
const password = decodeURIComponent(url.password);
const database = url.pathname.slice(1);

// Función para resolver IPv4
async function getIPv4() {
  const lookup = promisify(dns.lookup);
  const { address } = await lookup(hostname, { family: 4 });
  return address;
}

let pool = null;

async function initializePool() {
  try {
    const ipv4 = await getIPv4();
    console.log(`Conectando a PostgreSQL vía IPv4: ${ipv4}:${port}`);
    pool = new Pool({
      host: ipv4,
      port: parseInt(port),
      user: user,
      password: password,
      database: database,
      ssl: { rejectUnauthorized: false },
    });
    // Probar conexión
    await pool.query('SELECT 1');
    console.log('Conexión a base de datos exitosa');
    return pool;
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    throw err;
  }
}

// Inicializar la conexión antes de que el servidor arranque
const connectionPromise = initializePool();

// Exportar una función que devuelve el pool (para usarlo en los controladores)
module.exports = () => connectionPromise;
