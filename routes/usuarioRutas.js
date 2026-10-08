import usuario from "./usuario.js";
import { Router } from "express";

const usuarioRutas = Router();
/* ------------------- Rutas ------------------- */

// Usuario
usuarioRutas.post("/usuario", usuario.crearusuario);
usuarioRutas.post("/login", usuario.login);
usuarioRutas.put("/escucha", usuario.escucha);

export default usuarioRutas;