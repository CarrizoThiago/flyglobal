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
    conciu = /^[a-zA-Z]{1,45}$/.test(ciudad);
    conpai = /^[a-zA-Z]{1,45}$/.test(pais);
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
