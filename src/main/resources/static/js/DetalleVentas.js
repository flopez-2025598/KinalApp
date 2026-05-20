/*
   DetalleVentas.js — KinalApp Frontend
   Campos editables en modo actualización: cantidad, precioUnitario, subtotal.
*/

const API_URL = '/detalleventas';

let codigoEnEdicion      = null;
let codigoParaEliminar   = null;
let _fkProductoGuardado  = null;
let _fkVentaGuardada     = null;

// Lista completa en memoria (para filtrar sin re-fetch)
let _todosLosDetalles = [];

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarDetalles);
} else {
    // Si el script se carga tras DOMContentLoaded, llamar directamente
    cargarDetalles();
}

/*
   1. CARGAR TABLA — GET /detalleventas
*/
async function cargarDetalles() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        _todosLosDetalles = await response.json();
        console.debug('[DetalleVentas] cargados:', _todosLosDetalles.length);
        // Mostrar contador en la página para diagnóstico
        try {
            const el = document.getElementById('debugCount');
            if (el) el.textContent = _todosLosDetalles.length;
        } catch(e) { console.warn(e); }

        // Escribir JSON crudo para inspección
        try {
            const dbg = document.getElementById('debugJson');
            if (dbg) dbg.textContent = JSON.stringify(_todosLosDetalles.slice(0,500), null, 2);
        } catch(e) { console.warn(e); }

        renderizarTabla(_todosLosDetalles);
    } catch (error) {
        console.error('Error al cargar detalles:', error);
        mostrarToast('Error al conectar con el servidor', 'error');
    }
}

