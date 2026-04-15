/* ============================================================
   usuarios.js — Lógica de la página de Usuarios
   KinalApp Frontend

   IMPORTANTE:
   codigo_usuario es la LLAVE PRIMARIA de Usuarios.
   Ventas usa este código como LLAVE FORÁNEA
   (columna Usuarios_codigo_usuario).
   Por eso NO se permite modificar el código en modo edición.

   SEGURIDAD: En producción las contraseñas deben hashearse
   en el backend (BCrypt). Este frontend solo envía el texto plano
   como punto de partida educativo.
   ============================================================ */

const API_URL = 'http://localhost:8080/usuarios';

// null = modo crear, número = modo editar
let codigoEnEdicion = null;
let codigoParaEliminar = null;


/* ---- INICIALIZACIÓN ---- */
document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();
});


/* ============================================================
   FUNCIÓN: cargarUsuarios
   GET /usuarios → renderiza la tabla
   ============================================================ */
async function cargarUsuarios() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    const usuarios = await response.json();
    renderizarTabla(usuarios);

  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    mostrarToast('No se pudo conectar con el servidor', 'error');
  }
}


/* ============================================================
   FUNCIÓN: renderizarTabla

   Notas especiales:
   - La contraseña se muestra como "••••••" en la tabla por seguridad.
   - El rol se muestra con un badge de color según el tipo.
   ============================================================ */
function renderizarTabla(usuarios) {
  const tbody      = document.getElementById('tablaUsuarios');
  const emptyState = document.getElementById('emptyState');

  if (usuarios.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  tbody.innerHTML = usuarios.map(u => {
    // Determinamos la clase CSS del badge según el rol del usuario
    // Esto es puramente visual, no afecta la lógica del sistema
    let rolClass;
    switch((u.rol || '').toUpperCase()) {
      case 'ADMIN':     rolClass = 'badge--admin';     break;
      case 'VENDEDOR':  rolClass = 'badge--vendedor';  break;
      case 'BODEGUERO': rolClass = 'badge--bodeguero'; break;
      default:          rolClass = 'badge--otro';
    }

    return `
      <tr>
        <!-- Código usuario (llave primaria) -->
        <td><strong>${u.codigoUsuario}</strong></td>

        <!-- Username -->
        <td>${u.usuario || '—'}</td>

        <!-- Email -->
        <td>${u.correo || '—'}</td>

        <!-- Rol con badge de color -->
        <td><span class="badge ${rolClass}">${u.rol || '—'}</span></td>

        <!-- Estado -->
        <td>
          <span class="badge ${u.estado === 1 ? 'badge--active' : 'badge--inactive'}">
            ${u.estado === 1 ? 'Activo' : 'Inactivo'}
          </span>
        </td>

        <td>
          <div class="row-actions">
            <!-- Editar datos del usuario -->
            <button class="btn btn--secondary btn--sm"
              onclick="cargarEnFormulario(${u.codigoUsuario})">
              ✎ Editar
            </button>

            <!-- Advertencia: codigo_usuario es llave primaria Y foránea en Ventas.
                 No se puede modificar sin romper las relaciones. -->
            <button class="btn btn--warn btn--sm"
              onclick="abrirModal('modalLlavePrimaria')"
              title="El código es llave primaria y foránea en Ventas">
              🔑 LK
            </button>

            <!-- Eliminar con confirmación -->
            <button class="btn btn--danger btn--sm"
              onclick="confirmarEliminar(${u.codigoUsuario})">
              🗑
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}


/* ============================================================
   FUNCIÓN: guardarUsuario
   POST (crear) o PUT (actualizar).

   En el objeto que enviamos, los nombres de campo deben
   coincidir EXACTAMENTE con los getters/setters de Usuario.java:
   codigoUsuario, usuario, contrasena, correo, rol, estado.
   ============================================================ */
async function guardarUsuario() {
  const codigo    = parseInt(document.getElementById('codigoUsuario').value);
  const usuario   = document.getElementById('usuario').value.trim();
  const contrasena = document.getElementById('contrasena').value;
  const correo    = document.getElementById('correo').value.trim();
  const rol       = document.getElementById('rol').value;
  const estado    = parseInt(document.getElementById('estado').value);

  // Validaciones
  if (!codigo || !usuario) {
    mostrarToast('Código y username son obligatorios', 'error');
    return;
  }
  // En modo crear, la contraseña es obligatoria
  if (codigoEnEdicion === null && !contrasena) {
    mostrarToast('La contraseña es obligatoria al crear un usuario', 'error');
    return;
  }
  // Validación básica de email
  if (correo && !correo.includes('@')) {
    mostrarToast('El email no tiene un formato válido', 'error');
    return;
  }

  // Objeto con los nombres de campo que espera Usuario.java
  const usuarioData = {
    codigoUsuario: codigo,
    usuario:       usuario,
    contrasena:    contrasena, // En producción: el backend hashea con BCrypt
    correo:        correo,
    rol:           rol,
    estado:        estado
  };

  try {
    let response;

    if (codigoEnEdicion === null) {
      // POST → crear
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData)
      });
    } else {
      // PUT → actualizar (usando el código guardado, no el del input)
      response = await fetch(`${API_URL}/${codigoEnEdicion}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData)
      });
    }

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast(
      codigoEnEdicion === null ? 'Usuario creado correctamente' : 'Usuario actualizado',
      'success'
    );
    limpiarFormulario();
    cargarUsuarios();

  } catch (error) {
    console.error('Error al guardar usuario:', error);
    mostrarToast('Error al guardar el usuario', 'error');
  }
}


