import {config} from 'dotenv';

config();

export default {
    env: process.env.NODE_ENV || 'development',
    por: process.env.PORT || 3000,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
}
export {config};