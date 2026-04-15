// ─────────────────────────────────────────────
//  productos.js  —  KinalApp
//  Corregido: IDs alineados con Productos.html
// ─────────────────────────────────────────────

let modoEdicion = false;
let idOriginal  = null;

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
});

// ── GUARDAR (crear o actualizar) ──────────────
// Llamado por onclick="guardarProducto()" del botón en el HTML
async function guardarProducto() {

    // Leer valores usando los IDs que SÍ existen en el HTML
    const codigoVal = document.getElementById("codigoProducto").value.trim();
    const nombre    = document.getElementById("nombreProducto").value.trim();
    const precioVal = document.getElementById("precio").value.trim();       // era "precioProducto"
    const stockVal  = document.getElementById("stock").value.trim();        // era "stockProducto"
    const estadoVal = document.getElementById("estado").value;              // era "estadoProducto"

    // Validación básica
    if (!codigoVal || !nombre || !precioVal || !stockVal) {
        mostrarToast("Por favor completa todos los campos obligatorios.", "error");
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
            // PUT /productos/{id}
            res = await fetch(`/productos/${idOriginal}`, {
                method:  "PUT",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(producto)
            });
        } else {
            // POST /productos
            res = await fetch("/productos", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(producto)
            });
        }

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        limpiarFormulario();
        await cargarProductos();
        mostrarToast(modoEdicion ? "Producto actualizado ✓" : "Producto guardado ✓", "success");

    } catch (error) {
        console.error("Error al guardar producto:", error);
        mostrarToast("Ocurrió un error al guardar el producto.", "error");
    }
}

// ── CARGAR TABLA ──────────────────────────────
async function cargarProductos() {
    const tabla      = document.getElementById("tablaProductos");
    const emptyState = document.getElementById("emptyState");

    try {
        const res  = await fetch("/productos");
        const data = await res.json();

        tabla.innerHTML = "";

        if (data.length === 0) {
            emptyState.style.display = "block";
            return;
        }

        emptyState.style.display = "none";

        data.forEach(p => {
            tabla.innerHTML += `
                <tr>
                    <td>${p.codigoProducto}</td>
                    <td>${p.nombreProducto}</td>
                    <td>Q ${parseFloat(p.precio).toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td>${p.estado === 1 ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button class="btn btn--secondary"
                            onclick="editarProducto(${p.codigoProducto}, '${p.nombreProducto}', ${p.precio}, ${p.stock}, ${p.estado})">
                            ✏️ Editar
                        </button>
                        <button class="btn btn--danger"
                            onclick="confirmarEliminar(${p.codigoProducto})">
                            🗑️ Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error al cargar productos:", error);
        mostrarToast("No se pudo cargar la lista de productos.", "error");
    }
}

// ── EDITAR: poblar formulario ─────────────────
function editarProducto(codigo, nombre, precio, stock, estado) {

    // Mostrar modal de aviso sobre llave primaria
    abrirModal("modalLlavePrimaria");

    document.getElementById("codigoProducto").value    = codigo;
    document.getElementById("nombreProducto").value    = nombre;
    document.getElementById("precio").value            = precio;   // ID correcto
    document.getElementById("stock").value             = stock;    // ID correcto
    document.getElementById("estado").value            = estado;   // ID correcto

    // Proteger la llave primaria
    document.getElementById("codigoProducto").disabled = true;

    idOriginal  = codigo;
    modoEdicion = true;
}

// ── LIMPIAR FORMULARIO ────────────────────────
// Llamado por onclick="limpiarFormulario()" del botón en el HTML
function limpiarFormulario() {
    document.getElementById("codigoProducto").value    = "";
    document.getElementById("nombreProducto").value    = "";
    document.getElementById("precio").value            = "";
    document.getElementById("stock").value             = "";
    document.getElementById("estado").value            = "1";

    document.getElementById("codigoProducto").disabled = false;

    modoEdicion = false;
    idOriginal  = null;
}

// ── ELIMINAR con modal de confirmación ───────
function confirmarEliminar(codigo) {
    const btn = document.getElementById("btnConfirmarEliminar");
    btn.onclick = async function () {
        cerrarModal("modalEliminar");
        await eliminarProducto(codigo);
    };
    abrirModal("modalEliminar");
}

async function eliminarProducto(codigo) {
    try {
        const res = await fetch(`/productos/${codigo}`, { method: "DELETE" });

        if (res.status === 404) {
            mostrarToast("El producto no existe o ya fue eliminado.", "error");
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        await cargarProductos();
        mostrarToast("Producto eliminado ✓", "success");

    } catch (error) {
        console.error("Error al eliminar:", error);
        mostrarToast("Error al eliminar el producto.", "error");
    }
}

// ── MODALES ───────────────────────────────────
function abrirModal(id)  { document.getElementById(id).classList.add("active"); }
function cerrarModal(id) { document.getElementById(id).classList.remove("active"); }

// ── TOAST ─────────────────────────────────────
function mostrarToast(mensaje, tipo = "success") {
    const toast = document.getElementById("toast");
    toast.textContent  = mensaje;
    toast.className    = `toast toast--${tipo} toast--visible`;
    setTimeout(() => { toast.className = "toast"; }, 3000);
}