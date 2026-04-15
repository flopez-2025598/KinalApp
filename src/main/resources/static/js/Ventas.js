/* ============================================================
   ventas.js — Lógica de la página de Ventas
   KinalApp Frontend

   ESTRUCTURA DE LLAVES EN VENTA:
   ┌─────────────────────────────────────────────┐
   │ codigo_venta         → LLAVE PRIMARIA (PK)  │ ← bloqueado al editar
   │ Clientes_dpi_cliente → LLAVE FORÁNEA (FK)   │ ← bloqueado al editar
   │ Usuarios_codigo_usr  → LLAVE FORÁNEA (FK)   │ ← bloqueado al editar
   └─────────────────────────────────────────────┘

   Solo se pueden editar en modo actualización:
   fechaVenta, total, estado.

   Esto es porque:
   - Si cambias la PK, el registro "se mueve" y DetalleVenta pierde referencia.
   - Si cambias una FK, apuntaría a un cliente/usuario diferente,
     cambiando el significado histórico de la venta.
   ============================================================ */

const API_URL = 'http://localhost:8080/ventas';

// null = modo crear, número = modo editar
let codigoEnEdicion = null;
let codigoParaEliminar = null;


/* ---- INICIALIZACIÓN ---- */
document.addEventListener('DOMContentLoaded', () => {
  // Ponemos la fecha de hoy como valor por defecto en el campo fecha
  const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  document.getElementById('fechaVenta').value = hoy;

  cargarVentas();
});


/* ============================================================
   FUNCIÓN: cargarVentas
   GET /ventas → construye la tabla
   ============================================================ */
async function cargarVentas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const ventas = await response.json();
    renderizarTabla(ventas);

  } catch (error) {
    console.error('Error al cargar ventas:', error);
    mostrarToast('No se pudo conectar con el servidor', 'error');
  }
}


/* ============================================================
   FUNCIÓN: renderizarTabla

   Las celdas de FK se muestran con un color diferente para
   que el usuario identifique visualmente cuáles son llaves foráneas.
   ============================================================ */
function renderizarTabla(ventas) {
  const tbody      = document.getElementById('tablaVentas');
  const emptyState = document.getElementById('emptyState');

  if (ventas.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = ventas.map(v => {
    // Formateamos la fecha: de "2024-01-15" a "15/01/2024"
    const fecha = v.fechaVenta
      ? new Date(v.fechaVenta + 'T00:00:00').toLocaleDateString('es-GT')
      : '—';

    const total = `Q ${parseFloat(v.total || 0).toFixed(2)}`;

    return `
      <tr>
        <!-- PK: codigo_venta -->
        <td><strong>${v.codigoVenta}</strong></td>

        <!-- Fecha formateada -->
        <td>${fecha}</td>

        <!-- Total con acento naranja -->
        <td class="price-cell">${total}</td>

        <!-- Estado -->
        <td>
          <span class="badge ${v.estado === 1 ? 'badge--active' : 'badge--inactive'}">
            ${v.estado === 1 ? 'Activa' : 'Anulada'}
          </span>
        </td>

        <!-- FK hacia Clientes: color azul para identificarla visualmente -->
        <td class="fk-cell">🔗 ${v.clientesDpiCliente}</td>

        <!-- FK hacia Usuarios: color azul -->
        <td class="fk-cell">🔗 ${v.usuariosCodigoUsuario}</td>

        <td>
          <div class="row-actions">
            <!-- Editar: solo permite cambiar fecha, total y estado -->
            <button class="btn btn--secondary btn--sm"
              onclick="cargarEnFormulario(${v.codigoVenta})">
              ✎ Editar
            </button>

            <!-- Botón informativo de llaves.
                 Abre modal explicando que PK y FKs no se pueden cambiar. -->
            <button class="btn btn--warn btn--sm"
              onclick="abrirModal('modalLlaves')"
              title="Ver restricciones de llaves">
              🔑 LK
            </button>

            <!-- Eliminar con confirmación -->
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


/* ============================================================
   FUNCIÓN: guardarVenta
   POST (crear) o PUT (actualizar).

   Al ACTUALIZAR: el objeto enviado contiene la PK y las FKs
   originales (guardadas en codigoEnEdicion y variables de estado).
   Los inputs de PK y FK están bloqueados, así que leemos los
   valores desde variables en memoria, NO desde el formulario.
   ============================================================ */

// Variables que guardan los valores de FK al entrar en modo edición
// (no podemos leerlos del formulario porque están deshabilitados)
let _fkClienteGuardado  = null;
let _fkUsuarioGuardado  = null;

async function guardarVenta() {
  // Determinamos qué código de venta usar:
  // En modo crear: lo lee del input
  // En modo editar: lo toma de codigoEnEdicion (el input está bloqueado)
  const codigo = codigoEnEdicion !== null
    ? codigoEnEdicion
    : parseInt(document.getElementById('codigoVenta').value);

  const fecha  = document.getElementById('fechaVenta').value;
  const total  = parseFloat(document.getElementById('total').value);
  const estado = parseInt(document.getElementById('estado').value);

  // Las FK: en modo crear las lee del input, en modo editar usa las guardadas
  const dpiCliente   = codigoEnEdicion !== null
    ? _fkClienteGuardado
    : parseInt(document.getElementById('clientesDpiCliente').value);

  const codUsuario   = codigoEnEdicion !== null
    ? _fkUsuarioGuardado
    : parseInt(document.getElementById('usuariosCodigoUsuario').value);

  // Validaciones
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

  // Objeto que coincide con la entidad Venta.java
  // Las FK se envían con sus nombres exactos del getter/setter Java
  const ventaData = {
    codigoVenta:            codigo,
    fechaVenta:             fecha,     // String ISO: "2024-01-15" → Java lo convierte a LocalDate
    total:                  total,
    estado:                 estado,
    clientesDpiCliente:     dpiCliente,     // FK hacia Clientes
    usuariosCodigoUsuario:  codUsuario       // FK hacia Usuarios
  };

  try {
    let response;

    if (codigoEnEdicion === null) {
      // POST → crear nueva venta
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
    } else {
      // PUT → actualizar venta (solo fecha, total, estado cambian en práctica)
      response = await fetch(`${API_URL}/${codigoEnEdicion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData)
      });
    }

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast(
      codigoEnEdicion === null ? 'Venta creada correctamente' : 'Venta actualizada',
      'success'
    );
    limpiarFormulario();
    cargarVentas();

  } catch (error) {
    console.error('Error al guardar venta:', error);
    mostrarToast('Error al guardar la venta', 'error');
  }
}


