import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const vuelomenu = async (req, res) => {
    res.render('vuelo/vuelomenu')
}

export const vuelover = async (req, res) => {
    let muestro = false;
    res.render('vuelo/vuelovertodo', { muestro });
}

export const vuelovertodo = async (req, res) => {
    let auxsql = "SELECT * FROM ruiz_bd.vuelo;";

    let registros = [], col = [], muestro = true;

    try {
        [registros, col] = await bdd.query(auxsql);
        console.log(registros);
        res.render('vuelo/vuelovertodo', { muestro, registros });

    } catch (error) {
        console.log(error);
        let registros = null;
        res.render('vuelo/vuelovertodo', { muestro, registros });
    }
}

export const vuelovervigente = async (req, res) => {
    let auxsql = "SELECT * FROM ruiz_bd.vuelo where fecha_salida >= now();";

    let registros = [], col = [], muestro = true;

    try {
        [registros, col] = await bdd.query(auxsql);
        console.log(registros);
        res.render('vuelo/vuelovertodo', { muestro, registros });

    } catch (error) {
        console.log(error);
        let registros = null;
        res.render('vuelo/vuelovertodo', { muestro, registros });
    }
}

export const vuelobusqueda = async (req, res) => {
    let muestro = false;
    res.render('vuelo/vuelobusqueda', { muestro });
}

export const vuelosearch = async (req, res) => {
    let auxsql, muestro = true, err = false, registros = [], registros2 = [], col = [], col2 = [], id;
    try {
        id = req.body.idhtml || "";
        if (!id || !/^[0-9]+$/.test(id)) {
            res.render('vuelo/vuelobusqueda', { muestro, err: false, registros: [], registros2: [] });
            return;
        }
        auxsql = "SELECT * FROM vuelo WHERE idvuelo = " + id + ";";
        [registros, col] = await bdd.query(auxsql);
        if (registros.length == 0 || registros[0].idvuelo == null) {
        } else {
            let ressql = "SELECT * FROM ruiz_bd.reserva where vuelo_idvuelo = " + id + ";";
            [registros2, col2] = await bdd.query(ressql);
        }

        res.render('vuelo/vuelobusqueda', { muestro, err, registros, registros2 });
    } catch (error) {
        err = true;
        res.render('vuelo/vuelobusqueda', { muestro, err, registros: [], registros2: [] });
    }

}

export const vueloalta = async (req, res) => {
    let muestro = false, subido = false;
    res.render('vuelo/vueloalta', { muestro, subido });
}

export const vuelonuevo = async (req, res) => {
    let idvuelo, numerovuelo, iataorigen, iatadestino, fechasalida, fechallegada, matricula;
    let muestro = true, subido = false, err = false;
    let consigna = 0;
    let conid = true, connum = true, coniataorigen = true, coniatadestino = true;
    let confechasalida = true, confechallegada = true, conmatricula = true;

    idvuelo = req.body.idhtml;
    numerovuelo = req.body.numerovuelohtml;
    if (req.body.iataorigenhtml) {
        iataorigen = req.body.iataorigenhtml.toUpperCase();
    } else {
        iataorigen = "";
    }
    if (req.body.iatadestinohtml) {
        iatadestino = req.body.iatadestinohtml.toUpperCase();
    } else {
        iatadestino = "";
    }
    fechasalida = req.body.fechasalidahtml;
    fechallegada = req.body.fechallegadahtml;
    if (req.body.matriculahtml) {
        matricula = req.body.matriculahtml.toUpperCase();
    } else {
        matricula = "";
    }

    conid = /^[0-9]{1,10}$/.test(idvuelo);
    if (conid == false) { consigna++; }

    connum = /^[0-9]{1,10}$/.test(numerovuelo);
    if (connum == false) { consigna++; }

    if (/^[A-Za-z]{3}$/.test(iataorigen)) {
        try {
            const [regOri] = await bdd.query("SELECT codigoiata FROM aeropuerto WHERE codigoiata = '" + iataorigen + "';");
            if (regOri.length == 0) {
                coniataorigen = false;
                consigna++;
            }
        } catch (e) {
            coniataorigen = false;
            consigna++;
        }
    } else {
        coniataorigen = false;
        consigna++;
    }

    if (/^[A-Za-z]{3}$/.test(iatadestino)) {
        try {
            const [regDes] = await bdd.query("SELECT codigoiata FROM aeropuerto WHERE codigoiata = '" + iatadestino + "';");
            if (regDes.length == 0) {
                coniatadestino = false;
                consigna++;
            }
        } catch (e) {
            coniatadestino = false;
            consigna++;
        }
    } else {
        coniatadestino = false;
        consigna++;
    }

    if (/^[a-zA-Z0-9-]{1,10}$/.test(matricula)) {
        try {
            const [regMat] = await bdd.query("SELECT matricula FROM avion WHERE matricula = '" + matricula + "';");
            if (regMat.length == 0) {
                conmatricula = false;
                consigna++;
            }
        } catch (e) {
            conmatricula = false;
            consigna++;
        }
    } else {
        conmatricula = false;
        consigna++;
    }

    confechasalida = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(fechasalida) && !isNaN(Date.parse(fechasalida));
    if (confechasalida == false) { consigna++; }

    confechallegada = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(fechallegada) && !isNaN(Date.parse(fechallegada));
    if (confechallegada == false) { consigna++; }

    try {
        if (consigna == 0) {
            let auxsql = "INSERT INTO `ruiz_bd`.`vuelo`(`idvuelo`,`numerovuelo`,`aeropuerto_codigoiata_origen`,`aeropuerto_codigoiata_destino`,`fecha_salida`,`fecha_llegada`,`avion_matricula`)VALUES('" + idvuelo + "','" + numerovuelo + "','" + iataorigen + "','" + iatadestino + "','" + fechasalida + "','" + fechallegada + "','" + matricula + "');";
            await bdd.query(auxsql);
            subido = true;
            res.render('vuelo/vueloalta', { muestro, subido, err, idvuelo, numerovuelo, iataorigen, iatadestino, fechasalida, fechallegada, matricula });
        } else {
            subido = false;
            res.render('vuelo/vueloalta', { muestro, subido, err, conid, connum, coniataorigen, coniatadestino, confechasalida, confechallegada, conmatricula, idvuelo, numerovuelo, iataorigen, iatadestino, fechasalida, fechallegada, matricula });
        }
    } catch (error) {
        console.log(error);
        subido = false;
        err = true;
        res.render('vuelo/vueloalta', { muestro, subido, err, conid, connum, coniataorigen, coniatadestino, confechasalida, confechallegada, conmatricula, idvuelo, numerovuelo, iataorigen, iatadestino, fechasalida, fechallegada, matricula });
    }
}

