    /* ==========================================
       CONFIGURACIÓN Y VARIABLES
       ========================================== */

    // La dirección de tu servidor backend (Spring Boot)
    const API_URL = 'http://localhost:8021/clientes';

    // Esta variable nos dice si estamos creando un cliente nuevo (null)
    // o editando uno que ya existe (guardamos su DPI aquí).
    let dpiEnEdicion = null;

    /* ==========================================
       AL CARGAR LA PÁGINA
       ========================================== */

    // Apenas se abre la página, pedimos los datos al servidor
    document.addEventListener('DOMContentLoaded', () => {
        cargarClientes();
    });

    /* ==========================================
       1. LEER (MOSTRAR CLIENTES)
       ========================================== */

    async function cargarClientes() {
        // fetch() es como hacer una llamada telefónica al servidor
        const respuesta = await fetch(API_URL);
        const listaDeClientes = await respuesta.json(); // Convertimos la respuesta en una lista

        const tabla = document.getElementById('tablaClientes');
        tabla.innerHTML = ''; // Limpiamos la tabla antes de llenarla

        // Recorremos la lista y creamos una fila por cada cliente
        listaDeClientes.forEach(cliente => {
            tabla.innerHTML += `
                <tr>
                    <td>${cliente.dpiCliente}</td>
                    <td>${cliente.nombreCliente}</td>
                    <td>${cliente.apellidoCliente}</td>
                    <td>${cliente.direccion}</td>
                    <td>${cliente.estado == 1 ? 'Activo' : 'Inactivo'}</td>
                    <td>
                        <button onclick="prepararEdicion(${cliente.dpiCliente})">Editar</button>
                        <button onclick="eliminarCliente(${cliente.dpiCliente})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    /* ==========================================
       2. GUARDAR (CREAR O ACTUALIZAR)
       ========================================== */

    async function guardarCliente() {
        // Obtenemos los datos que el usuario escribió en los cuadritos (inputs)
        const dpi = document.getElementById('dpiCliente').value;
        const nombre = document.getElementById('nombreCliente').value;
        const apellido = document.getElementById('apellidoCliente').value;
        const direccion = document.getElementById('direccion').value;
        const estado = document.getElementById('estado').value;

        // Creamos un objeto con esos datos
        const cliente = {
            dpiCliente: dpi,
            nombreCliente: nombre,
            apellidoCliente: apellido,
            direccion: direccion,
            estado: parseInt(estado)
        };

        let metodoHttp = '';
        let urlFinal = '';

        if (dpiEnEdicion === null) {
            // Si no estamos editando, usamos POST para CREAR
            metodoHttp = 'POST';
            urlFinal = API_URL;
        } else {
            // Si hay un DPI guardado, usamos PUT para ACTUALIZAR ese cliente
            metodoHttp = 'PUT';
            urlFinal = API_URL + '/' + dpiEnEdicion;
        }

        // Enviamos los datos al servidor
        await fetch(urlFinal, {
            method: metodoHttp,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente) // Convertimos el objeto a texto para enviarlo
        });

        alert("¡Operación exitosa!");
        limpiarFormulario();
        cargarClientes(); // Recargamos la tabla para ver los cambios
    }

    /* ==========================================
       3. EDITAR (PREPARAR EL FORMULARIO)
       ========================================== */

    async function prepararEdicion(dpi) {
        // Pedimos al servidor los datos de ese cliente específico
        const respuesta = await fetch(API_URL + '/' + dpi);
        const cliente = await respuesta.json();

        // Ponemos los datos del cliente en los cuadros de texto
        document.getElementById('dpiCliente').value = cliente.dpiCliente;
        document.getElementById('nombreCliente').value = cliente.nombreCliente;
        document.getElementById('apellidoCliente').value = cliente.apellidoCliente;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('estado').value = cliente.estado;

        // IMPORTANTE: Bloqueamos el DPI para que no lo cambien (es la llave primaria)
        document.getElementById('dpiCliente').disabled = true;

        // Guardamos el DPI para saber que estamos editando
        dpiEnEdicion = dpi;
    }

    /* ==========================================
       4. ELIMINAR
       ========================================== */

    async function eliminarCliente(dpi) {
        // Pedimos confirmación al usuario
        if (confirm("¿Seguro que quieres eliminar este cliente?")) {
            await fetch(API_URL + '/' + dpi, {
                method: 'DELETE'
            });
            cargarClientes(); // Recargamos la lista
        }
    }

    /* ==========================================
       UTILIDADES
       ========================================== */

    function limpiarFormulario() {
        // Vaciamos todos los cuadros de texto
        document.getElementById('dpiCliente').value = '';
        document.getElementById('nombreCliente').value = '';
        document.getElementById('apellidoCliente').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('estado').value = '1';

        // Volvemos a habilitar el DPI para nuevos registros
        document.getElementById('dpiCliente').disabled = false;
        dpiEnEdicion = null;
    }