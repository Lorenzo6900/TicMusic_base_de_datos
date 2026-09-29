import { query } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Crea un nuevo usuario.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const crearusuario = async (req, res) => {
    const { userid, nombre, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await query("INSERT INTO usuario (userid, nombre, password) VALUES ($1, $2, $3)", [userid, nombre, passwordHash]);
    res.status(201).json({ userid, nombre });
};

/**
 * Hace un login.
 * @param {import('express').Request} req 
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


/**
 * Crea un nuevo usuario.
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const escucha = async (req, res) => {
    try {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ mensaje: "Token no proporcionado" });
    }
    const decoded = jwt.verify(token, 'mi_clave_secreta');
    const userid = decoded.userid;
    await query("SELECT * FROM usuario WHERE userid = $1", [userid]);
    res.status(201).json({ userid });
    } catch (error) {
        // Si jwt.verify falla, entra a este catch evitando que caiga la aplicación
        return res.status(401).json({ mensaje: "Token incorrecto o expirado" });
    }
};

const usuario = {
    crearusuario,
    login,
    escucha
};

export default usuario;