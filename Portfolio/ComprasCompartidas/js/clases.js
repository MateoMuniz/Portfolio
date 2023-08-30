class Persona {
    constructor(nombre, seccion, email) {
        this.nombre = nombre;
        this.seccion = seccion;
        this.email = email;
    }

    toString() {
        return this.nombre + " -Sección: " + this.seccion + "-" + this.email;
    }
}

class Sistema {
    constructor() {
        this.tablaCompras = [];
        this.listaDePersonas = [];
    }

    cantidadGrafica() {
        let cantidades = [];
        let masCaro = 0;
        for (let i of this.tablaCompras) {
            if (i.monto > masCaro) {
                masCaro = i.monto;
            }
        }

        for (let k = 0; k <= Math.trunc(masCaro / 100); k++) {
            cantidades.push(0);
        }
        for (let j of this.tablaCompras) {
            let pos = Math.trunc(j.monto / 100);
            cantidades[pos] = cantidades[pos] + 1;
        }
        return cantidades;
    }

    agregarPersona(persona) {
        this.listaDePersonas.push(persona);
    }

    darPersona() {
        return this.listaDePersonas;
    }

    agregarCompra(compra) {
        this.tablaCompras.push(compra);
    }

    darCompra() {
        return this.tablaCompras;
    }

    darCompraxNombre() {
        return this.tablaCompras.sort(function (a, b) {
            return a.responsable.localeCompare(b.responsable);
        });
    }
    darCompraxNumero() {
        return this.tablaCompras.sort(function (a, b) {
            return a.numero - b.numero;
        });
    }

    reintegrarNumero(numero) {
        for (i of this.tablaCompras) {
            if (i.numero == numero) {
                i.estado = "Reintegrado";
            }
        }
    }

    nombreRepetido(nombre) {
        let repe = false;

        for (let i = 0; i < this.listaDePersonas.length; i++) {
            if (this.listaDePersonas[i].nombre === nombre) {
                repe = true;
            }
        }

        return repe;
    }
}

class Compra {
    constructor(numero, responsable, descripcion, monto, participantes, cantidadParticipantes) {
        this.numero = numero;
        this.responsable = responsable;
        this.descripcion = descripcion;
        this.monto = monto;
        this.participantes = participantes;
        this.cantidadParticipantes = cantidadParticipantes;
        this.estado = "Pendiente";
    }
}
