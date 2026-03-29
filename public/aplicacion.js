let modalCita, modalAtencion;
let historialMemoria = []; // Almacena los datos para el buscador

// --- 1. LOGIN Y SESIÓN ---
async function ejecutarLogin() {
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, clave })
        });
        if (res.ok) {
            const datos = await res.json();
            localStorage.setItem('rol', datos.rol);
            window.location.replace('agenda.html');
        } else { alert("Credenciales incorrectas"); }
    } catch (e) { console.error("Error login:", e); }
}

function cerrarSesion() {
    localStorage.clear();
    window.location.replace('index.html');
}

// --- 2. GESTIÓN DE CITAS ---
async function cargarAgenda() {
    try {
        const res = await fetch('/api/citas');
        const citas = await res.json();
        const contenedor = document.getElementById('contenedorCitas');
        if (!contenedor || !Array.isArray(citas)) return;

        const rol = localStorage.getItem('rol');
        contenedor.innerHTML = citas.map(c => `
            <div class="card card-paciente mb-2 p-3 shadow-sm bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="text-primary">${c.nombre} ${c.apellidos}</strong><br>
                        <small class="text-muted">${c.procedimiento} | ${c.profesional}</small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary" onclick="abrirAtencion(${c.id}, '${c.nombre} ${c.apellidos}')">Atender</button>
                        <button class="btn btn-sm btn-outline-warning" onclick="prepararEdicion(${c.id}, '${c.nombre}', '${c.apellidos}', '${c.procedimiento}', '${c.fecha_cita}', '${c.profesional}', '${c.fecha_nacimiento}')">Editar</button>
                        ${rol === 'admin' ? `<button class="btn btn-sm btn-outline-danger" onclick="eliminarCita(${c.id})">Borrar</button>` : ''}
                    </div>
                </div>
            </div>`).join('');
    } catch (e) { console.error("Error agenda:", e); }
}

document.getElementById('formCita')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editCitaId').value;
    const datos = {
        nombre: document.getElementById('citaNombre').value,
        apellidos: document.getElementById('citaApellidos').value,
        fecha_nacimiento: document.getElementById('citaNacimiento').value,
        procedimiento: document.getElementById('citaProc').value,
        profesional: document.getElementById('citaProf').value,
        fecha_cita: document.getElementById('citaFecha').value
    };

    const res = await fetch(id ? `/api/citas/${id}` : '/api/citas', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('modalCita')).hide();
        cargarAgenda();
    }
});

// --- 3. HISTORIAL Y BUSCADOR ---
async function cargarHistorial() {
    try {
        const res = await fetch('/api/historial');
        const datos = await res.json();
        if (Array.isArray(datos)) {
            historialMemoria = datos;
            renderizarHistorial(historialMemoria);
        }
    } catch (e) { console.error("Error historial:", e); }
}

// SOLUCIÓN AL "INVALID DATE": Se añade validación de fecha
function renderizarHistorial(lista) {
    const contenedor = document.getElementById('contenedorHistorial');
    const totalLabel = document.getElementById('montoTotalHistorial');
    if (!contenedor) return;

    let totalRecaudado = 0;

    contenedor.innerHTML = lista.map(h => {
        const monto = parseFloat(h.monto_cobrado) || 0;
        totalRecaudado += monto;

        // Validar si la fecha es válida para evitar el "Invalid Date"
        const fechaObj = new Date(h.fecha_registro);
        const fechaTexto = isNaN(fechaObj.getTime()) ? "Fecha no reg." : fechaObj.toLocaleDateString();

        return `
            <div class="historial-item p-3 mb-2 shadow-sm bg-white">
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-bold text-dark small">${h.paciente_nombre}</span>
                    <span class="text-muted small">${fechaTexto}</span>
                </div>
                <div class="small text-secondary"><strong>Diag:</strong> ${h.diagnostico}</div>
                <div class="text-end fw-bold text-success mt-1 border-top pt-1">
                    $${monto.toLocaleString('es-CL')}
                </div>
            </div>`;
    }).join('');

    if (totalLabel) totalLabel.innerText = `$${totalRecaudado.toLocaleString('es-CL')}`;
}

function filtrarHistorial() {
    const query = document.getElementById('busquedaHistorial').value.toLowerCase();
    const filtrados = historialMemoria.filter(h => 
        h.paciente_nombre.toLowerCase().includes(query) || 
        h.diagnostico.toLowerCase().includes(query)
    );
    renderizarHistorial(filtrados);
}

document.getElementById('formAtencion')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = {
        cita_id: document.getElementById('atencionCitaId').value,
        paciente_nombre: document.getElementById('atencionNombre').value,
        diagnostico: document.getElementById('atencionDiagnostico').value,
        insumos_utilizados: document.getElementById('atencionInsumos').value,
        observaciones: document.getElementById('atencionObservaciones').value,
        monto_cobrado: document.getElementById('atencionMonto').value
    };

    const res = await fetch('/api/historial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });

    if (res.ok) {
        bootstrap.Modal.getInstance(document.getElementById('modalAtencion')).hide();
        cargarHistorial();
    }
});

// --- 4. FUNCIONES AUXILIARES ---
function abrirModalNuevo() {
    document.getElementById('formCita').reset();
    document.getElementById('editCitaId').value = '';
    ['citaNombre', 'citaApellidos', 'citaNacimiento'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.readOnly = false;
    });
    document.getElementById('tituloModal').innerText = 'Nuevo Paciente';
    new bootstrap.Modal(document.getElementById('modalCita')).show();
}

function prepararEdicion(id, nom, ape, proc, fecha, prof, nac) {
    document.getElementById('editCitaId').value = id;
    const n = document.getElementById('citaNombre'), a = document.getElementById('citaApellidos'), d = document.getElementById('citaNacimiento');
    if (n) { n.value = nom; n.readOnly = true; }
    if (a) { a.value = ape; a.readOnly = true; }
    if (d) { d.value = nac; d.readOnly = true; } // BLOQUEO DATOS PERSONALES
    
    document.getElementById('citaProc').value = proc;
    document.getElementById('citaProf').value = prof;
    
    // Formatear fecha para el input datetime-local
    if (fecha) {
        document.getElementById('citaFecha').value = new Date(fecha).toISOString().slice(0, 16);
    }
    
    document.getElementById('tituloModal').innerText = 'Editar Cita';
    new bootstrap.Modal(document.getElementById('modalCita')).show();
}

function abrirAtencion(id, nombre) {
    document.getElementById('formAtencion').reset();
    document.getElementById('atencionCitaId').value = id;
    document.getElementById('atencionNombre').value = nombre;
    new bootstrap.Modal(document.getElementById('modalAtencion')).show();
}

async function eliminarCita(id) {
    if (confirm("¿Eliminar registro?")) {
        await fetch(`/api/citas/${id}`, { method: 'DELETE' });
        cargarAgenda();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('agenda.html')) {
        const rol = localStorage.getItem('rol');
        if (!rol) window.location.replace('index.html');
        const info = document.getElementById('infoUsuario');
        if (info) info.innerText = `Sesión: ${rol}`;
        cargarAgenda();
        cargarHistorial();
    }
});