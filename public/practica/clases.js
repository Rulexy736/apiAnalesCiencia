class Persona {
    constructor(id, nombre, fechaNacimiento, fechaMuerte, imagen, wiki) {
      this.id = id;
      this.nombre = nombre;
      this.fechaNacimiento = fechaNacimiento;
      this.fechaMuerte = fechaMuerte;
      this.imagen = imagen;
      this.wiki = wiki;
      this.entidades = [];
      this.productos = []
    }
     
}
       // Función para obtener datos del JSON local
  function obtenerDatosPersonas() {
    const datos = localStorage.getItem("personas");
      return datos ? JSON.parse(datos) : [];
  }

// Función para guardar datos en JSON local
function guardarDatosPersonas(datos) {
  localStorage.setItem("personas", JSON.stringify(datos));
}

// Función para crear una nueva persona
function crearPersona(nombre, fechaNacimiento, fechaMuerte, imagen, wiki) {
  const personas = obtenerDatosPersonas();
  const nuevoId = personas.length ? Math.max(...personas.map(p => p.id)) + 1 : 1;

  const nuevaPersona = new Persona(nuevoId, nombre, fechaNacimiento, fechaMuerte, imagen, wiki);
  personas.push(nuevaPersona);
  guardarDatosPersonas(personas);
  mostrarPersonas();
}

function limpiarFormularioPersona(){
  document.getElementById("nombreP").value = "";
  document.getElementById("fechaNacimientoP").value = "";
  document.getElementById("fechaMuerteP").value = "";
  document.getElementById("imagenP").value = "";
  document.getElementById("wikiP").value = "";
  document.getElementById("idP").value = "";
}

//Funcion para modificar personas
function modificarPersona(){
  const personas = obtenerDatosPersonas();
  const nombre = document.getElementById("nombreP").value;
  const fechaNacimiento = document.getElementById("fechaNacimientoP").value;
  const fechaMuerte = document.getElementById("fechaMuerteP").value;
  const imagen = document.getElementById("imagenP").value;
  const wiki = document.getElementById("wikiP").value;
  const id = document.getElementById("idP").value;

  const persona = id ? personas.find((p) => p.id == id) : null;

  if(persona){
    persona.nombre = nombre;
    persona.fechaNacimiento = fechaNacimiento;
    persona.fechaMuerte = fechaMuerte;
    persona.imagen = imagen;
    persona.wiki = wiki;
  }

  guardarDatosPersonas(personas);
  mostrarPersonas();

}

// Función para mostrar las personas
function mostrarPersonas() {
  const personas = obtenerDatosPersonas();
  const listaPersonas = document.getElementById("listaPersonas");
  listaPersonas.innerHTML = "";
  personas.forEach((persona) => {
    const elementoPersona = document.createElement("li");
    elementoPersona.innerHTML = `
      ${persona.id}. ${persona.nombre}
      <button class="botonNormal" onclick="mostrarJSONPersona(${persona.id})">Ver persona</button>
      <button class="botonNormal" onclick="editarPersona(${persona.id})">Editar</button>
      <button class="botonNormal" onclick="eliminarPersona(${persona.id})">Eliminar</button>
    `;
    listaPersonas.appendChild(elementoPersona);
  });
}

// Función para mostrar el formulario de crear persona
function mostrarFormularioPersona() {
  document.getElementById("formulario-contenedorPersona").style.display = "block";
}

// Función para ocultar el formulario de crear persona
function ocultarFormularioPersona() {
  document.getElementById("formulario-contenedorPersona").style.display = "none";
}

function mostrarModificarPersonas(){
  document.getElementById("modificarPersona").style.display = "block";
}

function ocultarModificarPersonas(){
  document.getElementById("modificarPersona").style.display = "none";
}