export const vuelobaja = async (req, res) => {
    let muestro = false, err = false;
    res.render('vuelo/vuelobaja', { muestro, err });
}

export const vuelodelete = async (req, res) => {
    let muestro = true, exito = false, err = false;
    let id = req.body.idhtml;
    try {
        let auxsql = "SELECT * FROM vuelo WHERE idvuelo = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        if (registros.length == 0 || registros[0].idvuelo == null) {
            exito = false;
            res.render('vuelo/vuelobaja', { muestro, exito, err, id });
        } else {
            exito = true;
            auxsql = "DELETE FROM vuelo WHERE idvuelo = '" + id + "';";
            await bdd.query(auxsql);
            res.render('vuelo/vuelobaja', { muestro, exito, registros, err, id });
        }
    } catch (error) {
        console.log(error);
        exito = false;
        err = true;
        res.render('vuelo/vuelobaja', { muestro, exito, err, id });
    }
}

export const vuelomodificaciones = async (req, res) => {
    let muestro = false, muestro2 = false, cambiado = false;
    res.render('vuelo/vuelomodificaciones', { muestro, muestro2, cambiado });
}

export const vuelomodificacionagarre = async (req, res) => {
    let muestro = true, muestro2 = false, cambiado = false;
    let id;
    id = req.body.idhtml;
    try {
        let auxsql = "SELECT * FROM vuelo WHERE idvuelo = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        let encontrado = true;
        if (registros.length == 0) {
            encontrado = false;
        }
        res.render('vuelo/vuelomodificaciones', { muestro, muestro2, registros, encontrado, cambiado });
    } catch (error) {
        console.log(error);
        let muestro = true, encontrado = false;
        res.render('vuelo/vuelomodificaciones', { muestro, muestro2, encontrado, cambiado });
    }
}

