import express from "express";
const app = express();
const port = 3000;


import usuario from "./usuario.js";


app.use(express.json());

app.get("/", (_, res) => {
  res.send("Lendaa working!");
});

/* ------------------- Rutas ------------------- */

// Usuario
app.post("/usuario", usuario.crearusuario);
app.post("/login", usuario.login);
app.put("/escucha", usuario.escucha);

const server = app.listen(port, () => {
  console.log(`TicMusic listening at http://localhost:${port}`);
});

export { app, server };
