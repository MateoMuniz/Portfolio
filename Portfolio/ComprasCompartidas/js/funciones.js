window.addEventListener("load", inicio);

let empleados = new Sistema();
let tablaCompras = new Sistema();

function inicio() {
    mostrarPersonas();
    google.charts.load("current", { packages: ["corechart"] });
    document.getElementById("irPersonas").addEventListener("click", mostrarPersonas);
    document.getElementById("irCompras").addEventListener("click", mostrarCompras);
    document.getElementById("irConsultas").addEventListener("click", mostrarConsultas);
    document.getElementById("agregarPersonas").addEventListener("click", personaNueva);
    document.getElementById("agregarCompra").addEventListener("click", agregarCompra);
    document.getElementById("botonReintegro").addEventListener("click", reintegrar);
    document.getElementById("nombre2").addEventListener("click", mostrarTabla);
    document.getElementById("number").addEventListener("click", mostrarTabla);
    document.getElementById("botonConsultas").addEventListener("click", calcularConsulta);
    document.getElementById("botonGrafica").addEventListener("click", graficar);
    document.getElementById("botonBuscar").addEventListener("click", buscarPalabra);
}
function graficar() {
    let rangos = ["0-99"];
    let largo = tablaCompras.cantidadGrafica().length;
    for (let i = 1; i < largo; i++) {
        let ingresar = i + "00" + "-" + i + "99";
        rangos.push(ingresar);
    }
    let cantidad = tablaCompras.cantidadGrafica();

    drawChart(rangos, cantidad);
}
function drawChart(rangos, cantidad) {
    datosGrafica = [];
    for (i = 0; i < cantidad.length; i++) {
        let array = [rangos[i], cantidad[i]];
        datosGrafica.push(array);
    }
    let data = new google.visualization.DataTable();
    data.addColumn("string", "Rango");
    data.addColumn("number", "Cantidad");
    for (i = 0; i < cantidad.length; i++) {
        data.addRows([datosGrafica[i]]);
    }
    let options = {
        title: "Rangos",
        height: "500px",
        width: "400px",
    };

    let chart = new google.visualization.ColumnChart(document.getElementById("grafica"));
    chart.draw(data, options);
}

function buscarPalabra() {
    if (document.getElementById("formularioConsultas").reportValidity()) {
        let resultado = false;
        let lista = document.getElementById("listaDescripcion");
        lista.innerHTML = "";
        let palabra = document.getElementById("buscar").value;
        for (i of tablaCompras.darCompra()) {
            if (i.descripcion.includes(palabra)) {
                let resultadoTitulo = document.getElementById("resultadoBusca");
                resultadoTitulo.innerHTML = "";
                let titulo = document.createElement("h4");
                titulo.innerHTML = "Resultado (se muestra primera coincidencia)";
                resultadoTitulo.appendChild(titulo);
                let posicionPalabra = i.descripcion.indexOf(palabra);
                let descripcionParte1 = i.descripcion.substring(0, posicionPalabra);
                let descripcionParte2 = i.descripcion.substring(posicionPalabra + palabra.length);
                let nodo = document.createElement("li");
                nodo.innerHTML = "Compra " + i.numero + " " + descripcionParte1 + `<span class="resaltar"` /* usamos `` estas comillas para poder cerrar el string*/ + ">" + palabra + "</span>" + descripcionParte2;
                lista.appendChild(nodo);
                resultado = true;
            }
            if (!resultado) {
                let resultadoTitulo = document.getElementById("resultadoBusca");
                resultadoTitulo.innerHTML = "";
                let titulo = document.createElement("h4");
                titulo.innerHTML = "No hubo resultados";
                resultadoTitulo.appendChild(titulo);
            }
        }
    }
}

function mostrarInfoConsultas(precioResponsable, precioParticipante) {
    let info1 = document.getElementById("consultaResp");
    let info2 = document.getElementById("consultaPart");
    info1.innerHTML = "";
    info2.innerHTML = "";
    let nodoResp = document.createElement("span");
    let nodoRespTexto = document.createTextNode("Participó en total por $" + precioParticipante);
    nodoResp.appendChild(nodoRespTexto);
    let nodoPart = document.createElement("span");
    let nodoPartTexto = document.createTextNode("Responsable de compras por $" + precioResponsable);
    nodoPart.appendChild(nodoPartTexto);
    info1.appendChild(nodoResp);
    info2.appendChild(nodoPart);
}

