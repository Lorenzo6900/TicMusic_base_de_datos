import { query } from "../db.js";

/**
 * Crea un nuevo artista.
 * @param {import('express').Request} req - Body: { nombre: string }
 * @param {import('express').Response} res
 */
const crearusuario = async (req, res) => {
    const { userid, nombre, password } = req.body;
    await query("INSERT INTO usuario (userid, nombre, password) VALUES ($1, $2, $3)", [userid, nombre, password]);
    res.status(201).json({ userid, nombre, password });
};

const usuario = {
    crearusuario
};

export default usuario;