export const vuelomodificacion = async (req, res) => {
    let muestro = true, muestro2 = true, encontrado = true, cambiado = false;
    let registros = [], registros2 = [];

    let idoriginal = req.body.idoriginal;
    let id = req.body.idhtml2;
    let numerovuelo = req.body.numerovuelohtml;
    let iataorigen;
    if (req.body.iataorigenhtml) {
        iataorigen = req.body.iataorigenhtml.toUpperCase();
    } else {
        iataorigen = "";
    }
    let iatadestino;
    if (req.body.iatadestinohtml) {
        iatadestino = req.body.iatadestinohtml.toUpperCase();
    } else {
        iatadestino = "";
    }
    let fechasalida = req.body.fechasalidahtml;
    let fechallegada = req.body.fechallegadahtml;
    let matricula;
    if (req.body.matriculahtml) {
        matricula = req.body.matriculahtml.toUpperCase();
    } else {
        matricula = "";
    }

    let consigna = 0;
    let conid = true;
    if (id != "") {
        conid = /^[0-9]{1,10}$/.test(id);
    }
    if (conid == false) { consigna++; }

    let connum = true;
    if (numerovuelo != "") {
        connum = /^[0-9]{1,10}$/.test(numerovuelo);
    }
    if (connum == false) { consigna++; }

    let coniataorigen = true;
    if (iataorigen != "") {
        if (/^[A-Za-z]{3}$/.test(iataorigen)) {
            try {
                const [regOri] = await bdd.query("SELECT codigoiata FROM aeropuerto WHERE codigoiata = '" + iataorigen + "';");
                if (regOri.length == 0) {
                    coniataorigen = false;
                    consigna++;
                }
            } catch (error) {
                coniataorigen = false;
                consigna++;
            }
        } else {
            coniataorigen = false;
            consigna++;
        }
    }

    let coniatadestino = true;
    if (iatadestino != "") {
        if (/^[A-Za-z]{3}$/.test(iatadestino)) {
            try {
                const [regDes] = await bdd.query("SELECT codigoiata FROM aeropuerto WHERE codigoiata = '" + iatadestino + "';");
                if (regDes.length == 0) {
                    coniatadestino = false;
                    consigna++;
                }
            } catch (error) {
                coniatadestino = false;
                consigna++;
            }
        } else {
            coniatadestino = false;
            consigna++;
        }
    }

    let conmatricula = true;
    if (matricula != "") {
        if (/^[a-zA-Z0-9-]{1,10}$/.test(matricula)) {
            try {
                const [regMat] = await bdd.query("SELECT matricula FROM avion WHERE matricula = '" + matricula + "';");
                if (regMat.length == 0) {
                    conmatricula = false;
                    consigna++;
                }
            } catch (error) {
                conmatricula = false;
                consigna++;
            }
        } else {
            conmatricula = false;
            consigna++;
        }
    }

    let confechasalida = true;
    if (fechasalida != "") {
        confechasalida = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(fechasalida) && !isNaN(Date.parse(fechasalida));
        if (confechasalida == false) { consigna++; }
    }

    let confechallegada = true;
    if (fechallegada != "") {
        confechallegada = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(fechallegada) && !isNaN(Date.parse(fechallegada));
        if (confechallegada == false) { consigna++; }
    }

    let selectsql = "SELECT * FROM vuelo WHERE idvuelo = '" + idoriginal + "';";
    let selectsqlfinal = "SELECT * FROM vuelo WHERE idvuelo = '" + id + "';";
    let idsql = "UPDATE vuelo SET idvuelo = '" + id + "' WHERE idvuelo = '" + idoriginal + "';";
    let numsql = "UPDATE vuelo SET numerovuelo = '" + numerovuelo + "' WHERE idvuelo = '" + idoriginal + "';";
    let orisql = "UPDATE vuelo SET aeropuerto_codigoiata_origen = '" + iataorigen + "' WHERE idvuelo = '" + idoriginal + "';";
    let dessql = "UPDATE vuelo SET aeropuerto_codigoiata_destino = '" + iatadestino + "' WHERE idvuelo = '" + idoriginal + "';";
    let salsql = "UPDATE vuelo SET fecha_salida = '" + fechasalida + "' WHERE idvuelo = '" + idoriginal + "';";
    let llegsql = "UPDATE vuelo SET fecha_llegada = '" + fechallegada + "' WHERE idvuelo = '" + idoriginal + "';";
    let matsql = "UPDATE vuelo SET avion_matricula = '" + matricula + "' WHERE idvuelo = '" + idoriginal + "';";

    try {
        [registros] = await bdd.query(selectsql);

        if (id == "" && numerovuelo == "" && iataorigen == "" && iatadestino == "" && fechasalida == "" && fechallegada == "" && matricula == "") {
            muestro2 = false;
        } else if (consigna == 0) {
            if (numerovuelo != "") { await bdd.query(numsql); }
            if (iataorigen != "") { await bdd.query(orisql); }
            if (iatadestino != "") { await bdd.query(dessql); }
            if (fechasalida != "") { await bdd.query(salsql); }
            if (fechallegada != "") { await bdd.query(llegsql); }
            if (matricula != "") { await bdd.query(matsql); }
            if (id != "") {
                await bdd.query(idsql);
                [registros2] = await bdd.query(selectsqlfinal);
            } else {
                [registros2] = await bdd.query(selectsql);
            }
            cambiado = true;
        } else {
            cambiado = false;
        }
    } catch (error) {
        console.log(error);
        cambiado = false;
    }

    res.render('vuelo/vuelomodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conid, connum, coniataorigen, coniatadestino, confechasalida, confechallegada, conmatricula, id, numerovuelo, iataorigen, iatadestino, fechasalida, fechallegada, matricula });
}
