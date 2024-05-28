
  function cerrarSesion() {
    sessionStorage.removeItem('authHeader');
  }
document.getElementById("linkCerrarSesion").addEventListener("click", cerrarSesion);