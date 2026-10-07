/* =========================================================
   SISTEMA DE TURNOS - ARENERA
   ========================================================= */

const TOTAL_TURNOS = 25;

const STORAGE_KEY = "turnero_manual_v5";
const USERS_STORAGE_KEY = "turnero_users_v2";

/* =========================================================
   ESTADO INICIAL
   ========================================================= */

const defaultState = {
    current: null,
    called: [],
    delivered: []
};

const defaultUsers = [
    {
        username: "admin",
        password: "admin123"
    }
];

/* =========================================================
   CARGAR DATOS
   ========================================================= */

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return { ...defaultState };
        }

        const data = JSON.parse(saved);

        return {
            current: data.current || null,
            called: Array.isArray(data.called) ? data.called : [],
            delivered: Array.isArray(data.delivered) ? data.delivered : []
        };
    } catch (error) {
        console.error("Error cargando el estado:", error);
        return { ...defaultState };
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Error guardando el estado:", error);
    }
}

function loadUsers() {
    try {
        const saved = localStorage.getItem(USERS_STORAGE_KEY);

        if (!saved) {
            return [...defaultUsers];
        }

        const users = JSON.parse(saved);

        if (!Array.isArray(users) || users.length === 0) {
            return [...defaultUsers];
        }

        return users;
    } catch (error) {
        console.error("Error cargando usuarios:", error);
        return [...defaultUsers];
    }
}

function saveUsers() {
    try {
        localStorage.setItem(
            USERS_STORAGE_KEY,
            JSON.stringify(users)
        );
    } catch (error) {
        console.error("Error guardando usuarios:", error);
    }
}

let state = loadState();
let users = loadUsers();

/* =========================================================
   ELEMENTOS HTML
   ========================================================= */

const currentTurn = document.getElementById("currentTurn");
const currentMessage = document.getElementById("currentMessage");

const availableCount = document.getElementById("availableCount");
const lastCalled = document.getElementById("lastCalled");
const deliveredCount = document.getElementById("deliveredCount");

const turnGrid = document.getElementById("turnGrid");
const currentDate = document.getElementById("currentDate");

/* Botones principales */

const openHelpButton = document.getElementById("openHelpButton");
const openAdminButton = document.getElementById("openAdminButton");

/* Ayuda */

const helpMenu = document.getElementById("helpMenu");
const closeHelpButton = document.getElementById("closeHelpButton");
const understoodHelpButton = document.getElementById("understoodHelpButton");

/* Administración */

const adminModal = document.getElementById("adminModal");
const closeAdminButton = document.getElementById("closeAdminButton");

const loginSection = document.getElementById("loginSection");
const adminPanel = document.getElementById("adminPanel");

const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const loginError = document.getElementById("loginError");

/* Panel */

const adminCurrentTurn = document.getElementById("adminCurrentTurn");

const nextTurnButton = document.getElementById("nextTurnButton");
const repeatTurnButton = document.getElementById("repeatTurnButton");
const newDayButton = document.getElementById("newDayButton");

const specificTurn = document.getElementById("specificTurn");
const specificTurnButton = document.getElementById("specificTurnButton");

const deliveredList = document.getElementById("deliveredList");

const newUsername = document.getElementById("newUsername");
const newPassword = document.getElementById("newPassword");
const addUserButton = document.getElementById("addUserButton");
const usersList = document.getElementById("usersList");

const logoutButton = document.getElementById("logoutButton");

/* =========================================================
   COMPROBAR ELEMENTOS
   ========================================================= */

console.log("Sistema de turnos iniciado");

if (!currentTurn) {
    console.error("No se encontró #currentTurn");
}

if (!turnGrid) {
    console.error("No se encontró #turnGrid");
}

/* =========================================================
   FORMATO DEL TURNO
   ========================================================= */

function formatTurn(number) {
    if (!number) {
        return "---";
    }

    return String(number).padStart(3, "0");
}

/* =========================================================
   FECHA
   ========================================================= */

function updateDate() {
    if (!currentDate) return;

    const now = new Date();

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    };

    currentDate.textContent = now.toLocaleDateString(
        "es-CO",
        options
    );
}

/* =========================================================
   RENDER PRINCIPAL
   ========================================================= */

function render() {
    renderCurrentTurn();
    renderInformation();
    renderTurnGrid();
    renderDelivered();
    renderUsers();
}

/* =========================================================
   TURNO ACTUAL
   ========================================================= */

function renderCurrentTurn() {

    const turn = state.current;

    if (currentTurn) {
        currentTurn.textContent = formatTurn(turn);
    }

    if (adminCurrentTurn) {
        adminCurrentTurn.textContent = formatTurn(turn);
    }

    if (!currentMessage) {
        return;
    }

    if (!turn) {
        currentMessage.textContent =
            "Esperando el inicio de la jornada";
        return;
    }

    if (state.delivered.includes(turn)) {
        currentMessage.textContent =
            "Turno atendido";
        return;
    }

    currentMessage.textContent =
        "Por favor, acérquese al punto de atención";
}

