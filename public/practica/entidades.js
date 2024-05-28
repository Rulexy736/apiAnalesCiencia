function getAuthHeader() {
    return sessionStorage.getItem('authHeader');
}

function obtenerDatosEntidades() {
    return $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/entities?order=id&ordering=ASC',
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    });
}

function guardarDatosEntidad(entidad) {
    return $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/entities',
        headers: {
            "Authorization": getAuthHeader(),
            'Content-Type': 'application/json',
            "accept": "application/json"
        },
        data: JSON.stringify(entidad)
    });
}

function mostrarEntidades() {
    obtenerDatosEntidades().then(response => {
        const entidades = response.entities.map(e => e.entity);
        const listaEntidades = $("#listaEntidades");
        listaEntidades.empty();
        entidades.forEach(entidad => {
            listaEntidades.append(`
                <li>
                    ${entidad.id}. ${entidad.name}
                    <button class="botonNormal" onclick="mostrarJSONEntidad(${entidad.id})">Ver entidad</button>
                    <button class="botonNormal" onclick="editarEntidad(${entidad.id})">Editar</button>
                    <button class="botonNormal" onclick="eliminarEntidad(${entidad.id})">Eliminar</button>
                </li>
            `);
        });
    });
}

function crearEntidad(nombre, fechaCreacion, fechaDefuncion, imagen, wiki, personasSeleccionadas) {
    const entidad = {
        name: nombre,
        creationDate: fechaCreacion,
        endDate: fechaDefuncion,
        imageUrl: imagen,
        wikiUrl: wiki,
        persons: personasSeleccionadas
    };

    guardarDatosEntidad(entidad).then(() => {
        mostrarEntidades();
        ocultarFormularioEntidad();
    });
}

function limpiarFormularioEntidad() {
    $("#idE").val('');
    $("#nombreE").val('');
    $("#fechaCreacionE").val('');
    $("#fechaDefuncionE").val('');
    $("#imagenE").val('');
    $("#wikiE").val('');
}

function editarEntidad(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/entities/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const entidad = response.entity;
        $("#idE").val(entidad.id);
        $("#nombreE").val(entidad.name);
        $("#fechaCreacionE").val(entidad.creationDate);
        $("#fechaDefuncionE").val(entidad.endDate);
        $("#imagenE").val(entidad.imageUrl);
        $("#wikiE").val(entidad.wikiUrl);
        $("#guardarEntidad").hide();
        $("#modificarEntidad").show();
        mostrarFormularioEntidad();
        localStorage.setItem('entidadId', entidad.id);
    });
}

function modificarEntidad() {
    const id = localStorage.getItem('entidadId');
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/entities/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" },
        complete: function(response) {
            const etag = response.getResponseHeader('ETag');
            const entidad = {
                name: $("#nombreE").val(),
                creationDate: $("#fechaCreacionE").val(),
                endDate: $("#fechaDefuncionE").val(),
                imageUrl: $("#imagenE").val(),
                wikiUrl: $("#wikiE").val()
            };
            $.ajax({
                type: 'PUT',
                url: `http://127.0.0.1:8000/api/v1/entities/${id}`,
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                    "accept": "application/json",
                    "If-Match": etag
                },
                data: JSON.stringify(entidad)
            }).then(() => {
                mostrarEntidades();
                ocultarFormularioEntidad();
            }).catch(error => {
                console.error('Error updating entity:', error);
            });
        }
    });
}

function eliminarEntidad(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/entities/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(() => {
        mostrarEntidades();
    });
}

function mostrarFormularioEntidad() {
    const formularioEntidad = document.getElementById("formulario-contenedorEntidad");
    formularioEntidad.style.display = "block";
}

function ocultarFormularioEntidad() {
    document.getElementById("formulario-contenedorEntidad").style.display = "none";
}

function mostrarModificarEntidad() {
    document.getElementById("modificarEntidad").style.display = "block";
}

function ocultarModificarEntidad() {
    document.getElementById("modificarEntidad").style.display = "none";
}

