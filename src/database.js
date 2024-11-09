const mysql = require('mysql2/promise');
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
    host: process.env.host,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    waitForConnections: true,
    connectionLimit: 10, // Ajusta el límite según tus necesidades
    queueLimit: 0
});

const getConnection = async () => await pool.getConnection();

module.exports = {
    getConnection
};
