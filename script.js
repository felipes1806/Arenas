"use strict";


/* =========================================
   CONFIGURACIÓN
========================================= */

const STORAGE_KEY = "turnero_manual_v5";
const USERS_STORAGE_KEY = "turnero_users_v2";


/* =========================================
   ESTADO
========================================= */

let state = loadState();

let users = loadUsers();


/* =========================================
   CARGAR ESTADO
========================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);


        if (saved) {

            const data =
                JSON.parse(saved);


            return {
                current:
                    Number.isInteger(data.current)
                        ? data.current
                        : null,

                called:
                    Array.isArray(data.called)
                        ? data.called
                        : [],

                delivered:
                    Array.isArray(data.delivered)
                        ? data.delivered
                        : []
            };

        }

    } catch (error) {

        console.error(
            "Error cargando los turnos:",
            error
        );

    }


    return {
        current: null,
        called: [],
        delivered: []
    };

}


/* =========================================
   CARGAR USUARIOS
========================================= */

function loadUsers() {

    try {

        const saved =
            localStorage.getItem(
                USERS_STORAGE_KEY
            );


        if (saved) {

            const data =
                JSON.parse(saved);


            if (Array.isArray(data) && data.length > 0) {

                return data;

            }

        }

    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

    }


    return [
        {
            username: "admin",
            password: "admin123"
        }
    ];

}


/* =========================================
   GUARDAR
========================================= */

function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}


function saveUsers() {

    localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(users)
    );

}


/* =========================================
   FORMATO DE TURNO
========================================= */

function formatTurn(number) {

    return String(number).padStart(3, "0");

}


/* =========================================
   ELEMENTOS HTML
========================================= */

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


/* ADMIN */

const adminModal =
    document.getElementById("adminModal");

const openAdminButton =
    document.getElementById("openAdminButton");

const closeAdminButton =
    document.getElementById("closeAdminButton");

const loginSection =
    document.getElementById("loginSection");

const adminPanel =
    document.getElementById("adminPanel");

const loginUsername =
    document.getElementById("loginUsername");

const loginPassword =
    document.getElementById("loginPassword");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

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

const logoutButton =
    document.getElementById("logoutButton");


/* USUARIOS */

const newUsername =
    document.getElementById("newUsername");

const newPassword =
    document.getElementById("newPassword");

const addUserButton =
    document.getElementById("addUserButton");

const usersList =
    document.getElementById("usersList");


/* AYUDA */

const helpMenu =
    document.getElementById("helpMenu");

const openHelpButton =
    document.getElementById("openHelpButton");

const closeHelpButton =
    document.getElementById("closeHelpButton");

const understoodHelpButton =
    document.getElementById("understoodHelpButton");


/* =========================================
   VERIFICAR ELEMENTOS
========================================= */

const requiredElements = [

    currentTurn,
    currentMessage,
    availableCount,
    lastCalled,
    deliveredCount,
    turnGrid,

    adminModal,
    openAdminButton,
    closeAdminButton,

    loginSection,
    adminPanel,

    loginUsername,
    loginPassword,
    loginButton,

    nextTurnButton,
    repeatTurnButton,
    newDayButton,

    specificTurn,
    specificTurnButton,

    deliveredList,

    logoutButton,

    newUsername,
    newPassword,
    addUserButton,
    usersList,

    helpMenu,
    openHelpButton,
    closeHelpButton,
    understoodHelpButton

];


if (requiredElements.some(element => !element)) {

    console.error(
        "ERROR: Falta uno o más elementos HTML. Revisa que index.html sea el correcto."
    );

}


/* =========================================
   RENDERIZAR TODO
========================================= */

function render() {

    renderCurrentTurn();

    renderInformation();

    renderTurnGrid();

    renderDelivered();

    renderUsers();

}


/* =========================================
   TURNO ACTUAL
========================================= */

function renderCurrentTurn() {

    if (state.current !== null) {

        currentTurn.textContent =
            formatTurn(state.current);

        adminCurrentTurn.textContent =
            formatTurn(state.current);

        currentMessage.textContent =
            "Diríjase al punto de atención.";

    } else {

        currentTurn.textContent =
            "---";

        adminCurrentTurn.textContent =
            "---";

        currentMessage.textContent =
            "Esperando el inicio de la jornada.";

    }

}


/* =========================================
   INFORMACIÓN
========================================= */

