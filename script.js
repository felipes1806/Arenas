"use strict";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_TURNOS = 25;

const STATE_KEY = "arenera_turnos_estado_v30";
const USERS_KEY = "arenera_usuarios_v30";


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
   CARGAR ESTADO
========================================================= */

function loadState() {

    try {

        const saved = localStorage.getItem(STATE_KEY);

        if (!saved) {
            return {
                current: null,
                called: [],
                delivered: []
            };
        }

        const parsed = JSON.parse(saved);

        return {
            current: parsed.current || null,
            called: Array.isArray(parsed.called)
                ? parsed.called
                : [],
            delivered: Array.isArray(parsed.delivered)
                ? parsed.delivered
                : []
        };

    } catch (error) {

        console.error(
            "Error cargando estado:",
            error
        );

        return {
            current: null,
            called: [],
            delivered: []
        };
    }
}


function saveState() {

    try {

        localStorage.setItem(
            STATE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.error(
            "Error guardando estado:",
            error
        );
    }
}



/* =========================================================
   CARGAR USUARIOS
========================================================= */

function loadUsers() {

    try {

        const saved =
            localStorage.getItem(USERS_KEY);

        if (!saved) {

            return [...defaultUsers];
        }

        const users =
            JSON.parse(saved);

        if (!Array.isArray(users) ||
            users.length === 0) {

            return [...defaultUsers];
        }

        return users;

    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

        return [...defaultUsers];
    }
}


function saveUsers() {

    try {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    } catch (error) {

        console.error(
            "Error guardando usuarios:",
            error
        );
    }
}



/* =========================================================
   VARIABLES
========================================================= */

let state = loadState();
let users = loadUsers();

let loggedUser = null;



/* =========================================================
   ELEMENTOS HTML
========================================================= */

const helpButton =
    document.getElementById("helpButton");

const helpModal =
    document.getElementById("helpModal");

const closeHelp =
    document.getElementById("closeHelp");

const understoodHelp =
    document.getElementById("understoodHelp");


const adminButton =
    document.getElementById("adminButton");

const adminModal =
    document.getElementById("adminModal");

const closeAdmin =
    document.getElementById("closeAdmin");


const loginSection =
    document.getElementById("loginSection");

const adminPanel =
    document.getElementById("adminPanel");


const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");


const currentTurn =
    document.getElementById("currentTurn");

const currentMessage =
    document.getElementById("currentMessage");

const availableCount =
    document.getElementById("availableCount");

const lastCalled =
    document.getElementById("lastCalled");

const deliveredCount =
    document.getElementById("deliveredCount");

const turnGrid =
    document.getElementById("turnGrid");

const currentDate =
    document.getElementById("currentDate");


const adminCurrentTurn =
    document.getElementById("adminCurrentTurn");

const nextTurnButton =
    document.getElementById("nextTurnButton");

const repeatTurnButton =
    document.getElementById("repeatTurnButton");

const newDayButton =
    document.getElementById("newDayButton");


const specificTurn =
    document.getElementById("specificTurn");

const specificTurnButton =
    document.getElementById("specificTurnButton");


const deliveredList =
    document.getElementById("deliveredList");


const newUsername =
    document.getElementById("newUsername");

const newPassword =
    document.getElementById("newPassword");

const addUserButton =
    document.getElementById("addUserButton");

const usersList =
    document.getElementById("usersList");

const logoutButton =
    document.getElementById("logoutButton");



/* =========================================================
   FORMATO DE TURNO
========================================================= */

function formatTurn(number) {

    return String(number).padStart(3, "0");
}



/* =========================================================
   FECHA
========================================================= */

function updateDate() {

    if (!currentDate) {
        return;
    }

    const now = new Date();

    const date = now.toLocaleDateString(
        "es-CO",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

    currentDate.textContent = date;
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

    updateDate();
}



/* =========================================================
   TURNO ACTUAL
========================================================= */

function renderCurrentTurn() {

    if (!currentTurn ||
        !adminCurrentTurn) {

        return;
    }


    if (state.current === null) {

        currentTurn.textContent = "---";

        adminCurrentTurn.textContent = "---";

        currentMessage.textContent =
            "Esperando el inicio de la jornada";

        return;
    }


    const formatted =
        formatTurn(state.current);

    currentTurn.textContent =
        formatted;

    adminCurrentTurn.textContent =
        formatted;

    currentMessage.textContent =
        "Diríjase al punto de atención.";
}



/* =========================================================
   INFORMACIÓN
========================================================= */

function renderInformation() {

    if (!availableCount ||
        !lastCalled ||
        !deliveredCount) {

        return;
    }


    const available =
        TOTAL_TURNOS - state.called.length;


    availableCount.textContent =
        Math.max(available, 0);


    if (state.called.length === 0) {

        lastCalled.textContent =
            "---";

    } else {

        const last =
            state.called[
                state.called.length - 1
            ];

        lastCalled.textContent =
            formatTurn(last);
    }


    deliveredCount.textContent =
        state.delivered.length;
}



/* =========================================================
   GRID DE 25 TURNOS
========================================================= */

function renderTurnGrid() {

    if (!turnGrid) {
        return;
    }


    turnGrid.innerHTML = "";


    for (
        let number = 1;
        number <= TOTAL_TURNOS;
        number++
    ) {

        const card =
            document.createElement("div");

        card.className =
            "turn-card";


        let status = "available";

        let statusText = "Disponible";


        if (state.delivered.includes(number)) {

            status = "delivered";

            statusText = "Entregado";

        }


        if (state.called.includes(number)) {

            status = "called";

            statusText = "Llamado";

        }


        if (state.current === number) {

            status = "current";

            statusText = "Turno actual";

        }


        card.classList.add(status);


        card.innerHTML = `
            <div class="turn-number">
                ${formatTurn(number)}
            </div>

            <div class="turn-status">
                ${statusText}
            </div>
        `;


        turnGrid.appendChild(card);
    }
}



/* =========================================================
   LISTA DE TURNOS ENTREGADOS
========================================================= */

function renderDelivered() {

    if (!deliveredList) {
        return;
    }


    deliveredList.innerHTML = "";


    for (
        let number = 1;
        number <= TOTAL_TURNOS;
        number++
    ) {

        const row =
            document.createElement("div");

        row.className =
            "delivered-row";


        const isDelivered =
            state.delivered.includes(number);


        const turnText =
            formatTurn(number);


        row.innerHTML = `
            <span>
                Turno ${turnText}
            </span>

            <button
                type="button"
                data-turn="${number}"
                class="deliver-button">
                ${isDelivered ? "Quitar" : "Entregar"}
            </button>
        `;


        const button =
            row.querySelector("button");


        button.addEventListener(
            "click",
            function () {

                toggleDelivered(number);

            }
        );


        deliveredList.appendChild(row);
    }
}



/* =========================================================
   MARCAR COMO ENTREGADO
========================================================= */

function toggleDelivered(number) {

    const index =
        state.delivered.indexOf(number);


    if (index === -1) {

        state.delivered.push(number);

    } else {

        state.delivered.splice(index, 1);
    }


    state.delivered.sort(
        function (a, b) {
            return a - b;
        }
    );


    saveState();

    render();
}



/* =========================================================
   LLAMAR TURNO
========================================================= */

function callTurn(number) {

    number = Number(number);


    if (
        number < 1 ||
        number > TOTAL_TURNOS
    ) {

        return;
    }


    state.current = number;


    if (!state.called.includes(number)) {

        state.called.push(number);
    }


    state.called.sort(
        function (a, b) {
            return a - b;
        }
    );


    saveState();

    render();

    announceTurn(number);
}



/* =========================================================
   LLAMAR SIGUIENTE
========================================================= */

function callNext() {

    let next = null;


    for (
        let number = 1;
        number <= TOTAL_TURNOS;
        number++
    ) {

        if (!state.called.includes(number)) {

            next = number;

            break;
        }
    }


    if (next === null) {

        alert(
            "Todos los turnos han sido llamados."
        );

        return;
    }


    callTurn(next);
}



/* =========================================================
   REPETIR TURNO
========================================================= */

function repeatCurrent() {

    if (state.current === null) {

        alert(
            "No hay ningún turno actual."
        );

        return;
    }


    announceTurn(state.current);
}



/* =========================================================
   TURNO ESPECÍFICO
========================================================= */

function callSpecific() {

    const number =
        Number(specificTurn.value);


    if (
        !Number.isInteger(number) ||
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
   VOZ
========================================================= */

function announceTurn(number) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;
    }


    try {

        window.speechSynthesis.cancel();


        const message =
            new SpeechSynthesisUtterance(
                "Turno " +
                formatTurn(number) +
                ". Por favor diríjase al punto de atención."
            );


        message.lang = "es-CO";

        message.rate = 0.9;

        message.pitch = 1;


        window.speechSynthesis.speak(
            message
        );

    } catch (error) {

        console.error(
            "Error de voz:",
            error
        );
    }
}



/* =========================================================
   NUEVA JORNADA
========================================================= */

function newDay() {

    const confirmation =
        confirm(
            "¿Está seguro de iniciar una nueva jornada? Se reiniciarán los 25 turnos."
        );


    if (!confirmation) {
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
        "La nueva jornada ha sido iniciada."
    );
}



/* =========================================================
   AYUDA
========================================================= */

function openHelp() {

    if (!helpModal) {
        return;
    }

    helpModal.style.display = "flex";
}


function closeHelpModal() {

    if (!helpModal) {
        return;
    }

    helpModal.style.display = "none";
}



/* =========================================================
   ADMINISTRACIÓN
========================================================= */

function openAdmin() {

    if (!adminModal) {
        return;
    }


    adminModal.style.display = "flex";


    if (loggedUser) {

        showAdminPanel();

    } else {

        showLogin();
    }
}


function closeAdminModal() {

    if (!adminModal) {
        return;
    }

    adminModal.style.display = "none";
}



/* =========================================================
   LOGIN
========================================================= */

function showLogin() {

    loginSection.style.display = "block";

    adminPanel.style.display = "none";

    loginError.style.display = "none";
}


function showAdminPanel() {

    loginSection.style.display = "none";

    adminPanel.style.display = "block";

    render();
}


function login() {

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    const found =
        users.find(
            function (user) {

                return (
                    user.username === username &&
                    user.password === password
                );

            }
        );


    if (!found) {

        loginError.style.display =
            "block";

        return;
    }


    loggedUser =
        found.username;


    usernameInput.value = "";

    passwordInput.value = "";

    loginError.style.display =
        "none";


    showAdminPanel();
}



/* =========================================================
   CERRAR SESIÓN
========================================================= */

function logout() {

    loggedUser = null;

    showLogin();
}



/* =========================================================
   USUARIOS
========================================================= */

function renderUsers() {

    if (!usersList) {
        return;
    }


    usersList.innerHTML = "";


    users.forEach(
        function (user, index) {

            const row =
                document.createElement("div");

            row.className =
                "user-row";


            row.innerHTML = `
                <span>
                    ${escapeHTML(user.username)}
                </span>

                <button
                    type="button"
                    class="delete-user-button">
                    Eliminar
                </button>
            `;


            const deleteButton =
                row.querySelector("button");


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteUser(index);

                }
            );


            usersList.appendChild(row);
        }
    );
}



