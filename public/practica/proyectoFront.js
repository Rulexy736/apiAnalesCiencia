// Función para cerrar sesión
function cerrarSesion() {
  sessionStorage.removeItem('authHeader');
  window.location.href = 'inicioSesion.html';
}

// Función para obtener datos de la API REST con los parámetros especificados
function obtenerDatos(endpoint) {
  const authHeader = sessionStorage.getItem('authHeader');
  const url = `http://127.0.0.1:8000/api/v1/${endpoint}?order=id&ordering=ASC`;
  return $.ajax({
    type: 'GET',
    url: url,
    headers: {
      'accept': 'application/json',
      'Authorization': authHeader
    }
  });
}

// Mostrar personas
function mostrarPersonas() {
  obtenerDatos('persons').then(function(response) {
    console.log('Personas:', response); // Verifica la estructura de la respuesta
    const personas = response.persons.map(p => p.person); // Ajusta según la estructura real
    const listaPersonas = document.getElementById('listaPersonas');
    listaPersonas.innerHTML = '';
    personas.forEach((persona) => {
      const elementoPersona = document.createElement('li');
      elementoPersona.innerHTML = `
        ${persona.id}. ${persona.name}
        <button onclick="mostrarJSONPersona(${persona.id})" class="botonNormal">Ver persona</button>
      `;
      listaPersonas.appendChild(elementoPersona);
    });
  });
}

function mostrarJSONPersona(id) {
  obtenerDatos('persons').then(function(response) {
    console.log('Personas:', response); // Verifica la estructura de la respuesta
    const personas = response.persons.map(p => p.person); // Ajusta según la estructura real
    const persona = personas.find((e) => e.id == id);

    if (persona) {
      let personaHTML = `<h2>Persona: ${persona.name}</h2>`;
      personaHTML += `<p><strong>ID:</strong> ${persona.id}</p>`;
      personaHTML += `<p><strong>Nombre:</strong> ${persona.name}</p>`;
      if(persona.birthDate){
        personaHTML += `<p><strong>Fecha de Nacimiento:</strong> ${persona.birthDate}</p>`;
      }
      if(persona.deathDate){
        personaHTML += `<p><strong>Fecha de Muerte:</strong> ${persona.deathDate ? persona.deathDate : "N/A"}</p>`;
      }
      if(persona.imageUrl){
        personaHTML += `<p><strong>Imagen:</strong> <img src="${persona.imageUrl}" alt="${persona.name}" width="200"></p>`;
      }
      if(persona.wikiUrl){
        personaHTML += `<p><strong>Wiki:</strong> <a href="${persona.wikiUrl}" target="_blank">${persona.name} en Wikipedia</a></p>`;
      }
      if (persona.entities && persona.entities.length > 0) {
        personaHTML += `<h3>Entidades:</h3>`;
        personaHTML += `<ul>`;
        persona.entities.forEach((entityID) => {
          personaHTML += `<li>ID Entidad: ${entityID}</li>`;
        });
        personaHTML += `</ul>`;
      }
      if (persona.products && persona.products.length > 0) {
        personaHTML += `<h3>Productos:</h3>`;
        personaHTML += `<ul>`;
        persona.products.forEach((productID) => {
          personaHTML += `<li>ID Producto: ${productID}</li>`;
        });
        personaHTML += `</ul>`;
      }
      const modal = document.getElementById('contenidoJSONPersona');
      modal.innerHTML = personaHTML;
      document.getElementById('modalJSONPersona').style.display = 'block';
    } else {
      const modal = document.getElementById('contenidoJSONPersona');
      modal.innerHTML = `<p>Persona no encontrada con ID: ${id}</p>`;
      document.getElementById('modalJSONPersona').style.display = 'block';
    }
  });
}

function cerrarmodalJSONPersona() {
  const modal = document.getElementById('modalJSONPersona');
  modal.style.display = 'none';
}

function mostrarEntidades() {
  obtenerDatos('entities').then(function(response) {
    console.log('Entidades:', response); // Verifica la estructura de la respuesta
    const entidades = response.entities.map(e => e.entity); // Ajusta según la estructura real
    const listaEntidades = document.getElementById('listaEntidades');
    listaEntidades.innerHTML = '';
    entidades.forEach((entidad) => {
      const elementoEntidad = document.createElement('li');
      elementoEntidad.innerHTML = `
        ${entidad.id}. ${entidad.name}
        <button class="botonNormal" onclick="mostrarJSONEntidad(${entidad.id})">Ver entidad</button>
      `;
      listaEntidades.appendChild(elementoEntidad);
    });
  });
}

