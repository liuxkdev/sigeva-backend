export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: "Usuario no autenticado" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    error: `Acceso denegado. Roles permitidos: ${allowedRoles.join(", ")}`,
                });
            }

            next();
        } catch (error) {
            console.error("Error en verifyRole:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    };
};
