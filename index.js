import express from "express";
const app = express();
const port = 3000;

import cancion from "cancion.js";
import usuario from "usuario.js";
import escucha from "escucha.js";

app.use(express.json());

app.get("/", (_, res) => {
  res.send("SpoTICfy API working!");
});

/* ------------------- Rutas ------------------- */

// Usuario
app.put("usuario:id", usuario.crearusuario);
