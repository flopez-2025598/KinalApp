const API_USUARIOS = '/usuarios';

/* ── Cambiar entre paneles Login / Registro ── */
function mostrarPanel(panel) {
    const panelLogin    = document.getElementById('panelLogin');
    const panelRegistro = document.getElementById('panelRegistro');
    const tabLogin      = document.getElementById('tabLogin');
    const tabRegistro   = document.getElementById('tabRegistro');
    const indicator     = document.getElementById('tabIndicator');

    if (panel === 'login') {
        panelLogin.hidden    = false;
        panelRegistro.hidden = true;
        tabLogin.classList.add('active');
        tabRegistro.classList.remove('active');
        tabLogin.setAttribute('aria-selected', 'true');
        tabRegistro.setAttribute('aria-selected', 'false');
        if (indicator) indicator.style.transform = 'translateX(0)';
    } else {
        panelLogin.hidden    = true;
        panelRegistro.hidden = false;
        tabLogin.classList.remove('active');
        tabRegistro.classList.add('active');
        tabLogin.setAttribute('aria-selected', 'false');
        tabRegistro.setAttribute('aria-selected', 'true');
        if (indicator) indicator.style.transform = 'translateX(100%)';
    }
}

/* ── Mostrar / ocultar contraseña ── */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const mostrar = input.type === 'password';
    input.type = mostrar ? 'text' : 'password';
    btn.title = mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña';
}

/* ── Indicador de fortaleza de contraseña ── */
document.addEventListener('DOMContentLoaded', () => {
    const regPass = document.getElementById('regContrasena');
    if (regPass) {
        regPass.addEventListener('input', () => {
            const val   = regPass.value;
            const fill  = document.getElementById('strengthFill');
            const label = document.getElementById('strengthLabel');
            if (!fill || !label) return;

            let score = 0;
            if (val.length >= 6)               score++;
            if (val.length >= 10)              score++;
            if (/[A-Z]/.test(val))             score++;
            if (/[0-9]/.test(val))             score++;
            if (/[^A-Za-z0-9]/.test(val))      score++;

            const niveles = [
                { pct: '0%',   color: 'transparent', texto: '' },
                { pct: '25%',  color: '#ef4444',      texto: 'Muy débil' },
                { pct: '50%',  color: '#f97316',      texto: 'Débil' },
                { pct: '75%',  color: '#eab308',      texto: 'Moderada' },
                { pct: '90%',  color: '#22c55e',      texto: 'Fuerte' },
                { pct: '100%', color: '#16a34a',      texto: 'Muy fuerte' },
            ];
            const n = niveles[Math.min(score, 5)];
            fill.style.width           = n.pct;
            fill.style.backgroundColor = n.color;
            label.textContent          = n.texto;
        });
    }

    mostrarPanel('login');
});

/* ── Toast ── */
function mostrarToast(msg, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = `toast toast--${tipo} toast--visible`;
    setTimeout(() => toast.classList.remove('toast--visible'), 3500);
}

/*
 * ══════════════════════════════════════════════
 *  REGISTRO DE USUARIO
 *  Llama a POST /usuarios con los datos del form.
 *  La contraseña llega en texto plano al backend;
 *  UsuarioService.guardar() la encripta con BCrypt
 *  antes de persistirla. Así Spring Security puede
 *  autenticar correctamente después.
 * ══════════════════════════════════════════════
 */
async function registrarUsuario() {
    const btnReg = document.getElementById('btnRegistro');

    const usuario    = document.getElementById('regUsuario')?.value.trim();
    const correo     = document.getElementById('regCorreo')?.value.trim();
    const contrasena = document.getElementById('regContrasena')?.value;

    // Validaciones básicas
    if (!usuario) {
        mostrarToast('El nombre de usuario es requerido.', 'error'); return;
    }
    if (!correo || !correo.includes('@')) {
        mostrarToast('Ingresa un email válido.', 'error'); return;
    }
    if (!contrasena || contrasena.length < 6) {
        mostrarToast('La contraseña debe tener al menos 6 caracteres.', 'error'); return;
    }

    // Enviamos contraseña en texto plano → UsuarioService la encripta con BCrypt
    const nuevoUsuario = {
        usuario:    usuario,
        contrasena: contrasena,
        correo:     correo,
        estado:     1
    };

    setLoading(btnReg, true);

    try {
        const res = await fetch(API_USUARIOS, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(nuevoUsuario)
        });

        if (!res.ok) {
            const texto = await res.text();
            throw new Error(texto || `Error ${res.status}`);
        }

        mostrarToast('¡Cuenta creada! Ahora inicia sesión.', 'success');
        limpiarRegistro();
        setTimeout(() => mostrarPanel('login'), 1500);

    } catch (err) {
        mostrarToast(err.message || 'No se pudo crear la cuenta.', 'error');
    } finally {
        setLoading(btnReg, false);
    }
}

/* ── Helpers ── */
function setLoading(btn, loading) {
    if (!btn) return;
    const text   = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');
    btn.disabled = loading;
    if (text)   text.hidden   = loading;
    if (loader) loader.hidden = !loading;
}

function limpiarRegistro() {
    ['regCodigo','regUsuario','regCorreo','regContrasena'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const fill  = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    if (fill)  { fill.style.width = '0%'; fill.style.backgroundColor = 'transparent'; }
    if (label) label.textContent = '';
}