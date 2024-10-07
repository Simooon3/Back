import express from 'express'
import router from './routes/routes.pokemones.js';
import cors from 'cors';

//creo instancia de express
const app = express();

//Defino puerto
app.set('port', 3000)

//Importar rutas
app.use(router);

//Configuracion de CORS
app.use(cors({
    origin:'https://localhost:5173',
}));

export default app;