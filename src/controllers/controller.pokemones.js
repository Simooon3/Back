import pokemones from "../database/database.js";

const getSaludo = (req, res) => {
    return res.send('Hola soy un pokemon');
};

const getDespido = (req, res) => {
    return res.send('Adios soy un pokemon');
};

const getPokemones = (req, res) => {
    const datos = pokemones.map((item) => item);
    return res.json(datos);
};

 export const metodosPokemon = {
    getSaludo,
    getDespido,
    getPokemones,
 }