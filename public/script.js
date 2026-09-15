const lista = document.getElementById("lista");
const contador = document.getElementById("contador");
const addStatus = document.getElementById("addStatus");
const listStatus = document.getElementById("listStatus");

const formatearError = (res, texto) =>
    (res && res.error) ? res.error : texto;

async function cargarPeliculas() {
    listStatus.textContent = "";
    lista.innerHTML = "";

    try {
        const res = await fetch("/peliculas");
        const datos = await res.json();

        if (!res.ok) {
            listStatus.textContent = "Error: " + datos.error;
            return;
        }

        if (datos.length === 0) {
            lista.innerHTML = '<p class="vacio">No hay películas todavía. ¡Añade la primera!</p>';
            contador.textContent = "0 películas";
            return;
        }

        contador.textContent = datos.length + (datos.length === 1 ? " película" : " películas");

        datos.forEach(pelicula => {
            const card = document.createElement("div");
            card.className = "card";

            const titulo = document.createElement("div");
            titulo.className = "titulo";
            titulo.textContent = pelicula.titulo;

            const anio = document.createElement("div");
            anio.className = "anio";
            anio.textContent = pelicula.anio ? ("Año: " + pelicula.anio) : "Año: desconocido";

            const acciones = document.createElement("div");
            acciones.className = "acciones";

            const btnBorrar = document.createElement("button");
            btnBorrar.className = "btn-danger";
            btnBorrar.textContent = "Eliminar";
            btnBorrar.addEventListener("click", async () => {
                if (!confirm("¿Seguro que quieres eliminar la película \"" + pelicula.titulo + "\"?")) {
                    return;
                }
                try {
                    const res = await fetch("/peliculas/" + pelicula.id, { method: "DELETE" });
                    const datos = await res.json();
                    if (res.ok) {
                        cargarPeliculas();
                    } else {
                        listStatus.textContent = "Error: " + datos.error;
                    }
                } catch (e) {
                    listStatus.textContent = "Error de conexión: " + e.message;
                }
            });

            acciones.appendChild(btnBorrar);
            card.appendChild(titulo);
            card.appendChild(anio);
            card.appendChild(acciones);
            lista.appendChild(card);
        });
    } catch (e) {
        listStatus.textContent = "Error de conexión: " + e.message;
    }
}

async function agregarPelicula() {
    const tituloInput = document.getElementById("titulo");
    const anioInput = document.getElementById("anio");
    const titulo = tituloInput.value.trim();
    const anio = anioInput.value.trim();

    if (!titulo) {
        addStatus.className = "status error";
        addStatus.textContent = "El título es obligatorio.";
        return;
    }

    addStatus.textContent = "";

    try {
        const res = await fetch("/peliculas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ titulo, anio: anio ? Number(anio) : null })
        });
        const datos = await res.json();

        if (!res.ok) {
            addStatus.className = "status error";
            addStatus.textContent = "Error: " + formatearError(datos, "No se pudo guardar.");
            return;
        }

        addStatus.className = "status ok";
        addStatus.textContent = "Película \"" + datos.titulo + "\" guardada correctamente.";
        tituloInput.value = "";
        anioInput.value = "";
        cargarPeliculas();
    } catch (e) {
        addStatus.className = "status error";
        addStatus.textContent = "Error de conexión: " + e.message;
    }
}

document.getElementById("btnAdd").addEventListener("click", agregarPelicula);

cargarPeliculas();