/* =========================================================
   INFORMACIÓN
   ========================================================= */

function renderInformation() {

    const called = state.called.length;

    const available = Math.max(
        0,
        TOTAL_TURNOS - called
    );

    if (availableCount) {
        availableCount.textContent = available;
    }

    if (lastCalled) {
        if (state.called.length > 0) {
            const last =
                state.called[state.called.length - 1];

            lastCalled.textContent =
                formatTurn(last);
        } else {
            lastCalled.textContent = "---";
        }
    }

    if (deliveredCount) {
        deliveredCount.textContent =
            state.delivered.length;
    }
}

/* =========================================================
   CUADRÍCULA DE TURNOS
   ========================================================= */

function renderTurnGrid() {

    if (!turnGrid) return;

    turnGrid.innerHTML = "";

    for (let i = 1; i <= TOTAL_TURNOS; i++) {

        const card = document.createElement("div");

        card.classList.add("turn-card");

        const number = document.createElement("div");

        number.classList.add("turn-number");

        number.textContent = formatTurn(i);

        const status = document.createElement("div");

        status.classList.add("turn-status");

        /* Turno actual */

        if (state.current === i) {

            card.classList.add("current");

            status.textContent = "En atención";

        }

        /* Turno entregado */

        else if (state.delivered.includes(i)) {

            card.classList.add("delivered");

            status.textContent = "Entregado";

        }

        /* Turno llamado anteriormente */

        else if (state.called.includes(i)) {

            card.classList.add("called");

            status.textContent = "Llamado";

        }

        /* Turno disponible */

        else {

            status.textContent = "Disponible";
        }

        card.appendChild(number);
        card.appendChild(status);

        turnGrid.appendChild(card);
    }
}

/* =========================================================
   LISTA DE TURNOS ENTREGADOS
   ========================================================= */

function renderDelivered() {

    if (!deliveredList) return;

    deliveredList.innerHTML = "";

    for (let i = 1; i <= TOTAL_TURNOS; i++) {

        const item = document.createElement("div");

        item.classList.add("delivered-item");

        const number = document.createElement("span");

        number.textContent =
            "Turno " + formatTurn(i);

        const button = document.createElement("button");

        if (state.delivered.includes(i)) {

            button.textContent = "Quitar";

            button.addEventListener(
                "click",
                function () {
                    toggleDelivered(i);
                }
            );

        } else {

            button.textContent = "Entregar";

            button.addEventListener(
                "click",
                function () {
                    toggleDelivered(i);
                }
            );
        }

        item.appendChild(number);
        item.appendChild(button);

        deliveredList.appendChild(item);
    }
}

/* =========================================================
   ENTREGAR / QUITAR TURNO
   ========================================================= */

function toggleDelivered(number) {

    if (state.delivered.includes(number)) {

        state.delivered =
            state.delivered.filter(
                item => item !== number
            );

    } else {

        state.delivered.push(number);

        if (!state.called.includes(number)) {
            state.called.push(number);
        }
    }

    saveState();
    render();
}

/* =========================================================
   LLAMAR TURNO
   ========================================================= */

function callTurn(number) {

    if (
        number < 1 ||
        number > TOTAL_TURNOS
    ) {
        return;
    }

    if (!state.called.includes(number)) {
        state.called.push(number);
    }

    state.current = number;

    saveState();
    render();

    announceTurn(number);
}

/* =========================================================
   LLAMAR SIGUIENTE
   ========================================================= */

function callNext() {

    let next = null;

    for (let i = 1; i <= TOTAL_TURNOS; i++) {

        if (!state.called.includes(i)) {

            next = i;
            break;
        }
    }

    if (!next) {

        alert(
            "Todos los turnos de la jornada ya fueron llamados."
        );

        return;
    }

    callTurn(next);
}

/* =========================================================
   REPETIR TURNO
   ========================================================= */

function repeatCurrent() {

    if (!state.current) {

        alert(
            "No hay ningún turno llamado."
        );

        return;
    }

    announceTurn(state.current);
}

/* =========================================================
   LLAMAR TURNO ESPECÍFICO
   ========================================================= */

function callSpecificTurn() {

    if (!specificTurn) return;

    const number =
        parseInt(specificTurn.value, 10);

    if (
        isNaN(number) ||
        number < 1 ||
        number > TOTAL_TURNOS
    ) {

        alert(
            "Ingrese un número de turno entre 1 y 25."
        );

        return;
    }

    callTurn(number);

    specificTurn.value = "";
}

/* =========================================================
   ANUNCIO DE VOZ
   ========================================================= */

