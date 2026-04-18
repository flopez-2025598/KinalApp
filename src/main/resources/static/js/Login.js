/* ============================================================
   login.css — KinalApp (Cyber-Blue Edition)
   Rediseño compacto con acentos Cian, Azul Profundo y Slate
   ============================================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
    /* Nueva Paleta: Cyber Blue */
    --primary:       #00D1FF; /* Cian Eléctrico */
    --primary-dark:  #007ACC; /* Azul Tech */
    --primary-light: #E6F9FF;
    --primary-glow:  rgba(0, 209, 255, 0.15);

    --accent:        #7000FF; /* Púrpura Neon para contrastes */
    --accent-light:  #F3E6FF;

    --success:       #00E676;
    --success-bg:    #E8F5E9;

    --danger:        #FF3D00;
    --danger-bg:     #FFF3F0;

    /* Fondos y Superficies */
    --bg:            #0B0E14; /* Gris casi negro muy tech */
    --surface:       #161B22; /* Superficie tipo GitHub Dark */
    --surface-2:     #21262D;
    --border:        #30363D;

    /* Texto */
    --text-hi:       #F0F6FC;
    --text-mid:      #8B949E;
    --text-lo:       #484F58;

    --radius-sm:     8px;
    --radius-md:     12px;
    --radius-lg:     20px;
    --card-w:        400px;
    --ease:          0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

body {
    font-family: 'Space Grotesk', 'IBM Plex Mono', monospace;
    background-color: var(--bg);
    color: var(--text-hi);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    overflow-x: hidden;
}

/* ---- FONDO DECORATIVO ---- */
.bg-grid {
    position: fixed;
    inset: 0;
    background-image:
        linear-gradient(rgba(0, 209, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 209, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
}

.bg-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
    filter: blur(80px);
}

.bg-orb--1 {
    width: 400px; height: 400px;
    background: var(--primary-dark);
    top: -100px; left: -100px;
}

.bg-orb--2 {
    width: 300px; height: 300px;
    background: var(--accent);
    bottom: -50px; right: -50px;
}

/* ---- TARJETA PRINCIPAL ---- */
.card-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: var(--card-w);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 2.2rem;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
    animation: popIn 0.5s var(--ease) both;
}

/* Barra superior de gradiente */
.card-wrapper::before {
    content: '';
    position: absolute;
    top: -1px; left: 30px; right: 30px;
    height: 3px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    border-radius: 0 0 10px 10px;
}

@keyframes popIn {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---- BRANDING ---- */
.brand-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 2rem;
}

.brand-icon {
    width: 45px; height: 45px;
    background: var(--primary-glow);
    border: 2px solid var(--primary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    font-weight: bold;
    font-size: 1.2rem;
}

.brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.5rem;
    letter-spacing: -0.02em;
    color: var(--primary);
    text-transform: uppercase;
}

/* ---- NAVEGACIÓN (TABS) ---- */
.tab-bar {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 4px;
    margin-bottom: 1.8rem;
}

.tab {
    position: relative;
    z-index: 1;
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    padding: 10px 0;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-mid);
    cursor: pointer;
    transition: color var(--ease);
    letter-spacing: 0.05em;
}

.tab.active { color: var(--primary); }

.tab-indicator {
    position: absolute;
    top: 4px; bottom: 4px;
    left: 4px;
    width: calc(50% - 4px);
    background: var(--surface);
    border: 1px solid var(--primary);
    border-radius: var(--radius-sm);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
}

.tab-indicator.moved { transform: translateX(100%); }

/* ---- CAMPOS DE FORMULARIO ---- */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 1.2rem;
}

.field-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-mid);
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.field-input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    font-size: 0.85rem;
    color: var(--text-hi);
    outline: none;
    transition: all var(--ease);
}

.field-input:focus {
    background: var(--surface);
    border-color: var(--primary);
    box-shadow: 0 0 0 4px var(--primary-glow);
}

.field-input::placeholder { color: var(--text-lo); }

/* ---- BOTÓN ACCIÓN ---- */
.btn-main {
    width: 100%;
    margin-top: 1rem;
    padding: 14px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--bg); /* Texto oscuro sobre botón brillante */
    cursor: pointer;
    transition: all var(--ease);
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.btn-main:hover {
    background: var(--text-hi);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 209, 255, 0.3);
}

.btn-main:active { transform: scale(0.98); }

/* ---- DETALLES EXTRA ---- */
.switch-hint {
    text-align: center;
    font-size: 0.75rem;
    color: var(--text-lo);
    margin-top: 1.5rem;
}

.link-btn {
    background: none;
    border: none;
    color: var(--primary);
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
}

.link-btn:hover { text-decoration: underline; }

/* Scrollbar Personalizado */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }