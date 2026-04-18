/* ==========================================
   Productos.js — KinalApp
   ========================================== */

const API_URL = '/productos';

let modoEdicion     = false;
let idOriginal      = null;
let codigoAEliminar = null;

let _todosLosProductos = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

/* ---- CARGAR TABLA ---- */
async function cargarProductos() {
    const tabla      = document.getElementById('tablaProductos');
    const emptyState = document.getElementById('emptyState');

    try {
        const res  = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        _todosLosProductos = await res.json();

        tabla.innerHTML = '';

        if (_todosLosProductos.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        renderizarTabla(_todosLosProductos);

    } catch (err) {
        console.error('Error al cargar productos:', err);
        mostrarToast('No se pudo cargar la lista de productos.', 'error');
    }
}

function renderizarTabla(lista) {
    const tabla      = document.getElementById('tablaProductos');
    const emptyState = document.getElementById('emptyState');

    if (!lista || lista.length === 0) {
        tabla.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    tabla.innerHTML = lista.map(p => `
        <tr>
            <td><strong>${p.codigoProducto}</strong></td>
            <td>${p.nombreProducto}</td>
            <td>Q ${parseFloat(p.precio).toFixed(2)}</td>
            <td>${p.stock}</td>
            <td>
                <span class="badge ${p.estado === 1 ? 'badge--active' : 'badge--inactive'}">
                    ${p.estado === 1 ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="row-actions">
                    <button class="btn btn--secondary btn--sm"
                        onclick="editarProducto(${p.codigoProducto}, '${p.nombreProducto}', ${p.precio}, ${p.stock}, ${p.estado})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn--danger btn--sm"
                        onclick="confirmarEliminar(${p.codigoProducto})">
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/* ---- BARRA DE BÚSQUEDA por Código ---- */
function buscarEnTabla() {
    const query = document.getElementById('inputBusqueda').value.trim();

    if (query === '') {
        renderizarTabla(_todosLosProductos);
        return;
    }

    const resultados = _todosLosProductos.filter(p =>
        String(p.codigoProducto).includes(query)
    );

    renderizarTabla(resultados);

    if (resultados.length === 0) {
        mostrarToast(`No se encontró producto con código "${query}"`, 'error');
    }
}

/* ---- GUARDAR ---- */
async function guardarProducto() {
    const codigoVal = document.getElementById('codigoProducto').value.trim();
    const nombre    = document.getElementById('nombreProducto').value.trim();
    const precioVal = document.getElementById('precio').value.trim();
    const stockVal  = document.getElementById('stock').value.trim();
    const estadoVal = document.getElementById('estado').value;

    if (!codigoVal || !nombre || !precioVal || !stockVal) {
        mostrarToast('Por favor completa todos los campos obligatorios.', 'error');
        return;
    }

    const producto = {
        codigoProducto: parseInt(codigoVal),
        nombreProducto: nombre,
        precio:         parseFloat(precioVal),
        stock:          parseInt(stockVal),
        estado:         parseInt(estadoVal)
    };

    try {
        let res;
        if (modoEdicion) {
            res = await fetch(`${API_URL}/${idOriginal}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(producto)
            });
        } else {
            res = await fetch(API_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(producto)
            });
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        limpiarFormulario();
        await cargarProductos();
        mostrarToast(modoEdicion ? 'Producto actualizado ✓' : 'Producto guardado ✓', 'success');

    } catch (err) {
        console.error('Error al guardar producto:', err);
        mostrarToast('Ocurrió un error al guardar el producto.', 'error');
    }
}

/* ---- EDITAR ---- */
function editarProducto(codigo, nombre, precio, stock, estado) {
    document.getElementById('codigoProducto').value = codigo;
    document.getElementById('nombreProducto').value = nombre;
    document.getElementById('precio').value         = precio;
    document.getElementById('stock').value          = stock;
    document.getElementById('estado').value         = estado;

    document.getElementById('codigoProducto').disabled = true;
    document.getElementById('codigoHint').textContent  = '🔒 Llave primaria — no editable (FK en DetalleVenta)';

    idOriginal  = codigo;
    modoEdicion = true;

    abrirModal('modalLlavePrimaria');
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

/* ---- LIMPIAR ---- */
function limpiarFormulario() {
    document.getElementById('codigoProducto').value = '';
    document.getElementById('nombreProducto').value = '';
    document.getElementById('precio').value         = '';
    document.getElementById('stock').value          = '';
    document.getElementById('estado').value         = '1';

    document.getElementById('codigoProducto').disabled = false;
    document.getElementById('codigoHint').textContent  = '';

    modoEdicion = false;
    idOriginal  = null;
}

/* ---- ELIMINAR ---- */
function confirmarEliminar(codigo) {
    codigoAEliminar = codigo;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarProducto;
    abrirModal('modalEliminar');
}

async function eliminarProducto() {
    cerrarModal('modalEliminar');
    if (codigoAEliminar === null) return;

    try {
        const res = await fetch(`${API_URL}/${codigoAEliminar}`, { method: 'DELETE' });

        if (res.status === 404) {
            mostrarToast('El producto no existe o ya fue eliminado.', 'error');
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarProductos();
        mostrarToast('Producto eliminado ✓', 'success');

    } catch (err) {
        console.error('Error al eliminar:', err);
        mostrarToast('Error al eliminar. ¿Tiene detalles de venta asociados?', 'error');
    } finally {
        codigoAEliminar = null;
    }
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