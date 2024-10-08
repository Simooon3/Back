import {Router} from 'express';
import {metodosPokemon} from '../controllers/controller.pokemones.js'
import cors from 'cors';

//Instancia de Router
const router = Router();

//Rutas
router.get('/pokemones', cors({ origin: 'http://localhost:5173'}), metodosPokemon.getPokemones);

export default router;