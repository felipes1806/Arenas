/* =========================================================
   SISTEMA DE TURNOS - ARENERA
========================================================= */

"use strict";


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const TOTAL_TURNOS = 25;

const STATE_KEY = "arenera_turnos_estado_v10";
const USERS_KEY = "arenera_usuarios_v10";


/* =========================================================
   ESTADO INICIAL
========================================================= */

const estadoInicial = {
    current: null,
    called: [],
    delivered: []
};


const usuariosIniciales = [
    {
        username: "admin",
        password: "admin123"
    }
];


/* =========================================================
   ESTADO
========================================================= */

let state = cargarEstado();

let users = cargarUsuarios();


/* =========================================================
   ELEMENTOS HTML
========================================================= */

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


/* AYUDA */

const helpButton =
    document.getElementById("helpButton");

const helpModal =
    document.getElementById("helpModal");

const closeHelp =
    document.getElementById("closeHelp");

const understoodHelp =
    document.getElementById("understoodHelp");


/* ADMIN */

const adminButton =
    document.getElementById("adminButton");

const adminModal =
    document.getElementById("adminModal");

const closeAdmin =
    document.getElementById("closeAdmin");


/* LOGIN */

const loginSection =
    document.getElementById("loginSection");

const adminPanel =
    document.getElementById("adminPanel");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");


/* ADMINISTRACIÓN */

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


/* USUARIOS */

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
   CARGAR ESTADO
========================================================= */

