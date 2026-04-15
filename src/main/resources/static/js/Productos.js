/* ============================================================
   productos.js — Lógica de la página de Productos
   KinalApp Frontend

   IMPORTANTE:
   codigo_producto es la LLAVE PRIMARIA de Productos.
   DetalleVenta usa este código como LLAVE FORÁNEA
   (columna Productos_codigo_producto).
   Por eso NO se puede modificar el código en modo edición.
   ============================================================ */

// URL base del endpoint de productos en Spring Boot
const API_URL = 'http://localhost:8080/productos';

// Estado del formulario: null = crear nuevo, número = editar existente
let codigoEnEdicion = null;

// Código del producto pendiente de eliminar (para el modal de confirmación)
let codigoParaEliminar = null;


/* ---- INICIALIZACIÓN ---- */
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
});


/* ============================================================
   FUNCIÓN: cargarProductos
   GET /productos → llena la tabla con los datos del servidor
   ============================================================ */
async function cargarProductos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const productos = await response.json();
    renderizarTabla(productos);

  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarToast('No se pudo conectar con el servidor', 'error');
  }
}


/* ============================================================
   FUNCIÓN: renderizarTabla
   Convierte el array de productos en filas HTML para la tabla.

   Nota especial: mostramos indicadores de stock bajo
   para alertar cuando el inventario está por agotarse.
   ============================================================ */
function renderizarTabla(productos) {
  const tbody      = document.getElementById('tablaProductos');
  const emptyState = document.getElementById('emptyState');

  if (productos.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = productos.map(p => {
    // Determinamos el badge del stock:
    // - si stock es 0 → Agotado (rojo)
    // - si stock es <= 5 → Stock bajo (naranja, advertencia visual)
    // - si stock > 5 → muestra el número normal
    let stockBadge;
    if (p.stock === 0) {
      stockBadge = `<span class="badge badge--inactive">Agotado</span>`;
    } else if (p.stock <= 5) {
      stockBadge = `<span class="badge badge--low-stock">⚠ ${p.stock}</span>`;
    } else {
      stockBadge = p.stock;
    }

    // Formateamos el precio con 2 decimales y símbolo de quetzal
    // toFixed(2) asegura que siempre muestre 2 decimales (ej. 25.00)
    const precioFormateado = `Q ${parseFloat(p.precio || 0).toFixed(2)}`;

    return `
      <tr>
        <!-- Código producto (llave primaria) en negrita para destacarlo -->
        <td><strong>${p.codigoProducto}</strong></td>
        <td>${p.nombreProducto || '—'}</td>

        <!-- Precio con clase especial para colorearlo con el acento -->
        <td class="price-cell">${precioFormateado}</td>

        <!-- Stock con badge de advertencia si está bajo -->
        <td>${stockBadge}</td>

        <!-- Badge de estado activo/inactivo -->
        <td>
          <span class="badge ${p.estado === 1 ? 'badge--active' : 'badge--inactive'}">
            ${p.estado === 1 ? 'Activo' : 'Inactivo'}
          </span>
        </td>

        <td>
          <div class="row-actions">
            <!-- Editar: carga los datos del producto en el formulario -->
            <button class="btn btn--secondary btn--sm"
              onclick="cargarEnFormulario(${p.codigoProducto})">
              ✎ Editar
            </button>

            <!-- Botón de advertencia de llave primaria/foránea:
                 Informa que el código NO se puede cambiar porque
                 DetalleVenta lo referencia como llave foránea -->
            <button class="btn btn--warn btn--sm"
              onclick="abrirModal('modalLlavePrimaria')"
              title="Código es llave primaria y foránea en DetalleVenta">
              🔑 LK
            </button>

            <!-- Eliminar con confirmación -->
            <button class="btn btn--danger btn--sm"
              onclick="confirmarEliminar(${p.codigoProducto})">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


/* ============================================================
   FUNCIÓN: guardarProducto
   POST (crear) o PUT (actualizar) según el modo actual.

   parseFloat() convierte el string del input a número decimal
   para que coincida con BigDecimal en Java.
   ============================================================ */
async function guardarProducto() {
  const codigo = parseInt(document.getElementById('codigoProducto').value);
  const nombre = document.getElementById('nombreProducto').value.trim();
  // parseFloat convierte "25.99" → 25.99 (número decimal)
  const precio = parseFloat(document.getElementById('precio').value);
  const stock  = parseInt(document.getElementById('stock').value);
  const estado = parseInt(document.getElementById('estado').value);

  // Validaciones básicas
  if (!codigo || !nombre) {
    mostrarToast('Código y nombre son obligatorios', 'error');
    return;
  }
  if (isNaN(precio) || precio < 0) {
    mostrarToast('El precio debe ser un número válido', 'error');
    return;
  }
  if (isNaN(stock) || stock < 0) {
    mostrarToast('El stock debe ser un número válido', 'error');
    return;
  }

  // Objeto que coincide con la entidad Producto.java
  const productoData = {
    codigoProducto: codigo,
    nombreProducto: nombre,
    precio:         precio,
    stock:          stock,
    estado:         estado
  };

  try {
    let response;

    if (codigoEnEdicion === null) {
      // POST → crear nuevo producto
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });
    } else {
      // PUT → actualizar producto existente usando el código guardado
      response = await fetch(`${API_URL}/${codigoEnEdicion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });
    }

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast(
      codigoEnEdicion === null ? 'Producto creado correctamente' : 'Producto actualizado',
      'success'
    );

    limpiarFormulario();
    cargarProductos();

  } catch (error) {
    console.error('Error al guardar producto:', error);
    mostrarToast('Error al guardar el producto', 'error');
  }
}


