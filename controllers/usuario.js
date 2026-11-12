import { query } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "../middlewares/auth.js";

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

    const token = jwt.sign({userid: usuarioEncontrado.userid, rol: usuarioEncontrado.rol},
    secret,
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
    const decoded = jwt.verify(token, secret);
    const userid = decoded.userid;
    await query("SELECT * FROM usuario WHERE userid = $1", [userid]);
    res.status(201).json({ userid });
    } catch (error) {
        // Si jwt.verify falla, entra a este catch evitando que caiga la aplicación
        return res.status(401).json({ mensaje: "Token incorrecto o expirado" });
    }
};


/**
 * Crea una cancion
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const CrearCancion = async (req, res) => {
    const { nombre } = req.body;
    await query("INSERT INTO cancion (nombre) VALUES ($1)", [nombre]);
    res.status(201).json({ nombre });
};

/**
 * Actualiza datos de una cancion 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const CambiarNombre = async (req, res) => {
    const { nombre, id } = req.body;
    await query("update cancion set nombre = $1 where id = $2", [nombre, id]);
    res.status(201).json({ nombre, id });
};

/**
 * Borrar cancion
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const BorraCancion = async (req, res) => {
    const { id } = req.body;
    await query("delete from cancion where id = $1", [id]);
    res.status(201).json({ id });
};

/**
 * Borrar cancion
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 */
const escucho = async (req, res) => {
    const { id } = req.body;
    const usuario_id = req.user?.userid;

    if (!usuario_id) {
        return res.status(401).json({ mensaje: "No se pudo identificar al usuario desde el token." });
    }

    await query("insert into escucha (usuario_id, cancion_id) values ($1, $2)", [usuario_id, id]);
        // Cuento cuántas canciones distintas escuchó este usuario
    const resultado = await query(
        "select count(distinct cancion_id) as cantidad from escucha where usuario_id = $1",
        [usuario_id]
    );
    const cantidad = Number(resultado.rows[0].cantidad);

    // Si escuchó más de 10, lo marco como fan
    if (cantidad > 10) {
        await query("update usuario set fan = true where userid = $1", [usuario_id]);
    }

    res.status(201).json({ id });
};

const usuario = {
    crearusuario,
    login,
    escucha,
    CrearCancion,
    CambiarNombre,
    BorraCancion,
    escucho
};

export default usuario;