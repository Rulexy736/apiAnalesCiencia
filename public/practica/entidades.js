class Entidad {
    constructor(id, nombre, fechaCreacion, fechaDefuncion, imagen, wiki, personasSeleccionadas = []) {
      this.id = id;
      this.nombre = nombre;
      this.fechaCreacion = fechaCreacion;
      this.fechaDefuncion = fechaDefuncion;
      this.imagen = imagen;
      this.wiki = wiki;
      this.personas = personasSeleccionadas;
      this.productos=[]
    }
  }

  // Función para obtener datos del JSON local
function obtenerDatosEntidades() {
  const datos = localStorage.getItem("entidades");
  return datos ? JSON.parse(datos) : [];
}

// Función para guardar datos en JSON local
function guardarDatosEntidad(datos) {
  localStorage.setItem("entidades", JSON.stringify(datos));
}

// Función para crear una nueva entidad
function crearEntidad(nombre, fechaCreacion, fechaDefuncion, imagen, wiki,personasSeleccionadas) {
  const entidades = obtenerDatosEntidades();
  const nuevoId = entidades.length ? Math.max(...entidades.map(e => e.id)) + 1 : 1;

  const nuevaEntidad = new Entidad(nuevoId, nombre, fechaCreacion, fechaDefuncion, imagen, wiki,personasSeleccionadas);

  entidades.push(nuevaEntidad);
  guardarDatosEntidad(entidades);
  mostrarEntidades();

  const personas = obtenerDatosPersonas();
  for(let i = 0; i < personasSeleccionadas.length ; i++){
    const persona = personas.find((p) => p.id == personasSeleccionadas[i]);
    persona.entidades.push(nuevoId);
  }
  guardarDatosPersonas(personas);
  mostrarPersonas();
}

function limpiarFormularioEntidad(){

  document.getElementById("nombreE").value = "";
  document.getElementById("fechaCreacionE").value = "";
  document.getElementById("fechaDefuncionE").value = "";
  document.getElementById("imagenE").value = "";
  document.getElementById("wikiE").value = "";
  document.getElementById("idE").value = "";
}

function modificarEntidad() {
  const entidades = obtenerDatosEntidades();
  const nombre = document.getElementById("nombreE").value;
  const fechaCreacion = document.getElementById("fechaCreacionE").value;
  const fechaDefuncion = document.getElementById("fechaDefuncionE").value;
  const imagen = document.getElementById("imagenE").value;
  const wiki = document.getElementById("wikiE").value;
  const id = document.getElementById("idE").value;

  const entidad = id ? entidades.find((e) => e.id == id) : null;

  if (entidad) {
    entidad.nombre = nombre;
    entidad.fechaCreacion = fechaCreacion;
    entidad.fechaDefuncion = fechaDefuncion;
    entidad.imagen = imagen;
    entidad.wiki = wiki;
  }

  guardarDatosEntidad(entidades);
  mostrarEntidades();
}

// Función para mostrar las entidades
function mostrarEntidades() {
  const entidades = obtenerDatosEntidades();
  const listaEntidades = document.getElementById("listaEntidades");
  listaEntidades.innerHTML = "";
  entidades.forEach((entidad) => {
    const elementoEntidad = document.createElement("li");
    elementoEntidad.innerHTML = `
      ${entidad.id}. ${entidad.nombre}
      <button class="botonNormal" onclick="mostrarJSONEntidad(${entidad.id})">Ver entidad</button>
      <button class="botonNormal" onclick="editarEntidad(${entidad.id})">Editar</button>
      <button class="botonNormal" onclick="eliminarEntidad(${entidad.id})">Eliminar</button>
      `;
    listaEntidades.appendChild(elementoEntidad);
  });
}

// Función para mostrar el formulario de crear entidad
function mostrarFormularioEntidad() {
      // Obtener los id de las personas del JSON local
      const personas = obtenerDatosPersonas();
      const idPersonas = personas.map(persona => persona.id);

      // Mostrar el formulario con los id de las personas
      const formularioEntidad = document.getElementById("formulario-contenedorEntidad");
      const personasSelect = document.getElementById("personas");
      personasSelect.innerHTML = idPersonas.map(id => `<option value="${id}">${id}</option>`).join("");
      formularioEntidad.style.display = "block";
}

// Función para ocultar el formulario de crear entidad
function ocultarFormularioEntidad() {
  document.getElementById("formulario-contenedorEntidad").style.display = "none";
}

function mostrarModificarEntidad() {
  document.getElementById("modificarEntidad").style.display = "block";
}

function ocultarModificarEntidad() {
  document.getElementById("modificarEntidad").style.display = "none";
}

// Función para editar una entidad
function editarEntidad(id) {
  const entidades = obtenerDatosEntidades();
  const entidad = entidades.find((e) => e.id === id);
  // Mostrar formulario con datos de la entidad
  const formularioEntidad = document.getElementById("formularioEntidad");

  const nombreInput = document.getElementById("nombreE");
  nombreInput.value = entidad.nombre;

  const fechaCreacionInput = document.getElementById("fechaCreacionE");
  fechaCreacionInput.value = entidad.fechaCreacion;

  const fechaDefuncionInput = document.getElementById("fechaDefuncionE");
  fechaDefuncionInput.value = entidad.fechaDefuncion;

  const imagenInput = document.getElementById("imagenE");
  imagenInput.value = entidad.imagen;

  const wikiInput = document.getElementById("wikiE");
  wikiInput.value = entidad.wiki;

  const idInput = document.getElementById("idE");
  idInput.value = id;

  mostrarFormularioEntidad();
  mostrarModificarEntidad();
}

