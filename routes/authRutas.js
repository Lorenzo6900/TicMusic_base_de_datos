import express from 'express';
import { verifyToken, verifyAdmin } from './middlewares/auth.js';

const router = express.Router();

// Ruta pública (no requiere middlewares)
router.get('/public', (req, res) => res.send("Endpoint público"));

// Ruta que requiere solo estar autenticado
router.get('/perfil', verifyToken, (req, res) => {
    res.send(`Hola usuario ${req.user.id}`);
});

// IMPORTANTE: verifyToken corre primero, carga req.user, luego verifyAdmin lo evalúa
router.delete('/usuarios/:id', [verifyToken, verifyAdmin], async (req, res) => {
    res.send("Usuario eliminado por un Administrador");
});

export default router;