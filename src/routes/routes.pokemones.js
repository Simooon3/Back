import {Router} from 'express';
import {metodosPokemon} from '../controllers/controller.pokemones.js'

//Instancia de Router
const router = Router();

//Rutas
router.get('/pokemon-saludo', metodosPokemon.getSaludo);

router.get('/pokemon-despido', metodosPokemon.getDespido);

router.get('/pokemones', metodosPokemon.getPokemones);

export default router;