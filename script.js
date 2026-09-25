/* =========================================================
   CONFIGURACIÓN
========================================================= */

const STORAGE_KEY = "turnero_manual_v4";

const USERS_STORAGE_KEY = "turnero_users_v1";


/* =========================================================
   ESTADO INICIAL
========================================================= */

const defaultState = {
    current: null,
    called: [],
    delivered: []
};


/* =========================================================
   CARGAR ESTADO
========================================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);


        if (!saved) {

            return {
                ...defaultState
            };

        }


        const parsed =
            JSON.parse(saved);


        return {

            current:
                parsed.current ?? null,

            called:
                Array.isArray(parsed.called)
                    ? parsed.called
                    : [],

            delivered:
                Array.isArray(parsed.delivered)
                    ? parsed.delivered
                    : []

        };


    } catch (error) {

        return {
            ...defaultState
        };

    }

}


let state = loadState();


/* =========================================================
   USUARIOS
========================================================= */

function loadUsers() {

    try {

        const saved =
            localStorage.getItem(
                USERS_STORAGE_KEY
            );


        if (!saved) {

            const defaultUsers = [
                {
                    username: "admin",
                    password: "admin123"
                }
            ];


            localStorage.setItem(
                USERS_STORAGE_KEY,
                JSON.stringify(defaultUsers)
            );


            return defaultUsers;

        }


        const users =
            JSON.parse(saved);


        if (
            !Array.isArray(users) ||
            users.length === 0
        ) {

            const defaultUsers = [
                {
                    username: "admin",
                    password: "admin123"
                }
            ];


            localStorage.setItem(
                USERS_STORAGE_KEY,
                JSON.stringify(defaultUsers)
            );


            return defaultUsers;

        }


        return users;


    } catch (error) {

        return [
            {
                username: "admin",
                password: "admin123"
            }
        ];

    }

}


let users = loadUsers();


/* =========================================================
   GUARDAR ESTADO
========================================================= */

function saveState() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );


    render();

}


/* =========================================================
   FORMATO DEL TURNO
========================================================= */

function formatTurn(number) {

    if (
        number === null ||
        number === undefined
    ) {

        return "---";

    }


    return String(number).padStart(3, "0");

}


/* =========================================================
   MOSTRAR LOS 25 TURNOS
========================================================= */

function renderTurnGrid() {

    const grid =
        document.getElementById("turnGrid");


    grid.innerHTML = "";


    for (let i = 1; i <= 25; i++) {


        const card =
            document.createElement("div");


        card.className = "turn-card";


        /* TURNO ACTUAL */

        if (
            state.current === i
        ) {

            card.classList.add("current");

        }


        /* TURNO LLAMADO */

        else if (
            state.called.includes(i)
        ) {

            card.classList.add("called");

        }


        /* TURNO ENTREGADO */

        else if (
            state.delivered.includes(i)
        ) {

            card.classList.add("delivered");

        }


        let status =
            "Disponible";


        if (
            state.current === i
        ) {

            status =
                "En atención";

        }


        else if (
            state.called.includes(i)
        ) {

            status =
                "Llamado";

        }


        else if (
            state.delivered.includes(i)
        ) {

            status =
                "Entregado";

        }


        card.innerHTML = `

            <div class="turn-number">

                ${formatTurn(i)}

            </div>


            <div class="turn-status">

                ${status}

            </div>

        `;


        grid.appendChild(card);

    }

}


/* =========================================================
   ACTUALIZAR PANTALLA
========================================================= */

function render() {


    const currentTurn =
        document.getElementById(
            "currentTurn"
        );


    const currentMessage =
        document.getElementById(
            "currentMessage"
        );


    const lastCalled =
        document.getElementById(
            "lastCalled"
        );


    const availableCount =
        document.getElementById(
            "availableCount"
        );


    const deliveredCount =
        document.getElementById(
            "deliveredCount"
        );


    const adminCurrentTurn =
        document.getElementById(
            "adminCurrentTurn"
        );


    /* TURNO ACTUAL */

    currentTurn.textContent =
        formatTurn(state.current);


    adminCurrentTurn.textContent =
        formatTurn(state.current);


    if (state.current) {

        currentMessage.textContent =
            "Por favor, acérquese al punto de atención.";

    }

    else {

        currentMessage.textContent =
            "Esperando el inicio de la jornada";

    }


    /* ÚLTIMO LLAMADO */

    if (state.called.length > 0) {

        const last =
            state.called[
                state.called.length - 1
            ];


        lastCalled.textContent =
            formatTurn(last);

    }

    else {

        lastCalled.textContent =
            "---";

    }


    /* DISPONIBLES */

    const available =
        25 -
        state.called.length;


    availableCount.textContent =
        Math.max(0, available);


    /* ENTREGADOS */

    deliveredCount.textContent =
        state.delivered.length;


    renderTurnGrid();

    renderDeliveredList();

}


