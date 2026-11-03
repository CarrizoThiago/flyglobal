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

export const estadisticaaeropuertos = async (req, res) => {
    let muestro = 2;
    let destinospopulares = [], auxiliardestino = [], vuelosxmes = [], maximoxmes, promedioanual;
    let totalaeropuertos, aeropuertosxpais = [], aeropuertoxpaismax;
    let auxreg = [], auxcol = [], i = 0, auxsql, auxsql2;
    let aux1, aux2;

    try {
        auxsql = "SELECT * from aeropuerto;";
        let [iatareg, iatacol] = await bdd.query(auxsql);
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

        aux2 = 0;
        maximoxmes = 0;
        for (i = 0; i < 12; i++) {
            auxsql = "SELECT COUNT(*) AS total FROM vuelo WHERE (aeropuerto_codigoiata_destino = '" + destinospopulares[0][0] + "' OR aeropuerto_codigoiata_origen = '" + destinospopulares[0][0] + "') AND MONTH(fecha_salida) = " + (i + 1) + ";";
            [auxreg, auxcol] = await bdd.query(auxsql);
            vuelosxmes[i] = parseInt(auxreg[0].total);
            if (vuelosxmes[i] > maximoxmes) {
                maximoxmes = vuelosxmes[i];
            }
            aux2 += parseInt(auxreg[0].total);
        }
        promedioanual = aux2 / 12;

        auxsql = "SELECT COUNT(*) AS total FROM aeropuerto;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        totalaeropuertos = parseInt(auxreg[0].total);

        auxsql = "SELECT pais, COUNT(*) AS total FROM aeropuerto GROUP BY pais;";
        [aeropuertosxpais, auxcol] = await bdd.query(auxsql);
        aeropuertosxpais.sort((a, b) => b.total - a.total);
        aeropuertoxpaismax = parseInt(aeropuertosxpais[0].total);

        res.render("gestion/estadisticamenu", { muestro, destinospopulares, vuelosxmes, maximoxmes, promedioanual, totalaeropuertos, aeropuertosxpais, aeropuertoxpaismax });

    } catch (error) {
        console.error("Error general en estadistica:", error);
    }

}

export const estadisticaaviones = async (req, res) => {
    let muestro = 3;
    let avionespopulares = [], auxiliarvuelos = [], vuelosxmes = [], maximoxmes, promedioanual;
    let totalaviones, avionespormodelo = [], avionpormodelomax;
    let auxreg = [], auxcol = [], i = 0, auxsql, auxsql2;
    let aux1, aux2;

    try {
        auxsql = "SELECT * from avion;";
        let [avionreg, avioncol] = await bdd.query(auxsql);
        for (i = 0; i < avionreg.length; i++) {
            auxsql2 = "SELECT COUNT(idvuelo) AS total FROM vuelo WHERE avion_matricula = '" + avionreg[i].matricula + "';";
            [auxreg, auxcol] = await bdd.query(auxsql2);
            auxiliarvuelos[i] = parseInt(auxreg[0].total);
            avionreg[i].total = (auxiliarvuelos[i]);
        }
        avionreg.sort((a, b) => b.total - a.total);
        for (i = 0; i < 10; i++) {
            avionespopulares[i] = [avionreg[i].matricula, avionreg[i].modelo, avionreg[i].capacidad, parseInt(avionreg[i].total)];
        }
        aux2 = 0;
        for (i = avionreg.length - 1; i >= avionreg.length - 10; i--) {
            avionespopulares[10 + aux2] = [avionreg[i].matricula, avionreg[i].modelo, avionreg[i].capacidad, parseInt(avionreg[i].total)];
            aux2++;
        }

        aux2 = 0;
        maximoxmes = 0;
        for (i = 0; i < 12; i++) {
            auxsql = "SELECT COUNT(*) AS total FROM vuelo WHERE avion_matricula = '" + avionespopulares[0][0] + "' AND MONTH(fecha_salida) = " + (i + 1) + ";";
            [auxreg, auxcol] = await bdd.query(auxsql);
            vuelosxmes[i] = parseInt(auxreg[0].total);
            if (vuelosxmes[i] > maximoxmes) {
                maximoxmes = vuelosxmes[i];
            }
            aux2 += parseInt(auxreg[0].total);
        }
        if (maximoxmes == 0) {
            maximoxmes = 1;
        }
        promedioanual = aux2 / 12;

        auxsql = "SELECT COUNT(*) AS total FROM avion;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        totalaviones = parseInt(auxreg[0].total);

        auxsql = "SELECT modelo, COUNT(*) AS total FROM avion GROUP BY modelo;";
        [avionespormodelo, auxcol] = await bdd.query(auxsql);
        avionespormodelo.sort((a, b) => b.total - a.total);
        avionpormodelomax = parseInt(avionespormodelo[0].total);

        res.render("gestion/estadisticamenu", { muestro, avionespopulares, vuelosxmes, maximoxmes, promedioanual, totalaviones, avionespormodelo, avionpormodelomax });

    } catch (error) {
        console.error("Error general en estadistica:", error);
    }

}

