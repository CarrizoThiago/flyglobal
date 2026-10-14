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
    res.render('aeropuerto/aeropuertoalta');
}
export const aeropuertoNuevo = async (req, res) => {
    let codigoiata, nombre, ciudad, pais;
    codigoiata = req.body.iatahmtl.toUpperCase();
    nombre = req.body.nomhtml.toUpperCase();
    ciudad = req.body.ciuhtml.toUpperCase();
    pais = req.body.paihtml.toUpperCase();
    try {
        let auxsql = "INSERT INTO aeropuerto (codigoiata, nombre, ciudad, pais) VALUES ('" + codigoiata + "', '" + nombre + "', '" + ciudad + "', '" + pais + "');"
        console.log(auxsql);
        await bdd.query(auxsql);
        res.redirect('/aeropuerto');
    } catch (error) {
        console.log(error);
        res.send("error en el alta");
    }
}
export const aeropuertobaja = async (req, res) => {
    res.render('aeropuerto/aeropuertobaja');
}
export const aeropuertodelete = async (req, res) => {
    let iata;
    iata = req.body.iatahmtl.toUpperCase();
    try {
        let auxsql = "DELETE FROM aeropuerto WHERE codigoiata = '" + iata + "';";
        await bdd.query(auxsql);
        console.log(iata);
        console.log("Aeropuerto eliminado");
        res.redirect('/aeropuerto');
    } catch (error) {
        console.log(error);
        res.send("error en la baja");
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
