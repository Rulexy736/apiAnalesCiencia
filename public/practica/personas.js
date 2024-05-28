function getAuthHeader() {
    return sessionStorage.getItem('authHeader');
}

function obtenerDatosPersonas() {
    return $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/persons?order=id&ordering=ASC',
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    });
}

function guardarDatosPersona(persona) {
    return $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/persons',
        headers: {
            "Authorization": getAuthHeader(),
            'Content-Type': 'application/json',
            "accept": "application/json"
        },
        data: JSON.stringify(persona)
    });
}

function mostrarPersonas() {
    obtenerDatosPersonas().then(response => {
        const personas = response.persons.map(p => p.person);
        const listaPersonas = $("#listaPersonas");
        listaPersonas.empty();
        personas.forEach(persona => {
            listaPersonas.append(`
                <li>
                    ${persona.id}. ${persona.name}
                    <button class="botonNormal" onclick="mostrarJSONPersona(${persona.id})">Ver persona</button>
                    <button class="botonNormal" onclick="editarPersona(${persona.id})">Editar</button>
                    <button class="botonNormal" onclick="eliminarPersona(${persona.id})">Eliminar</button>
                </li>
            `);
        });
    });
}

function crearPersona(nombre, fechaNacimiento, fechaMuerte, imagen, wiki) {
    const persona = {
        name: nombre,
        birthDate: fechaNacimiento,
        deathDate: fechaMuerte,
        imageUrl: imagen,
        wikiUrl: wiki
    };

    guardarDatosPersona(persona).then(() => {
        mostrarPersonas();
        ocultarFormularioPersona();
    });
}

function limpiarFormularioPersona() {
    $("#idP").val('');
    $("#nombreP").val('');
    $("#fechaNacimientoP").val('');
    $("#fechaMuerteP").val('');
    $("#imagenP").val('');
    $("#wikiP").val('');
}

function editarPersona(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/persons/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const persona = response.person;
        $("#idP").val(persona.id);
        $("#nombreP").val(persona.name);
        $("#fechaNacimientoP").val(persona.birthDate);
        $("#fechaMuerteP").val(persona.deathDate);
        $("#imagenP").val(persona.imageUrl);
        $("#wikiP").val(persona.wikiUrl);
        $("#guardarPersona").hide();
        $("#modificarPersona").show();
        mostrarFormularioPersona();
        localStorage.setItem('personaId', persona.id);
    });
}

function modificarPersona() {
    const id = localStorage.getItem('personaId');
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/persons/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" },
        complete: function(response) {
            const etag = response.getResponseHeader('ETag');
            console.log('ETag:', etag); // Log the ETag
            if (!etag) {
                console.error('ETag not found');
                return;
            }
            const persona = {
                name: $("#nombreP").val(),
                birthDate: $("#fechaNacimientoP").val(),
                deathDate: $("#fechaMuerteP").val(),
                imageUrl: $("#imagenP").val(),
                wikiUrl: $("#wikiP").val()
            };
            console.log('Person Data:', JSON.stringify(persona)); // Log person data
            $.ajax({
                type: 'PUT',
                url: `http://127.0.0.1:8000/api/v1/persons/${id}`,
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                    "accept": "application/json",
                    "If-Match": etag
                },
                data: JSON.stringify(persona)
            }).then(() => {
                mostrarPersonas();
                ocultarFormularioPersona();
            }).catch(error => {
                console.error('Error updating person:', error);
            });
        }
    });
}

function eliminarPersona(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/persons/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(() => {
        mostrarPersonas();
    });
}

function mostrarFormularioPersona() {
    const formularioPersona = document.getElementById("formulario-contenedorPersona");
    formularioPersona.style.display = "block";
}

function ocultarFormularioPersona() {
    document.getElementById("formulario-contenedorPersona").style.display = "none";
}

function mostrarModificarPersona() {
    document.getElementById("modificarPersona").style.display = "block";
}

