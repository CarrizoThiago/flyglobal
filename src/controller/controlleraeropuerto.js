import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const aeropuerto = async (req, res) => {
    res.render('aeropuerto/aeropuertomenu');
}
export const aeropuertoVerTodo = async (req, res) => {
    let min = 0, max = 15, buscarxhtml = "";
    try {
        let auxsql = "SELECT * FROM ruiz_bd.aeropuerto;";
        const [registros] = await bdd.query(auxsql);
        console.log(registros);
        res.render('aeropuerto/aeropuertovertodo', { registros, min, max, buscarxhtml });
    } catch (error) {
        console.log(error);
        let registros = null;
        res.render('aeropuerto/aeropuertovertodo', { registros, min, max, buscarxhtml });
    }

}

export const aeropuertoactualizado = async (req, res) => {
    let min = parseInt(req.body.min), max = parseInt(req.body.max);
    let buscarxhtml = req.body.buscarxhtml || "";

    try {
        let auxsql = "";
        if (buscarxhtml != "") {
            auxsql = "SELECT * FROM ruiz_bd.aeropuerto WHERE pais = '" + buscarxhtml + "';";
        } else {
            auxsql = "SELECT * FROM ruiz_bd.aeropuerto;";
        }

        const [registros] = await bdd.query(auxsql);
        console.log(registros);
        res.render('aeropuerto/aeropuertovertodo', { registros, min, max, buscarxhtml });
    } catch (error) {
        console.log(error);
        let registros = null;
        res.render('aeropuerto/aeropuertovertodo', { registros, min, max, buscarxhtml });
    }
}

export const aeropuertoAlta = async (req, res) => {
    let muestro = false;
    let subido = false;
    res.render('aeropuerto/aeropuertoalta', { muestro, subido });
}
export const aeropuertoNuevo = async (req, res) => {
    let consigna = 0;
    let coniata = true, connom = true, conciu = true, conpai = true;
    let codigoiata, nombre, ciudad, pais;
    codigoiata = (req.body.iatahtml || req.body.iatahmtl || "").toUpperCase();
    nombre = (req.body.nomhtml || "").toUpperCase();
    ciudad = (req.body.ciuhtml || "").toUpperCase();
    pais = (req.body.paihtml || "").toUpperCase();
    coniata = /^[a-zA-Z]{3}$/.test(codigoiata);
    if (nombre.length < 71 && nombre.length > 1) {
        connom = true;
    } else {
        connom = false;
    }
    conciu = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,45}$/.test(ciudad);
    conpai = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,45}$/.test(pais);
    if (coniata == false) { consigna++; }
    if (connom == false) { consigna++; }
    if (conciu == false) { consigna++; }
    if (conpai == false) { consigna++; }
    console.log(consigna);
    if (consigna == 0) {
        try {
            let auxsql = "INSERT INTO aeropuerto (codigoiata, nombre, ciudad, pais) VALUES ('" + codigoiata + "', '" + nombre + "', '" + ciudad + "', '" + pais + "');"
            console.log(auxsql);
            await bdd.query(auxsql);
            let muestro = true;
            let subido = true;
            res.render('aeropuerto/aeropuertoalta', { muestro, subido, codigoiata, ciudad, nombre, pais });
        } catch (error) {
            console.log(error);
            let err = true;
            let muestro = true;
            let subido = false;
            res.render('aeropuerto/aeropuertoalta', { muestro, subido, err });
        }
    } else {
        let err = false;
        let muestro = true;
        let subido = false;
        res.render('aeropuerto/aeropuertoalta', { muestro, subido, codigoiata, coniata, ciudad, conciu, nombre, connom, pais, conpai, err });
    }
}
export const aeropuertobaja = async (req, res) => {
    let muestro = false;
    let exito = false;
    res.render('aeropuerto/aeropuertobaja', { muestro, exito });
}
export const aeropuertodelete = async (req, res) => {
    let iata = (req.body.iatahtml || req.body.iatahmtl || "").toUpperCase();
    let exito = false;
    try {
        let getsql = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        const [registros, col] = await bdd.query(getsql);
        let muestro = true;
        if (registros.length == 0 || registros[0].codigoiata == null) {
            exito = false;
            res.render('aeropuerto/aeropuertobaja', { muestro, exito });
        } else {
            let auxsql = "DELETE FROM aeropuerto WHERE codigoiata = '" + iata + "';";
            await bdd.query(auxsql);
            console.log(iata);
            console.log("Aeropuerto eliminado");
            exito = true;
            res.render('aeropuerto/aeropuertobaja', { muestro, exito, registros });
        }
    } catch (error) {
        console.log(error);
        let muestro = true;
        let exito = false;
        res.render('aeropuerto/aeropuertobaja', { muestro, exito });
    }
}

