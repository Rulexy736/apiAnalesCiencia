function getAuthHeader() {
    return sessionStorage.getItem('authHeader');
}

function obtenerDatosProducto() {
    return $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/products?order=id&ordering=ASC',
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    });
}

function guardarDatosProducto(producto) {
    return $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/products',
        headers: {
            "Authorization": getAuthHeader(),
            'Content-Type': 'application/json',
            "accept": "application/json"
        },
        data: JSON.stringify(producto)
    });
}

function mostrarProductos() {
    obtenerDatosProducto().then(response => {
        const productos = response.products.map(p => p.product);
        const listaProductos = $("#listaProductos");
        listaProductos.empty();
        productos.forEach(producto => {
            listaProductos.append(`
                <li>
                    ${producto.id}. ${producto.name}
                    <button class="botonNormal" onclick="mostrarJSONProducto(${producto.id})">Ver producto</button>
                    <button class="botonNormal" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="botonNormal" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </li>
            `);
        });
    });
}

function crearProducto(nombre, fechaCreacion, fechaDefuncion, imagen, url) {
    const producto = {
        name: nombre,
        birthDate: fechaCreacion,
        deathDate: fechaDefuncion,
        imageUrl: imagen,
        wikiUrl: url
    };

    guardarDatosProducto(producto).then(() => {
        mostrarProductos();
        ocultarFormularioProducto();
    });
}

function editarProducto(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/products/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const producto = response.product;
        $("#idPr").val(producto.id);
        $("#nombrePr").val(producto.name);
        $("#fechaCreacionPr").val(producto.birthDate);
        $("#fechaDefuncionPr").val(producto.deathDate);
        $("#imagenPr").val(producto.imageUrl);
        $("#urlPr").val(producto.wikiUrl);
        $("#guardarProducto").hide();
        $("#modificarProducto").show();
        mostrarFormularioProducto();
        localStorage.setItem('productoId', producto.id);
    });
}

function modificarProducto() {
    const id = localStorage.getItem('productoId');
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/products/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const etag = response.getResponseHeader('ETag');
        const producto = {
            name: $("#nombrePr").val(),
            birthDate: $("#fechaCreacionPr").val(),
            deathDate: $("#fechaDefuncionPr").val(),
            imageUrl: $("#imagenPr").val(),
            wikiUrl: $("#urlPr").val()
        };

        $.ajax({
            type: 'PUT',
            url: `http://127.0.0.1:8000/api/v1/products/${id}`,
            headers: {
                "Authorization": getAuthHeader(),
                'Content-Type': 'application/json',
                "accept": "application/json",
                "If-Match": etag
            },
            data: JSON.stringify(producto)
        }).then(() => {
            mostrarProductos();
            ocultarFormularioProducto();
        });
    });
}

function eliminarProducto(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/products/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(() => {
        mostrarProductos();
    });
}

function mostrarFormularioProducto() {
    const formularioProducto = document.getElementById("formulario-contenedorProducto");
    formularioProducto.style.display = "block";
}

function ocultarFormularioProducto() {
    document.getElementById("formulario-contenedorProducto").style.display = "none";
}

function mostrarModificarProducto() {
    document.getElementById("modificarProducto").style.display = "block";
}

function ocultarModificarProducto() {
    document.getElementById("modificarProducto").style.display = "none";
}

function mostrarJSONProducto(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/products/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const producto = response.product;
        if (producto) {
            let productoHTML = `<h2>Producto: ${producto.name}</h2>`;
            productoHTML += `<p><strong>ID:</strong> ${producto.id}</p>`;
            productoHTML += `<p><strong>Nombre:</strong> ${producto.name}</p>`;
            if (producto.birthDate) {
                productoHTML += `<p><strong>Fecha de Creación:</strong> ${producto.birthDate}</p>`;
            }
            if (producto.deathDate) {
                productoHTML += `<p><strong>Fecha de Defunción:</strong> ${producto.deathDate ? producto.deathDate : "N/A"}</p>`;
            }
            if (producto.imageUrl) {
                productoHTML += `<p><strong>Imagen:</strong> <img src="${producto.imageUrl}" alt="${producto.name}" width="200"></p>`;
            }
            if (producto.wikiUrl) {
                productoHTML += `<p><strong>URL:</strong> <a href="${producto.wikiUrl}" target="_blank">${producto.wikiUrl}</a></p>`;
            }

            if (producto.persons && producto.persons.length > 0) {
                productoHTML += `<h3>Personas:</h3><ul>`;
                producto.persons.forEach(personaID => {
                    productoHTML += `<li>ID Persona: ${personaID}</li>`;
                });
                productoHTML += `</ul>`;
            }

            if (producto.entities && producto.entities.length > 0) {
                productoHTML += `<h3>Entidades:</h3><ul>`;
                producto.entities.forEach(entidadID => {
                    productoHTML += `<li>ID Entidad: ${entidadID}</li>`;
                });
                productoHTML += `</ul>`;
            }

            $("#contenidoJSONProducto").html(productoHTML);
            $("#modalJSONProducto").show();
        } else {
            $("#contenidoJSONProducto").html(`<p>Producto no encontrado con ID: ${id}</p>`);
            $("#modalJSONProducto").show();
        }
    });
}

function cerrarmodalJSONProducto() {
    $("#modalJSONProducto").hide();
}

function manejarRelaciones() {
    const productId = $("#productId").val();
    const relationType = $("#relationType").val();
    const operation = $("#operation").val();
    const entityId = $("#entityId").val();

    $.ajax({
        type: 'PUT',
        url: `http://127.0.0.1:8000/api/v1/products/${productId}/${relationType}/${operation}/${entityId}`,
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

mostrarProductos();

// Agregar eventos a los botones
document.getElementById("crearProducto").addEventListener("click", () => {
    limpiarFormularioProducto();
    mostrarFormularioProducto();
    ocultarModificarProducto();
});
document.getElementById("guardarProducto").addEventListener("click", () => {
    const nombre = document.getElementById("nombrePr").value;
    const fechaCreacion = document.getElementById("fechaCreacionPr").value;
    const fechaDefuncion = document.getElementById("fechaDefuncionPr").value;
    const imagen = document.getElementById("imagenPr").value;
    const url = document.getElementById("urlPr").value;
    crearProducto(nombre, fechaCreacion, fechaDefuncion, imagen, url);
    ocultarFormularioProducto();
});
document.getElementById("modificarProducto").addEventListener("click", () => {
    modificarProducto();
    ocultarFormularioProducto();
});
document.getElementById("cerrarJsonProducto").addEventListener("click", cerrarmodalJSONProducto);
document.getElementById("cerrar-formularioProducto").addEventListener("click", ocultarFormularioProducto);
document.getElementById("crearRelaciones").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelaciones").style.display = "block";
});
document.getElementById("cerrar-formularioRelaciones").addEventListener("click", () => {
    document.getElementById("formulario-contenedorRelaciones").style.display = "none";
});
document.getElementById("actualizarRelacion").addEventListener("click", manejarRelaciones);

function limpiarFormularioProducto() {
    $("#idPr").val('');
    $("#nombrePr").val('');
    $("#fechaCreacionPr").val('');
    $("#fechaDefuncionPr").val('');
    $("#imagenPr").val('');
    $("#urlPr").val('');
}