function renderInformation() {

    const calledUnique =
        new Set(state.called).size;


    availableCount.textContent =
        Math.max(
            0,
            25 - calledUnique
        );


    if (state.called.length > 0) {

        lastCalled.textContent =
            formatTurn(
                state.called[
                    state.called.length - 1
                ]
            );

    } else {

        lastCalled.textContent =
            "---";

    }


    deliveredCount.textContent =
        state.delivered.length;

}


/* =========================================
   CUADRÍCULA DE TURNOS
========================================= */

function renderTurnGrid() {

    turnGrid.innerHTML = "";


    for (
        let number = 1;
        number <= 25;
        number++
    ) {


        const card =
            document.createElement("div");


        card.className =
            "turn-card";


        if (
            state.current === number
        ) {

            card.classList.add(
                "current"
            );

        } else if (
            state.called.includes(number)
        ) {

            card.classList.add(
                "called"
            );

        } else if (
            state.delivered.includes(number)
        ) {

            card.classList.add(
                "delivered"
            );

        }


        const numberElement =
            document.createElement("div");


        numberElement.className =
            "turn-number";


        numberElement.textContent =
            formatTurn(number);


        const statusElement =
            document.createElement("div");


        statusElement.className =
            "turn-status";


        if (
            state.current === number
        ) {

            statusElement.textContent =
                "En atención";

        } else if (
            state.called.includes(number)
        ) {

            statusElement.textContent =
                "Llamado";

        } else if (
            state.delivered.includes(number)
        ) {

            statusElement.textContent =
                "Entregado";

        } else {

            statusElement.textContent =
                "Disponible";

        }


        card.appendChild(
            numberElement
        );


        card.appendChild(
            statusElement
        );


        turnGrid.appendChild(
            card
        );

    }

}


/* =========================================
   LLAMAR TURNO
========================================= */

function callTurn(number) {

    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 25
    ) {

        return;

    }


    state.current =
        number;


    if (
        !state.called.includes(number)
    ) {

        state.called.push(number);

    }


    saveState();

    render();

    announceTurn(number);

}


/* =========================================
   LLAMAR SIGUIENTE
========================================= */

function callNext() {

    let next = null;


    for (
        let number = 1;
        number <= 25;
        number++
    ) {

        if (
            !state.called.includes(number)
        ) {

            next = number;

            break;

        }

    }


    if (next === null) {

        alert(
            "Todos los turnos ya fueron llamados."
        );

        return;

    }


    callTurn(next);

}


/* =========================================
   REPETIR TURNO
========================================= */

function repeatCurrent() {

    if (
        state.current === null
    ) {

        alert(
            "No hay un turno actual para repetir."
        );

        return;

    }


    announceTurn(
        state.current
    );

}


/* =========================================
   LLAMAR TURNO ESPECÍFICO
========================================= */

function callSpecific() {

    const number =
        Number(
            specificTurn.value
        );


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 25
    ) {

        alert(
            "Ingrese un número entre 1 y 25."
        );

        return;

    }


    callTurn(number);


    specificTurn.value = "";

}


/* =========================================
   VOZ
========================================= */

function announceTurn(number) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    window.speechSynthesis.cancel();


    const text =
        `Turno ${formatTurn(number)}. Diríjase al punto de atención.`;


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang =
        "es-CO";


    speech.rate =
        0.9;


    speech.pitch =
        1;


    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================
   NUEVA JORNADA
========================================= */