// Función para eliminar una entidad
function eliminarEntidad(id) {
  const entidades = obtenerDatosEntidades();
  const entidadesFiltradas = entidades.filter((e) => e.id !== id);
  guardarDatosEntidad(entidadesFiltradas);
  mostrarEntidades();

  const entidad = entidades.find((e) => e.id == id) ;
  const personas = obtenerDatosPersonas();
  for(let i = 0; i < entidad.personas.length ; i++){
    const persona = personas.find((p) => p.id == entidad.personas[i]);
    const indice = persona.entidades.indexOf(id);
    if (indice !== -1) {
      persona.entidades.splice(indice, 1);
}
  }
  guardarDatosPersonas(personas);
  mostrarPersonas();

  const productos = obtenerDatosProducto();
  for(let i = 0; i < entidad.productos.length ; i++){
    const producto = productos.find((p) => p.id == entidad.productos[i]);
    const indice = producto.entidades.indexOf(id);
    if (indice !== -1) {
      producto.entidades.splice(indice, 1);
    }
  }
  guardarDatosProducto(productos);
  mostrarProductos();
}

function mostrarJSONEntidad(id) {
  // Obtener el JSON de la entidad
  const entidades = obtenerDatosEntidades();
  const entidad = id ? entidades.find((e) => e.id == id) : null;

  if (entidad) {
    // Crear una cadena HTML para mostrar la información de la entidad
    let entidadHTML = `<h2>Entidad: ${entidad.nombre}</h2>`;
    entidadHTML += `<p><strong>ID:</strong> ${entidad.id}</p>`;
    entidadHTML += `<p><strong>Nombre:</strong> ${entidad.nombre}</p>`;
    if (entidad.fechaCreacion) {
      entidadHTML += `<p><strong>Fecha de Creación:</strong> ${entidad.fechaCreacion}</p>`;
    }
    if (entidad.fechaCreacion) {
      entidadHTML += `<p><strong>Fecha de Defunción:</strong> ${entidad.fechaDefuncion ? entidad.fechaDefuncion : "N/A"}</p>`;
    }
    if (entidad.imagen) {
      entidadHTML += `<p><strong>Imagen:</strong> <img src="${entidad.imagen}" alt="${entidad.nombre}" width="200"></p>`;
    }
    if (entidad.wiki) {
      entidadHTML += `<p><strong>Wiki:</strong> <a href="${entidad.wiki}" target="_blank">${entidad.nombre} en Wikipedia</a></p>`;
    }

    // Mostrar las personas asociadas (si las hay)
    if (entidad.personas.length > 0) {
      const personas = obtenerDatosPersonas();
      entidadHTML += `<h3>Personas:</h3>`;
      entidadHTML += `<ul>`;
      entidad.personas.forEach((personaID) => {
        const persona = personas.find((e) => e.id == personaID);
        if (persona) {
          entidadHTML += `<li>${persona.nombre}</li>`;
        }
      });
      entidadHTML += `</ul>`;
    }

    // Mostrar los productos asociados (si los hay)
    if (entidad.productos.length > 0) {
      const productos = obtenerDatosProducto();
      entidadHTML += `<h3>Productos:</h3>`;
      entidadHTML += `<ul>`;
      entidad.productos.forEach((productoID) => {
        const producto = productos.find((e) => e.id == productoID);
        if (producto) {
          entidadHTML += `<li>${producto.nombre}</li>`;
        }
      });
      entidadHTML += `</ul>`;
    }

    // Mostrar el HTML en el modal
    const modal = document.getElementById("contenidoJSONEntidad");
    modal.innerHTML = entidadHTML;
    document.getElementById("modalJSONEntidad").style.display = "block";
  } else {
    // Mostrar un mensaje si no se encuentra la entidad
    const modal = document.getElementById("contenidoJSONEntidad");
    modal.innerHTML = `<p>Entidad no encontrada con ID: ${id}</p>`;
    document.getElementById("modalJSONEntidad").style.display = "block";
  }
}


function cerrarmodalJSONEntidad() {
  const modal = document.getElementById("modalJSONEntidad");
  modal.style.display = "none";
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
  const personasSelect = document.getElementById("personas");
  const personasSeleccionadas = Array.from(personasSelect.selectedOptions).map(option => parseInt(option.value));
  crearEntidad(nombre, fechaCreacion, fechaDefuncion, imagen, wiki,personasSeleccionadas);
  ocultarFormularioEntidad();
});
document.getElementById("modificarEntidad").addEventListener("click", () => {
  modificarEntidad();
  ocultarFormularioEntidad();
});
document.getElementById("cerrarJsonEntidad").addEventListener("click", cerrarmodalJSONEntidad);
document.getElementById("cerrar-formularioEntidad").addEventListener("click", ocultarFormularioEntidad);
