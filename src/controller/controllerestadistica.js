import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const estadisticamenu = (req, res) => {
    let muestro = 0;
    res.render("gestion/estadisticamenu", { muestro });
}

export const estadisticageneral = async (req, res) => {
    let muestro = 1;
    let auxsql, auxsql2, auxreg = [], auxcol = [];
    let vuelostotales, vuelosvigentes, vuelosnovigentes, pasajerostotales, ocupacionmedia, capacidadpasajeros;
    let usuariosregistrados;
    let destinospopulares = [], auxiliardestino = [];
    let reservastotales, gastopromediousuario, reservaspromedio, gastopromedioreserva;
    let flotatotal;
    let ingresosbrutos, empleadosregistrados;

    let aux1, aux2, aux3;
    let i = 0;

    try {
        auxsql = "SELECT COUNT(*) AS total FROM avion";
        [auxreg, auxcol] = await bdd.query(auxsql);
        flotatotal = parseInt(auxreg[0].total);


        auxsql = "SELECT  COUNT(*) AS total FROM vuelo";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelostotales = auxreg[0].total;

        auxsql = "SELECT  COUNT(*) AS total FROM vuelo WHERE fecha_salida >= NOW()";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelosvigentes = auxreg[0].total;
        vuelosnovigentes = vuelostotales - vuelosvigentes;

        auxsql = "SELECT vuelo.*, avion.capacidad FROM vuelo INNER JOIN avion ON vuelo.avion_matricula = avion.matricula WHERE fecha_salida < NOW() ";
        [auxreg, auxcol] = await bdd.query(auxsql);
        for (i = 0; i < auxreg.length; i++) {
            if (i == 0) {
                aux1 = auxreg[i].idvuelo;
                capacidadpasajeros = parseInt(auxreg[i].capacidad)
            } else {
                aux1 = aux1 + ", " + auxreg[i].idvuelo;
                capacidadpasajeros = capacidadpasajeros + parseInt(auxreg[i].capacidad);
            }
        }
        if (aux1 == null) { } else {
            auxsql = "SELECT  COUNT(*) AS total FROM reserva WHERE vuelo_idvuelo IN ( " + aux1 + ");";
            [auxreg, auxcol] = await bdd.query(auxsql);
            pasajerostotales = parseInt(auxreg[0].total);
            ocupacionmedia = (pasajerostotales / capacidadpasajeros) * 100;
        }

        auxsql = "SELECT  COUNT(*) AS total FROM usuario";
        [auxreg, auxcol] = await bdd.query(auxsql);
        usuariosregistrados = parseInt(auxreg[0].total);

        auxsql = "SELECT  COUNT(*) AS total FROM reserva";
        [auxreg, auxcol] = await bdd.query(auxsql);
        reservastotales = parseInt(auxreg[0].total);

        auxsql = "SELECT costo from reserva";
        [auxreg, auxcol] = await bdd.query(auxsql);
        ingresosbrutos = 0;
        for (i = 0; i < auxreg.length; i++) {
            ingresosbrutos += parseInt(auxreg[i].costo);
        }
        gastopromedioreserva = ingresosbrutos / reservastotales;
        reservaspromedio = reservastotales / usuariosregistrados;
        gastopromediousuario = ingresosbrutos / usuariosregistrados;

        auxsql = "SELECT COUNT(*) AS total FROM usuario WHERE contraseña != '' AND contraseña IS NOT NULL ;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        empleadosregistrados = parseInt(auxreg[0].total);

        auxsql = "SELECT * from aeropuerto;";
        const [iatareg, iatacol] = await bdd.query(auxsql);
        for (i = 0; i < iatareg.length; i++) {
            auxsql2 = "SELECT COUNT(idreserva) AS total FROM vuelo INNER JOIN reserva ON idvuelo = vuelo_idvuelo where aeropuerto_codigoiata_destino = '" + iatareg[i].codigoiata + "';";
            [auxreg, auxcol] = await bdd.query(auxsql2);
            auxiliardestino[i] = parseInt(auxreg[0].total);
            iatareg[i].total = (auxiliardestino[i]);
        }
        iatareg.sort((a, b) => b.total - a.total);
        for (i = 0; i < 10; i++) {
            destinospopulares[i] = [iatareg[i].codigoiata, iatareg[i].nombre, iatareg[i].ciudad, iatareg[i].pais, parseInt(iatareg[i].total)];
        }
        aux2 = 0;
        for (i = iatareg.length - 1; i >= iatareg.length - 10; i--) {
            destinospopulares[10 + aux2] = [iatareg[i].codigoiata, iatareg[i].nombre, iatareg[i].ciudad, iatareg[i].pais, parseInt(iatareg[i].total)];
            aux2++;

        }


    } catch (error) {
        console.error("Error general en estadistica:", error);
    }



    res.render("gestion/estadisticamenu", { muestro, destinospopulares, vuelostotales, vuelosvigentes, vuelosnovigentes, pasajerostotales, ocupacionmedia, capacidadpasajeros, usuariosregistrados, reservastotales, ingresosbrutos, gastopromedioreserva, reservaspromedio, gastopromediousuario, empleadosregistrados, flotatotal });
}