/* ============================================================
   FUNCIÓN: cargarEnFormulario
   Carga los datos de un producto para editarlos.
   Deshabilita el campo de código (llave primaria).
   ============================================================ */
async function cargarEnFormulario(codigo) {
  try {
    const response = await fetch(`${API_URL}/${codigo}`);
    if (!response.ok) throw new Error('No encontrado');

    const p = await response.json();

    // Llenamos el formulario con los datos del producto
    document.getElementById('codigoProducto').value  = p.codigoProducto;
    document.getElementById('nombreProducto').value  = p.nombreProducto;
    document.getElementById('precio').value          = p.precio;
    document.getElementById('stock').value           = p.stock;
    document.getElementById('estado').value          = p.estado;

    // BLOQUEAMOS el código porque es llave primaria Y foránea.
    // Si el usuario lo cambiara, el PUT crearía un producto nuevo
    // y el original quedaría huérfano. Además, DetalleVenta
    // perdería la referencia.
    document.getElementById('codigoProducto').disabled = true;
    document.getElementById('codigoHint').textContent  = '🔒 Llave primaria — no editable';

    codigoEnEdicion = codigo;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Error al cargar producto:', error);
    mostrarToast('Error al cargar el producto', 'error');
  }
}


/* ============================================================
   FUNCIÓN: confirmarEliminar
   Abre el modal de confirmación antes de eliminar.
   ============================================================ */
function confirmarEliminar(codigo) {
  codigoParaEliminar = codigo;
  document.getElementById('btnConfirmarEliminar').onclick = eliminarProducto;
  abrirModal('modalEliminar');
}


/* ============================================================
   FUNCIÓN: eliminarProducto
   DELETE /productos/{codigo} → elimina el producto del servidor.

   Nota: si el producto tiene detalles de venta asociados,
   el backend puede rechazar la eliminación por integridad referencial.
   ============================================================ */
async function eliminarProducto() {
  cerrarModal('modalEliminar');
  if (codigoParaEliminar === null) return;

  try {
    const response = await fetch(`${API_URL}/${codigoParaEliminar}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast('Producto eliminado', 'success');
    cargarProductos();

  } catch (error) {
    console.error('Error al eliminar:', error);
    mostrarToast('Error al eliminar. ¿Tiene detalles de venta asociados?', 'error');
  } finally {
    codigoParaEliminar = null;
  }
}


/* ---- LIMPIAR FORMULARIO ---- */
function limpiarFormulario() {
  document.getElementById('codigoProducto').value  = '';
  document.getElementById('nombreProducto').value  = '';
  document.getElementById('precio').value          = '';
  document.getElementById('stock').value           = '';
  document.getElementById('estado').value          = '1';

  document.getElementById('codigoProducto').disabled = false;
  document.getElementById('codigoHint').textContent  = '';

  codigoEnEdicion = null;
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
  const toast = document.getElementById('toast');
  toast.textContent = mensaje;
  toast.className = `toast toast--${tipo} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}