import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "Token requerido" });
        }

        const [bearer, token] = authHeader.split(" ");

        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({ error: "Formato de token inválido" });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT error:", err.message);
                return res.status(403).json({ error: "Token inválido o expirado" });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error("Error en verifyToken:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
}