/* ============================================================
   FUNCIÓN: cargarEnFormulario
   Carga una venta para editarla.

   IMPORTANTE: bloquea los campos de PK y ambas FK.
   Guarda los valores de FK en variables separadas porque
   los inputs deshabilitados no se pueden leer con .value.
   ============================================================ */
async function cargarEnFormulario(codigo) {
  try {
    const response = await fetch(`${API_URL}/${codigo}`);
    if (!response.ok) throw new Error('No encontrado');

    const v = await response.json();

    // Llenamos todos los campos
    document.getElementById('codigoVenta').value             = v.codigoVenta;
    document.getElementById('fechaVenta').value              = v.fechaVenta;
    document.getElementById('total').value                   = v.total;
    document.getElementById('estado').value                  = v.estado;
    document.getElementById('clientesDpiCliente').value      = v.clientesDpiCliente;
    document.getElementById('usuariosCodigoUsuario').value   = v.usuariosCodigoUsuario;

    // GUARDAMOS las FK en variables de memoria antes de bloquear los inputs
    _fkClienteGuardado = v.clientesDpiCliente;
    _fkUsuarioGuardado = v.usuariosCodigoUsuario;

    // BLOQUEAMOS la llave primaria
    document.getElementById('codigoVenta').disabled = true;
    document.getElementById('codigoVentaHint').textContent = '🔒 PK — no editable';

    // BLOQUEAMOS las llaves foráneas
    // Si se cambiara el dpi_cliente, la venta apuntaría a otro cliente
    // y se perdería el historial real de la transacción.
    document.getElementById('clientesDpiCliente').disabled    = true;
    document.getElementById('dpiClienteHint').textContent     = '🔗 FK → Clientes — no editable';
    document.getElementById('clientesDpiCliente').classList.add('fk-locked');

    document.getElementById('usuariosCodigoUsuario').disabled  = true;
    document.getElementById('codigoUsuarioHint').textContent   = '🔗 FK → Usuarios — no editable';
    document.getElementById('usuariosCodigoUsuario').classList.add('fk-locked');

    codigoEnEdicion = codigo;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Error al cargar venta:', error);
    mostrarToast('Error al cargar la venta', 'error');
  }
}


/* ---- CONFIRMAR ELIMINACIÓN ---- */
function confirmarEliminar(codigo) {
  codigoParaEliminar = codigo;
  document.getElementById('btnConfirmarEliminar').onclick = eliminarVenta;
  abrirModal('modalEliminar');
}


/* ============================================================
   FUNCIÓN: eliminarVenta
   DELETE /ventas/{codigo}

   Fallará si la venta tiene DetalleVenta asociados
   (la BD rechazará por FK constraint).
   ============================================================ */
async function eliminarVenta() {
  cerrarModal('modalEliminar');
  if (codigoParaEliminar === null) return;

  try {
    const response = await fetch(`${API_URL}/${codigoParaEliminar}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast('Venta eliminada', 'success');
    cargarVentas();

  } catch (error) {
    console.error('Error al eliminar venta:', error);
    mostrarToast('Error al eliminar. ¿Tiene detalles de venta?', 'error');
  } finally {
    codigoParaEliminar = null;
  }
}


/* ---- LIMPIAR FORMULARIO ---- */
function limpiarFormulario() {
  document.getElementById('codigoVenta').value            = '';
  document.getElementById('fechaVenta').value             = new Date().toISOString().split('T')[0];
  document.getElementById('total').value                  = '';
  document.getElementById('estado').value                 = '1';
  document.getElementById('clientesDpiCliente').value     = '';
  document.getElementById('usuariosCodigoUsuario').value  = '';

  // Rehabilitamos todos los campos bloqueados
  ['codigoVenta', 'clientesDpiCliente', 'usuariosCodigoUsuario'].forEach(id => {
    const el = document.getElementById(id);
    el.disabled = false;
    el.classList.remove('fk-locked');
  });

  // Limpiamos las pistas y las variables auxiliares
  ['codigoVentaHint', 'dpiClienteHint', 'codigoUsuarioHint']
    .forEach(id => document.getElementById(id).textContent = '');

  codigoEnEdicion    = null;
  _fkClienteGuardado = null;
  _fkUsuarioGuardado = null;
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