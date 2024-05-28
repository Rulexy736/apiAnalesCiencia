$('#login-form').submit(function(event) {
  event.preventDefault();

  const usuario = $('#usuario').val();
  const contrasena = $('#contrasena').val();

  $.ajax({
    type: 'POST',
    url: '/access_token',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: usuario,
      password: contrasena
    }
  }).then(function(data, textStatus, request) {
    // Obtener el encabezado de autorización
    const authHeader = request.getResponseHeader('Authorization');
    
    if (authHeader) {
      // Guardar el encabezado de autorización en sessionStorage
      sessionStorage.setItem('authHeader', authHeader);

      // Realizar la solicitud GET para obtener el rol del usuario
      $.ajax({
        type: 'GET',
        url: '/api/v1/users',
        headers: {
          'accept': 'application/json',
          'Authorization': authHeader
        }
      }).then(function(userData) {
        // Buscar el usuario autenticado en la respuesta
        const currentUser = userData.users.find(user => user.user.username === usuario);

        if (currentUser) {
          const role = currentUser.user.role;
          if (role === 'WRITER') {
            window.location.href = 'proyectoIniciado.html';
          } else if (role === 'READER') {
            window.location.href = 'proyectoFront.html';
          } 
        } else {
          $('#error-message').text('Usuario no encontrado o inactivo.');
        }
      }).catch(function(xmlHttpRequest, statusText, errorThrown) {
        console.error('Error fetching user data:', errorThrown);
        $('#error-message').text('Error al obtener los datos del usuario.');
      });
    } else {
      $('#error-message').text('Usuario o contraseña incorrectos.');
    }
  }).catch(function(xmlHttpRequest, statusText, errorThrown) {
    console.error('Error fetching user data:', errorThrown);
    $('#error-message').text('Usuario o contraseña incorrectos.');
  });
});

