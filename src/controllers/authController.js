import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTRO
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userRole = role || "student"; // por defecto 'student'

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        // Verificar si ya existe el usuario
        const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (exists.rowCount > 0) {
            return res.status(400).json({ error: "El correo ya está registrado" });
        }

        // Hashear contraseña
        const hashed = await bcrypt.hash(password, 10);

        // Insertar usuario
        const newUser = await pool.query(
            `INSERT INTO users(name, email, password, role)
             VALUES($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            [name, email, hashed, userRole]
        );

        res.status(201).json({
            message: "Registro exitoso",
            user: newUser.rows[0],
        });
    } catch (err) {
        console.error("Error en register:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Faltan campos obligatorios" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rowCount === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const valid = await bcrypt.compare(password, user.rows[0].password);
        if (!valid) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar token incluyendo id y role
        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        const { password: _, ...safeUser } = user.rows[0]; // quitar password

        res.json({
            message: "Login exitoso",
            token,
            user: safeUser,
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
