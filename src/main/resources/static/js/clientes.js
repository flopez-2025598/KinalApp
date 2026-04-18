/* ==========================================
   clientes.js — KinalApp
   ========================================== */

// ✅ Ruta relativa — sin puerto hardcodeado, funciona en cualquier entorno
const API_URL = '/clientes';

let dpiEnEdicion    = null;
let dpiParaEliminar = null;

// Lista completa en memoria (para filtrar sin re-fetch)
let _todosLosClientes = [];

/* ---- INICIO ---- */
document.addEventListener('DOMContentLoaded', () => {
    cargarClientes();
});

/* ==========================================
   1. CARGAR TABLA — GET /clientes
   ========================================== */
async function cargarClientes() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        _todosLosClientes = await res.json();
        renderizarTabla(_todosLosClientes);
    } catch (err) {
        console.error('Error al cargar clientes:', err);
        mostrarToast('No se pudo conectar con el servidor', 'error');
    }
}

/* ==========================================
   RENDERIZAR TABLA
   ========================================== */
function renderizarTabla(lista) {
    const tbody      = document.getElementById('tablaClientes');
    const emptyState = document.getElementById('emptyState');

    if (!lista || lista.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    tbody.innerHTML = lista.map(c => `
        <tr>
            <td><strong>${c.dpiCliente}</strong></td>
            <td>${c.nombreCliente}</td>
            <td>${c.apellidoCliente}</td>
            <td>${c.direccion || '—'}</td>
            <td>
                <span class="badge ${c.estado === 1 ? 'badge--active' : 'badge--inactive'}">
                    ${c.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="row-actions">
                    <button class="btn btn--secondary btn--sm"
                        onclick="prepararEdicion(${c.dpiCliente})">✎ Editar</button>
                    <button class="btn btn--danger btn--sm"
                        onclick="confirmarEliminar(${c.dpiCliente})">🗑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

/* ==========================================
   BARRA DE BÚSQUEDA — filtra por DPI
   Llamada desde oninput="buscarEnTabla()" en el HTML
   ========================================== */
function buscarEnTabla() {
    const query = document.getElementById('inputBusqueda').value.trim();

    if (query === '') {
        renderizarTabla(_todosLosClientes);
        return;
    }

    const resultados = _todosLosClientes.filter(c =>
        String(c.dpiCliente).includes(query)
    );

    renderizarTabla(resultados);

    if (resultados.length === 0) {
        mostrarToast(`No se encontró ningún cliente con DPI "${query}"`, 'error');
    }
}

/* ==========================================
   2. GUARDAR — POST (crear) o PUT (actualizar)
   BUG FIX: antes usaba http://localhost:8021 → ahora ruta relativa /clientes
   ========================================== */
async function guardarCliente() {
    const dpi      = document.getElementById('dpiCliente').value.trim();
    const nombre   = document.getElementById('nombreCliente').value.trim();
    const apellido = document.getElementById('apellidoCliente').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const estado   = parseInt(document.getElementById('estado').value);

    if (!dpi || !nombre || !apellido) {
        mostrarToast('DPI, nombre y apellido son obligatorios', 'error');
        return;
    }

    const cliente = {
        dpiCliente:      parseInt(dpi),
        nombreCliente:   nombre,
        apellidoCliente: apellido,
        direccion:       direccion,
        estado:          estado
    };

    try {
        let res;

        if (dpiEnEdicion === null) {
            res = await fetch(API_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(cliente)
            });
        } else {
            res = await fetch(`${API_URL}/${dpiEnEdicion}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(cliente)
            });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        mostrarToast(dpiEnEdicion === null ? 'Cliente creado ✓' : 'Cliente actualizado ✓', 'success');
        limpiarFormulario();
        cargarClientes();

    } catch (err) {
        console.error('Error al guardar cliente:', err);
        mostrarToast('Error al guardar el cliente', 'error');
    }
}

/* ==========================================
   3. EDITAR — carga datos y bloquea la PK
   dpiCliente es PK y FK en Ventas → no se puede cambiar
   ========================================== */
async function prepararEdicion(dpi) {
    try {
        const res = await fetch(`${API_URL}/${dpi}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const c = await res.json();

        document.getElementById('dpiCliente').value      = c.dpiCliente;
        document.getElementById('nombreCliente').value   = c.nombreCliente;
        document.getElementById('apellidoCliente').value = c.apellidoCliente;
        document.getElementById('direccion').value       = c.direccion || '';
        document.getElementById('estado').value          = c.estado;

        document.getElementById('dpiCliente').disabled = true;
        document.getElementById('dpiHint').textContent = '🔒 Llave primaria — no editable (FK en Ventas)';

        dpiEnEdicion = dpi;

        abrirModal('modalLlavePrimaria');
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Error al cargar cliente:', err);
        mostrarToast('Error al cargar el cliente', 'error');
    }
}

/* ==========================================
   4. ELIMINAR — DELETE /clientes/{dpi}
   ========================================== */
function confirmarEliminar(dpi) {
    dpiParaEliminar = dpi;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarCliente;
    abrirModal('modalEliminar');
}

async function eliminarCliente() {
    cerrarModal('modalEliminar');
    if (dpiParaEliminar === null) return;

    try {
        const res = await fetch(`${API_URL}/${dpiParaEliminar}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        mostrarToast('Cliente eliminado ✓', 'success');
        cargarClientes();
    } catch (err) {
        console.error('Error al eliminar:', err);
        mostrarToast('Error al eliminar. ¿Tiene ventas asociadas?', 'error');
    } finally {
        dpiParaEliminar = null;
    }
}

/* ==========================================
   UTILIDADES
   ========================================== */
function limpiarFormulario() {
    document.getElementById('dpiCliente').value      = '';
    document.getElementById('nombreCliente').value   = '';
    document.getElementById('apellidoCliente').value = '';
    document.getElementById('direccion').value       = '';
    document.getElementById('estado').value          = '1';

    document.getElementById('dpiCliente').disabled   = false;
    document.getElementById('dpiHint').textContent   = '';

    dpiEnEdicion = null;
}

/* ---- MODALES ---- */
function abrirModal(id)  { document.getElementById(id).classList.add('active'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('active'); }

document.addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
        document.querySelectorAll('.modal-overlay.active')
            .forEach(m => m.classList.remove('active'));
    }
});

/* ---- TOAST ---- */
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className   = `toast toast--${tipo} toast--visible`;
    setTimeout(() => { toast.className = 'toast'; }, 3000);
}