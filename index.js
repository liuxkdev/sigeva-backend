import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.js";
import vacantesRoutes from "./src/routes/vacantes.js";
import pool from "./src/config/db.js";

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/vacantes", vacantesRoutes);

// Ruta para probar base de datos
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    console.error("Error global:", err);
    res.status(500).json({ error: "Error interno del servidor" });
});

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
