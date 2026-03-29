const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Modelo Usuario - Ajustado a tu última inserción SQL
const Usuario = sequelize.define('Usuario', {
    nombre_usuario: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
    },
    password: { 
        type: DataTypes.TEXT, // Cambiado de clave_hash a password
        allowNull: false 
    },
    rol: { 
        type: DataTypes.STRING, 
        allowNull: false
    }
}, { 
    tableName: 'usuarios', 
    timestamps: false 
});

// Modelo Cita
const Cita = sequelize.define('Cita', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    apellidos: { type: DataTypes.STRING, allowNull: false },
    fecha_nacimiento: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_cita: { type: DataTypes.DATE, allowNull: false },
    procedimiento: { type: DataTypes.STRING, allowNull: false },
    profesional: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'citas', timestamps: false });

// Modelo Historial
const Historial = sequelize.define('Historial', {
    cita_id: { type: DataTypes.INTEGER },
    paciente_nombre: { type: DataTypes.STRING },
    observaciones: { type: DataTypes.TEXT },
    diagnostico: { type: DataTypes.TEXT },
    insumos_utilizados: { type: DataTypes.TEXT },
    monto_cobrado: { type: DataTypes.DECIMAL(10, 2) }
}, { tableName: 'historial_clinico', timestamps: false });

Cita.hasOne(Historial, { foreignKey: 'cita_id' });
Historial.belongsTo(Cita, { foreignKey: 'cita_id' });

module.exports = { sequelize, Usuario, Cita, Historial };