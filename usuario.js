import { query } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Crea un nuevo artista.
 * @param {import('express').Request} req - Body: { nombre: string }
 * @param {import('express').Response} res
 */
const crearusuario = async (req, res) => {
    const { userid, nombre, password } = req.body;
     const passwordHash = await bcrypt.hash(password, 10);
    await query("INSERT INTO usuario (userid, nombre, password) VALUES ($1, $2, $3)", [userid, nombre, passwordHash]);
    res.status(201).json({ userid, nombre });
};

/**
 * Crea un nuevo artista.
 * @param {import('express').Request} req - Body: { nombre: string }
 * @param {import('express').Response} res
 */
const login = async (req, res) => {
    const { userid, password } = req.body;

    const resultado = await query("SELECT * FROM usuario WHERE userid = $1", [userid]);

    if (resultado.rows.length === 0){
        return res.status(400).json({
            error: "Usuario o contraseña incorrectos"
        });
    }

    const usuarioEncontrado = resultado.rows[0];

    const passwordCorrecto = await bcrypt.compare(password, usuarioEncontrado.password);
    
    if (!passwordCorrecto) {return res.status(401).json({error: "Usuario o contraseña incorrectos"});}

    const token = jwt.sign({userid: usuarioEncontrado.userid},
    "mi_clave_secreta",
    {expiresIn: "1h"});
    res.json({ token });
};

const usuario = {
    crearusuario,
    login
};

export default usuario;