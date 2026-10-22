import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'tu_clave_secreta';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers ['authorization'];
    if (!authHeader){
        return res.status(401).send({error: "no llego ningun token en los headers"});
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, secret);
        req.user_id = payload.id; //modifica rez, agrega user id q viene del token.
        next();// pasa al proximo middleware

    } catch (err) {
        console.error (err);
        return res.status(401).send({error:"no autorizado"});
    }
}

export const verifyAdmin = async (req, res, next) => {
    try{
        if (req.user_role !== 'A') {
            return res.status(403).send({ error: "Acceso denegado: requiere rol de administrador" });
    }
    next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Error al verificar permisos" });
    }
};