function mostrarJSONEntidad(id) {
  obtenerDatos('entities').then(function(response) {
    console.log('Entidades:', response); // Verifica la estructura de la respuesta
    const entidades = response.entities.map(e => e.entity); // Ajusta según la estructura real
    const entidad = entidades.find((e) => e.id == id);

    if (entidad) {
      let entidadHTML = `<h2>Entidad: ${entidad.name}</h2>`;
      entidadHTML += `<p><strong>ID:</strong> ${entidad.id}</p>`;
      entidadHTML += `<p><strong>Nombre:</strong> ${entidad.name}</p>`;
      if (entidad.birthDate) {
        entidadHTML += `<p><strong>Fecha de Creación:</strong> ${entidad.birthDate}</p>`;
      }
      if (entidad.deathDate) {
        entidadHTML += `<p><strong>Fecha de Defunción:</strong> ${entidad.deathDate ? entidad.deathDate : "N/A"}</p>`;
      }
      if (entidad.imageUrl) {
        entidadHTML += `<p><strong>Imagen:</strong> <img src="${entidad.imageUrl}" alt="${entidad.name}" width="200"></p>`;
      }
      if (entidad.wikiUrl) {
        entidadHTML += `<p><strong>Wiki:</strong> <a href="${entidad.wikiUrl}" target="_blank">${entidad.name} en Wikipedia</a></p>`;
      }
  
      if (entidad.persons && entidad.persons.length > 0) {
        entidadHTML += `<h3>Personas:</h3>`;
        entidadHTML += `<ul>`;
        entidad.persons.forEach((personaID) => {
          entidadHTML += `<li>ID Persona: ${personaID}</li>`;
        });
        entidadHTML += `</ul>`;
      }
  
      if (entidad.products && entidad.products.length > 0) {
        entidadHTML += `<h3>Productos:</h3>`;
        entidadHTML += `<ul>`;
        entidad.products.forEach((productoID) => {
          entidadHTML += `<li>ID Producto: ${productoID}</li>`;
        });
        entidadHTML += `</ul>`;
      }
  
      const modal = document.getElementById('contenidoJSONEntidad');
      modal.innerHTML = entidadHTML;
      document.getElementById('modalJSONEntidad').style.display = 'block';
    } else {
      const modal = document.getElementById('contenidoJSONEntidad');
      modal.innerHTML = `<p>Entidad no encontrada con ID: ${id}</p>`;
      document.getElementById('modalJSONEntidad').style.display = 'block';
    }
  });
}

function cerrarmodalJSONEntidad() {
  const modal = document.getElementById('modalJSONEntidad');
  modal.style.display = 'none';
}

function mostrarProductos() {
  obtenerDatos('products').then(function(response) {
    console.log('Productos:', response); // Verifica la estructura de la respuesta
    const productos = response.products.map(p => p.product); // Ajusta según la estructura real
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';
    productos.forEach((producto) => {
      const elementoProducto = document.createElement('li');
      elementoProducto.innerHTML = `
        ${producto.id}. ${producto.name}
        <button class="botonNormal" onclick="mostrarJSONProducto(${producto.id})">Ver producto</button>
      `;
      listaProductos.appendChild(elementoProducto);
    });
  });
}

function mostrarJSONProducto(id) {
  obtenerDatos('products').then(function(response) {
    console.log('Productos:', response); // Verifica la estructura de la respuesta
    const productos = response.products.map(p => p.product); // Ajusta según la estructura real
    const producto = productos.find((e) => e.id == id);

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
        productoHTML += `<p><strong>Wiki:</strong> <a href="${producto.wikiUrl}" target="_blank">${producto.name} en Wikipedia</a></p>`;
      }
  
      if (producto.persons && producto.persons.length > 0) {
        productoHTML += `<h3>Personas:</h3>`;
        productoHTML += `<ul>`;
        producto.persons.forEach((personaID) => {
          productoHTML += `<li>ID Persona: ${personaID}</li>`;
        });
        productoHTML += `</ul>`;
      }
  
      if (producto.entities && producto.entities.length > 0) {
        productoHTML += `<h3>Entidades:</h3>`;
        productoHTML += `<ul>`;
        producto.entities.forEach((entidadID) => {
          productoHTML += `<li>ID Entidad: ${entidadID}</li>`;
        });
        productoHTML += `</ul>`;
      }
  
      const modal = document.getElementById('contenidoJSONProducto');
      modal.innerHTML = productoHTML;
      document.getElementById('modalJSONProducto').style.display = 'block';
    } else {
      const modal = document.getElementById('contenidoJSONProducto');
      modal.innerHTML = `<p>Producto no encontrado con ID: ${id}</p>`;
      document.getElementById('modalJSONProducto').style.display = 'block';
    }
  });
}

function cerrarmodalJSONProducto() {
  const modal = document.getElementById('modalJSONProducto');
  modal.style.display = 'none';
}

// Inicializar la página
$(document).ready(function() {
  mostrarPersonas();
  document.getElementById('cerrarJsonPersona').addEventListener('click', cerrarmodalJSONPersona);
  mostrarEntidades();
  document.getElementById('cerrarJsonEntidad').addEventListener('click', cerrarmodalJSONEntidad);
  mostrarProductos();
  document.getElementById('cerrarJsonProducto').addEventListener('click', cerrarmodalJSONProducto);
});


