import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const estadisticamenu = (req, res) => {
    let muestro = 0;
    res.render("gestion/estadisticamenu", { muestro });
}

export const estadisticageneral = async (req, res) => {
    let muestro = 1;
    let auxsql, auxreg = [], auxcol = [];
    let vuelostotales, vuelosvigentes, vuelosnovigentes, pasajerostotales, ocupacionmedia, capacidadpasajeros;
    let usuariosregistrados, topusuarios = [];
    let destinospopulares = [], destinosinpopulares = [];
    let reservastotales, gastopromedio;
    let topaviones = [], flotatotal, topmodelos = [];
    let ingresosbrutos, empleadosregistrados;

    let aux1, aux2, aux3;

    try {
        auxsql = "SELECT  COUNT(*) AS total FROM vuelos";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelostotales = auxreg[0].total;

        auxsql = "SELECT  COUNT(*) AS total FROM vuelos WHERE fecha_salida >= NOW()";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelosvigentes = auxreg[0].total;
        vuelosnovigentes = vuelostotales - vuelosvigentes;

        auxsql = "SELECT vuelo.*, avion.capacidad FROM vuelo INNER JOIN avion ON vuelo.avion_matricula = avion.matricula WHERE fecha_salida < NOW() "
        [auxreg, auxcol] = await bdd.query(auxsql);
        for (i = 0; i < auxreg.length; i++) {
            if (i == 0) {
                aux1 = auxreg[i].idvuelo;
                capacidadpasajeros = parseInt(auxreg[i].capacidad)
            } else {
                if (auxreg[i].avion_matricula == aux1) {
                    aux1 = aux1 + ", " + auxreg[i].idvuelo;
                    capacidadpasajeros = capacidadpasajeros + parseInt(auxreg[i].capacidad);
                }
            }
        }
        auxsql = "SELECT  COUNT(*) AS total FROM reserva WHERE vuelo_idvuelo IN ( " + aux1 + ");";
        [auxreg, auxcol] = await bdd.query(auxsql);
        pasajerostotales = parseInt(auxreg[0].total);
        ocupacionmedia = (pasajerostotales / capacidadpasajeros) * 100;

    } catch (error) {
        console.error("Error general en estadistica:", error);
        res.status(500).send("Error en el servidor");
    }



    res.render("gestion/estadisticamenu", { muestro });
}