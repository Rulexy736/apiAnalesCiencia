function getAuthHeader() {
    return sessionStorage.getItem('authHeader');
}

function obtenerDatosUsuarios() {
    return $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/users',
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    });
}

function guardarDatosUsuario(usuario) {
    return $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/users',
        headers: {
            "Authorization": getAuthHeader(),
            'Content-Type': 'application/json',
            "accept": "application/json"
        },
        data: JSON.stringify(usuario)
    });
}

function mostrarUsuarios() {
    obtenerDatosUsuarios().then(response => {
        const usuarios = response.users.map(u => u.user);
        const listaUsuarios = $("#listaUsuarios");
        listaUsuarios.empty();
        usuarios.forEach(usuario => {
            listaUsuarios.append(`
                <li>
                    ${usuario.id}. ${usuario.username} (${usuario.role})
                    <button class="botonNormal" onclick="mostrarJSONUsuario(${usuario.id})">Ver usuario</button>
                    <button class="botonNormal" onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button class="botonNormal" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </li>
            `);
        });
    });
}

function crearUsuario(username, email, password) {
    const usuario = {
        username: username,
        email: email,
        password: password,
        role: "INACTIVE"
    };

    guardarDatosUsuario(usuario).then(() => {
        mostrarUsuarios();
        ocultarFormularioUsuario();
    });
}

function limpiarFormularioUsuario() {
    $("#idU").val('');
    $("#usernameU").val('');
    $("#emailU").val('');
    $("#passwordU").val('');
}

function editarUsuario(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const usuario = response.user;
        $("#idU").val(usuario.id);
        $("#usernameU").val(usuario.username);
        $("#emailU").val(usuario.email);
        $("#roleU").val(usuario.role);
        $("#guardarUsuario").hide();
        $("#modificarUsuario").show();
        mostrarModificarUsuario();
        localStorage.setItem('usuarioId', usuario.id);
    });
}

function modificarUsuario() {
    const id = localStorage.getItem('usuarioId');
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" },
        complete: function(response) {
            const etag = response.getResponseHeader('ETag');
            console.log('ETag:', etag); // Log the ETag
            if (!etag) {
                console.error('ETag not found');
                return;
            }
            const usuario = {
                username: $("#usernameU").val(),
                email: $("#emailU").val(),
                role: $("#roleU").val()
            };
            console.log('User Data:', JSON.stringify(usuario)); // Log user data
            $.ajax({
                type: 'PUT',
                url: `http://127.0.0.1:8000/api/v1/users/${id}`,
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                    "accept": "application/json",
                    "If-Match": etag
                },
                data: JSON.stringify(usuario)
            }).then(() => {
                mostrarUsuarios();
                ocultarFormularioUsuario();
            }).catch(error => {
                console.error('Error updating user:', error);
            });
        }
    });
}

function eliminarUsuario(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(() => {
        mostrarUsuarios();
    });
}

function mostrarFormularioUsuario() {
    document.getElementById("formulario-contenedorUsuario").style.display = "block";
    document.getElementById("guardarUsuario").style.display = "block";
}

function ocultarFormularioUsuario() {
    document.getElementById("formulario-contenedorUsuario").style.display = "none";
}

function mostrarModificarUsuario() {
    document.getElementById("formulario-contenedorUsuario").style.display = "block";
    document.getElementById("modificarUsuario").style.display = "block";
    document.getElementById("guardarUsuario").style.display = "none";
}

function ocultarModificarUsuario() {
    document.getElementById("modificarUsuario").style.display = "none";
}

function mostrarJSONUsuario(id) {
    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" }
    }).then(response => {
        const usuario = response.user;
        if (usuario) {
            let usuarioHTML = `<h2>Usuario: ${usuario.username}</h2>`;
            usuarioHTML += `<p><strong>ID:</strong> ${usuario.id}</p>`;
            usuarioHTML += `<p><strong>Nombre de usuario:</strong> ${usuario.username}</p>`;
            usuarioHTML += `<p><strong>Email:</strong> ${usuario.email}</p>`;
            usuarioHTML += `<p><strong>Rol:</strong> ${usuario.role}</p>`;

            $("#contenidoJSONUsuario").html(usuarioHTML);
            $("#modalJSONUsuario").show();
        } else {
            $("#contenidoJSONUsuario").html(`<p>Usuario no encontrado con ID: ${id}</p>`);
            $("#modalJSONUsuario").show();
        }
    });
}

function cerrarmodalJSONUsuario() {
    $("#modalJSONUsuario").hide();
}

function mostrarFormularioCambioRol() {
    document.getElementById("formulario-contenedorCambioRol").style.display = "block";
}

function ocultarFormularioCambioRol() {
    document.getElementById("formulario-contenedorCambioRol").style.display = "none";
}

function cambiarRolUsuario() {
    const id = document.getElementById("cambioRolId").value;
    const nuevoRol = document.getElementById("cambioRolNuevo").value;

    $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/users/${id}`,
        headers: { "Authorization": getAuthHeader(), "accept": "application/json" },
        complete: function(response) {
            const etag = response.getResponseHeader('ETag');
            console.log('ETag:', etag); // Log the ETag
            if (!etag) {
                console.error('ETag not found');
                return;
            }
            const usuario = { role: nuevoRol };
            console.log('User Role Data:', JSON.stringify(usuario)); // Log user role data
            $.ajax({
                type: 'PUT',
                url: `http://127.0.0.1:8000/api/v1/users/${id}`,
                headers: {
                    "Authorization": getAuthHeader(),
                    'Content-Type': 'application/json',
                    "accept": "application/json",
                    "If-Match": etag
                },
                data: JSON.stringify(usuario)
            }).then(() => {
                mostrarUsuarios();
                ocultarFormularioCambioRol();
            }).catch(error => {
                console.error('Error updating user role:', error);
            });
        }
    });
}

mostrarUsuarios();

// Agregar eventos a los botones
document.getElementById("crearUsuario").addEventListener("click", () => {
    limpiarFormularioUsuario();
    mostrarFormularioUsuario();
    ocultarModificarUsuario();
});
document.getElementById("guardarUsuario").addEventListener("click", () => {
    const username = document.getElementById("usernameU").value;
    const email = document.getElementById("emailU").value;
    const password = document.getElementById("passwordU").value;
    crearUsuario(username, email, password);
    ocultarFormularioUsuario();
});
document.getElementById("modificarUsuario").addEventListener("click", () => {
    modificarUsuario();
    ocultarFormularioUsuario();
});
document.getElementById("cerrarJsonUsuario").addEventListener("click", cerrarmodalJSONUsuario);
document.getElementById("cerrar-formularioUsuario").addEventListener("click", ocultarFormularioUsuario);
document.getElementById("cambiarRolUsuario").addEventListener("click", mostrarFormularioCambioRol);
document.getElementById("guardarCambioRol").addEventListener("click", cambiarRolUsuario);
document.getElementById("cerrar-formularioCambioRol").addEventListener("click", ocultarFormularioCambioRol);