/* ============================================================
   FUNCIÓN: cargarEnFormulario
   Llena el formulario con los datos del usuario seleccionado.
   Bloquea el campo código (llave primaria).
   ============================================================ */
async function cargarEnFormulario(codigo) {
  try {
    const response = await fetch(`${API_URL}/${codigo}`);
    if (!response.ok) throw new Error('No encontrado');

    const u = await response.json();

    document.getElementById('codigoUsuario').value = u.codigoUsuario;
    document.getElementById('usuario').value       = u.usuario;
    // En modo edición, dejamos la contraseña vacía por seguridad.
    // El usuario puede ingresarla si quiere cambiarla.
    document.getElementById('contrasena').value    = '';
    document.getElementById('correo').value        = u.correo;
    document.getElementById('rol').value           = u.rol;
    document.getElementById('estado').value        = u.estado;

    // BLOQUEAMOS el campo código: es llave primaria.
    // Ventas referencia usuarios.codigo_usuario como foránea.
    // Cambiar el código aquí NO actualizaría las ventas existentes.
    document.getElementById('codigoUsuario').disabled = true;
    document.getElementById('codigoHint').textContent = '🔒 Llave primaria — no editable';

    codigoEnEdicion = codigo;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('Error al cargar usuario:', error);
    mostrarToast('Error al cargar el usuario', 'error');
  }
}


/* ---- CONFIRMAR ELIMINACIÓN ---- */
function confirmarEliminar(codigo) {
  codigoParaEliminar = codigo;
  document.getElementById('btnConfirmarEliminar').onclick = eliminarUsuario;
  abrirModal('modalEliminar');
}


/* ============================================================
   FUNCIÓN: eliminarUsuario
   DELETE /usuarios/{codigo}

   Si el usuario tiene ventas asociadas, el backend rechazará
   la eliminación por integridad referencial (FK constraint).
   ============================================================ */
async function eliminarUsuario() {
  cerrarModal('modalEliminar');
  if (codigoParaEliminar === null) return;

  try {
    const response = await fetch(`${API_URL}/${codigoParaEliminar}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

    mostrarToast('Usuario eliminado', 'success');
    cargarUsuarios();

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    mostrarToast('Error al eliminar. ¿Tiene ventas asociadas?', 'error');
  } finally {
    codigoParaEliminar = null;
  }
}


/* ---- LIMPIAR FORMULARIO ---- */
function limpiarFormulario() {
  document.getElementById('codigoUsuario').value  = '';
  document.getElementById('usuario').value        = '';
  document.getElementById('contrasena').value     = '';
  document.getElementById('correo').value         = '';
  document.getElementById('rol').value            = 'ADMIN';
  document.getElementById('estado').value         = '1';

  document.getElementById('codigoUsuario').disabled = false;
  document.getElementById('codigoHint').textContent = '';

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