export const estadisticavuelos = async (req, res) => {
    let auxsql, auxsql2, auxreg = [], auxcol = [], i = 0, auxiliarvuelos = [], aux1, aux2, muestro = 4;
    let vuelostotales, vuelosvigentes, vuelosnovigentes, vuelosaire;
    let vuelosxmes = [], promedioanual, maximoxmes = 0, topvuelos = [];
    let vuelospororigen = [], aeropuertomaxorigen;

    try {
        auxsql = "SELECT COUNT(*) AS total FROM vuelo;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelostotales = parseInt(auxreg[0].total);

        auxsql = "SELECT COUNT(*) AS total FROM vuelo WHERE fecha_salida >= NOW();";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelosvigentes = parseInt(auxreg[0].total);
        vuelosnovigentes = vuelostotales - vuelosvigentes;

        auxsql = "SELECT COUNT(*) AS total FROM vuelo WHERE fecha_salida <= NOW() AND fecha_llegada >= NOW();";
        [auxreg, auxcol] = await bdd.query(auxsql);
        vuelosaire = parseInt(auxreg[0].total);

        auxsql = "SELECT aeropuerto_codigoiata_origen, COUNT(*) AS total FROM vuelo GROUP BY aeropuerto_codigoiata_origen;";
        [vuelospororigen, auxcol] = await bdd.query(auxsql);
        vuelospororigen.sort((a, b) => b.total - a.total);
        if (vuelospororigen.length > 0) {
            aeropuertomaxorigen = parseInt(vuelospororigen[0].total);
        } else {
            aeropuertomaxorigen = 1;
        }

        auxsql = "SELECT * FROM vuelo;";
        let [vueloreg, vuelocol] = await bdd.query(auxsql);
        for (i = 0; i < vueloreg.length; i++) {
            auxsql2 = "SELECT COUNT(idreserva) AS total FROM reserva WHERE vuelo_idvuelo = " + vueloreg[i].idvuelo + ";";
            [auxreg, auxcol] = await bdd.query(auxsql2);
            auxiliarvuelos[i] = parseInt(auxreg[0].total);
            vueloreg[i].total = auxiliarvuelos[i];
        }
        vueloreg.sort((a, b) => b.total - a.total);

        for (i = 0; i < 10; i++) {
            topvuelos[i] = [vueloreg[i].idvuelo, vueloreg[i].numerovuelo, vueloreg[i].aeropuerto_codigoiata_origen, vueloreg[i].aeropuerto_codigoiata_destino, vueloreg[i].avion_matricula, parseInt(vueloreg[i].total)];
        }
        aux2 = 0;
        for (i = vueloreg.length - 1; i >= vueloreg.length - 10; i--) {
            topvuelos[10 + aux2] = [vueloreg[i].idvuelo, vueloreg[i].numerovuelo, vueloreg[i].aeropuerto_codigoiata_origen, vueloreg[i].aeropuerto_codigoiata_destino, vueloreg[i].avion_matricula, parseInt(vueloreg[i].total)];
            aux2++;
        }

        aux2 = 0;
        maximoxmes = 0;
        for (i = 0; i < 12; i++) {
            auxsql = "SELECT COUNT(*) AS total FROM vuelo WHERE MONTH(fecha_salida) = " + (i + 1) + ";";
            [auxreg, auxcol] = await bdd.query(auxsql);
            vuelosxmes[i] = parseInt(auxreg[0].total);
            if (vuelosxmes[i] > maximoxmes) {
                maximoxmes = vuelosxmes[i];
            }
            aux2 += parseInt(auxreg[0].total);
        }
        if (maximoxmes == 0) {
            maximoxmes = 1;
        }
        promedioanual = aux2 / 12;

        res.render("gestion/estadisticamenu", { muestro, topvuelos, vuelosxmes, maximoxmes, promedioanual, vuelostotales, vuelosvigentes, vuelosnovigentes, vuelosaire, vuelospororigen, aeropuertomaxorigen });

    } catch (error) {
        console.error("Error general en estadistica:", error);
    }
};

