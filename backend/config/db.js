const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Prioriza la URL de Railway, si existe
const connectionUrl = process.env.MYSQL_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = mysql.createPool(connectionUrl);
module.exports = pool.promise();
