const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citaController');

// Asegúrate de que estos nombres coincidan con las funciones exportadas en el controlador
router.get('/', citaController.obtenerCitas);
router.post('/', citaController.crearCita);
router.put('/:id', citaController.actualizarCita);
router.delete('/:id', citaController.eliminarCita);

module.exports = router;