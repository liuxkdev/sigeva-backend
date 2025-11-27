import pool from "../config/db.js";

// Crear vacante
export const crearVacante = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        const empresa_id = req.user.id; // viene del token

        if (!titulo || !descripcion) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }

        const result = await pool.query(
            "INSERT INTO vacantes (titulo, descripcion, empresa_id) VALUES ($1, $2, $3) RETURNING *",
            [titulo, descripcion, empresa_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error en crearVacante:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Obtener vacantes (público)
export const obtenerVacantes = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM vacantes");
        res.json(result.rows);
    } catch (err) {
        console.error("Error en obtenerVacantes:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Actualizar vacante
export const actualizarVacante = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion } = req.body;

        if (!titulo || !descripcion) {
            return res
                .status(400)
                .json({ error: "Faltan campos obligatorios" });
        }

        // Verificar que la vacante exista
        const vacanteExist = await pool.query(
            "SELECT * FROM vacantes WHERE id = $1",
            [id]
        );
        if (vacanteExist.rowCount === 0) {
            return res.status(404).json({ error: "Vacante no encontrada" });
        }

        // Solo la empresa propietaria o admin pueden actualizar
        if (
            req.user.role === "company" &&
            vacanteExist.rows[0].empresa_id !== req.user.id
        ) {
            return res
                .status(403)
                .json({ error: "No tienes permiso para editar esta vacante" });
        }

        const result = await pool.query(
            "UPDATE vacantes SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *",
            [titulo, descripcion, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error en actualizarVacante:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Eliminar vacante
export const eliminarVacante = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que la vacante exista
        const vacanteExist = await pool.query(
            "SELECT * FROM vacantes WHERE id = $1",
            [id]
        );
        if (vacanteExist.rowCount === 0) {
            return res.status(404).json({ error: "Vacante no encontrada" });
        }

        // Solo la empresa propietaria o admin pueden eliminar
        if (
            req.user.role === "company" &&
            vacanteExist.rows[0].empresa_id !== req.user.id
        ) {
            return res
                .status(403)
                .json({
                    error: "No tienes permiso para eliminar esta vacante",
                });
        }

        await pool.query("DELETE FROM vacantes WHERE id = $1", [id]);
        res.json({ message: "Vacante eliminada correctamente" });
    } catch (err) {
        console.error("Error en eliminarVacante:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};