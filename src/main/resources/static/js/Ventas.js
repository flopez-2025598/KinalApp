/* ==========================================
   Ventas.js — KinalApp
   ========================================== */

// ✅ Ruta relativa — antes era http://localhost:8080/ventas
const API_URL = '/ventas';

let codigoEnEdicion    = null;
let codigoParaEliminar = null;
let _fkClienteGuardado = null;
let _fkUsuarioGuardado = null;

let _todasLasVentas = [];

/* ---- INICIO ---- */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fechaVenta').value = new Date().toISOString().split('T')[0];
    cargarVentas();
});

/* ---- CARGAR TABLA ---- */
async function cargarVentas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        _todasLasVentas = await response.json();
        renderizarTabla(_todasLasVentas);
    } catch (err) {
        console.error('Error al cargar ventas:', err);
        mostrarToast('No se pudo conectar con el servidor', 'error');
    }
}

function renderizarTabla(ventas) {
    const tbody      = document.getElementById('tablaVentas');
    const emptyState = document.getElementById('emptyState');

    if (!ventas || ventas.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    emptyState.style.display = 'none';

    tbody.innerHTML = ventas.map(v => {
        const fecha = v.fechaVenta
            ? new Date(v.fechaVenta + 'T00:00:00').toLocaleDateString('es-GT')
            : '—';
        const total = `Q ${parseFloat(v.total || 0).toFixed(2)}`;

        return `
            <tr>
                <td><strong>${v.codigoVenta}</strong></td>
                <td>${fecha}</td>
                <td class="price-cell">${total}</td>
                <td>
                    <span class="badge ${v.estado === 1 ? 'badge--active' : 'badge--inactive'}">
                        ${v.estado === 1 ? 'Activa' : 'Anulada'}
                    </span>
                </td>
                <td class="fk-cell">🔗 ${v.clientesDpiCliente}</td>
                <td class="fk-cell">🔗 ${v.usuariosCodigoUsuario}</td>
                <td>
                    <div class="row-actions">
                        <button class="btn btn--secondary btn--sm"
                            onclick="cargarEnFormulario(${v.codigoVenta})">
                            ✎ Editar
                        </button>
                        <button class="btn btn--warn btn--sm"
                            onclick="abrirModal('modalLlaves')"
                            title="Ver restricciones de llaves">
                            🔑 LK
                        </button>
                        <button class="btn btn--danger btn--sm"
                            onclick="confirmarEliminar(${v.codigoVenta})">
                            🗑
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/* ---- BARRA DE BÚSQUEDA por Código de Venta ---- */
function buscarEnTabla() {
    const query = document.getElementById('inputBusqueda').value.trim();

    if (query === '') {
        renderizarTabla(_todasLasVentas);
        return;
    }

    const resultados = _todasLasVentas.filter(v =>
        String(v.codigoVenta).includes(query)
    );

    renderizarTabla(resultados);

    if (resultados.length === 0) {
        mostrarToast(`No se encontró venta con código "${query}"`, 'error');
    }
}

/* ---- GUARDAR ---- */
async function guardarVenta() {
    const codigo = codigoEnEdicion !== null
        ? codigoEnEdicion
        : parseInt(document.getElementById('codigoVenta').value);

    const fecha  = document.getElementById('fechaVenta').value;
    const total  = parseFloat(document.getElementById('total').value);
    const estado = parseInt(document.getElementById('estado').value);

    const dpiCliente = codigoEnEdicion !== null
        ? _fkClienteGuardado
        : parseInt(document.getElementById('clientesDpiCliente').value);

    const codUsuario = codigoEnEdicion !== null
        ? _fkUsuarioGuardado
        : parseInt(document.getElementById('usuariosCodigoUsuario').value);

    if (!codigo || !fecha) {
        mostrarToast('Código y fecha son obligatorios', 'error');
        return;
    }
    if (isNaN(total) || total < 0) {
        mostrarToast('El total debe ser un número válido', 'error');
        return;
    }
    if (!dpiCliente || !codUsuario) {
        mostrarToast('El DPI del cliente y el código de usuario son obligatorios', 'error');
        return;
    }

    const ventaData = {
        codigoVenta:           codigo,
        fechaVenta:            fecha,
        total:                 total,
        estado:                estado,
        clientesDpiCliente:    dpiCliente,
        usuariosCodigoUsuario: codUsuario
    };

    try {
        let response;
        if (codigoEnEdicion === null) {
            response = await fetch(API_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(ventaData)
            });
        } else {
            response = await fetch(`${API_URL}/${codigoEnEdicion}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(ventaData)
            });
        }

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        mostrarToast(codigoEnEdicion === null ? 'Venta creada ✓' : 'Venta actualizada ✓', 'success');
        limpiarFormulario();
        cargarVentas();

    } catch (err) {
        console.error('Error al guardar venta:', err);
        mostrarToast('Error al guardar la venta', 'error');
    }
}

