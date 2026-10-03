let tareas = [];

// FUNCIÓN PARA ESPERAR UN TIEMPO

function esperar(tiempo) {
    return new Promise(resolve => {
        setTimeout(resolve, tiempo);
    });
}

// CARGAR LAS TAREAS DESDE localStorage

async function cargarTareas() {

    try {

        // Mostrar mensaje de carga
        document.getElementById("loading").style.display = "block";

        // Simulamos una carga de 1 segundo
        await esperar(1000);

        // Obtener las tareas guardadas
        const datos = localStorage.getItem("tareas");

        // Si existen tareas guardadas
        if (datos) {
            tareas = JSON.parse(datos);
        } else {
            tareas = [];
        }

        // Mostrar las tareas
        mostrarTareas();

        // Ocultar mensaje de carga
        document.getElementById("loading").style.display = "none";

    } catch (error) {

        console.log("Ocurrió un error:", error);
        document.getElementById("loading").textContent =
            "Ocurrió un error al cargar las tareas.";
    }
}

// GUARDAR LAS TAREAS EN localStorage

function guardarTareas() {

    try {

        localStorage.setItem(
            "tareas",
            JSON.stringify(tareas)
        );

    } catch (error) {

        console.log("Error al guardar las tareas:", error);
        document.getElementById("mensaje").textContent =
            "No se pudieron guardar las tareas.";
    }
}

// MOSTRAR LAS TAREAS

function mostrarTareas(lista = tareas) {

    const listaTareas = document.getElementById("listaTareas");

    // Limpiar la lista
    listaTareas.innerHTML = "";

    // Recorrer las tareas
    lista.forEach((tarea, indice) => {

        const li = document.createElement("li");

        li.classList.add("list-group-item", "d-flex", "align-items-center", "gap-2");

        li.textContent = tarea;

        // Crear botón eliminar
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("btn", "btn-primary", "text-white", "rounded", "ms-2")
        botonEliminar.addEventListener("click", function () {
            eliminarTarea(indice);

        });

        li.appendChild(document.createTextNode(" "));
        li.appendChild(botonEliminar);
        listaTareas.appendChild(li);
    });
}

// AGREGAR UNA TAREA

function agregarTarea() {

    const input = document.getElementById("tareaInput");
    const tarea = input.value.trim();

    // Verificar que no esté vacío
    if (tarea === "") {

        document.getElementById("mensaje").textContent =
            "Escribe una tarea.";
        return;
    }

    // Agregar tarea al array
    tareas.push(tarea);

    // Guardar en localStorage
    guardarTareas();

    // Mostrar tareas
    mostrarTareas();

    // Limpiar input
    input.value = "";

    document.getElementById("mensaje").textContent =
        "Tarea agregada correctamente.";
}

// ELIMINAR UNA TAREA

function eliminarTarea(indice) {

    // Eliminar la tarea del array
    tareas.splice(indice, 1);

    // Guardar nuevamente
    guardarTareas();

    // Mostrar lista actualizada
    mostrarTareas();
}

function buscarTareas() {

    const texto = document
        .getElementById("buscarInput")
        .value
        .toLowerCase()
        .trim();

    // Filtrar las tareas
    const resultados = tareas.filter(function (tarea) {

        return tarea.toLowerCase().includes(texto);

    });

    // Mostrar resultados
    mostrarTareas(resultados);
}

function debounce(funcion, tiempo) {

    let temporizador;

    return function () {
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
            funcion();
        }, tiempo);
    };
}

// Crear búsqueda con debounce de 400 milisegundos
const buscarConDebounce = debounce(buscarTareas, 400);

// Botón agregar
document
    .getElementById("agregarBtn")
    .addEventListener("click", agregarTarea);

// Buscar mientras escribimos
document
    .getElementById("buscarInput")
    .addEventListener("input", buscarConDebounce);

cargarTareas();