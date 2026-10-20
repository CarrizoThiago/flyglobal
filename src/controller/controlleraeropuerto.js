import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const aeropuerto = async (req, res) => {
    res.render('aeropuerto/aeropuertomenu');
};
export const aeropuertoVerTodo = async (req, res) => {

    try {
        let auxsql = "SELECT * FROM ruiz_bd.aeropuerto;";
        const [registros] = await bdd.query(auxsql);
        console.log(registros);
        res.render('aeropuerto/aeropuertovertodo', { registros });
    } catch (error) {
        console.log(error);
    }

};
export const aeropuertoAlta = async (req, res) => {
    let muestro = false;
    let subido = false;
    res.render('aeropuerto/aeropuertoalta', { muestro, subido });
}
export const aeropuertoNuevo = async (req, res) => {
    let consigna = 0;
    let coniata = true, connom = true, conciu = true, conpai = true;
    let codigoiata, nombre, ciudad, pais;
    codigoiata = req.body.iatahmtl.toUpperCase();
    nombre = req.body.nomhtml.toUpperCase();
    ciudad = req.body.ciuhtml.toUpperCase();
    pais = req.body.paihtml.toUpperCase();
    coniata = /^[a-zA-Z]{3}$/.test(codigoiata);
    if (nombre.length < 71 && nombre.length > 1) {
        connom = true;
    } else {
        connom = false;
    }
    conciu = /^[a-zA-ZñÑ ]{1,45}$/.test(ciudad);
    conpai = /^[a-zA-ZñÑ ]{1,45}$/.test(pais);
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
    let iata;
    iata = req.body.iatahmtl.toUpperCase();
    try {
        let getsql = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        const [registros, col] = await bdd.query(getsql);
        let auxsql = "DELETE FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        await bdd.query(auxsql);
        console.log(iata);
        console.log("Aeropuerto eliminado");
        let muestro = true;
        if (registros[0].codigoiata != null) {
            let exito = true;
        } else {
            let exito = false;
        }
        res.render('aeropuerto/aeropuertobaja', { muestro, exito, registros });
    } catch (error) {
        console.log(error);
        let muestro = true;
        let exito = false;
        res.render('aeropuerto/aeropuertobaja', { muestro, exito });
    }
}

export const aeropuertosearch = async (req, res) => {
    let iata, muestro;
    muestro = true;
    iata = req.body.iatahmtl.toUpperCase();
    try {
        let auxsql = "SELECT * FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        const [registros, col] = await bdd.query(auxsql);
        console.log(registros);
        res.render('aeropuerto/aeropuertobusqueda', { registros, muestro });
    } catch (error) {
        console.log(error);
        res.send("error en la busqueda");
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
    let iata;
    iata = req.body.iatahtml.toUpperCase();
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

    let iataoriginal = req.body.iataoriginal.toUpperCase();
    let iata = req.body.iatahtml2.toUpperCase();
    let nombre = req.body.nombrehtml.toUpperCase();
    let ciudad = req.body.ciudadhtml.toUpperCase();
    let pais = req.body.paishtml.toUpperCase();

    let consigna = 0;
    let coniata = true; if (iata != "") { coniata = /^[a-zA-Z]{3}$/.test(iata); }
    let connom = true; if (nombre != "") { connom = (nombre.length < 71 && nombre.length > 1); }
    let conciu = true; if (ciudad != "") { conciu = /^[a-zA-ZñÑ ]{1,45}$/.test(ciudad); }
    let conpai = true; if (pais != "") { conpai = /^[a-zA-ZñÑ ]{1,45}$/.test(pais); }
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

    res.render('aeropuerto/aeropuertomodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conciu, connom, conpai, coniata, ciudad, nombre, pais, iata });
}

