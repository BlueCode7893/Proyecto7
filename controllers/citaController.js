const pool = require('../config/db');

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM citas ORDER BY fecha_cita ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener citas" });
    }
};

// Crear nueva cita
exports.crearCita = async (req, res) => {
    const { nombre, apellidos, fecha_nacimiento, fecha_cita, procedimiento, profesional } = req.body;
    try {
        await pool.query(
            'INSERT INTO citas (nombre, apellidos, fecha_nacimiento, fecha_cita, procedimiento, profesional) VALUES ($1, $2, $3, $4, $5, $6)',
            [nombre, apellidos, fecha_nacimiento, fecha_cita, procedimiento, profesional]
        );
        res.json({ mensaje: "Cita creada" });
    } catch (error) {
        res.status(500).json({ error: "Error al crear cita" });
    }
};

// ACTUALIZAR CITA (Corregido para evitar Error 500)
exports.actualizarCita = async (req, res) => {
    const { id } = req.params;
    // Asegurarse de recibir los campos exactos del frontend
    const { procedimiento, profesional, fecha_cita } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE citas SET procedimiento = $1, profesional = $2, fecha_cita = $3 WHERE id = $4',
            [procedimiento, profesional, fecha_cita, id]
        );
        res.json({ mensaje: "Cita actualizada" });
    } catch (error) {
        console.error("Error SQL:", error);
        res.status(500).json({ error: "No se pudo actualizar en la base de datos" });
    }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
    try {
        await pool.query('DELETE FROM citas WHERE id = $1', [req.params.id]);
        res.json({ mensaje: "Cita eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};