export const aeropuertosearch = async (req, res) => {
    let input, buscarx, muestro;
    muestro = true;

    input = (req.body.inputhtml || req.body.inputhmtl || "");
    buscarx = (req.body.buscarxhtml || req.body.buscarxhtml || "");
    if (input != "") {
        try {
            let auxsql = "SELECT * FROM aeropuerto WHERE " + buscarx + " = '" + input + "';";
            const [registros, col] = await bdd.query(auxsql);
            console.log(registros);
            res.render('aeropuerto/aeropuertobusqueda', { registros, muestro });
        } catch (error) {
            console.log(error);
            let registros = [];
            res.render('aeropuerto/aeropuertobusqueda', { registros, muestro });
        }
    } else {
        let muestro = false;
        res.render('aeropuerto/aeropuertobusqueda', { muestro });
    }

}

export const aeropuertobusqueda = async (req, res) => {
    let muestro = false;
    res.render('aeropuerto/aeropuertobusqueda', { muestro });
}

export const aeropuertomodificaciones = async (req, res) => {
    let muestro = false, muestro2 = false, cambiado = false;
    res.render('aeropuerto/aeropuertomodificaciones', { muestro, muestro2, cambiado });
}

export const aeropuertomodificacionesagarre = async (req, res) => {
    let muestro = true, muestro2 = false, cambiado = false;
    let iata = (req.body.iatahtml || req.body.iatahmtl || "").toUpperCase();
    try {
        let auxsql = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        const [registros, col] = await bdd.query(auxsql);
        let encontrado = true;
        if (registros.length == 0) {
            encontrado = false;
        }
        res.render('aeropuerto/aeropuertomodificaciones', { muestro, muestro2, registros, encontrado, cambiado });
    } catch (error) {
        console.log(error);
        let muestro = true, encontrado = false;
        res.render('aeropuerto/aeropuertomodificaciones', { muestro, muestro2, encontrado, cambiado });
    }
}

export const aeropuertomodificacion = async (req, res) => {
    let muestro = true, muestro2 = true, encontrado = true, cambiado = false;
    let registros = [], registros2 = [];

    let iataoriginal = (req.body.iataoriginal || "").toUpperCase();
    let iata = (req.body.iatahtml2 || "").toUpperCase();
    let nombre = (req.body.nombrehtml || "").toUpperCase();
    let ciudad = (req.body.ciudadhtml || "").toUpperCase();
    let pais = (req.body.paishtml || "").toUpperCase();

    let consigna = 0;
    let coniata = true, coniata2 = true;
    if (iata != "") {
        coniata = /^[a-zA-Z]{3}$/.test(iata);
        if (coniata && iata != iataoriginal) {
            try {
                const [regIata] = await bdd.query("SELECT codigoiata FROM aeropuerto WHERE codigoiata = '" + iata + "';");
                if (regIata.length > 0) {
                    coniata2 = false;
                    consigna++;
                }
            } catch (error) {
                coniata2 = false;
                consigna++;
            }
        }
    }
    let connom = true; if (nombre != "") { connom = (nombre.length < 71 && nombre.length > 1); }
    let conciu = true; if (ciudad != "") { conciu = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,45}$/.test(ciudad); }
    let conpai = true; if (pais != "") { conpai = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]{1,45}$/.test(pais); }
    if (coniata == false) { consigna++; }
    if (connom == false) { consigna++; }
    if (conciu == false) { consigna++; }
    if (conpai == false) { consigna++; }

    let selectsql = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iataoriginal + "';";
    let selectsqlfinal = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iata + "';";
    let paissql = "UPDATE aeropuerto SET pais = '" + pais + "' WHERE codigoiata = '" + iataoriginal + "';";
    let ciudadsql = "UPDATE aeropuerto SET ciudad = '" + ciudad + "' WHERE codigoiata = '" + iataoriginal + "';";
    let nombresql = "UPDATE aeropuerto SET nombre = '" + nombre + "' WHERE codigoiata = '" + iataoriginal + "';";
    let iatasql = "UPDATE aeropuerto SET codigoiata = '" + iata + "' WHERE codigoiata = '" + iataoriginal + "';";

    try {
        [registros] = await bdd.query(selectsql);

        if (pais == "" && ciudad == "" && nombre == "" && iata == "") {
            muestro2 = false;
        } else if (consigna == 0) {
            if (pais != "") { await bdd.query(paissql); }
            if (ciudad != "") { await bdd.query(ciudadsql); }
            if (nombre != "") { await bdd.query(nombresql); }
            if (iata != "") {
                await bdd.query(iatasql);
                [registros2] = await bdd.query(selectsqlfinal);
            } else { [registros2] = await bdd.query(selectsql); }


            cambiado = true;
        } else { cambiado = false; }
    } catch (error) {
        console.log(error);
        cambiado = false;
    }

    res.render('aeropuerto/aeropuertomodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conciu, connom, conpai, coniata, coniata2, ciudad, nombre, pais, iata });
}

