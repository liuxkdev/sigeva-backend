import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

/**
 * Registro de usuario
 * body: { name, email, password, role (opcional: student/company/admin) }
 */
router.post("/register", (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    next();
}, register);

/**
 * Login de usuario
 * body: { email, password }
 */
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    next();
}, login);

export default router;