// Función para editar una persona
function editarPersona(id) {
  const personas = obtenerDatosPersonas();
  const persona = personas.find((p) => p.id === id);
  // Mostrar formulario con datos de la persona
  const formularioPersona = document.getElementById("formularioPersona");

  const nombreInput = document.getElementById("nombreP");
  nombreInput.value = persona.nombre;

  const fechaNacimientoInput = document.getElementById("fechaNacimientoP");
  fechaNacimientoInput.value = persona.fechaNacimiento;

  const fechaMuerteInput = document.getElementById("fechaMuerteP");
  fechaMuerteInput.value = persona.fechaMuerte;

  const imagenInput = document.getElementById("imagenP");
  imagenInput.value = persona.imagen;

  const wikiInput = document.getElementById("wikiP");
  wikiInput.value = persona.wiki;

  const idInput = document.getElementById("idP");
  idInput.value = id

  mostrarFormularioPersona()
  mostrarModificarPersonas()
}

// Función para eliminar una persona
function eliminarPersona(id) {
  const personas = obtenerDatosPersonas();
  const personasFiltradas = personas.filter((p) => p.id !== id);
  guardarDatosPersonas(personasFiltradas);
  mostrarPersonas();

  const persona = personas.find((e) => e.id == id) ;
  const productos = obtenerDatosProducto();
  for(let i = 0; i < persona.productos.length ; i++){
    const producto = productos.find((p) => p.id == persona.productos[i]);
    const indice = producto.personas.indexOf(id);
    if (indice !== -1) {
      producto.personas.splice(indice, 1);
    }
  }
  guardarDatosProducto(productos);
  mostrarProductos();

  const entidades = obtenerDatosEntidades();
  for(let j = 0; j < persona.entidades.length ; j++){
    const entidad = entidades.find((pr) => pr.id == persona.entidades[j]);
    const indice = entidad.personas.indexOf(id);
    if (indice !== -1) {
      entidad.personas.splice(indice, 1);
}
  }
  guardarDatosEntidad(entidades);
  mostrarEntidades();
}

function mostrarJSONPersona(id) {
  // Obtener el JSON de la persona
  const personas = obtenerDatosPersonas();
  const persona = id ? personas.find((e) => e.id == id) : null;

  if (persona) {
    // Crear una cadena HTML para mostrar la información de la persona
    let personaHTML = `<h2>Persona: ${persona.nombre}</h2>`;
    personaHTML += `<p><strong>ID:</strong> ${persona.id}</p>`;
    personaHTML += `<p><strong>Nombre:</strong> ${persona.nombre}</p>`;
    if(persona.fechaNacimiento){
      personaHTML += `<p><strong>Fecha de Nacimiento:</strong> ${persona.fechaNacimiento}</p>`;
    }
    if(persona.fechaNacimiento){
      personaHTML += `<p><strong>Fecha de Muerte:</strong> ${persona.fechaMuerte ? persona.fechaMuerte : "N/A"}</p>`;
    }
    if(persona.imagen){
      personaHTML += `<p><strong>Imagen:</strong> <img src="${persona.imagen}" alt="${persona.nombre}" width="200"></p>`;
    }
    if(persona.wiki){
      personaHTML += `<p><strong>Wiki:</strong> <a href="${persona.wiki}" target="_blank">${persona.nombre} en Wikipedia</a></p>`;
    }
    // Mostrar las entidades y productos asociados (si los hay)
    if (persona.entidades.length > 0) {
      const entidades = obtenerDatosEntidades();
      personaHTML += `<h3>Entidades:</h3>`;
      personaHTML += `<ul>`;
      for(let i =0; i<persona.entidades.length;i++){
        const entidad = entidades.find((e) => e.id == persona.entidades[i]);
        personaHTML += `<li>${entidad.nombre}</li>`;
      }
      personaHTML += `</ul>`;
    }

    if (persona.productos.length > 0) {
      const productos = obtenerDatosProducto();
      personaHTML += `<h3>Productos:</h3>`;
      personaHTML += `<ul>`;
      for(let i =0; i<persona.productos.length;i++){
        const producto = productos.find((e) => e.id == persona.productos[i]);
        personaHTML += `<li>${producto.nombre}</li>`;
      }
      personaHTML += `</ul>`;
    }

    // Mostrar el HTML en el modal
    const modal = document.getElementById("contenidoJSONPersona");
    modal.innerHTML = personaHTML;
    document.getElementById("modalJSONPersona").style.display = "block";
  } else {
    // Mostrar un mensaje si no se encuentra la persona
    const modal = document.getElementById("contenidoJSONPersona");
    modal.innerHTML = `<p>Persona no encontrada con ID: ${id}</p>`;
    document.getElementById("modalJSONPersona").style.display = "block";
  }
}

