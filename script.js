/* =========================================
   CONFIGURACIÓN
========================================= */

const STORAGE_KEY = "turnero_manual_v4";
const USERS_STORAGE_KEY = "turnero_users_v1";


/* =========================================
   ESTADO INICIAL
========================================= */

let state = JSON.parse(
    localStorage.getItem(STORAGE_KEY)
) || {
    current: null,
    called: [],
    delivered: []
};


let users = JSON.parse(
    localStorage.getItem(USERS_STORAGE_KEY)
) || [
    {
        username: "admin",
        password: "admin123"
    }
];


/* =========================================
   ELEMENTOS PRINCIPALES
========================================= */

const currentTurn = document.getElementById("currentTurn");
const currentMessage = document.getElementById("currentMessage");

const availableCount = document.getElementById("availableCount");
const lastCalled = document.getElementById("lastCalled");
const deliveredCount = document.getElementById("deliveredCount");

const turnGrid = document.getElementById("turnGrid");
const currentDate = document.getElementById("currentDate");


/* =========================================
   ADMIN
========================================= */

const adminModal = document.getElementById("adminModal");

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


/* =========================================
   USUARIOS
========================================= */

const newUsername =
    document.getElementById("newUsername");

const newPassword =
    document.getElementById("newPassword");

const addUserButton =
    document.getElementById("addUserButton");

const usersList =
    document.getElementById("usersList");


/* =========================================
   AYUDA
========================================= */

const helpMenu =
    document.getElementById("helpMenu");

const openHelpButton =
    document.getElementById("openHelpButton");

const closeHelpButton =
    document.getElementById("closeHelpButton");

const understoodHelpButton =
    document.getElementById("understoodHelpButton");


/* =========================================
   FUNCIONES GENERALES
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


function formatTurn(number) {

    return String(number).padStart(3, "0");

}


/* =========================================
   RENDERIZAR TURNOS
========================================= */

function renderTurnGrid() {

    turnGrid.innerHTML = "";

    for (let number = 1; number <= 25; number++) {

        const card = document.createElement("div");

        card.className = "turn-card";

        if (state.current === number) {

            card.classList.add("current");

        } else if (state.called.includes(number)) {

            card.classList.add("called");

        } else if (state.delivered.includes(number)) {

            card.classList.add("delivered");

        }


        const numberElement =
            document.createElement("div");

        numberElement.className = "turn-number";

        numberElement.textContent =
            formatTurn(number);


        const statusElement =
            document.createElement("div");

        statusElement.className = "turn-status";


        if (state.current === number) {

            statusElement.textContent =
                "En atención";

        } else if (state.called.includes(number)) {

            statusElement.textContent =
                "Llamado";

        } else if (state.delivered.includes(number)) {

            statusElement.textContent =
                "Entregado";

        } else {

            statusElement.textContent =
                "Disponible";

        }


        card.appendChild(numberElement);

        card.appendChild(statusElement);

        turnGrid.appendChild(card);

    }

}


/* =========================================
   RENDERIZAR TODO
========================================= */

function render() {

    if (state.current) {

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


    if (state.called.length > 0) {

        const last =
            state.called[state.called.length - 1];

        lastCalled.textContent =
            formatTurn(last);

    } else {

        lastCalled.textContent =
            "---";

    }


    availableCount.textContent =
        25 - state.called.length;


    deliveredCount.textContent =
        state.delivered.length;


    renderTurnGrid();

    renderDelivered();

    renderUsers();

}


/* =========================================
   LLAMAR TURNO
========================================= */

function callTurn(number) {

    if (number < 1 || number > 25) {
        return;
    }


    state.current = number;


    if (!state.called.includes(number)) {

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


    for (let number = 1; number <= 25; number++) {

        if (!state.called.includes(number)) {

            next = number;

            break;

        }

    }


    if (!next) {

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

    if (!state.current) {

        alert(
            "No hay un turno actual para repetir."
        );

        return;

    }


    announceTurn(state.current);

}


/* =========================================
   TURNO ESPECÍFICO
========================================= */

function callSpecific() {

    const number =
        Number(specificTurn.value);


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 25
    ) {

        alert(
            "Ingrese un número de turno entre 1 y 25."
        );

        return;

    }


    callTurn(number);

    specificTurn.value = "";

}


/* =========================================
   ANUNCIO POR VOZ
========================================= */

function announceTurn(number) {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();


        const text =
            `Turno ${number}. Diríjase al punto de atención.`;


        const speech =
            new SpeechSynthesisUtterance(text);


        speech.lang = "es-CO";

        speech.rate = 0.9;

        speech.pitch = 1;


        window.speechSynthesis.speak(
            speech
        );

    }

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


        const label =
            document.createElement("span");


        label.textContent =
            `Turno ${formatTurn(number)}`;


        const button =
            document.createElement("button");


        const delivered =
            state.delivered.includes(number);


        button.textContent =
            delivered
                ? "Quitar"
                : "Entregar";


        button.addEventListener(
            "click",
            function () {

                toggleDelivered(number);

            }
        );


        item.appendChild(label);

        item.appendChild(button);

        deliveredList.appendChild(item);

    }

}


/* =========================================
   CAMBIAR ESTADO DE ENTREGA
========================================= */

function toggleDelivered(number) {

    const index =
        state.delivered.indexOf(number);


    if (index === -1) {

        state.delivered.push(number);

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
            user =>
                user.username === username &&
                user.password === password
        );


    if (!validUser) {

        loginError.classList.add("show");

        return;

    }


    loginError.classList.remove("show");

    loginSection.style.display =
        "none";

    adminPanel.classList.add("active");

    loginUsername.value = "";

    loginPassword.value = "";

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

    loginUsername.value = "";

    loginPassword.value = "";

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


    if (!username || !password) {

        alert(
            "Ingrese usuario y contraseña."
        );

        return;

    }


    const exists =
        users.some(
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


/* =========================================
   MOSTRAR USUARIOS
========================================= */

function renderUsers() {

    usersList.innerHTML = "";


    users.forEach(
        (user, index) => {

            const item =
                document.createElement("div");


            item.className =
                "user-item";


            const name =
                document.createElement("span");


            name.textContent =
                user.username;


            const deleteButton =
                document.createElement("button");


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


            item.appendChild(name);

            item.appendChild(deleteButton);

            usersList.appendChild(item);

        }
    );

}


/* =========================================
   ELIMINAR USUARIO
========================================= */

function deleteUser(index) {

    if (users.length <= 1) {

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


    users.splice(index, 1);

    saveUsers();

    renderUsers();

}


/* =========================================
   FECHA ACTUAL
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
   MENÚ DE AYUDA
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


loginButton.addEventListener(
    "click",
    login
);


loginPassword.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            login();

        }

    }
);


nextTurnButton.addEventListener(
    "click",
    callNext
);


repeatTurnButton.addEventListener(
    "click",
    repeatCurrent
);


newDayButton.addEventListener(
    "click",
    newDay
);


specificTurnButton.addEventListener(
    "click",
    callSpecific
);


specificTurn.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            callSpecific();

        }

    }
);


logoutButton.addEventListener(
    "click",
    logout
);


addUserButton.addEventListener(
    "click",
    addUser
);


/* =========================================
   INICIO
========================================= */

updateDate();

render();


/*
    El menú de ayuda se abre automáticamente
    cada vez que se carga la página.
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTimeout(
            function () {

                openHelp();

            },
            300
        );

    }
);
