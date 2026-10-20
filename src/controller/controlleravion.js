import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const avionmenu = async (req, res) => {
    res.render('aviones/avionmenu');
}

export const avionalta = async (req, res) => {
    let muestro = false, subido = false;
    res.render('aviones/avionalta', { muestro, subido });
}
export const avionnuevo = async (req, res) => {
    let matricula, modelo, capacidad;
    let consigna = 0, conmat = true, conmod = true, concap = true;
    matricula = req.body.matriculahtml.toUpperCase();
    modelo = req.body.modelohtml.toUpperCase();
    capacidad = req.body.capacidadhtml;
    let auxsql = "INSERT INTO `ruiz_bd`.`avion`(`matricula`,`modelo`,`capacidad`)VALUES('" + matricula + "','" + modelo + "','" + capacidad + "');";
    conmat = /^[a-zA-Z0-9-]{1,10}$/.test(matricula);
    conmod = /^[a-zA-ZñÑ ]{1,50}$/.test(modelo);
    concap = /^[0-9]{1,10}$/.test(capacidad);
    if (conmat == false) { consigna++; }
    if (conmod == false) { consigna++; }
    if (concap == false) { consigna++; }
    try {
        if (consigna == 0) {
            await bdd.query(auxsql);
            let muestro = true, subido = true;
            res.render('aviones/avionalta', { muestro, subido, matricula, modelo, capacidad });
        } else {
            let muestro = true, subido = false;
            res.render('aviones/avionalta', { muestro, subido, conmat, conmod, concap, matricula, modelo, capacidad });
        }
    } catch (error) {
        console.log(error);
        let muestro = true, subido = false;
        res.render('aviones/avionalta', { muestro, subido, conmat, conmod, concap, matricula, modelo, capacidad });
    }
}

export const avionbaja = async (req, res) => {
    let muestro = false;
    res.render('aviones/avionbaja', { muestro });
}

export const aviondelete = async (req, res) => {
    let matricula = req.body.matriculahtml.toUpperCase();
    let auxsql = "DELETE FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';";
    let auxsql2 = "SELECT * FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';";
    try {
        const [registro, col] = await bdd.query(auxsql2);
        if (registro.length == 0) {
            let muestro = true, borrado = false;
            res.render('aviones/avionbaja', { muestro, borrado, matricula });
        } else {
            await bdd.query(auxsql);
            let muestro = true, borrado = true;
            res.render('aviones/avionbaja', { muestro, borrado, matricula, registro });
        }

    } catch (error) {
        console.log(error);
        let muestro = true, borrado = false;
        res.render('aviones/avionbaja', { muestro, borrado });
    }
}

export const avionmodificaciones = async (req, res) => {
    res.render('aviones/avionmodificaciones');
}

export const avionvertodo = async (req, res) => {
    const auxsql = "SELECT * FROM `ruiz_bd`.`avion`;";
    try {
        const [registro, col] = await bdd.query(auxsql);
        console.log(registro);
        res.render('aviones/avionvertodo', { registro });
    } catch (error) {
        console.log(error);
        let registro = [];
        res.render('aviones/avionvertodo', { registro });
    }
}

export const avionbusqueda = async (req, res) => {
    res.render('aviones/avionbusqueda');
}
