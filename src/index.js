const express = require('express');
const cors = require("cors");
const morgan = require("morgan");
const database = require("./database.js");

// Configuración inicial
const app = express();
app.set('port', 4000);
app.listen(app.get("port"), () => {
    console.log("Escuchando comunicaciones al puerto " + app.get("port"));
});

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas - Endpoints

// 1) Ruta de verificación de usuario
app.post('/verificar-usuario', async (req, res) => {
    const { correo, contraseña } = req.body;

    try {
        const connection = await database.getConnection();

        // Verificar en la tabla Cliente
        const [clientes] = await connection.query("SELECT * FROM cliente WHERE CorreoCl = ?", [correo]);

        if (clientes.length > 0) {
            if (clientes[0].ContraseñaCl === contraseña) { 
                return res.json({ tipo_usuario: 'Cliente', usuario: clientes[0] });
            } else {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        }

        // Verificar en la tabla Tecnico
        const [tecnicos] = await connection.query("SELECT * FROM tecnico WHERE CorreoTc = ?", [correo]);

        if (tecnicos.length > 0) {
            if (tecnicos[0].ContraseñaTc === contraseña) { 
                return res.json({ tipo_usuario: 'Tecnico', usuario: tecnicos[0] });
            } else {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
        }

        res.status(404).json({ message: 'Usuario no encontrado' });
    } catch (error) {
        console.error('Error al verificar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// 2) Ruta para registrar un cliente
app.post('/registrar-cliente', async (req, res) => {
    const { CedulaCl, NombreCl, ApellidoCl, CorreoCl, ContraseñaCl, NúmeroCl, DirecciónCl } = req.body;

    try {
        const connection = await database.getConnection();

        const [clientes] = await connection.query("SELECT * FROM Cliente WHERE CedulaCl = ?", [CedulaCl]);

        if (clientes.length > 0) {
            return res.status(400).json({ message: 'La cédula ya está registrada.' });
        }

        const query = 'INSERT INTO Cliente (CedulaCl, NombreCl, ApellidoCl, CorreoCl, ContraseñaCl, NúmeroCl, DirecciónCl) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const result = await connection.query(query, [CedulaCl, NombreCl, ApellidoCl, CorreoCl, ContraseñaCl, NúmeroCl, DirecciónCl]);

        res.status(201).json({ id_cliente: result[0].insertId, message: 'Cliente registrado exitosamente.' });
    } catch (err) {
        console.error('Error al registrar el cliente: ', err);
        return res.status(500).json({ error: 'Error al registrar el cliente' });
    }
});

// 3) Ruta para buscar un cliente
app.get('/buscar-cliente/:cedula', async (req, res) => {
    const { cedula } = req.params;
    let connection;

    try {
        connection = await database.getConnection();

        const query = 'SELECT * FROM Cliente WHERE CedulaCl = ?';
        const [results] = await connection.query(query, [cedula]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        return res.status(200).json(results[0]);
    } catch (err) {
        console.error('Error al buscar el cliente:', err);
        return res.status(500).json({ error: 'Error al buscar el cliente' });
    } finally {
        if (connection) connection.release();
    }
});

/// 4) Ruta para registrar un equipo
app.post('/registrar-equipo', async (req, res) => {
    const { Marca, Modelo, FechaCompra, TipoMantenimiento, Revisiones, Problemas, ID_Cliente, ID_Tecnico } = req.body;
    const FechaEntrada = new Date().toISOString().split('T')[0];
    const Estado = 'Revisión';
    let connection; // Definición de la variable `connection` fuera del `try`

    try {
        connection = await database.getConnection(); // Elimina la palabra `const`

        const [cliente] = await connection.query("SELECT * FROM Cliente WHERE ID_Cliente = ?", [ID_Cliente]);
        const [tecnico] = await connection.query("SELECT * FROM Tecnico WHERE ID_Tecnico = ?", [ID_Tecnico]);

        if (cliente.length === 0) {
            return res.status(400).json({ message: 'ID_Cliente no existe en la tabla Cliente' });
        }
        if (tecnico.length === 0) {
            return res.status(400).json({ message: 'ID_Tecnico no existe en la tabla Tecnico' });
        }

        const revisionesString = Array.isArray(Revisiones) ? Revisiones.join(',') : Revisiones;

        const query = `
            INSERT INTO Equipo 
            (Marca, Modelo, FechaCompra, FechaEntrada, TipoMantenimiento, Revisiones, Problemas, Estado, ID_Cliente, ID_Tecnico) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const result = await connection.query(query, [Marca, Modelo, FechaCompra, FechaEntrada, TipoMantenimiento, revisionesString, Problemas, Estado, ID_Cliente, ID_Tecnico]);

        res.status(201).json({ id_equipo: result.insertId, message: 'Equipo registrado exitosamente.' });
    } catch (err) {
        console.error('Error al registrar el equipo:', err);
        res.status(500).json({ error: 'Error al registrar el equipo' });
    } finally {
        if (connection) connection.release();
    }
});


// 5) Ruta para obtener los equipos asignados a un técnico
app.get('/equipos/asignados/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;

    try {
        const connection = await database.getConnection();

        const query = 'SELECT ID_Equipo, Marca, Modelo, TipoMantenimiento, Revisiones, Problemas, Estado FROM Equipo WHERE ID_Tecnico = ? AND Estado = "Revision"';
        const [equipos] = await connection.query(query, [id_tecnico]);

        res.status(200).json(equipos);
    } catch (err) {
        console.error('Error al obtener los equipos asignados:', err);
        res.status(500).json({ error: 'Error al obtener los equipos asignados' });
    }
});

// 6) Ruta para obtener los equipos asignados que fueron revisados
app.get('/equipos/historial/:id_tecnico', async (req, res) => {
    const { id_tecnico } = req.params;

    try {
        const connection = await database.getConnection();

        const query = 'SELECT ID_Equipo, Marca, Modelo, TipoMantenimiento, Revisiones, Problemas, Estado FROM Equipo WHERE ID_Tecnico = ? AND Estado = "Finalizado"';
        const [equipos] = await connection.query(query, [id_tecnico]);

        res.status(200).json(equipos);
    } catch (err) {
        console.error('Error al obtener los equipos asignados:', err);
        res.status(500).json({ error: 'Error al obtener los equipos asignados' });
    }
});

// Ruta para editar un equipo
app.put('/equipos/:id', async (req, res) => {
    const { id } = req.params;
    const { Marca, Modelo, FechaCompra, TipoMantenimiento, Revisiones, Problemas, Estado } = req.body;

    try {
        const connection = await database.getConnection();
        
        const [result] = await connection.query(
            `UPDATE equipo 
             SET Marca = ?, Modelo = ?, FechaCompra = ?, TipoMantenimiento = ?, Revisiones = ?, Problemas = ?, Estado = ? 
             WHERE ID_Equipo = ?`, 
            [Marca, Modelo, FechaCompra, TipoMantenimiento, Revisiones, Problemas, Estado, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: 'Equipo actualizado correctamente.' });
        } else {
            res.status(404).json({ message: 'Equipo no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar el equipo:', error);
        res.status(500).json({ message: 'Error al actualizar el equipo.' });
    }
});