function ocultarModificarPersona() {
    document.getElementById("modificarPersona").style.display = "none";
}

function mostrarJSONPersona(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/persons/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const persona = response.person;
        if (persona) {
            let personaHTML = `<h2>Persona: ${persona.name}</h2>`;
            personaHTML += `<p><strong>ID:</strong> ${persona.id}</p>`;
            personaHTML += `<p><strong>Nombre:</strong> ${persona.name}</p>`;
            if (persona.birthDate) {
                personaHTML += `<p><strong>Fecha de Nacimiento:</strong> ${persona.birthDate}</p>`;
            }
            if (persona.deathDate) {
                personaHTML += `<p><strong>Fecha de Muerte:</strong> ${persona.deathDate ? persona.deathDate : "N/A"}</p>`;
            }
            if (persona.imageUrl) {
                personaHTML += `<p><strong>Imagen:</strong> <img src="${persona.imageUrl}" alt="${persona.name}" width="200"></p>`;
            }
            if (persona.wikiUrl) {
                personaHTML += `<p><strong>URL:</strong> <a href="${persona.wikiUrl}" target="_blank">${persona.wikiUrl}</a></p>`;
            }

            if (persona.entities && persona.entities.length > 0) {
                personaHTML += `<h3>Entidades:</h3><ul>`;
                persona.entities.forEach(entidadID => {
                    personaHTML += `<li>ID Entidad: ${entidadID}</li>`;
                });
                personaHTML += `</ul>`;
            }

            if (persona.products && persona.products.length > 0) {
                personaHTML += `<h3>Productos:</h3><ul>`;
                persona.products.forEach(productoID => {
                    personaHTML += `<li>ID Producto: ${productoID}</li>`;
                });
                personaHTML += `</ul>`;
            }

            $("#contenidoJSONPersona").html(personaHTML);
            $("#modalJSONPersona").show();
        } else {
            $("#contenidoJSONPersona").html(`<p>Persona no encontrada con ID: ${id}</p>`);
            $("#modalJSONPersona").show();
        }
    });
}

function cerrarmodalJSONPersona() {
    $("#modalJSONPersona").hide();
}

function manejarRelacionesPersona() {
    const personaId = $("#personaId").val();
    const relationType = $("#relationTypePersona").val();
    const operation = $("#operationPersona").val();
    const relatedId = $("#relatedIdPersona").val();

    $.ajax({
        type: 'PUT',
        url: `http://127.0.0.1:8000/api/v1/persons/${personaId}/${relationType}/${operation}/${relatedId}`,
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

mostrarPersonas();

// Agregar eventos a los botones
document.getElementById("crearPersona").addEventListener("click", () => {
    limpiarFormularioPersona();
    mostrarFormularioPersona();
    ocultarModificarPersona();
});
document.getElementById("guardarPersona").addEventListener("click", () => {
    const nombre = document.getElementById("nombreP").value;
    const fechaNacimiento = document.getElementById("fechaNacimientoP").value;
    const fechaMuerte = document.getElementById("fechaMuerteP").value;
    const imagen = document.getElementById("imagenP").value;
    const wiki = document.getElementById("wikiP").value;
    crearPersona(nombre, fechaNacimiento, fechaMuerte, imagen, wiki);
    ocultarFormularioPersona();
});
document.getElementById("modificarPersona").addEventListener("click", () => {
    modificarPersona();
    ocultarFormularioPersona();
});
document.getElementById("cerrarJsonPersona").addEventListener("click", cerrarmodalJSONPersona);
document.getElementById("cerrar-formularioPersona").addEventListener("click", ocultarFormularioPersona);
document.getElementById("crearRelacionesPersona").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelacionesPersona").style.display = "block";
});
document.getElementById("cerrar-formularioRelacionesPersona").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelacionesPersona").style.display = "none";
});
document.getElementById("actualizarRelacionPersona").addEventListener("click", manejarRelacionesPersona);
