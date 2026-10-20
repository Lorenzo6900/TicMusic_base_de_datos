import usuario from "../controllers/usuario.js";
import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middlewares/auth.js"
import { verify } from "jsonwebtoken";

const usuarioRutas = Router();
/* ------------------- Rutas ------------------- */

// Usuario
usuarioRutas.post("/usuario", usuario.crearusuario);
usuarioRutas.post("/login", usuario.login);
usuarioRutas.put("/escucha", usuario.escucha);

//ticmusic 2

usuarioRutas.post("/cancion", [verifyToken, verifyAdmin], usuario.CrearCancion);
usuarioRutas.put("/cancion", [verifyToken, verifyAdmin], usuario.CambiarNombre);
usuarioRutas.delete("/cancion", [verifyToken, verifyAdmin], usuario.BorraCancion);

usuarioRutas.post("/escucho", [verifyToken], usuario.escucho); //solo necesita token xq lo puede hacer cualquier usuarrio.

export default usuarioRutas;