function mostrarJSONEntidad(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/entities/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const entidad = response.entity;
        if (entidad) {
            let entidadHTML = `<h2>Entidad: ${entidad.name}</h2>`;
            entidadHTML += `<p><strong>ID:</strong> ${entidad.id}</p>`;
            entidadHTML += `<p><strong>Nombre:</strong> ${entidad.name}</p>`;
            if (entidad.creationDate) {
                entidadHTML += `<p><strong>Fecha de Creación:</strong> ${entidad.creationDate}</p>`;
            }
            if (entidad.endDate) {
                entidadHTML += `<p><strong>Fecha de Defunción:</strong> ${entidad.endDate ? entidad.endDate : "N/A"}</p>`;
            }
            if (entidad.imageUrl) {
                entidadHTML += `<p><strong>Imagen:</strong> <img src="${entidad.imageUrl}" alt="${entidad.name}" width="200"></p>`;
            }
            if (entidad.wikiUrl) {
                entidadHTML += `<p><strong>URL:</strong> <a href="${entidad.wikiUrl}" target="_blank">${entidad.wikiUrl}</a></p>`;
            }

            if (entidad.persons && entidad.persons.length > 0) {
                entidadHTML += `<h3>Personas:</h3><ul>`;
                entidad.persons.forEach(personaID => {
                    entidadHTML += `<li>ID Persona: ${personaID}</li>`;
                });
                entidadHTML += `</ul>`;
            }

            if (entidad.products && entidad.products.length > 0) {
                entidadHTML += `<h3>Productos:</h3><ul>`;
                entidad.products.forEach(productoID => {
                    entidadHTML += `<li>ID Producto: ${productoID}</li>`;
                });
                entidadHTML += `</ul>`;
            }

            $("#contenidoJSONEntidad").html(entidadHTML);
            $("#modalJSONEntidad").show();
        } else {
            $("#contenidoJSONEntidad").html(`<p>Entidad no encontrada con ID: ${id}</p>`);
            $("#modalJSONEntidad").show();
        }
    });
}

function cerrarmodalJSONEntidad() {
    $("#modalJSONEntidad").hide();
}

function manejarRelacionesEntidad() {
    const entidadId = $("#entidadId").val();
    const relationType = $("#relationTypeEntidad").val();
    const operation = $("#operationEntidad").val();
    const relatedId = $("#relatedIdEntidad").val();

    $.ajax({
        type: 'PUT',
        url: `http://127.0.0.1:8000/api/v1/entities/${entidadId}/${relationType}/${operation}/${relatedId}`,
        headers: { 
            "Authorization": getAuthHeader(), 
            "accept": "application/json"
        }
    }).then(response => {
        console.log('Relación actualizada', response);
    }).catch(error => {
        console.error('Error al actualizar la relación', error);
        alert('Error al actualizar la relación');
    });
}

mostrarEntidades();

// Agregar eventos a los botones
document.getElementById("crearEntidad").addEventListener("click", () => {
    limpiarFormularioEntidad();
    mostrarFormularioEntidad();
    ocultarModificarEntidad();
});
document.getElementById("guardarEntidad").addEventListener("click", () => {
    const nombre = document.getElementById("nombreE").value;
    const fechaCreacion = document.getElementById("fechaCreacionE").value;
    const fechaDefuncion = document.getElementById("fechaDefuncionE").value;
    const imagen = document.getElementById("imagenE").value;
    const wiki = document.getElementById("wikiE").value;
    const personasSeleccionadas = Array.from(document.getElementById("personas").selectedOptions).map(option => option.value);
    crearEntidad(nombre, fechaCreacion, fechaDefuncion, imagen, wiki, personasSeleccionadas);
    ocultarFormularioEntidad();
});
document.getElementById("modificarEntidad").addEventListener("click", () => {
    modificarEntidad();
    ocultarFormularioEntidad();
});
document.getElementById("cerrarJsonEntidad").addEventListener("click", cerrarmodalJSONEntidad);
document.getElementById("cerrar-formularioEntidad").addEventListener("click", ocultarFormularioEntidad);
document.getElementById("crearRelacionesEntidad").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelacionesEntidad").style.display = "block";
});
document.getElementById("cerrar-formularioRelacionesEntidad").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelacionesEntidad").style.display = "none";
});
document.getElementById("actualizarRelacionEntidad").addEventListener("click", manejarRelacionesEntidad);