/* ---- EDITAR ---- */
async function cargarEnFormulario(codigo) {
    try {
        const response = await fetch(`${API_URL}/${codigo}`);
        if (!response.ok) throw new Error('No encontrado');
        const v = await response.json();

        document.getElementById('codigoVenta').value            = v.codigoVenta;
        document.getElementById('fechaVenta').value             = v.fechaVenta;
        document.getElementById('total').value                  = v.total;
        document.getElementById('estado').value                 = v.estado;
        document.getElementById('clientesDpiCliente').value     = v.clientesDpiCliente;
        document.getElementById('usuariosCodigoUsuario').value  = v.usuariosCodigoUsuario;

        _fkClienteGuardado = v.clientesDpiCliente;
        _fkUsuarioGuardado = v.usuariosCodigoUsuario;

        document.getElementById('codigoVenta').disabled           = true;
        document.getElementById('codigoVentaHint').textContent    = '🔒 PK — no editable';
        document.getElementById('clientesDpiCliente').disabled    = true;
        document.getElementById('dpiClienteHint').textContent     = '🔗 FK → Clientes — no editable';
        document.getElementById('clientesDpiCliente').classList.add('fk-locked');
        document.getElementById('usuariosCodigoUsuario').disabled = true;
        document.getElementById('codigoUsuarioHint').textContent  = '🔗 FK → Usuarios — no editable';
        document.getElementById('usuariosCodigoUsuario').classList.add('fk-locked');

        codigoEnEdicion = codigo;
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Error al cargar venta:', err);
        mostrarToast('Error al cargar la venta', 'error');
    }
}

/* ---- ELIMINAR ---- */
function confirmarEliminar(codigo) {
    codigoParaEliminar = codigo;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarVenta;
    abrirModal('modalEliminar');
}

async function eliminarVenta() {
    cerrarModal('modalEliminar');
    if (codigoParaEliminar === null) return;

    try {
        const response = await fetch(`${API_URL}/${codigoParaEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        mostrarToast('Venta eliminada ✓', 'success');
        cargarVentas();
    } catch (err) {
        console.error('Error al eliminar venta:', err);
        mostrarToast('Error al eliminar. ¿Tiene detalles de venta?', 'error');
    } finally {
        codigoParaEliminar = null;
    }
}

/* ---- LIMPIAR ---- */
function limpiarFormulario() {
    document.getElementById('codigoVenta').value           = '';
    document.getElementById('fechaVenta').value            = new Date().toISOString().split('T')[0];
    document.getElementById('total').value                 = '';
    document.getElementById('estado').value                = '1';
    document.getElementById('clientesDpiCliente').value    = '';
    document.getElementById('usuariosCodigoUsuario').value = '';

    ['codigoVenta', 'clientesDpiCliente', 'usuariosCodigoUsuario'].forEach(id => {
        const el = document.getElementById(id);
        el.disabled = false;
        el.classList.remove('fk-locked');
    });

    ['codigoVentaHint', 'dpiClienteHint', 'codigoUsuarioHint']
        .forEach(id => { document.getElementById(id).textContent = ''; });

    codigoEnEdicion    = null;
    _fkClienteGuardado = null;
    _fkUsuarioGuardado = null;
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
    toast.className   = `toast toast--${tipo} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}