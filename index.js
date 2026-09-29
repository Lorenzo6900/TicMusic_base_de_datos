import express from "express";
const app = express();
const port = process.env.PORT || 3000;


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

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`TicMusic listening at http://localhost:${port}`);
  });
}

export default app;