function cerrarmodalJSONPersona() {
  const modal = document.getElementById("modalJSONPersona");
  modal.style.display = "none";
}


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


  
class Producto {
  constructor(id, nombre, fechaCreacion, fechaDefuncion, descripcion, precio, imagen, url, personasSeleccionadas = [], entidadesSeleccionadas = []) {
    this.id = id;
    this.nombre = nombre;
    this.fechaCreacion = fechaCreacion;
    this.fechaDefuncion = fechaDefuncion;
    this.descripcion = descripcion;
    this.precio = precio;
    this.imagen = imagen;
    this.url = url;

    this.personas = personasSeleccionadas;
    this.entidades = entidadesSeleccionadas;
  }
}

// Función para obtener datos del JSON local
function obtenerDatosProducto() {
  const datos = localStorage.getItem("Productos");
  return datos ? JSON.parse(datos) : [];
}

// Función para guardar datos en JSON local
function guardarDatosProducto(datos) {
  localStorage.setItem("Productos", JSON.stringify(datos));
}

// Función para crear una nueva Producto
function crearProducto(nombre, fechaCreacion, fechaDefuncion, descripcion, precio, imagen, url,personasSeleccionadas,entidadesSeleccionadas) {
  const productos = obtenerDatosProducto();
  const nuevoId = productos.length ? Math.max(...productos.map(e => e.id)) + 1 : 1;

  const nuevaProducto = new Producto(nuevoId, nombre, fechaCreacion, fechaDefuncion, descripcion, precio, imagen, url,personasSeleccionadas,entidadesSeleccionadas);

  productos.push(nuevaProducto);
  guardarDatosProducto(productos);
  mostrarProductos();

  const personas = obtenerDatosPersonas();
  for(let i = 0; i < personasSeleccionadas.length ; i++){
    const persona = personas.find((p) => p.id == personasSeleccionadas[i]);
    persona.productos.push(nuevoId);
  }
  guardarDatosPersonas(personas);
  mostrarPersonas();

  const entidades = obtenerDatosEntidades();
  for(let i = 0; i < entidadesSeleccionadas.length ; i++){
    const entidad = entidades.find((p) => p.id == entidadesSeleccionadas[i]);
    entidad.productos.push(nuevoId);
  }
  guardarDatosEntidad(entidades);
  mostrarEntidades();
}

function limpiarFormularioProducto(){
  document.getElementById("nombrePr").value = "";
  document.getElementById("fechaCreacionPr").value = "";
  document.getElementById("fechaDefuncionPr").value = "";
  document.getElementById("descripcionPr").value = "";
  document.getElementById("precioPr").value = "";
  document.getElementById("imagenPr").value = "";
  document.getElementById("urlPr").value = "";
  document.getElementById("idPr").value = "";
}

function modificarProducto() {
  const productos = obtenerDatosProducto();
  const nombre = document.getElementById("nombrePr").value;
  const fechaCreacion = document.getElementById("fechaCreacionPr").value;
  const fechaDefuncion = document.getElementById("fechaDefuncionPr").value;
  const descripcion = document.getElementById("descrpcionPr").value;
  const precio = document.getElementById("precioPr").value;
  const imagen = document.getElementById("imagenPr").value;
  const url = document.getElementById("urlPr").value;
  const id = document.getElementById("idPr").value;

  const Producto = id ? productos.find((e) => e.id == id) : null;

  if (Producto) {
    Producto.nombre = nombre;
    Producto.fechaCreacion = fechaCreacion;
    Producto.fechaDefuncion = fechaDefuncion;
    Producto.descripcion = descripcion;
    Producto.precio = precio;
    Producto.imagen = imagen;
    Producto.url = url;
  }

  guardarDatosProducto(productos);
  mostrarProductos();
}

