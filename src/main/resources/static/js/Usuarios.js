/* ==========================================
   Usuarios.js — KinalApp
   ========================================== */

const API_URL = '/usuarios';

let codigoEnEdicion    = null;
let codigoParaEliminar = null;

let _todosLosUsuarios = [];

/* ---- INICIO ---- */
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
});

/* ---- CARGAR TABLA ---- */
async function cargarUsuarios() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        _todosLosUsuarios = await response.json();
        renderizarTabla(_todosLosUsuarios);
    } catch (err) {
        console.error('Error al cargar usuarios:', err);
        mostrarToast('No se pudo conectar con el servidor', 'error');
    }
}

function renderizarTabla(usuarios) {
    const tbody      = document.getElementById('tablaUsuarios');
    const emptyState = document.getElementById('emptyState');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    emptyState.style.display = 'none';

    tbody.innerHTML = usuarios.map(u => {
        let rolClass;
        switch ((u.rol || '').toUpperCase()) {
            case 'ADMIN':     rolClass = 'badge--admin';     break;
            case 'VENDEDOR':  rolClass = 'badge--vendedor';  break;
            case 'BODEGUERO': rolClass = 'badge--bodeguero'; break;
            default:          rolClass = 'badge--otro';
        }

        return `
            <tr>
                <td><strong>${u.codigoUsuario}</strong></td>
                <td>${u.usuario  || '—'}</td>
                <td>${u.correo   || '—'}</td>
                <td><span class="badge ${rolClass}">${u.rol || '—'}</span></td>
                <td>
                    <span class="badge ${u.estado === 1 ? 'badge--active' : 'badge--inactive'}">
                        ${u.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="row-actions">
                        <button class="btn btn--secondary btn--sm"
                            onclick="cargarEnFormulario(${u.codigoUsuario})">
                            ✎ Editar
                        </button>
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

/* ---- BARRA DE BÚSQUEDA por Código ---- */
function buscarEnTabla() {
    const query = document.getElementById('inputBusqueda').value.trim();

    if (query === '') {
        renderizarTabla(_todosLosUsuarios);
        return;
    }

    const resultados = _todosLosUsuarios.filter(u =>
        String(u.codigoUsuario).includes(query)
    );

    renderizarTabla(resultados);

    if (resultados.length === 0) {
        mostrarToast(`No se encontró usuario con código "${query}"`, 'error');
    }
}

/* ---- GUARDAR ---- */
async function guardarUsuario() {
    const codigo     = codigoEnEdicion !== null
        ? codigoEnEdicion
        : parseInt(document.getElementById('codigoUsuario').value);
    const usuario    = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const correo     = document.getElementById('correo').value.trim();
    const rol        = document.getElementById('rol').value;
    const estado     = parseInt(document.getElementById('estado').value);

    if (!codigo || !usuario) {
        mostrarToast('Código y username son obligatorios', 'error');
        return;
    }
    if (codigoEnEdicion === null && !contrasena) {
        mostrarToast('La contraseña es obligatoria al crear un usuario', 'error');
        return;
    }
    if (correo && !correo.includes('@')) {
        mostrarToast('El email no tiene un formato válido', 'error');
        return;
    }

    const usuarioData = {
        codigoUsuario: codigo,
        usuario:       usuario,
        contrasena:    contrasena,
        correo:        correo,
        rol:           rol,
        estado:        estado
    };

    try {
        let response;
        if (codigoEnEdicion === null) {
            response = await fetch(API_URL, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(usuarioData)
            });
        } else {
            response = await fetch(`${API_URL}/${codigoEnEdicion}`, {
                method:  'PUT',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(usuarioData)
            });
        }

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        mostrarToast(codigoEnEdicion === null ? 'Usuario creado ✓' : 'Usuario actualizado ✓', 'success');
        limpiarFormulario();
        cargarUsuarios();

    } catch (err) {
        console.error('Error al guardar usuario:', err);
        mostrarToast('Error al guardar el usuario', 'error');
    }
}

/* ---- EDITAR ---- */
async function cargarEnFormulario(codigo) {
    try {
        const response = await fetch(`${API_URL}/${codigo}`);
        if (!response.ok) throw new Error('No encontrado');

        const u = await response.json();

        document.getElementById('codigoUsuario').value = u.codigoUsuario;
        document.getElementById('usuario').value       = u.usuario;
        document.getElementById('contrasena').value    = '';
        document.getElementById('correo').value        = u.correo;
        document.getElementById('rol').value           = u.rol;
        document.getElementById('estado').value        = u.estado;

        document.getElementById('codigoUsuario').disabled = true;
        document.getElementById('codigoHint').textContent = '🔒 Llave primaria — no editable (FK en Ventas)';

        codigoEnEdicion = codigo;

        abrirModal('modalLlavePrimaria');
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Error al cargar usuario:', err);
        mostrarToast('Error al cargar el usuario', 'error');
    }
}

/* ---- ELIMINAR ---- */
function confirmarEliminar(codigo) {
    codigoParaEliminar = codigo;
    document.getElementById('btnConfirmarEliminar').onclick = eliminarUsuario;
    abrirModal('modalEliminar');
}

async function eliminarUsuario() {
    cerrarModal('modalEliminar');
    if (codigoParaEliminar === null) return;

    try {
        const response = await fetch(`${API_URL}/${codigoParaEliminar}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        mostrarToast('Usuario eliminado ✓', 'success');
        cargarUsuarios();
    } catch (err) {
        console.error('Error al eliminar usuario:', err);
        mostrarToast('Error al eliminar. ¿Tiene ventas asociadas?', 'error');
    } finally {
        codigoParaEliminar = null;
    }
}

/* ---- LIMPIAR ---- */
function limpiarFormulario() {
    document.getElementById('codigoUsuario').value = '';
    document.getElementById('usuario').value       = '';
    document.getElementById('contrasena').value    = '';
    document.getElementById('correo').value        = '';
    document.getElementById('rol').value           = 'ADMIN';
    document.getElementById('estado').value        = '1';

    document.getElementById('codigoUsuario').disabled = false;
    document.getElementById('codigoHint').textContent = '';

    codigoEnEdicion = null;
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