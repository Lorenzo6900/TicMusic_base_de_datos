import jwt from 'jsonwebtoken';

// Una sola clave secreta para firmar (login) y verificar (middleware) los tokens.
export const secret = process.env.JWT_SECRET || 'mi_clave_secreta';

export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader){
        return res.status(401).send({error: "no llego ningun token en los headers"});
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, secret);
        req.user = payload; // guarda los datos del token (userid y rol) en req.user
        next();// pasa al proximo middleware

    } catch (err) {
        console.error (err);
        return res.status(401).send({error:"no autorizado"});
    }
}

export const verifyAdmin = async (req, res, next) => {
    try{
        if (req.user?.rol?.trim() !== 'A') {
            return res.status(403).send({ error: "Acceso denegado: requiere rol de administrador" });
    }
    next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Error al verificar permisos" });
    }
};