export const estadisticavuelo = estadisticavuelos;

export const estadisticausuarios = async (req, res) => {
    let auxsql, auxsql2, auxreg = [], auxcol = [], i = 0, aux1, aux2, muestro = 5;
    let usuariostotales, empleadosregistrados, clientesregistrados, usuariosconreserva, usuariossinreserva;
    let usuariospopulares = [], reservasxmes = [], maximoxmes = 0, promedioanual;

    try {
        auxsql = "SELECT COUNT(*) AS total FROM usuario;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        usuariostotales = parseInt(auxreg[0].total);

        auxsql = "SELECT COUNT(*) AS total FROM usuario WHERE contraseña != '' AND contraseña IS NOT NULL;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        empleadosregistrados = parseInt(auxreg[0].total);
        clientesregistrados = usuariostotales - empleadosregistrados;

        auxsql = "SELECT COUNT(DISTINCT usuario_idusuario) AS total FROM reserva;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        usuariosconreserva = parseInt(auxreg[0].total);
        usuariossinreserva = usuariostotales - usuariosconreserva;

        auxsql = "SELECT usuario.idusuario, usuario.pasaporte, usuario.nombre, usuario.apellido, usuario.email, COUNT(reserva.idreserva) AS total, COALESCE(SUM(reserva.costo), 0) AS totalgastado FROM usuario INNER JOIN reserva ON usuario.idusuario = reserva.usuario_idusuario GROUP BY usuario.idusuario, usuario.pasaporte, usuario.nombre, usuario.apellido, usuario.email ORDER BY total DESC;";
        let [userreg, usercol] = await bdd.query(auxsql);

        for (i = 0; i < 10; i++) {
            usuariospopulares[i] = [userreg[i].idusuario, userreg[i].pasaporte, userreg[i].nombre + " " + userreg[i].apellido, userreg[i].email, parseInt(userreg[i].total), parseInt(userreg[i].totalgastado)];
        }
        aux2 = 0;
        for (i = userreg.length - 1; i >= userreg.length - 10; i--) {
            usuariospopulares[10 + aux2] = [userreg[i].idusuario, userreg[i].pasaporte, userreg[i].nombre + " " + userreg[i].apellido, userreg[i].email, parseInt(userreg[i].total), parseInt(userreg[i].totalgastado)];
            aux2++;
        }

        aux2 = 0;
        maximoxmes = 0;
        for (i = 0; i < 12; i++) {
            auxsql = "SELECT COUNT(*) AS total FROM reserva WHERE usuario_idusuario = " + usuariospopulares[0][0] + " AND MONTH(fecha) = " + (i + 1) + ";";
            [auxreg, auxcol] = await bdd.query(auxsql);
            reservasxmes[i] = parseInt(auxreg[0].total);
            if (reservasxmes[i] > maximoxmes) {
                maximoxmes = reservasxmes[i];
            }
            aux2 += parseInt(auxreg[0].total);
        }
        if (maximoxmes == 0) {
            maximoxmes = 1;
        }
        promedioanual = aux2 / 12;

        res.render("gestion/estadisticamenu", { muestro, usuariospopulares, reservasxmes, maximoxmes, promedioanual, usuariostotales, empleadosregistrados, clientesregistrados, usuariosconreserva, usuariossinreserva });

    } catch (error) {
        console.error("Error general en estadistica:", error);
    }
};