// Función para mostrar las Productos
function mostrarProductos() {
  const productos = obtenerDatosProducto();
  const listaProductos = document.getElementById("listaProductos");
  listaProductos.innerHTML = "";
  productos.forEach((producto) => {
    const elementoProducto = document.createElement("li");
    elementoProducto.innerHTML = `
       ${producto.id}. ${producto.nombre}
      <button class="botonNormal" onclick="mostrarJSONProducto(${producto.id})">Ver producto</button>
      <button class="botonNormal" onclick="editarProducto(${producto.id})">Editar</button>
      <button class="botonNormal" onclick="eliminarProducto(${producto.id})">Eliminar</button>
      `;
    listaProductos.appendChild(elementoProducto);
  });
}

// Función para mostrar el formulario de crear Producto
function mostrarFormularioProducto() {
      // Obtener los id de las personas y entidades del JSON local
      const personas = obtenerDatosPersonas();
      const nombresPersonas = personas.map(persona => persona.id);
      const entidades = obtenerDatosEntidades();
      const nombresEntidades = entidades.map(entidad => entidad.id);

      // Mostrar el formulario con los id de las personas y entiades
      const formularioProducto = document.getElementById("formulario-contenedorProducto");
      const personasSelect = document.getElementById("personasP");
      personasSelect.innerHTML = nombresPersonas.map(id => `<option value="${id}">${id}</option>`).join("");
      const entidadesSelect = document.getElementById("entidades");
      entidadesSelect.innerHTML = nombresEntidades.map(id => `<option value="${id}">${id}</option>`).join("");
      formularioProducto.style.display = "block";
}

// Función para ocultar el formulario de crear Producto
function ocultarFormularioProducto() {
  document.getElementById("formulario-contenedorProducto").style.display = "none";
}

function mostrarModificarProducto() {
  document.getElementById("modificarProducto").style.display = "block";
}

function ocultarModificarProducto() {
  document.getElementById("modificarProducto").style.display = "none";
}

// Función para editar una Producto
function editarProducto(id) {
  const Productos = obtenerDatosProducto();
  const Producto = Productos.find((e) => e.id === id);

  const nombreInput = document.getElementById("nombrePr");
  nombreInput.value = Producto.nombre;

  const fechaCreacionInput = document.getElementById("fechaCreacionPr");
  fechaCreacionInput.value = Producto.fechaCreacion;

  const fechaDefuncionInput = document.getElementById("fechaDefuncionPr");
  fechaDefuncionInput.value = Producto.fechaDefuncion;

  const descripcionInput = document.getElementById("descripcionPr");
  descripcionInput.value = Producto.descripcion;

  const precioInput = document.getElementById("precioPr");
  precioInput.value = Producto.precio;

  const imagenInput = document.getElementById("imagenPr");
  imagenInput.value = Producto.imagen;
  
  const urlInput = document.getElementById("urlPr");
  urlInput.value = Producto.url;

  const idInput = document.getElementById("idPr");
  idInput.value = id;

  mostrarFormularioProducto();
  mostrarModificarProducto();
}

// Función para eliminar una Producto
function eliminarProducto(id) {
  const productos = obtenerDatosProducto();
  const productosFiltradas = productos.filter((e) => e.id !== id);
  guardarDatosProducto(productosFiltradas);
  mostrarProductos();

  const producto = productos.find((e) => e.id == id) ;
  const personas = obtenerDatosPersonas();
  for(let i = 0; i < producto.personas.length ; i++){
    const persona = personas.find((p) => p.id == producto.personas[i]);
    const indice = persona.productos.indexOf(id);
    if (indice !== -1) {
      persona.productos.splice(indice, 1);
    }
  }
  guardarDatosPersonas(personas);
  mostrarPersonas();

  const entidades = obtenerDatosEntidades();
  for(let j = 0; j < producto.entidades.length ; j++){
    const entidad = entidades.find((e) => e.id == producto.entidades[j]);
    const indiceE = entidad.productos.indexOf(id);
    if (indiceE !== -1) {
      entidad.productos.splice(indiceE, 1);
    }
  }
  guardarDatosEntidad(entidades);
  mostrarEntidades();
}

