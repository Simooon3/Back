// import pokemones from "../database/database.js";
import { getConnection } from "../database/database.js";

// const getSaludo = (req, res) => {
//     return res.send('Hola soy un pokemon');
// };

// const getDespido = (req, res) => {
//     return res.send('Adios soy un pokemon');
// };

const getPokemones = async (req, res) => {
    
    try {

        const connection = await getConnection();
        const result = await connection.query('SELECT * FROM pokemon');

        res.json(result[0]);

    } catch (error) {
        console.log(error);
        res.status(500);
        res.send(error.message);
    }
};

 export const metodosPokemon = {
    // getSaludo,
    // getDespido,
    getPokemones,
 }