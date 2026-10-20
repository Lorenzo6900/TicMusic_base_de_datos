import express from "express";
import authRutas from './routes/authRutas.js';
import usuarioRutas from './routes/usuarioRutas.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use('/auth', auth);
app.use('/api', auth);

app.get("/", (_, res) => {
  res.send("Lendaa working!");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`TicMusic listening at http://localhost:${port}`);
  });
}

export default app;
