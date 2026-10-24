import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const reservamenu = async (req, res) => {
    res.render('reserva/reservamenu');
}

export const reservavertodo = async (req, res) => {
    let auxsql = "select * from reserva;", registros = [], col = [];
    try {
        [registros, col] = await bdd.query(auxsql);
        res.render('reserva/reservavertodo', { registros });
    } catch (error) {
        console.log(error);
        registros = null;
        res.render('reserva/reservavertodo', { registros });
    }
}

export const reservabusqueda = async (req, res) => {
    let muestro = false, err = false, registros = [], col = [];
    res.render('reserva/reservabusqueda', { muestro, err, registros });
}

export const reservasearch = async (req, res) => {
    let muestro = true, err = false, registros = [], registros2 = [], registros3 = [], col = [];
    let id = req.body.idhtml;
    try {
        if (id == "" || id == null || !/^[0-9]+$/.test(id)) {
            muestro = false;
            res.render('reserva/reservabusqueda', { muestro, err, registros });
        } else {
            let auxsql = "select * from reserva where idreserva = " + id + ";";
            [registros, col] = await bdd.query(auxsql);
            if (registros.length == 0) {
                res.render('reserva/reservabusqueda', { muestro, err, registros });
            } else {
                let vuelosql = "select * from vuelo where idvuelo = " + registros[0].vuelo_idvuelo + ";";
                [registros2, col] = await bdd.query(vuelosql);
                let usuariosql = "select * from usuario where idusuario = " + registros[0].usuario_idusuario + ";";
                [registros3, col] = await bdd.query(usuariosql);
                res.render('reserva/reservabusqueda', { muestro, err, registros, registros2, registros3 });
            }
        }

    } catch (error) {
        console.log(error);
        err = true;
        res.render('reserva/reservabusqueda', { muestro, err, registros });
    }
}

export const reservaalta = async (req, res) => {
    let muestro = false, subido = false;
    res.render('reserva/reservaalta', { muestro, subido });
}

export const reservanuevo = async (req, res) => {
    let idreserva, idvuelo, fecha, asiento, costo, idusuario;
    let muestro = true, subido = false, err = false;
    let consigna = 0;
    let convuelo = true, confecha = true, conasiento = true, concosto = true, conusuario = true;

    let regUsu = [], regVue = [], col = [];
    const fechaActual = new Date().toLocaleDateString('en-CA');
    idvuelo = req.body.idvuelohtml;
    fecha = fechaActual;
    if (req.body.asientohtml) {
        asiento = req.body.asientohtml.toUpperCase();
    } else {
        asiento = "";
    }
    costo = req.body.costohtml;
    idusuario = req.body.idusuariohtml;



    if (/^[0-9]{1,10}$/.test(idvuelo)) {
        try {
            [regVue, col] = await bdd.query("SELECT * FROM vuelo WHERE idvuelo = '" + idvuelo + "';");
            if (regVue.length == 0) {
                convuelo = false;
                consigna++;
            }
        } catch (error) {
            convuelo = false;
            consigna++;
        }
    } else {
        convuelo = false;
        consigna++;
    }

    confecha = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fecha) && !isNaN(Date.parse(fecha));
    if (confecha == false) { consigna++; }

    conasiento = /^[a-zA-Z0-9]{1,5}$/.test(asiento);
    if (conasiento == false) { consigna++; }

    concosto = /^[0-9]{1,10}$/.test(costo);
    if (concosto == false) { consigna++; }

    if (/^[0-9]{1,10}$/.test(idusuario)) {
        try {
            [regUsu, col] = await bdd.query("SELECT * FROM usuario WHERE idusuario = '" + idusuario + "';");
            if (regUsu.length == 0) {
                conusuario = false;
                consigna++;
            }
        } catch (error) {
            conusuario = false;
            consigna++;
        }
    } else {
        conusuario = false;
        consigna++;
    }

    try {
        if (consigna == 0) {
            let coincidencia, idsql = "SELECT idreserva FROM reserva;", idreg = [];
            [idreg] = await bdd.query(idsql);
            for (let i = 1; i < idreg.length + 2; i++) {
                coincidencia = false;
                for (let j = 0; j < idreg.length; j++) {
                    if (idreg[j].idreserva == i) {
                        coincidencia = true;
                        break;
                    }
                }
                if (coincidencia == false) {
                    idreserva = i;
                    break;
                }
            }
            let auxsql = "INSERT INTO `ruiz_bd`.`reserva`(`idreserva`,`vuelo_idvuelo`,`fecha`,`asiento`,`costo`,`usuario_idusuario`)VALUES('" + idreserva + "','" + idvuelo + "','" + fecha + "','" + asiento + "','" + costo + "','" + idusuario + "');";
            await bdd.query(auxsql);
            subido = true;
            res.render('reserva/reservaalta', { muestro, subido, err, idreserva, idvuelo, fecha, asiento, costo, idusuario, regUsu, regVue });
        } else {
            subido = false;
            res.render('reserva/reservaalta', { muestro, subido, err, convuelo, confecha, conasiento, concosto, conusuario, idreserva, idvuelo, fecha, asiento, costo, idusuario });
        }
    } catch (error) {
        console.log(error);
        subido = false;
        err = true;
        res.render('reserva/reservaalta', { muestro, subido, err, convuelo, confecha, conasiento, concosto, conusuario, idreserva, idvuelo, fecha, asiento, costo, idusuario });
    }
}

export const reservabaja = async (req, res) => {
    let muestro = false, err = false;
    res.render('reserva/reservabaja', { muestro, err });
}

