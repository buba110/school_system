const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

// Parsear la URL de conexión para extraer parámetros
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definida');
}

// Configuración que fuerza IPv4 y establece SSL
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }, // Necesario para Supabase
  family: 4, // Fuerza IPv4
});

module.exports = pool;