function newDay() {

    const confirmation =
        confirm(
            "¿Está seguro de iniciar una nueva jornada? Se reiniciarán todos los turnos."
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

}


/* =========================================
   TURNOS ENTREGADOS
========================================= */

function renderDelivered() {

    deliveredList.innerHTML = "";


    for (
        let number = 1;
        number <= 25;
        number++
    ) {


        const item =
            document.createElement("div");


        item.className =
            "delivered-item";


        const text =
            document.createElement("span");


        text.textContent =
            `Turno ${formatTurn(number)}`;


        const button =
            document.createElement("button");


        const isDelivered =
            state.delivered.includes(
                number
            );


        button.type =
            "button";


        button.textContent =
            isDelivered
                ? "Quitar"
                : "Entregar";


        button.addEventListener(
            "click",
            function () {

                toggleDelivered(number);

            }
        );


        item.appendChild(text);

        item.appendChild(button);

        deliveredList.appendChild(item);

    }

}


/* =========================================
   ENTREGAR / QUITAR TURNO
========================================= */

function toggleDelivered(number) {

    const index =
        state.delivered.indexOf(
            number
        );


    if (index === -1) {

        state.delivered.push(
            number
        );

    } else {

        state.delivered.splice(
            index,
            1
        );

    }


    saveState();

    render();

}


/* =========================================
   LOGIN
========================================= */

function login() {

    const username =
        loginUsername.value.trim();


    const password =
        loginPassword.value;


    const validUser =
        users.find(
            function (user) {

                return (
                    user.username === username &&
                    user.password === password
                );

            }
        );


    if (!validUser) {

        loginError.classList.add(
            "show"
        );

        return;

    }


    loginError.classList.remove(
        "show"
    );


    loginSection.style.display =
        "none";


    adminPanel.classList.add(
        "active"
    );


    loginUsername.value =
        "";

    loginPassword.value =
        "";

}


/* =========================================
   CERRAR SESIÓN
========================================= */

function logout() {

    adminPanel.classList.remove(
        "active"
    );


    loginSection.style.display =
        "block";


    loginUsername.value =
        "";

    loginPassword.value =
        "";


    loginError.classList.remove(
        "show"
    );

}


/* =========================================
   AGREGAR USUARIO
========================================= */

function addUser() {

    const username =
        newUsername.value.trim();


    const password =
        newPassword.value;


    if (
        username === "" ||
        password === ""
    ) {

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


    newUsername.value =
        "";

    newPassword.value =
        "";


    alert(
        "Usuario agregado correctamente."
    );

}


/* =========================================
   MOSTRAR USUARIOS
========================================= */

function renderUsers() {

    usersList.innerHTML = "";


    users.forEach(
        function (user, index) {


            const item =
                document.createElement("div");


            item.className =
                "user-item";


            const username =
                document.createElement("span");


            username.textContent =
                user.username;


            const deleteButton =
                document.createElement("button");


            deleteButton.type =
                "button";


            deleteButton.className =
                "user-delete";


            deleteButton.textContent =
                "Eliminar";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteUser(index);

                }
            );


            item.appendChild(
                username
            );


            item.appendChild(
                deleteButton
            );


            usersList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   ELIMINAR USUARIO
========================================= */

function deleteUser(index) {

    if (
        users.length <= 1
    ) {

        alert(
            "Debe existir al menos un usuario."
        );

        return;

    }


    const confirmation =
        confirm(
            "¿Desea eliminar este usuario?"
        );


    if (!confirmation) {

        return;

    }


    users.splice(
        index,
        1
    );


    saveUsers();

    renderUsers();

}


/* =========================================
   FECHA
========================================= */

function updateDate() {

    const now =
        new Date();


    currentDate.textContent =
        now.toLocaleDateString(
            "es-CO",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


/* =========================================
   AYUDA
========================================= */

function openHelp() {

    helpMenu.classList.add(
        "active"
    );

}


function closeHelp() {

    helpMenu.classList.remove(
        "active"
    );

}


/* =========================================
   EVENTOS AYUDA
========================================= */

openHelpButton.addEventListener(
    "click",
    openHelp
);


closeHelpButton.addEventListener(
    "click",
    closeHelp
);


understoodHelpButton.addEventListener(
    "click",
    closeHelp
);


/* Cerrar haciendo clic fuera */

helpMenu.addEventListener(
    "click",
    function (event) {

        if (
            event.target === helpMenu
        ) {

            closeHelp();

        }

    }
);


/* Cerrar con ESC */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeHelp();

        }

    }
);


/* =========================================
   EVENTOS ADMINISTRACIÓN
========================================= */

openAdminButton.addEventListener(
    "click",
    function () {

        adminModal.classList.add(
            "active"
        );


        loginSection.style.display =
            "block";


        adminPanel.classList.remove(
            "active"
        );

    }
);


closeAdminButton.addEventListener(
    "click",
    function () {

        adminModal.classList.remove(
            "active"
        );


        logout();

    }
);


/* Cerrar admin haciendo clic afuera */

adminModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === adminModal
        ) {

            adminModal.classList.remove(
                "active"
            );


            logout();

        }

    }
);


/* =========================================
   EVENTOS LOGIN
========================================= */

loginButton.addEventListener(
    "click",
    login
);
