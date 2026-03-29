const { Usuario } = require('../models'); // Importamos el modelo
const bcrypt = require('bcrypt'); // Si usas bcrypt para contraseñas

exports.login = async (req, res) => {
    const { usuario, clave } = req.body;

    try {
        // Buscamos al usuario usando Sequelize (Punto 5 del proyecto)
        const user = await Usuario.findOne({ 
            where: { nombre_usuario: usuario } 
        });

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado" });
        }

        // Validación de contraseña (ajusta según si usas hash o texto plano para el proyecto)
        if (user.password === clave) { // Cambia a bcrypt.compare si usas hash
            // Enviamos los datos SIN la contraseña (Punto 2 del proyecto)
            res.json({
                id: user.id,
                nombre_usuario: user.nombre_usuario,
                rol: user.rol
            });
        } else {
            res.status(401).json({ error: "Contraseña incorrecta" });
        }

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};