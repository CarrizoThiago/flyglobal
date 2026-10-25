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
    matricula = (req.body.matriculahtml || "").toUpperCase();
    modelo = (req.body.modelohtml || "").toUpperCase();
    capacidad = req.body.capacidadhtml || "";
    let auxsql = "INSERT INTO `ruiz_bd`.`avion`(`matricula`,`modelo`,`capacidad`)VALUES('" + matricula + "','" + modelo + "','" + capacidad + "');";
    conmat = /^[a-zA-Z0-9-]{1,10}$/.test(matricula);
    conmod = /^[a-zA-Z0-9ñÑ\- ]{1,50}$/.test(modelo);
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
    let matricula = (req.body.matriculahtml || "").toUpperCase();
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
        res.render('aviones/avionbaja', { muestro, borrado, matricula });
    }
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
    let muestro = false;
    res.render('aviones/avionbusqueda', { muestro });
}

export const avionsearch = async (req, res) => {
    let matricula = (req.body.matriculahtml || "").toUpperCase();
    let auxsql = "SELECT * FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';";
    let muestro = true;
    try {
        const [registro, col] = await bdd.query(auxsql);
        if (registro.length == 0) {
            let encontrado = false;
            res.render('aviones/avionbusqueda', { muestro, encontrado, matricula });
        } else {
            let encontrado = true;
            res.render('aviones/avionbusqueda', { muestro, encontrado, matricula, registro });
        }
    } catch (error) {
        console.log(error);
        let muestro = true, encontrado = false;
        res.render('aviones/avionbusqueda', { muestro, encontrado, matricula });
    }
}

export const avionmodificaciones = async (req, res) => {
    let muestro = false, muestro2 = false, cambiado = false;
    res.render('aviones/avionmodificaciones', { muestro, muestro2, cambiado });
}

export const avionmodificacionagarre = async (req, res) => {
    let muestro = true, muestro2 = false, cambiado = false;
    let matricula = (req.body.matriculahtml || "").toUpperCase();
    try {
        let auxsql = "SELECT * FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';";
        const [registros, col] = await bdd.query(auxsql);
        let encontrado = true;
        if (registros.length == 0) {
            encontrado = false;
        }
        res.render('aviones/avionmodificaciones', { muestro, muestro2, registros, encontrado, cambiado });
    } catch (error) {
        console.log(error);
        let muestro = true, muestro2 = false, encontrado = false, cambiado = false;
        res.render('aviones/avionmodificaciones', { muestro, muestro2, encontrado, cambiado });
    }
}

export const avionmodificacion = async (req, res) => {
    let muestro = true, muestro2 = true, encontrado = true, cambiado = false;
    let registros = [], registros2 = [];

    let matriculaoriginal = (req.body.matriculaoriginal || "").toUpperCase();
    let matricula = (req.body.matriculahtml2 || "").toUpperCase();
    let modelo = (req.body.modelohtml || "").toUpperCase();
    let capacidad = req.body.capacidadhtml || "";

    let consigna = 0;
    let conmat = true, conmat2 = true;
    if (matricula != "") {
        conmat = /^[a-zA-Z0-9-]{1,10}$/.test(matricula);
        if (conmat && matricula != matriculaoriginal) {
            try {
                const [regMat] = await bdd.query("SELECT matricula FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';");
                if (regMat.length > 0) {
                    conmat2 = false;
                    consigna++;
                }
            } catch (error) {
                conmat2 = false;
                consigna++;
            }
        }
    }
    let conmod = true; if (modelo != "") { conmod = /^[a-zA-Z0-9ñÑ\- ]{1,50}$/.test(modelo); }
    let concap = true; if (capacidad != "") { concap = /^[0-9]{1,10}$/.test(capacidad); }

    if (conmat == false) { consigna++; }
    if (conmod == false) { consigna++; }
    if (concap == false) { consigna++; }

    let selectsql = "SELECT * FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matriculaoriginal + "';";
    let selectsqlfinal = "SELECT * FROM `ruiz_bd`.`avion` WHERE `matricula` = '" + matricula + "';";
    let matsql = "UPDATE `ruiz_bd`.`avion` SET `matricula` = '" + matricula + "' WHERE `matricula` = '" + matriculaoriginal + "';";
    let modsql = "UPDATE `ruiz_bd`.`avion` SET `modelo` = '" + modelo + "' WHERE `matricula` = '" + matriculaoriginal + "';";
    let capsql = "UPDATE `ruiz_bd`.`avion` SET `capacidad` = '" + capacidad + "' WHERE `matricula` = '" + matriculaoriginal + "';";

    try {
        [registros] = await bdd.query(selectsql);

        if (modelo == "" && capacidad == "" && matricula == "") {
            muestro2 = false;
        } else if (consigna == 0) {
            if (modelo != "") { await bdd.query(modsql); }
            if (capacidad != "") { await bdd.query(capsql); }
            if (matricula != "") {
                await bdd.query(matsql);
                [registros2] = await bdd.query(selectsqlfinal);
            } else { [registros2] = await bdd.query(selectsql); }

            cambiado = true;
        } else { cambiado = false; }
    } catch (error) {
        console.log(error);
        cambiado = false;
    }

    res.render('aviones/avionmodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conmat, conmat2, conmod, concap, matricula, modelo, capacidad });
}