function mostrarJSONProducto(id) {
  // Obtener el JSON del producto
  const productos = obtenerDatosProducto();
  const producto = id ? productos.find((e) => e.id == id) : null;

  if (producto) {
    // Crear una cadena HTML para mostrar la información del producto
    let productoHTML = `<h2>Producto: ${producto.nombre}</h2>`;
    productoHTML += `<p><strong>ID:</strong> ${producto.id}</p>`;
    productoHTML += `<p><strong>Nombre:</strong> ${producto.nombre}</p>`;
    if (producto.fechaCreacion) {
      productoHTML += `<p><strong>Fecha de Creación:</strong> ${producto.fechaCreacion}</p>`;
    }
    if (producto.fechaDefuncion) {
      productoHTML += `<p><strong>Fecha de Defunción:</strong> ${producto.fechaDefuncion ? producto.fechaDefuncion : "N/A"}</p>`;
    }
    if (producto.descripcion) {
      productoHTML += `<p><strong>Descripción:</strong> ${producto.descripcion}</p>`;
    }
    if (producto.precio) {
      productoHTML += `<p><strong>Precio:</strong> ${producto.precio}</p>`;
    }
    if (producto.imagen) {
      productoHTML += `<p><strong>Imagen:</strong> <img src="${producto.imagen}" alt="${producto.nombre}" width="200"></p>`;
    }
    if (producto.url) {
      productoHTML += `<p><strong>URL:</strong> <a href="${producto.url}" target="_blank">${producto.url}</a></p>`;
    }

    // Mostrar las personas asociadas (si las hay)
    if (producto.personas.length > 0) {
      const personas = obtenerDatosPersonas();
      productoHTML += `<h3>Personas:</h3>`;
      productoHTML += `<ul>`;
      producto.personas.forEach((personaID) => {
        const persona = personas.find((e) => e.id == personaID);
        if (persona) {
          productoHTML += `<li>${persona.nombre}</li>`;
        }
      });
      productoHTML += `</ul>`;
    }

    // Mostrar las entidades asociadas (si las hay)
    if (producto.entidades.length > 0) {
      const entidades = obtenerDatosEntidades();
      productoHTML += `<h3>Entidades:</h3>`;
      productoHTML += `<ul>`;
      producto.entidades.forEach((entidadID) => {
        const entidad = entidades.find((e) => e.id == entidadID);
        if (entidad) {
          productoHTML += `<li>${entidad.nombre}</li>`;
        }
      });
      productoHTML += `</ul>`;
    }

    // Mostrar el HTML en el modal
    const modal = document.getElementById("contenidoJSONProducto");
    modal.innerHTML = productoHTML;
    document.getElementById("modalJSONProducto").style.display = "block";
  } else {
    // Mostrar un mensaje si no se encuentra el producto
    const modal = document.getElementById("contenidoJSONProducto");
    modal.innerHTML = `<p>Producto no encontrado con ID: ${id}</p>`;
    document.getElementById("modalJSONProducto").style.display = "block";
  }
}


function cerrarmodalJSONProducto() {
  const modal = document.getElementById("modalJSONProducto");
  modal.style.display = "none";
}


// Mostrar personas al cargar la página
mostrarPersonas();

// Agregar eventos a los botones
document.getElementById("crearPersona").addEventListener("click",() =>{
  limpiarFormularioPersona();
  mostrarFormularioPersona();
  ocultarModificarPersonas();
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

// Mostrar entidades al cargar la página
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

// Mostrar Productos al cargar la página
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
const descripcion = document.getElementById("descripcionPr").value;
const precio = document.getElementById("precioPr").value;
const imagen = document.getElementById("imagenPr").value;
const url = document.getElementById("urlPr").value;
const personasSelect = document.getElementById("personasP");
const personasSeleccionadas = Array.from(personasSelect.selectedOptions).map(option =>parseInt(option.value));
const entidadesSelect = document.getElementById("entidades");
const entidadesSeleccionadas = Array.from(entidadesSelect.selectedOptions).map(option => parseInt(option.value));
crearProducto(nombre, fechaCreacion, fechaDefuncion, descripcion, precio, imagen, url,personasSeleccionadas,entidadesSeleccionadas);
ocultarFormularioProducto();
});
document.getElementById("modificarProducto").addEventListener("click", () => {
modificarProducto();
ocultarFormularioProducto();
});
document.getElementById("cerrarJsonProducto").addEventListener("click", cerrarmodalJSONProducto);
document.getElementById("cerrar-formularioProducto").addEventListener("click", ocultarFormularioProducto);