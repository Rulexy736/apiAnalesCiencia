$(document).ready(function() {
  // Mostrar formulario de registro
  $('#btn-register-show').click(function() {
    $('.login').hide();
    $('.register').show();
  });

  // Comprobación del nombre de usuario y contraseña
  $('#btn-validate').click(function() {
    const username = $('#register-usuario').val();
    const password = $('#register-contrasena').val();

    if (username && password) {
      $.ajax({
        type: 'GET',
        url: `http://127.0.0.1:8000/api/v1/users/username/${username}`,
        headers: {
          'accept': '*/*'
        }
      }).then(function(response) {
        $('#user-check-message').text('El nombre de usuario ya está en uso.');
      }).catch(function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status === 404) {
          $('#user-check-message').text('Usuario válido.');
          $('#register-usuario').prop('disabled', true);
          $('#register-contrasena').prop('disabled', true);
          $('#btn-validate').hide();
          $('#email-section').show();
        } else {
          console.error('Error checking username:', errorThrown);
        }
      });
    }
  });

  // Completar el registro de usuario
  $('#complete-register-form').submit(function(event) {
    event.preventDefault();
    
    const usuario = $('#register-usuario').val();
    const contrasena = $('#register-contrasena').val();
    const email = $('#register-email').val();

    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        username: usuario,
        password: contrasena,
        email: email
      }),
      statusCode: {
        201: function() {
          // Registro exitoso, restablecer el formulario y volver a la pantalla de inicio de sesión
          $('#register-usuario').prop('disabled', false).val('');
          $('#register-contrasena').prop('disabled', false).val('');
          $('#user-check-message').text('');
          $('#register-error-message').text('');
          $('#btn-validate').show();
          $('#email-section').hide();
          $('#complete-register-form')[0].reset();
          $('.register').hide();
          $('.login').show();
        }
      }
    }).fail(function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.status !== 201) {
        $('#register-error-message').text('Error al registrar el usuario.');
      }
      console.error('Error registering user:', errorThrown);
    });
  });

  // Inicio de sesión
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
      const authHeader = request.getResponseHeader('Authorization');
      
      if (authHeader) {
        sessionStorage.setItem('authHeader', authHeader);
        $.ajax({
          type: 'GET',
          url: '/api/v1/users',
          headers: {
            'accept': 'application/json',
            'Authorization': authHeader
          }
        }).then(function(userData) {
          const currentUser = userData.users.find(user => user.user.username === usuario);
          if (currentUser) {
            sessionStorage.setItem('username', currentUser.user.username);
            const role = currentUser.user.role;
            if (role === 'WRITER') {
              window.location.href = 'proyectoIniciado.html';
            } else if (role === 'READER') {
              window.location.href = 'proyectoFront.html';
            }
          } else {
            $('#error-message').text('Usuario no encontrado o inactivo.');
          }
        }).catch(function(error) {
          console.error('Error fetching user data:', error);
          $('#error-message').text('Error al obtener los datos del usuario.');
        });
      } else {
        $('#error-message').text('Usuario o contraseña incorrectos.');
      }
    }).catch(function(error) {
      console.error('Error logging in:', error);
      $('#error-message').text('Usuario o contraseña incorrectos.');
    });
  });
});

