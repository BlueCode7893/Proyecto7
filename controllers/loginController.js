const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.autenticarUsuario = async (req, res) => {
    const { usuario, clave } = req.body;

    try {
        const query = 'SELECT * FROM usuarios WHERE nombre_usuario = $1';
        const result = await pool.query(query, [usuario]);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            // Comparamos clave escrita con el hash de la DB
            const coinciden = await bcrypt.compare(clave, user.clave_hash);

            if (coinciden) {
                return res.json({
                    id: user.id,
                    nombre_usuario: user.nombre_usuario,
                    rol: user.rol // IMPORTANTE: Enviamos el rol (admin o dentista)
                });
            }
        }
        res.status(401).json({ error: "No autorizado" });
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
};