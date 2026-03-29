const express = require('express');
const path = require('path');
const { Usuario, Cita, Historial } = require('./models');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- LOGIN ---
app.post('/api/login', async (req, res) => {
    try {
        const { usuario, clave } = req.body;
        const user = await Usuario.findOne({ where: { nombre_usuario: usuario } });
        if (user && user.password === clave) {
            return res.json({ success: true, rol: user.rol });
        }
        res.status(401).json({ error: "Credenciales incorrectas" });
    } catch (e) { res.status(500).json({ error: "Error en el servidor" }); }
});

// --- CITAS (AGENDA) ---
app.get('/api/citas', async (req, res) => {
    try {
        const citas = await Cita.findAll({ order: [['fecha_cita', 'ASC']] });
        res.json(citas);
    } catch (e) { res.status(500).json([]); }
});

app.post('/api/citas', async (req, res) => {
    try {
        const nueva = await Cita.create(req.body);
        res.status(201).json(nueva);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/citas/:id', async (req, res) => {
    try {
        await Cita.update(req.body, { where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/citas/:id', async (req, res) => {
    try {
        await Cita.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- HISTORIAL CLÍNICO ---
app.get('/api/historial', async (req, res) => {
    try {
        const historial = await Historial.findAll({ order: [['fecha_registro', 'DESC']] });
        res.json(historial);
    } catch (e) { res.status(500).json([]); }
});

app.post('/api/historial', async (req, res) => {
    try {
        await Historial.create(req.body);
        res.status(201).json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('Servidor dental activo en puerto 3000'));