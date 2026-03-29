const pool = require('../config/db');

exports.obtenerHistorial = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM historial_clinico ORDER BY fecha_registro DESC');
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ error: "Error al obtener historial" });
    }
};

exports.agregarAlHistorial = async (req, res) => {
    const { cita_id, paciente_nombre, observaciones, diagnostico, insumos, monto } = req.body;
    try {
        await pool.query(
            'INSERT INTO historial_clinico (cita_id, paciente_nombre, observaciones, diagnostico, insumos_utilizados, monto_cobrado) VALUES ($1, $2, $3, $4, $5, $6)',
            [cita_id, paciente_nombre, observaciones, diagnostico, insumos, monto]
        );
        res.status(201).json({ mensaje: "Historial registrado" });
    } catch (e) {
        res.status(500).json({ error: "Error en servidor" });
    }
};