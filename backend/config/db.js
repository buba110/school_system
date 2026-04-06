const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Railway inyecta MYSQL_URL automáticamente
const connectionUrl = process.env.MYSQL_URL || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = mysql.createPool(connectionUrl);
module.exports = pool.promise();