function announceTurn(number) {

    if (
        typeof window.speechSynthesis ===
        "undefined"
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const text =
        "Turno " +
        formatTurn(number) +
        ". Por favor, acérquese al punto de atención.";

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.lang = "es-CO";
    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}

/* =========================================================
   NUEVA JORNADA
   ========================================================= */

function newDay() {

    const confirmReset =
        confirm(
            "¿Está seguro de iniciar una nueva jornada?\n\nSe reiniciarán todos los turnos."
        );

    if (!confirmReset) {
        return;
    }

    state = {
        current: null,
        called: [],
        delivered: []
    };

    saveState();
    render();

    alert(
        "La nueva jornada ha comenzado."
    );
}

/* =========================================================
   AYUDA
   ========================================================= */

function openHelp() {

    if (!helpMenu) return;

    helpMenu.classList.add("active");

    document.body.classList.add(
        "modal-open"
    );
}

function closeHelp() {

    if (!helpMenu) return;

    helpMenu.classList.remove("active");

    document.body.classList.remove(
        "modal-open"
    );
}

/* =========================================================
   ADMINISTRACIÓN
   ========================================================= */

function openAdmin() {

    if (!adminModal) return;

    adminModal.classList.add("active");

    showLogin();

    if (loginUsername) {
        setTimeout(function () {
            loginUsername.focus();
        }, 100);
    }
}

function closeAdmin() {

    if (!adminModal) return;

    adminModal.classList.remove("active");
}

/* =========================================================
   MOSTRAR LOGIN
   ========================================================= */

function showLogin() {

    if (loginSection) {
        loginSection.style.display = "block";
    }

    if (adminPanel) {
        adminPanel.style.display = "none";
    }

    if (loginError) {
        loginError.style.display = "none";
    }

    if (loginUsername) {
        loginUsername.value = "";
    }

    if (loginPassword) {
        loginPassword.value = "";
    }
}

/* =========================================================
   MOSTRAR PANEL
   ========================================================= */

function showAdminPanel() {

    if (loginSection) {
        loginSection.style.display = "none";
    }

    if (adminPanel) {
        adminPanel.style.display = "block";
    }

    render();
}

/* =========================================================
   LOGIN
   ========================================================= */

function login() {

    const username =
        loginUsername
            ? loginUsername.value.trim()
            : "";

    const password =
        loginPassword
            ? loginPassword.value
            : "";

    const user = users.find(
        item =>
            item.username === username &&
            item.password === password
    );

    if (!user) {

        if (loginError) {
            loginError.style.display = "block";
        }

        return;
    }

    if (loginError) {
        loginError.style.display = "none";
    }

    showAdminPanel();
}

/* =========================================================
   CERRAR SESIÓN
   ========================================================= */

function logout() {

    showLogin();

}

/* =========================================================
   AGREGAR USUARIO
   ========================================================= */

function addUser() {

    if (!newUsername || !newPassword) {
        return;
    }

    const username =
        newUsername.value.trim();

    const password =
        newPassword.value;

    if (!username || !password) {

        alert(
            "Ingrese un usuario y una contraseña."
        );

        return;
    }

    const exists = users.some(
        user =>
            user.username.toLowerCase() ===
            username.toLowerCase()
    );

    if (exists) {

        alert(
            "Ese usuario ya existe."
        );

        return;
    }

    users.push({
        username: username,
        password: password
    });

    saveUsers();
    renderUsers();

    newUsername.value = "";
    newPassword.value = "";

    alert(
        "Usuario agregado correctamente."
    );
}

/* =========================================================
   MOSTRAR USUARIOS
   ========================================================= */

function renderUsers() {

    if (!usersList) return;

    usersList.innerHTML = "";

    users.forEach(
        function (user, index) {

            const item =
                document.createElement("div");

            item.classList.add("user-item");

            const name =
                document.createElement("span");

            name.textContent =
                user.username;

            const button =
                document.createElement("button");

            button.textContent =
                "Eliminar";

            /*
             * No permitimos eliminar el último
             * usuario administrador.
             */

            button.addEventListener(
                "click",
                function () {

                    if (users.length === 1) {

                        alert(
                            "Debe existir al menos un usuario."
                        );

                        return;
                    }

                    const confirmDelete =
                        confirm(
                            "¿Desea eliminar el usuario " +
                            user.username +
                            "?"
                        );

                    if (!confirmDelete) {
                        return;
                    }

                    users.splice(index, 1);

                    saveUsers();
                    renderUsers();
                }
            );

            item.appendChild(name);
            item.appendChild(button);

            usersList.appendChild(item);
        }
    );
}

/* =========================================================
   EVENTOS
   ========================================================= */

/* Ayuda */

if (openHelpButton) {

    openHelpButton.addEventListener(
        "click",
        openHelp
    );
}

if (closeHelpButton) {

    closeHelpButton.addEventListener(
        "click",
        closeHelp
    );
}

if (understoodHelpButton) {

    understoodHelpButton.addEventListener(
        "click",
        closeHelp
    );
}

/* Administración */

if (openAdminButton) {

    openAdminButton.addEventListener(
        "click",
        openAdmin
    );
}

if (closeAdminButton) {

    closeAdminButton.addEventListener(
        "click",
        closeAdmin
    );
}

/* Login */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );
}

if (loginPassword) {

    loginPassword.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {
                login();
            }
        }
    );
}

/* Administración */

if (nextTurnButton) {

    nextTurnButton.addEventListener(
        "click",
        callNext
    );
}

if (repeatTurnButton) {

    repeatTurnButton.a
