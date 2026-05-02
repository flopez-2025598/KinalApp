onst API_USUARIOS = '/usuarios';

/* ---- TABS ---- */
function mostrarPanel(cual) {
    const panelLogin    = document.getElementById('panelLogin');
    const panelRegistro = document.getElementById('panelRegistro');
    const tabLogin      = document.getElementById('tabLogin');
    const tabRegistro   = document.getElementById('tabRegistro');
    const indicator     = document.getElementById('tabIndicator');

    if (cual === 'login') {
        panelLogin.hidden    = false;
        panelRegistro.hidden = true;
        tabLogin.classList.add('active');
        tabRegistro.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegistro.setAttribute('aria-selected', 'false');
        indicator.classList.remove('moved');
    } else {
        panelLogin.hidden    = true;
        panelRegistro.hidden = false;
        tabLogin.classList.remove('active');
        tabRegistro.classList.add('active');
        tabLogin.setAttribute('aria-selected', 'false');
        tabRegistro.setAttribute('aria-selected', 'true');
        indicator.classList.add('moved');
    }
}

/* ---- MOSTRAR / OCULTAR CONTRASEÑA ---- */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const isPass = input.type === 'password';
    input.type = isPass ? 'text' : 'password';
    btn.title  = isPass ? 'Ocultar contraseña' : 'Mostrar contraseña';
    /* Cambia el ojo con una línea cruzada visualmente */
    btn.style.opacity = isPass ? '0.7' : '1';
}

/* ---- FORTALEZA DE CONTRASEÑA ---- */
document.addEventListener('DOMContentLoaded', () => {
    const passInput = document.getElementById('regContrasena');
    if (passInput) {
        passInput.addEventListener('input', evaluarFortaleza);
    }
});

function evaluarFortaleza() {
    const pass   = document.getElementById('regContrasena').value;
    const fill   = document.getElementById('strengthFill');
    const label  = document.getElementById('strengthLabel');

    let score = 0;
    if (pass.length >= 6)                    score++;
    if (pass.length >= 10)                   score++;
    if (/[A-Z]/.test(pass))                  score++;
    if (/[0-9]/.test(pass))                  score++;
    if (/[^A-Za-z0-9]/.test(pass))          score++;

    const pct    = (score / 5) * 100;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const texts  = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];

    fill.style.width           = pct + '%';
    fill.style.backgroundColor = colors[score - 1] || '#ef4444';
    label.textContent          = pass.length > 0 ? texts[score - 1] || 'Muy débil' : '';
}

async function iniciarSesion() {
    const usernameVal = document.getElementById('loginUsuario').value.trim();
    const passVal     = document.getElementById('loginContrasena').value;

    if (!usernameVal || !passVal) {
        mostrarToast('Completa usuario y contraseña', 'error');
        marcarError('loginUsuario',   !usernameVal);
        marcarError('loginContrasena', !passVal);
        return;
    }

    setLoading('btnLogin', true);

    try {
        const res = await fetch(API_USUARIOS);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const usuarios = await res.json();

        /* Buscar por username (campo "usuario" en el modelo) */
        const encontrado = usuarios.find(u =>
            (u.usuario || '').toLowerCase() === usernameVal.toLowerCase()
        );

        if (!encontrado) {
            mostrarToast('Usuario no encontrado', 'error');
            marcarError('loginUsuario', true);
            return;
        }

        if (encontrado.estado === 0) {
            mostrarToast('Esta cuenta está inactiva', 'error');
            return;
        }

        /* Comparar contraseña */
        if (encontrado.contrasena !== passVal) {
            mostrarToast('Contraseña incorrecta', 'error');
            marcarError('loginContrasena', true);
            return;
        }

        /* Guardar sesión en sessionStorage */
        sessionStorage.setItem('kinal_user', JSON.stringify({
            codigo:  encontrado.codigoUsuario,
            usuario: encontrado.usuario,
            rol:     encontrado.rol
        }));

        mostrarToast(`Bienvenido, ${encontrado.usuario} ✓`, 'success');

        /* Redirigir al dashboard (clientes-view) */
        setTimeout(() => {
            window.location.href = '/clientes-view';
        }, 900);

    } catch (err) {
        console.error('Error al iniciar sesión:', err);
        mostrarToast('No se pudo conectar con el servidor', 'error');
    } finally {
        setLoading('btnLogin', false);
    }
}

/* ============================================================
   2. REGISTRAR USUARIO  —  POST /usuarios
   ============================================================ */
async function registrarUsuario() {
    const codigoVal   = document.getElementById('regCodigo').value.trim();
    const usuarioVal  = document.getElementById('regUsuario').value.trim();
    const correoVal   = document.getElementById('regCorreo').value.trim();
    const passVal     = document.getElementById('regContrasena').value;
    const rolVal      = document.getElementById('regRol').value;

    /* Validaciones */
    let hayError = false;
    marcarError('regCodigo',    !codigoVal);   if (!codigoVal)  hayError = true;
    marcarError('regUsuario',   !usuarioVal);  if (!usuarioVal) hayError = true;
    marcarError('regCorreo',    !correoVal || !correoVal.includes('@'));
    if (!correoVal || !correoVal.includes('@')) hayError = true;
    marcarError('regContrasena', passVal.length < 6);
    if (passVal.length < 6) hayError = true;

    if (hayError) {
        mostrarToast('Revisa los campos marcados', 'error');
        return;
    }

    setLoading('btnRegistro', true);

    const nuevoUsuario = {
        codigoUsuario: parseInt(codigoVal),
        usuario:       usuarioVal,
        contrasena:    passVal,
        correo:        correoVal,
        rol:           rolVal,
        estado:        1
    };

    try {
        const res = await fetch(API_USUARIOS, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(nuevoUsuario)
        });

        if (res.status === 409) {
            mostrarToast('El código de usuario ya existe', 'error');
            marcarError('regCodigo', true);
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        mostrarToast('Cuenta creada. Ahora inicia sesión ✓', 'success');

        /* Limpiar y volver al login */
        limpiarRegistro();
        setTimeout(() => mostrarPanel('login'), 1200);

    } catch (err) {
        console.error('Error al registrar usuario:', err);
        mostrarToast('Error al crear la cuenta. ¿Ya existe el código?', 'error');
    } finally {
        setLoading('btnRegistro', false);
    }
}


function marcarError(id, hayError) {
    const el = document.getElementById(id);
    if (!el) return;
    if (hayError) {
        el.classList.add('error');
        el.addEventListener('input', () => el.classList.remove('error'), { once: true });
    } else {
        el.classList.remove('error');
    }
}

function limpiarRegistro() {
    ['regCodigo','regUsuario','regCorreo','regContrasena'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.value = ''; el.classList.remove('error'); }
    });
    document.getElementById('regRol').value = 'VENDEDOR';
    document.getElementById('strengthFill').style.width = '0%';
    document.getElementById('strengthLabel').textContent = '';
}

/* Alterna el estado de carga en un botón */
function setLoading(btnId, loading) {
    const btn    = document.getElementById(btnId);
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    btn.disabled       = loading;
    text.hidden        = loading;
    loader.hidden      = !loading;
}

/* Toast */
function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className   = `toast show ${tipo}`;
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => { toast.className = 'toast'; }, 3200);
}

/* Acceso rápido con Enter */
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const panelLogin    = document.getElementById('panelLogin');
    const panelRegistro = document.getElementById('panelRegistro');
    if (!panelLogin.hidden)    iniciarSesion();
    else if (!panelRegistro.hidden) registrarUsuario();
});