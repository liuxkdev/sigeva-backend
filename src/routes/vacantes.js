import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyRole } from "../middleware/verifyRole.js";
import {
    crearVacante,
    obtenerVacantes,
    actualizarVacante,
    eliminarVacante,
} from "../controllers/vacantesController.js";

const router = express.Router();

/**
 * GET /vacantes
 * Rutas públicas: todos pueden ver vacantes
 */
router.get("/", obtenerVacantes);

/**
 * POST /vacantes
 * Solo companies pueden crear vacantes
 * body: { titulo, descripcion }
 */
router.post(
    "/",
    verifyToken,
    verifyRole("company"),
    (req, res, next) => {
        const { titulo, descripcion } = req.body;
        if (!titulo || !descripcion) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }
        next();
    },
    crearVacante
);

/**
 * PUT /vacantes/:id
 * Company solo puede actualizar su vacante, admin cualquiera
 * body: { titulo, descripcion }
 */
router.put(
    "/:id",
    verifyToken,
    verifyRole("company", "admin"),
    (req, res, next) => {
        const { titulo, descripcion } = req.body;
        if (!titulo || !descripcion) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }
        next();
    },
    actualizarVacante
);

/**
 * DELETE /vacantes/:id
 * Company solo puede eliminar su vacante, admin cualquiera
 */
router.delete(
    "/:id",
    verifyToken,
    verifyRole("company", "admin"),
    eliminarVacante
);

export default router;