/* =========================================================
   AGREGAR USUARIO
========================================================= */

function addUser() {

    const username =
        newUsername.value.trim();

    const password =
        newPassword.value;


    if (!username ||
        !password) {

        alert(
            "Ingrese usuario y contraseña."
        );

        return;
    }


    const exists =
        users.some(
            function (user) {

                return (
                    user.username.toLowerCase() ===
                    username.toLowerCase()
                );

            }
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
   ELIMINAR USUARIO
========================================================= */

function deleteUser(index) {

    if (users.length <= 1) {

        alert(
            "Debe existir al menos un usuario."
        );

        return;
    }


    const user =
        users[index];


    const confirmation =
        confirm(
            "¿Desea eliminar al usuario " +
            user.username +
            "?"
        );


    if (!confirmation) {
        return;
    }


    users.splice(index, 1);

    saveUsers();

    renderUsers();
}



/* =========================================================
   SEGURIDAD BÁSICA PARA TEXTO
========================================================= */

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



/* =========================================================
   CERRAR MODALES AL HACER CLIC AFUERA
========================================================= */

if (helpModal) {

    helpModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === helpModal
            ) {

                closeHelpModal();
            }
        }
    );
}


if (adminModal) {

    adminModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === adminModal
            ) {

                closeAdminModal();
            }
        }
    );
}



/* =========================================================
   EVENTOS
========================================================= */

if (helpButton) {

    helpButton.addEventListener(
        "click",
        openHelp
    );
}


if (closeHelp) {

    closeHelp.addEventListener(
        "click",
        closeHelpModal
    );
}


if (understoodH
