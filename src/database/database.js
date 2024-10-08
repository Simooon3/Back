// const pokemones = [
//     {
//         id: 1,
//         name: 'Pikachu',
//         type: 'Electric',
//         level: 50,
//     },
//     {
//         id: 2,
//         name: 'Charmander',
//         type: 'Fire',
//         level: 50,
//     }
// ];

// export default pokemones;

import mysql from 'mysql2/promise';
import config from '../config.js';

const connection = mysql.createConnection({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
})

const getConnection = () => {
    return connection;
}
export { getConnection };