/* =========================================================
   LLAMAR TURNO
========================================================= */

function callTurn(number) {


    if (
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


    announceTurn(number);

}


/* =========================================================
   LLAMAR SIGUIENTE
========================================================= */

function callNext() {


    let next = null;


    for (
        let i = 1;
        i <= 25;
        i++
    ) {


        if (
            !state.called.includes(i)
        ) {

            next = i;

            break;

        }

    }


    if (!next) {

        alert(
            "Ya se han llamado todos los turnos."
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
            "No hay un turno actual para repetir."
        );

        return;

    }


    announceTurn(
        state.current
    );

}


/* =========================================================
   TURNO ESPECÍFICO
========================================================= */

function callSpecific() {


    const input =
        document.getElementById(
            "specificTurn"
        );


    const number =
        Number(input.value);


    if (
        !Number.isInteger(number) ||
        number < 1 ||
        number > 25
    ) {

        alert(
            "Ingrese un turno válido entre 1 y 25."
        );

        return;

    }


    callTurn(number);


    input.value = "";

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


    window.speechSynthesis.cancel();


    const text =
        `Turno ${formatTurn(number)}. ` +
        `Por favor, acérquese al punto de atención.`;


    const speech =
        new SpeechSynthesisUtterance(text);


    speech.lang = "es-CO";

    speech.rate = 0.9;

    speech.pitch = 1;


    window.speechSynthesis.speak(
        speech
    );

}


/* =========================================================
   NUEVA JORNADA
========================================================= */

function newDay() {


    const confirmation =
        confirm(
            "¿Está seguro de iniciar una nueva jornada? Se reiniciarán los turnos."
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

}


/* =========================================================
   LISTA DE TURNOS ENTREGADOS
========================================================= */

function renderDeliveredList() {


    const list =
        document.getElementById(
            "deliveredList"
        );


    list.innerHTML = "";


    if (
        state.delivered.length === 0
    ) {

        list.innerHTML = `

            <div
                style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 15px;
                    color: #806c55;
                ">

                No hay turnos marcados como entregados.

            </div>

        `;


        return;

    }


    const sorted =
        [...state.delivered].sort(
            (a, b) => a - b
        );


    sorted.forEach(number => {


        const item =
            document.createElement("div");


        item.className =
            "delivered-item";


        const isCalled =
            state.called.includes(number);


        item.innerHTML = `

            <strong>

                Turno ${formatTurn(number)}

            </strong>


            <button
                onclick="toggleDelivered(${number})">

                ${
                    isCalled
                        ? "Entregado"
                        : "Marcar"
                }

            </button>

        `;


        list.appendChild(item);

    });

}


/* =========================================================
   MARCAR ENTREGADO
========================================================= */

function toggleDelivered(number) {


    const index =
        state.delivered.indexOf(number);


    if (index === -1) {

        state.delivered.push(number);

    }

    else {

        state.delivered.splice(
            index,
            1
        );

    }


    saveState();

}


/* =========================================================
   LOGIN
========================================================= */

function login() {


    const username =
        document.getElementById(
            "loginUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    const user =
        users.find(
            item =>
                item.username === username &&
                item.password === password
        );


    const error =
        document.getElementById(
            "loginError"
        );


    if (!user) {

        error.style.display =
            "block";

        return;

    }


    error.style.display =
        "none";


    document.getElementById(
        "loginSection"
    ).style.display =
        "none";


    document.getElementById(
        "adminPanel"
    ).classList.add("active");


    renderUsers();

    render();

}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function logout() {


    document.getElementById(
        "adminPanel"
    ).classList.remove("active");


    document.getElementById(
        "loginSection"
    ).style.display =
        "block";


    document.getElementById(
        "loginUsername"
    ).value = "";


    document.getElementById(
        "loginPassword"
    ).value = "";


    document.getElementById(
        "loginError"
    ).style.display =
        "none";

}


/* =========================================================
   AGREGAR USUARIO
========================================================= */

function addUser() {


    const username =
        document.getElementById(
            "newUsername"
        ).value.trim();


    const password =
        document.getElementById(
            "newPassword"
        ).value;


    if (
        !username ||
        !password
    ) {

        alert(
            "Ingrese usuario y contraseña."
        );

        return;

    }


    if (
        username.length < 3
    ) {

        alert(
            "El usuario debe tener al menos 3 caracteres."
        );

        return;

    }


    if (
        password.length < 4
    ) {

        alert(
            "La contraseña debe tener al menos 4 caracteres."
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


    document.getElementById(
        "newUsername"
    ).value = "";


    document.getElementById(
        "newPassword"
    ).value = "";


    renderUsers();


    alert(
        "Usuario agregado correctamente."
    );

}


/* =========================================================
   GUARDAR USUARIOS
========================================================= */

function saveUsers() {

    localStorage.setItem(

        USERS_STORAGE_KEY,

        JSON.stringify(users)

    );

}


/* =========================================================
   MOSTRAR USUARIOS
========================================================= */

function renderUsers() {


    const list =
        document.getElementById(
            "usersList"
        );


    list.innerHTML = "";


    users.forEach(
        (user, index) => {


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "user-item";


            item.innerHTML = `

                <div>

                    <span class="user-name">

                        ${escapeHtml(
                            user.username
                        )}

                    </span>


                    <span class="user-role">

                        Administrador

                    </span>

                </div>


                <button
                    class="delete-user"
                    onclick="deleteUser(${index})">

                    Eliminar

                </button>

            `;


            list.appendChild(item);

        }
    );

}


/* =========================================================
   ELIMINAR USUARIO
========================================================= */

function deleteUser(index) {


    if (
        users.length <= 1
    ) {

        alert(
            "Debe existir al menos un usuario administrador."
        );

        return;

    }


    const user =
        users[index];


    const confirmation =
        confirm(
            `¿Desea eliminar al usuario "${user.username}"?`
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


/* =========================================================
   SEGURIDAD HTML
========================================================= */

function escapeHtml(text) {


    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   FECHA
========================================================= */

function updateDate() {


    const date =
        new Date();


    const options = {

        day: "2-digit",

        month: "2-digit",

        year: "numeric"

    };


    document.getElementById(
        "currentDate"
    ).textContent =

        date.toLocaleDateString(
            "es-CO",
            options
        );

}


/* =========================================================
   EVENTOS
========================================================= */


/* Abrir administración */

document
    .getElementById("openAdminButton")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("adminModal")
                .classList.add("active");


            document
                .getElementById("loginSection")
                .style.display = "block";


            document
                .getElementById("adminPanel")
                .classList.remove("active");


            document
                .getElementById("loginUsername")
                .focus();

        }
    );


/* Cerrar administración */

document
    .getElementById("closeAdminButton")
    .addEventListener(
        "click",
        function () {

            document
                .getElementById("adminModal")
                .classList.remove("active");

        }
    );


/* Login */

document
    .getElementById("loginButton")
    .addEventListener(
        "click",
        login
    );


/* Llamar siguiente */

document
    .getElementById("nextTurnButton")
    .addEventListener(
        "click",
        callNext
    );


/* Repetir */

document
    .getElementById("repeatTurnButton")
    .addEventListener(
        "click",
        repeatCurrent
    );


/* Nueva jornada */

document
    .getElementById("newDayButton")
    .addEventListener(
        "click",
        newDay
    );


/* Turno específico */

document
    .getElementById("specificTurnButton")
    .addEventListener(
        "click",
        callSpecific
    );


/* Agregar usuario */

document
    .getElementById("addUserButton")
    .addEventListener(
        "click",
        addUser
    );


/* Cerrar sesión */

document
    .getElementById("logoutButton")
    .addEventListener(
        "click",
        logout
    );


/* ENTER en login */

document
    .getElementById("loginPassword")
    .addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter"
            ) {

                login();

            }

        }
    );


/* Cerrar modal haciendo clic afuera */

document
    .getElementById("adminModal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {

                this.classList.remove(
                    "active"
                );

            }

        }
    );


/* =========================================================
   INICIAR
========================================================= */

updateDate();

render();