function calcularConsulta() {
    let consultado = document.getElementById("ListaPersonasConsultas").value;
    let precioResp = 0;
    let precioPart = 0;
    for (i of tablaCompras.darCompra()) {
        if (i.responsable.includes(consultado) && i.estado == "Pendiente") {
            precioResp = precioResp + i.monto;
        }
        if (i.participantes.includes(consultado) && i.estado == "Pendiente") {
            precioPart = precioPart + i.monto / i.cantidadParticipantes;
        }
    }
    mostrarInfoConsultas(precioResp, precioPart);
}

function agregarComboReintegro() {
    let combo = document.getElementById("comboReintegros");
    combo.innerHTML = "";
    for (let i of tablaCompras.darCompraxNumero()) {
        if (i.estado === "Pendiente") {
            let nodo = document.createElement("option");
            nodo.setAttribute("value", i.numero);
            let nodoTexto = document.createTextNode(i.numero);
            nodo.appendChild(nodoTexto);
            combo.appendChild(nodo);
        }
    }
}

function agregarComboConsultas() {
    let combo = document.getElementById("ListaPersonasConsultas");
    combo.innerHTML = "";
    for (let i of empleados.darPersona()) {
        let nodo = document.createElement("option");
        nodo.setAttribute("value", i.nombre);
        let nodoTexto = document.createTextNode(i.nombre);
        nodo.appendChild(nodoTexto);
        combo.appendChild(nodo);
    }
}

function reintegrar() {
    let numero = document.getElementById("comboReintegros").value;
    tablaCompras.reintegrarNumero(numero);
    mostrarTabla();
    agregarComboReintegro();
}

function agregarComboCompras() {
    let combo = document.getElementById("listaPersonasCompras");
    combo.innerHTML = "";
    for (let i of empleados.darPersona()) {
        let nodo = document.createElement("option");
        let nodoTexto = document.createTextNode(i.nombre);
        nodo.appendChild(nodoTexto);
        combo.appendChild(nodo);
    }
}

function agregarCompra() {
    if (document.getElementById("formularioCompras").reportValidity()) {
        let numero = tablaCompras.darCompra().length + 1;
        let nombreComprador = document.getElementById("listaPersonasCompras").value;
        let descripcion = document.getElementById("descripcion").value;
        let monto = parseInt(document.getElementById("monto").value);
        let seleccionados = document.getElementsByName("participante");
        let listaParticipantes = [];
        for (let i of seleccionados) {
            if (i.checked) {
                listaParticipantes.push(i.value);
            }
        }
        if (listaParticipantes.length == 0) {
            alert("Seleccione algún participante");
        } else {
            let cantidadParticipantes = listaParticipantes.length;
            let participantesTabla = "";
            for (let j = 0; j < listaParticipantes.length; j++) {
                if (j == listaParticipantes.length - 1) {
                    participantesTabla = participantesTabla + listaParticipantes[j];
                } else {
                    participantesTabla = participantesTabla + listaParticipantes[j] + ",";
                }
            }
            for (let c = 0; c < seleccionados.length; c++) {
                seleccionados[c].checked = 0;
            }
            document.getElementById("descripcion").value = "";
            document.getElementById("monto").value = "";

            let compra = new Compra(numero, nombreComprador, descripcion, monto, participantesTabla, cantidadParticipantes);
            tablaCompras.agregarCompra(compra);

            mostrarTabla();
            agregarComboReintegro();
        }
    }
}

function personaNueva() {
    if (document.getElementById("formularioPersonas").reportValidity()) {
        let nombre = document.getElementById("nombre1").value;
        let seccion = document.getElementById("seccion").value;
        let email = document.getElementById("email").value;

        document.getElementById("nombre1").value = "";
        document.getElementById("seccion").value = "";
        document.getElementById("email").value = "";

        if (!empleados.nombreRepetido(nombre)) {
            let persona = new Persona(nombre, seccion, email);

            agregarCheckboxes(persona);
            empleados.agregarPersona(persona);
            agregarComboCompras();
            agregarComboConsultas();

            cargarVis();
        } else {
            alert("No puede ingresar dos personas con el mismo nombre.");
        }
    }
}

