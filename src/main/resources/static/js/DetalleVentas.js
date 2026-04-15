const API_URL = 'http://localhost:8021/detalleventas';
let codigoEnEdicion = null;
let codigoParaEliminar = null;
let _fkProductoGuardado = null;
let _fkVentaGuardada = null;

document.addEventListener('DOMContentLoaded', cargarDetalles);

async function cargarDetalles() {
    try {
        const response = await fetch(API_URL);
        const detalles = await response.json();
        renderizarTabla(detalles);
    } catch (error) {
        mostrarToast('Error al conectar con el servidor', 'error');
    }
}

function renderizarTabla(detalles) {
    const tbody = document.getElementById('tablaDetalles');
    const emptyState = document.getElementById('emptyState');

    if (detalles.length === 0) {
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
            <td>${d.productoCodigoProducto}</td>
            <td>${d.ventasCodigoVenta}</td>
            <td>
                <div class="row-actions">
                    <button class="btn btn--secondary btn--sm" onclick="cargarEnFormulario(${d.codigoDetalleVenta})">✎</button>
                    <button class="btn btn--danger btn--sm" onclick="confirmarEliminar(${d.codigoDetalleVenta})">🗑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function calcularSubtotal() {
    const cant = parseFloat(document.getElementById('cantidad').value) || 0;
    const precio = parseFloat(document.getElementById('precioUnitario').value) || 0;
    document.getElementById('subtotal').value = (cant * precio).toFixed(2);
}

async function guardarDetalleVenta() {
    const codigo = codigoEnEdicion !== null ? codigoEnEdicion : parseInt(document.getElementById('codigoDetalleVenta').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const precioUnit = parseFloat(document.getElementById('precioUnitario').value);
    const subtotal = parseFloat(document.getElementById('subtotal').value);
    const codProd = codigoEnEdicion !== null ? _fkProductoGuardado : parseInt(document.getElementById('productoCodigoProducto').value);
    const codVen = codigoEnEdicion !== null ? _fkVentaGuardada : parseInt(document.getElementById('ventasCodigoVenta').value);

    if (!codigo || !cantidad || !precioUnit || !codProd || !codVen) {
        mostrarToast('Faltan datos obligatorios', 'error');
        return;
    }

    const data = {
        codigoDetalleVenta: codigo,
        cantidad: cantidad,
        precioUnitario: precioUnit,
        subtotal: subtotal,
        productoCodigoProducto: codProd,
        ventasCodigoVenta: codVen
    };

    try {
        const method = codigoEnEdicion ? 'PUT' : 'POST';
        const url = codigoEnEdicion ? `${API_URL}/${codigoEnEdicion}` : API_URL;
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            mostrarToast(codigoEnEdicion ? 'Actualizado' : 'Creado');
            limpiarFormulario();
            cargarDetalles();
        }
    } catch (e) { mostrarToast('Error al guardar', 'error'); }
}

async function cargarEnFormulario(codigo) {
    try {
        const res = await fetch(`${API_URL}/${codigo}`);
        const d = await res.json();
        document.getElementById('codigoDetalleVenta').value = d.codigoDetalleVenta;
        document.getElementById('cantidad').value = d.cantidad;
        document.getElementById('precioUnitario').value = d.precioUnitario;
        document.getElementById('subtotal').value = parseFloat(d.subtotal).toFixed(2);
        document.getElementById('productoCodigoProducto').value = d.productoCodigoProducto;
        document.getElementById('ventasCodigoVenta').value = d.ventasCodigoVenta;

        _fkProductoGuardado = d.productoCodigoProducto;
        _fkVentaGuardada = d.ventasCodigoVenta;
        codigoEnEdicion = codigo;

        document.getElementById('codigoDetalleVenta').disabled = true;
        document.getElementById('productoCodigoProducto').disabled = true;
        document.getElementById('ventasCodigoVenta').disabled = true;
    } catch (e) { mostrarToast('Error al cargar', 'error'); }
}

function limpiarFormulario() {
    codigoEnEdicion = null;
    document.getElementById('codigoDetalleVenta').value = '';
    document.getElementById('cantidad').value = '';
    document.getElementById('precioUnitario').value = '';
    document.getElementById('subtotal').value = '';
    document.getElementById('productoCodigoProducto').value = '';
    document.getElementById('ventasCodigoVenta').value = '';

    document.getElementById('codigoDetalleVenta').disabled = false;
    document.getElementById('productoCodigoProducto').disabled = false;
    document.getElementById('ventasCodigoVenta').disabled = false;
}

function confirmarEliminar(id) {
    codigoParaEliminar = id;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarDetalle;
    document.getElementById('modalEliminar').classList.add('active');
}

async function eliminarDetalle() {
    cerrarModal('modalEliminar');
    await fetch(`${API_URL}/${codigoParaEliminar}`, { method: 'DELETE' });
    cargarDetalles();
}

function cerrarModal(id) { document.getElementById(id).classList.remove('active'); }

function mostrarToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}