function renderizarTabla(detalles) {
    const tbody      = document.getElementById('tablaDetalles');
    const emptyState = document.getElementById('emptyState');

    if (!detalles || detalles.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    tbody.innerHTML = detalles.map(d => `
        <tr>
            <td><strong>${d.codigoDetalleVenta}</strong></td>
            <td>${d.cantidad}</td>
            <td class="price-cell">Q ${parseFloat(d.precioUnitario).toFixed(2)}</td>
            <td class="subtotal-cell">Q ${parseFloat(d.subtotal).toFixed(2)}</td>
            <td class="fk-cell">${d.productoCodigoProducto}</td>
            <td class="fk-cell">${d.ventasCodigoVenta}</td>
            <td>
                <div class="row-actions">
                    <button class="btn btn--secondary btn--sm"
                        onclick="cargarEnFormulario(${d.codigoDetalleVenta})">
                        ✎ Editar
                    </button>
                    <button class="btn btn--danger btn--sm"
                        onclick="confirmarEliminar(${d.codigoDetalleVenta})">
                        🗑
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/*
   BARRA DE BÚSQUEDA — filtra por código de detalle
   Llamada desde oninput="buscarEnTabla()" en el HTML.
   Esta función faltaba y causaba error en consola.
*/
function buscarEnTabla() {
    const query = document.getElementById('inputBusqueda').value.trim();

    if (query === '') {
        renderizarTabla(_todosLosDetalles);
        return;
    }

    const resultados = _todosLosDetalles.filter(d =>
        String(d.codigoDetalleVenta).includes(query)
    );

    renderizarTabla(resultados);

    if (resultados.length === 0) {
        mostrarToast(`No se encontró detalle con código "${query}"`, 'error');
    }
}

/*
   CÁLCULO DE SUBTOTAL (automático)
*/
function calcularSubtotal() {
    const cant   = parseFloat(document.getElementById('cantidad').value)       || 0;
    const precio = parseFloat(document.getElementById('precioUnitario').value) || 0;
    document.getElementById('subtotal').value = (cant * precio).toFixed(2);
}

/*
   2. GUARDAR — POST (crear) o PUT (actualizar)
*/
async function guardarDetalleVenta() {
    const codigo     = codigoEnEdicion !== null
        ? codigoEnEdicion
        : parseInt(document.getElementById('codigoDetalleVenta').value);

    const cantidad   = parseInt(document.getElementById('cantidad').value);
    const precioUnit = parseFloat(document.getElementById('precioUnitario').value);
    const subtotal   = parseFloat(document.getElementById('subtotal').value);

    const codProd = codigoEnEdicion !== null
        ? _fkProductoGuardado
        : parseInt(document.getElementById('productoCodigoProducto').value);
    const codVen  = codigoEnEdicion !== null
        ? _fkVentaGuardada
        : parseInt(document.getElementById('ventasCodigoVenta').value);

    if (!codigo || !cantidad || !precioUnit || !codProd || !codVen) {
        mostrarToast('Faltan datos obligatorios', 'error');
        return;
    }

    const data = {
        codigoDetalleVenta:     codigo,
        cantidad:               cantidad,
        precioUnitario:         precioUnit,
        subtotal:               subtotal,
        productoCodigoProducto: codProd,
        ventasCodigoVenta:      codVen
    };

    try {
        const method = codigoEnEdicion !== null ? 'PUT' : 'POST';
        const url    = codigoEnEdicion !== null ? `${API_URL}/${codigoEnEdicion}` : API_URL;

        const res = await fetch(url, {
            method:  method,
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        mostrarToast(codigoEnEdicion !== null ? 'Detalle actualizado ✓' : 'Detalle creado ✓', 'success');
        limpiarFormulario();
        cargarDetalles();

    } catch (error) {
        console.error('Error al guardar:', error);
        mostrarToast('Error al guardar el detalle', 'error');
    }
}

/*
   3. EDITAR — carga datos en el formulario y bloquea PK y FKs
*/
async function cargarEnFormulario(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const d = await res.json();

        document.getElementById('codigoDetalleVenta').value      = d.codigoDetalleVenta;
        document.getElementById('cantidad').value                 = d.cantidad;
        document.getElementById('precioUnitario').value           = d.precioUnitario;
        document.getElementById('subtotal').value                 = parseFloat(d.subtotal).toFixed(2);
        document.getElementById('productoCodigoProducto').value   = d.productoCodigoProducto;
        document.getElementById('ventasCodigoVenta').value        = d.ventasCodigoVenta;

        // Guardar FKs en memoria antes de bloquear los inputs
        _fkProductoGuardado = d.productoCodigoProducto;
        _fkVentaGuardada    = d.ventasCodigoVenta;
        codigoEnEdicion     = id;

        // Bloquear PK
        document.getElementById('codigoDetalleVenta').disabled    = true;
        document.getElementById('codigoDetalleHint').textContent  = 'PK — no editable';

        // Bloquear FKs — modificarlas cambiaría el producto o venta asociada
        document.getElementById('productoCodigoProducto').disabled = true;
        document.getElementById('productoHint').textContent        = 'FK Productos — no editable';
        document.getElementById('ventasCodigoVenta').disabled      = true;
        document.getElementById('ventaHint').textContent           = 'FK Ventas — no editable';

        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al cargar detalle:', error);
        mostrarToast('Error al cargar el detalle', 'error');
    }
}

/*
   4. ELIMINAR
*/
function confirmarEliminar(id) {
    codigoParaEliminar = id;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarDetalle;
    abrirModal('modalEliminar');
}

async function eliminarDetalle() {
    cerrarModal('modalEliminar');
    if (codigoParaEliminar === null) return;

    try {
        const res = await fetch(`${API_URL}/${codigoParaEliminar}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        mostrarToast('Detalle eliminado ✓', 'success');
        cargarDetalles();
    } catch (error) {
        console.error('Error al eliminar:', error);
        mostrarToast('Error al eliminar el detalle', 'error');
    } finally {
        codigoParaEliminar = null;
    }
}

/*
   LIMPIAR FORMULARIO
*/
function limpiarFormulario() {
    codigoEnEdicion     = null;
    _fkProductoGuardado = null;
    _fkVentaGuardada    = null;

    ['codigoDetalleVenta', 'cantidad', 'precioUnitario', 'subtotal',
     'productoCodigoProducto', 'ventasCodigoVenta']
        .forEach(id => { document.getElementById(id).value = ''; });

    document.getElementById('codigoDetalleVenta').disabled      = false;
    document.getElementById('productoCodigoProducto').disabled  = false;
    document.getElementById('ventasCodigoVenta').disabled       = false;

    ['codigoDetalleHint', 'productoHint', 'ventaHint']
        .forEach(id => { document.getElementById(id).textContent = ''; });
}

/* ---- MODALES ---- */
function abrirModal(id)  { document.getElementById(id).classList.add('active'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('active'); }

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        document.querySelectorAll('.modal-overlay.active')
            .forEach(m => m.classList.remove('active'));
    }
});

/* ---- TOAST ---- */
function mostrarToast(mensaje, tipo = 'success') {
    const t = document.getElementById('toast');
    t.textContent = mensaje;
    t.className   = `toast toast--${tipo} toast--visible`;
    setTimeout(() => { t.className = 'toast'; }, 3000);
}