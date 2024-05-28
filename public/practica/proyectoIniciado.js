
  function cerrarSesion() {
    sessionStorage.removeItem('authHeader');
    sessionStorage.removeItem('username');
  }
document.getElementById("linkCerrarSesion").addEventListener("click", cerrarSesion);