export const reservadelete = async (req, res) => {
    let muestro = true, exito = false, err = false;
    let id = req.body.idhtml;
    try {
        let auxsql = "SELECT * FROM reserva WHERE idreserva = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        if (registros.length == 0 || registros[0].idreserva == null) {
            exito = false;
            res.render('reserva/reservabaja', { muestro, exito, err, id });
        } else {
            exito = true;
            auxsql = "DELETE FROM reserva WHERE idreserva = '" + id + "';";
            await bdd.query(auxsql);
            res.render('reserva/reservabaja', { muestro, exito, registros, err, id });
        }
    } catch (error) {
        console.log(error);
        exito = false;
        err = true;
        res.render('reserva/reservabaja', { muestro, exito, err, id });
    }
}

export const reservamodificaciones = async (req, res) => {
    let muestro = false, muestro2 = false, cambiado = false;
    res.render('reserva/reservamodificaciones', { muestro, muestro2, cambiado });
}

export const reservamodificacionagarre = async (req, res) => {
    let muestro = true, muestro2 = false, cambiado = false;
    let id;
    id = req.body.idhtml;
    try {
        let auxsql = "SELECT * FROM reserva WHERE idreserva = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        let encontrado = true;
        if (registros.length == 0) {
            encontrado = false;
        }
        res.render('reserva/reservamodificaciones', { muestro, muestro2, registros, encontrado, cambiado });
    } catch (error) {
        console.log(error);
        let muestro = true, encontrado = false;
        res.render('reserva/reservamodificaciones', { muestro, muestro2, encontrado, cambiado });
    }
}

export const reservamodificacion = async (req, res) => {
    let muestro = true, muestro2 = true, encontrado = true, cambiado = false;
    let registros = [], registros2 = [];

    let idoriginal = req.body.idoriginal;
    let id = req.body.idhtml2;
    let idvuelo = req.body.idvuelohtml;
    let fecha = req.body.fechahtml;
    let asiento;
    if (req.body.asientohtml) {
        asiento = req.body.asientohtml.toUpperCase();
    } else {
        asiento = "";
    }
    let costo = req.body.costohtml;
    let idusuario = req.body.idusuariohtml;

    let consigna = 0;
    let conid = true;
    if (id != "") {
        conid = /^[0-9]{1,10}$/.test(id);
    }
    if (conid == false) { consigna++; }

    let convuelo = true;
    if (idvuelo != "") {
        if (/^[0-9]{1,10}$/.test(idvuelo)) {
            try {
                const [regVue] = await bdd.query("SELECT idvuelo FROM vuelo WHERE idvuelo = '" + idvuelo + "';");
                if (regVue.length == 0) {
                    convuelo = false;
                    consigna++;
                }
            } catch (error) {
                convuelo = false;
                consigna++;
            }
        } else {
            convuelo = false;
            consigna++;
        }
    }

    let confecha = true;
    if (fecha != "") {
        confecha = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(fecha) && !isNaN(Date.parse(fecha));
        if (confecha == false) { consigna++; }
    }

    let conasiento = true;
    if (asiento != "") {
        conasiento = /^[a-zA-Z0-9]{1,5}$/.test(asiento);
        if (conasiento == false) { consigna++; }
    }

    let concosto = true;
    if (costo != "") {
        concosto = /^[0-9]{1,10}$/.test(costo);
        if (concosto == false) { consigna++; }
    }

    let conusuario = true;
    if (idusuario != "") {
        if (/^[0-9]{1,10}$/.test(idusuario)) {
            try {
                const [regUsu] = await bdd.query("SELECT idusuario FROM usuario WHERE idusuario = '" + idusuario + "';");
                if (regUsu.length == 0) {
                    conusuario = false;
                    consigna++;
                }
            } catch (error) {
                conusuario = false;
                consigna++;
            }
        } else {
            conusuario = false;
            consigna++;
        }
    }

    let selectsql = "SELECT * FROM reserva WHERE idreserva = '" + idoriginal + "';";
    let selectsqlfinal = "SELECT * FROM reserva WHERE idreserva = '" + id + "';";
    let idsql = "UPDATE reserva SET idreserva = '" + id + "' WHERE idreserva = '" + idoriginal + "';";
    let vuelosql = "UPDATE reserva SET vuelo_idvuelo = '" + idvuelo + "' WHERE idreserva = '" + idoriginal + "';";
    let fechasql = "UPDATE reserva SET fecha = '" + fecha + "' WHERE idreserva = '" + idoriginal + "';";
    let asientosql = "UPDATE reserva SET asiento = '" + asiento + "' WHERE idreserva = '" + idoriginal + "';";
    let costosql = "UPDATE reserva SET costo = '" + costo + "' WHERE idreserva = '" + idoriginal + "';";
    let usuariosql = "UPDATE reserva SET usuario_idusuario = '" + idusuario + "' WHERE idreserva = '" + idoriginal + "';";

    try {
        [registros] = await bdd.query(selectsql);

        if (id == "" && idvuelo == "" && fecha == "" && asiento == "" && costo == "" && idusuario == "") {
            muestro2 = false;
        } else if (consigna == 0) {
            if (idvuelo != "") { await bdd.query(vuelosql); }
            if (fecha != "") { await bdd.query(fechasql); }
            if (asiento != "") { await bdd.query(asientosql); }
            if (costo != "") { await bdd.query(costosql); }
            if (idusuario != "") { await bdd.query(usuariosql); }
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

    res.render('reserva/reservamodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conid, convuelo, confecha, conasiento, concosto, conusuario, id, idvuelo, fecha, asiento, costo, idusuario });
}