export const estadisticareservas = async (req, res) => {
    let auxsql, auxsql2, auxreg = [], auxcol = [], i = 0, aux1, aux2, muestro = 6;
    let reservastotales, ingresostotales = 0, gastopromedioreserva = 0;
    let reservasvigentes, reservasnovigentes;
    let reservasnacionales, reservasinternacionales;
    let reservaspopulares = [], reservasxmes = [], maximoxmes = 0, promedioanual;

    try {
        auxsql = "SELECT COUNT(*) AS total FROM reserva;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        reservastotales = parseInt(auxreg[0].total);

        auxsql = "SELECT costo FROM reserva;";
        [auxreg, auxcol] = await bdd.query(auxsql);
        for (i = 0; i < auxreg.length; i++) {
            ingresostotales += parseInt(auxreg[i].costo);
        }
        if (reservastotales > 0) {
            gastopromedioreserva = Math.round(ingresostotales / reservastotales);
        } else {
            gastopromedioreserva = 0;
        }

        auxsql = "SELECT COUNT(*) AS total FROM reserva INNER JOIN vuelo ON reserva.vuelo_idvuelo = vuelo.idvuelo WHERE vuelo.fecha_salida >= NOW();";
        [auxreg, auxcol] = await bdd.query(auxsql);
        reservasvigentes = parseInt(auxreg[0].total);
        reservasnovigentes = reservastotales - reservasvigentes;

        auxsql = "SELECT COUNT(*) AS total FROM reserva INNER JOIN vuelo ON reserva.vuelo_idvuelo = vuelo.idvuelo INNER JOIN aeropuerto aer1 ON vuelo.aeropuerto_codigoiata_origen = aer1.codigoiata INNER JOIN aeropuerto aer2 ON vuelo.aeropuerto_codigoiata_destino = aer2.codigoiata WHERE aer1.pais = 'ARGENTINA' AND aer2.pais = 'ARGENTINA';";
        [auxreg, auxcol] = await bdd.query(auxsql);
        reservasnacionales = parseInt(auxreg[0].total);
        reservasinternacionales = reservastotales - reservasnacionales;

        auxsql = "SELECT * FROM vuelo;";
        let [vueloreg, vuelocol] = await bdd.query(auxsql);
        for (i = 0; i < vueloreg.length; i++) {
            auxsql2 = "SELECT COUNT(idreserva) AS total, COALESCE(SUM(costo), 0) AS totalrecaudado FROM reserva WHERE vuelo_idvuelo = " + vueloreg[i].idvuelo + ";";
            [auxreg, auxcol] = await bdd.query(auxsql2);
            vueloreg[i].totalreservas = parseInt(auxreg[0].total);
            vueloreg[i].totalrecaudado = parseInt(auxreg[0].totalrecaudado);
        }
        vueloreg.sort((a, b) => b.totalrecaudado - a.totalrecaudado);

        for (i = 0; i < 10; i++) {
            reservaspopulares[i] = [vueloreg[i].idvuelo, vueloreg[i].numerovuelo, vueloreg[i].aeropuerto_codigoiata_origen, vueloreg[i].aeropuerto_codigoiata_destino, parseInt(vueloreg[i].totalreservas), parseInt(vueloreg[i].totalrecaudado)];
        }
        aux2 = 0;
        for (i = vueloreg.length - 1; i >= vueloreg.length - 10; i--) {
            reservaspopulares[10 + aux2] = [vueloreg[i].idvuelo, vueloreg[i].numerovuelo, vueloreg[i].aeropuerto_codigoiata_origen, vueloreg[i].aeropuerto_codigoiata_destino, parseInt(vueloreg[i].totalreservas), parseInt(vueloreg[i].totalrecaudado)];
            aux2++;
        }

        aux2 = 0;
        maximoxmes = 0;
        for (i = 0; i < 12; i++) {
            auxsql = "SELECT COUNT(*) AS total FROM reserva WHERE MONTH(fecha) = " + (i + 1) + ";";
            [auxreg, auxcol] = await bdd.query(auxsql);
            reservasxmes[i] = parseInt(auxreg[0].total);
            if (reservasxmes[i] > maximoxmes) {
                maximoxmes = reservasxmes[i];
            }
            aux2 += parseInt(auxreg[0].total);
        }
        if (maximoxmes == 0) {
            maximoxmes = 1;
        }
        promedioanual = aux2 / 12;

        res.render("gestion/estadisticamenu", { muestro, reservaspopulares, reservasxmes, maximoxmes, promedioanual, reservastotales, ingresostotales, gastopromedioreserva, reservasvigentes, reservasnovigentes, reservasnacionales, reservasinternacionales });

    } catch (error) {
        console.error("Error general en estadistica:", error);
    }
};