function cargarEstado() {

    try {

        const guardado =
            localStorage.getItem(STATE_KEY);

        if (!guardado) {

            return {
                current: null,
                called: [],
                delivered: []
            };
        }

        const datos =
            JSON.parse(guardado);

        return {

            current:
                datos.current || null,

            called:
                Array.isArray(datos.called)
                    ? datos.called
                    : [],

            delivered:
                Array.isArray(datos.delivered)
                    ? datos.delivered
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


/* =========================================================
   GUARDAR ESTADO
========================================================= */

function guardarEstado() {

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

function cargarUsuarios() {

    try {

        const guardados =
            localStorage.getItem(USERS_KEY);

        if (!guardados) {

            return [
                ...usuariosIniciales
            ];
        }

        const datos =
            JSON.parse(guardados);

        if (
            !Array.isArray(datos) ||
            datos.length === 0
        ) {

            return [
                ...usuariosIniciales
            ];
        }

        return datos;

    } catch (error) {

        console.error(
            "Error cargando usuarios:",
            error
        );

        return [
            ...usuariosIniciales
        ];
    }
}


/* =========================================================
   GUARDAR USUARIOS
========================================================= */

function guardarUsuarios() {

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
   FORMATO DEL TURNO
========================================================= */

function formatoTurno(numero) {

    if (!numero) {
        return "---";
    }

    return String(numero).padStart(3, "0");
}


/* =========================================================
   FECHA
========================================================= */

function actualizarFecha() {

    const ahora =
        new Date();

    currentDate.textContent =
        ahora.toLocaleDateString(
            "es-CO",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
}


/* =========================================================
   RENDERIZAR TODO
========================================================= */

function render() {

    renderTurnoActual();

    renderInformacion();

    renderTurnos();

    renderEntregados();

    renderUsuarios();
}


/* =========================================================
   TURNO ACTUAL
========================================================= */

function renderTurnoActual() {

    const numero =
        state.current;


    currentTurn.textContent =
        formatoTurno(numero);


    adminCurrentTurn.textContent =
        formatoTurno(numero);


    if (!numero) {

        currentMessage.textContent =
            "Esperando el inicio de la jornada";

        return;
    }


    currentMessage.textContent =
        "Por favor, acérquese al punto de atención";
}


/* =========================================================
   INFORMACIÓN
========================================================= */

function renderInformacion() {

    const llamados =
        state.called.length;


    const disponibles =
        Math.max(
            0,
            TOTAL_TURNOS - llamados
        );


    availableCount.textContent =
        disponibles;


    deliveredCount.textContent =
        state.delivered.length;


    if (state.called.length === 0) {

        lastCalled.textContent =
            "---";

    } else {

        const ultimo =
            state.called[
                state.called.length - 1
            ];

        lastCalled.textContent =
            formatoTurno(ultimo);
    }
}


/* =========================================================
   CREAR LOS 25 TURNOS
========================================================= */

function renderTurnos() {

    turnGrid.innerHTML = "";


    for (
        let numero = 1;
        numero <= TOTAL_TURNOS;
        numero++
    ) {

        const card =
            document.createElement("div");

        card.className =
            "turn-card";


        const numeroElemento =
            document.createElement("div");

        numeroElemento.className =
            "turn-number";

        numeroElemento.textContent =
            formatoTurno(numero);


        const estadoElemento =
            document.createElement("div");

        estadoElemento.className =
            "turn-status";


        /* TURNO ACTUAL */

        if (
            state.current === numero
        ) {

            card.classList.add(
                "current"
            );

            estadoElemento.textContent =
                "En atención";
        }


        /* ENTREGADO */

        else if (
            state.delivered.includes(
                numero
            )
        ) {

            card.classList.add(
                "delivered"
            );

            estadoElemento.textContent =
                "Entregado";
        }


        /* LLAMADO */

        else if (
            state.called.includes(
                numero
            )
        ) {

            card.classList.add(
                "called"
            );

            estadoElemento.textContent =
                "Llamado";
        }


        /* DISPONIBLE */

        else {

            estadoElemento.textContent =
                "Disponible";
        }


        card.appendChild(
            numeroElemento
        );

        card.appendChild(
            estadoElemento
        );

        turnGrid.appendChild(
            card
        );
    }
}


/* =========================================================
   LLAMAR TURNO
========================================================= */

function llamarTurno(numero) {

    numero =
        Number(numero);


    if (
        numero < 1 ||
        numero > TOTAL_TURNOS
    ) {

        alert(
            "El turno debe estar entre 1 y 25."
        );

        return;
    }


    /* Agregar a llamados */

    if (
        !state.called.includes(
            numero
        )
    ) {

        state.called.push(
            numero
        );
    }


    /* Establecer turno actual */

    state.current =
        numero;


    guardarEstado();

    render();

    anunciarTurno(numero);
}


/* =========================================================
   LLAMAR SIGUIENTE
========================================================= */

function llamarSiguiente() {

    let siguiente =
        null;


    for (
        let numero = 1;
        numero <= TOTAL_TURNOS;
        numero++
    ) {

        if (
            !state.called.includes(
                numero
            )
        ) {

            siguiente =
                numero;

            break;
        }
    }


    if (!siguiente) {

        alert(
            "Todos los turnos ya fueron llamados."
        );

        return;
    }


    llamarTurno(
        siguiente
    );
}


/* =========================================================
   REPETIR
========================================================= */

function repetirTurno() {

    if (!state.current) {

        alert(
            "No hay un turno actualmente llamado."
        );

        return;
    }


    anunciarTurno(
        state.current
    );
}


/* =========================================================
   LLAMAR ESPECÍFICO
========================================================= */

function llamarEspecifico() {

    const numero =
        Number(
            specificTurn.value
        );


    if (
        !Number.isInteger(numero) ||
        numero < 1 ||
        numero > TOTAL_TURNOS
    ) {

        alert(
            "Ingrese un turno válido entre 1 y 25."
        );

        return;
    }


    llamarTurno(
        numero
    );


    specificTurn.value =
        "";
}


/* =========================================================
   VOZ
========================================================= */

function anunciarTurno(numero) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;
    }


    window.speechSynthesis.cancel();


    const mensaje =
        new SpeechSynthesisUtterance(
            "Turno " +
            formatoTurno(numero) +
            ". Por favor, acérquese al punto de atención."
        );


    mensaje.lang =
        "es-CO";

    mensaje.rate =
        0.9;

    mensaje.pitch =
        1;

    mensaje.volume =
        1;


    window.speechSynthesis.speak(
        mensaje
    );
}


/* =========================================================
   NUEVA JORNADA
========================================================= */

function nuevaJornada() {

    const confirmar =
        confirm(
            "¿Está seguro de iniciar una nueva jornada?\n\nTodos los turnos volverán a estar disponibles."
        );


    if (!confirmar) {
        return;
    }


    state = {

        current: null,

        called: [],

        delivered: []
    };


    guardarEstado();

    render();


    alert(
        "Nueva jornada iniciada correctamente."
    );
}


/* =========================================================
   TURNOS ENTREGADOS
========================================================= */

function renderEntregados() {

    deliveredList.innerHTML = "";


    for (
        let numero = 1;
        numero <= TOTAL_TURNOS;
        numero++
    ) {

        const fila =
            document.createElement("div");

        fila.className =
            "delivered-item";


        const texto =
            document.createElement("span");

        texto.textContent =
            "Turno " +
            formatoTurno(numero);


        const boton =
            document.createElement("button");


        const entregado =
            state.delivered.includes(
                numero
            );


        if (entregado) {

            boton.textContent =
                "Quitar";

        } else {

            boton.textContent =
                "Entregar";
        }


        boton.addEventListener(
            "click",
            function () {

                cambiarEstadoEntregado(
                    numero
                );
            }
        );


        fila.appendChild(
            texto
        );

        fila.appendChild(
            boton
        );


        deliveredList.appendChild(
            fila
        );
    }
}


/* =========================================================
   CAMBIAR ENTREGADO
========================================================= */

function cambiarEstadoEntregado(numero) {

    const indice =
        state.delivered.indexOf(
            numero
        );


    if (indice !== -1) {

        state.delivered.splice(
            indice,
            1
        );

    } else {

        state.delivered.push(
            numero
        );


        if (
            !state.called.includes(
                numero
            )
        ) {

            state.called.push(
                numero
            );
        }
    }


    guardarEstado();

    render();
}


/* =========================================================
   LOGIN
========================================================= */

function iniciarSesion() {

    const usuario =
        username.value.trim();

    const clave =
        password.value;


    const encontrado =
        users.find(
            function (user) {

                return (
                    user.username === usuario &&
                    user.password === clave
                );
            }
        );


    if (!encontrado) {

        loginError.style.display =
            "block";

        return;
    }


    loginError.style.display =
        "none";


    loginSection.classList.add(
        "hidden"
    );


    adminPanel.classList.remove(
        "hidden"
    );


    render();
}


/* =========================================================
   CERRAR SESIÓN
========================================================= */

function cerrarSesion() {

    adminPanel.classList.add(
        "hidden"
    );


    loginSection.classList.remove(
        "hidden"
    );


    username.value =
        "";

    password.value =
        "";

    loginError.style.display =
        "none";
}


/* =========================================================
   MOSTRAR ADMINISTRACIÓN
========================================================= */

function abrirAdministracion() {

    adminModal.classList.add(
        "active"
    );


    adminPanel.classList.add(
        "hidden"
    );


    loginSection.classList.remove(
        "hidden"
    );


    username.value =
        "";

    password.value =
        "";

    loginError.style.display =
        "none";


    setTimeout(
        function () {

            username.focus();

        },
        100
    );
}


/* =========================================================
   CERRAR ADMINISTRACIÓN
========================================================= */

function cerrarAdministracion() {

    adminModal.classList.remove(
        "active"
    );
}


/* =========================================================
   AYUDA
========================================================= */

function abrirAyuda() {

    helpModal.classList.add(
        "active"
    );
}


function cerrarAyuda() {

    helpModal.classList.remove(
        "active"
    );
}


/* =========================================================
   USUARIOS
========================================================= */

function renderUsuarios() {

    usersList.innerHTML = "";


    users.forEach(
        function (user, index) {

            const fila =
                document.createElement("div");

            fila.className =
                "user-item";


            const nombre =
                document.createElement("span");

            nombre.textContent =
                user.username;


            const boton =
                document.createElement("button");

            boton.textContent =
                "Eliminar";


            boton.addEventListener(
                "click",
                function () {

                    eliminarUsuario(
                        index
                    );
                }
            );


            fila.appendChild(
                nombre
            );

            fila.appendChild(
                boton
            );


            usersList.appendChild(
                fila
            );
        }
    );
}


/* =========================================================
   AGREGAR USUARIO
========================================================= */

function agregarUsuario() {

    const nombre =
        newUsername.value.trim();

    const clave =
        newPassword.value;


    if (
        !nombre ||
        !clave
    ) {

        alert(
            "Ingrese usuario y contraseña."
        );

        return;
    }


    const existe =
        users.some(
            function (user) {

                return (
                    user.username.toLowerCase() ===
                    nombre.toLowerCase()
                );
            }
        );


    if (existe) {

        alert(
            "Ese usuario ya existe."
        );

        return;
    }


    users.push({

        username:
            nombre,

        password:
            clave
    });


    guardarUsuarios();

    renderUsuarios();


    newUsername.value =
        "";

    newPassword.value 