function cargarVis() {
    let lista = document.getElementById("listaPersonas");
    lista.innerHTML = "";
    let persona = empleados.darPersona();
    for (let elemento of persona) {
        let nodo = document.createElement("li");
        let nodoTexto = document.createTextNode(elemento);
        nodo.appendChild(nodoTexto);
        lista.appendChild(nodo);
    }
}

function mostrarTabla() {
    let tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    let encabezado = tabla.createTHead();
    let fila = encabezado.insertRow();
    let celda1 = fila.insertCell();
    celda1.innerHTML = "NÚMERO";
    let celda2 = fila.insertCell();
    celda2.innerHTML = "RESPONSABLE";
    let celda3 = fila.insertCell();
    celda3.innerHTML = "DESCRIPCIÓN";
    let celda4 = fila.insertCell();
    celda4.innerHTML = "MONTÓN";
    let celda5 = fila.insertCell();
    celda5.innerHTML = "PARTICIPANTE";
    let celda6 = fila.insertCell();
    celda6.innerHTML = "ESTADO";
    if (document.getElementById("number").checked) {
        for (i of tablaCompras.darCompraxNumero()) {
            fila = tabla.insertRow();
            celda1 = fila.insertCell();
            celda1.innerHTML = i.numero;
            celda2 = fila.insertCell();
            celda2.innerHTML = i.responsable;
            celda3 = fila.insertCell();
            celda3.innerHTML = i.descripcion;
            celda4 = fila.insertCell();
            celda4.innerHTML = i.monto;
            celda5 = fila.insertCell();
            celda5.innerHTML = i.participantes;
            celda6 = fila.insertCell();
            celda6.innerHTML = i.estado;
        }
    } else {
        for (i of tablaCompras.darCompraxNombre()) {
            fila = tabla.insertRow();
            celda1 = fila.insertCell();
            celda1.innerHTML = i.numero;
            celda2 = fila.insertCell();
            celda2.innerHTML = i.responsable;
            celda3 = fila.insertCell();
            celda3.innerHTML = i.descripcion;
            celda4 = fila.insertCell();
            celda4.innerHTML = i.monto;
            celda5 = fila.insertCell();
            celda5.innerHTML = i.participantes;
            celda6 = fila.insertCell();
            celda6.innerHTML = i.estado;
        }
    }
}

function agregarCheckboxes(persona) {
    document.getElementById("checkboxes").required = true; //pongo el required después de crear los checkboxes
    let nodo = document.createElement("input"); //porque sino, el validador W3C me dice que el div no puede tener
    nodo.setAttribute("type", "checkbox"); //el atributo "required".
    nodo.setAttribute("name", "participante");
    nodo.setAttribute("value", persona.nombre);
    document.getElementById("checkboxes").appendChild(nodo);
    let nombre = document.createElement("span");
    nombre.innerHTML = persona.nombre;
    document.getElementById("checkboxes").appendChild(nombre);
    let espacio = document.createElement("br");
    espacio.innerHTML = "";
    document.getElementById("checkboxes").appendChild(espacio);
}

function mostrarPersonas() {
    let seccionPersonas = document.getElementById("seccionPersonas");
    seccionPersonas.style.display = "block";
    let seccionCompras = document.getElementById("seccionCompras");
    seccionCompras.style.display = "none";
    let seccionConsultas = document.getElementById("seccionConsultas");
    seccionConsultas.style.display = "none";
}

function mostrarCompras() {
    let seccionPersonas = document.getElementById("seccionPersonas");
    seccionPersonas.style.display = "none";
    let seccionCompras = document.getElementById("seccionCompras");
    seccionCompras.style.display = "block";
    let seccionConsultas = document.getElementById("seccionConsultas");
    seccionConsultas.style.display = "none";
}

function mostrarConsultas() {
    let seccionPersonas = document.getElementById("seccionPersonas");
    seccionPersonas.style.display = "none";
    let seccionCompras = document.getElementById("seccionCompras");
    seccionCompras.style.display = "none";
    let seccionConsultas = document.getElementById("seccionConsultas");
    seccionConsultas.style.display = "block";
}
