import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const usuariomenu = async (req, res) => {
    res.render('usuario/usuariomenu')
}

export const usuarioalta = async (req, res) => {
    let muestro = false;
    res.render('usuario/usuarioalta', { muestro });
}

export const usuarionuevo = async (req, res) => {
    let id, pasaporte, nombre, apellido, email, telefono, contraseña;
    let muestro = true;
    let auxsql;

    id = req.body.idhtml;
    pasaporte = req.body.pasaportehtml.toUpperCase();
    nombre = req.body.nombrehtml.toUpperCase();
    apellido = req.body.apellidohtml.toUpperCase();
    email = req.body.emailhtml;
    telefono = req.body.telefonohtml;
    contraseña = req.body.contraseñahtml;

    let consigna = 0, conid, conpasaporte, connom, conape, conema, contele, concontra;

    conid = /^[0-9]{1,10}$/.test(id);
    conpasaporte = /^[A-Z 0-9]{2,9}$/.test(pasaporte);
    connom = /^[A-ZÑÁÉÍÓÚ ]{1,30}$/.test(nombre);
    conape = /^[A-ZÑÁÉÍÓÚ ]{1,25}$/.test(apellido);
    conema = /^[a-zA-Z0-9@._-]{1,50}$/.test(email);
    contele = /^[0-9+\- ]{1,20}$/.test(telefono);
    if (contraseña != "") {
        if (contraseña.length >= 45) { concontra = false; } else { concontra = true; }
    } else {
        concontra = true;
        contraseña = null;
    }
    if (conid == false) { consigna++; }
    if (conpasaporte == false) { consigna++; }
    if (connom == false) { consigna++; }
    if (conape == false) { consigna++; }
    if (conema == false) { consigna++; }
    if (contele == false) { consigna++; }
    if (concontra == false) { consigna++; }
    try {
        if (consigna == 0) {
            if (contraseña == null) {
                auxsql = "INSERT INTO `ruiz_bd`.`usuario`(`idusuario`,`pasaporte`,`nombre`,`apellido`,`email`,`telefono`,`contraseña`)VALUES('" + id + "','" + pasaporte + "','" + nombre + "','" + apellido + "','" + email + "','" + telefono + "', null);";
            } else {
                auxsql = "INSERT INTO `ruiz_bd`.`usuario`(`idusuario`,`pasaporte`,`nombre`,`apellido`,`email`,`telefono`,`contraseña`)VALUES('" + id + "','" + pasaporte + "','" + nombre + "','" + apellido + "','" + email + "','" + telefono + "','" + contraseña + "');";
            }
            await bdd.query(auxsql);
            let subido = true;
            res.render('usuario/usuarioalta', { muestro, subido, id, pasaporte, nombre, apellido, email, telefono, contraseña });
        } else {
            let subido = false;
            res.render('usuario/usuarioalta', { muestro, subido, conid, conpasaporte, connom, conape, conema, contele, concontra, id, pasaporte, nombre, apellido, email, telefono, contraseña });
        }
    } catch (error) {
        console.log(error);
        let subido = false;
        res.render('usuario/usuarioalta', { muestro, subido, conid, conpasaporte, connom, conape, conema, contele, concontra, id, pasaporte, nombre, apellido, email, telefono, contraseña });
    }
}

export const usuariovertodo = async (req, res) => {
    const sql = "select * from usuario";
    try {
        const [registros, col] = await bdd.query(sql);
        res.render('usuario/usuariovertodo', { registros });
    } catch (error) {
        console.log(error);
        const registros = null;
        res.render('usuario/usuariovertodo', { registros });
    }
}

export const usuariobaja = async (req, res) => {
    let muestro = false, err = false;
    res.render('usuario/usuariobaja', { muestro, err });
}

export const usuariodelete = async (req, res) => {
    let muestro = true, exito, err = false;
    let id = req.body.idhtml;
    try {
        let auxsql = "SELECT * FROM usuario WHERE idusuario = " + id + ";";
        const [registros, col] = await bdd.query(auxsql);
        if (registros[0].idusuario == null) {
            exito = false;
            res.render('usuario/usuariobaja', { muestro, exito, err });
        } else {
            exito = true;
            auxsql = "DELETE FROM usuario WHERE idusuario = '" + id + "';";
            await bdd.query(auxsql);
            res.render('usuario/usuariobaja', { muestro, exito, registros, err });
        }
    } catch (error) {
        console.log(error);
        let exito = false;
        err = true;
        res.render('usuario/usuariobaja', { muestro, exito, err });
    }
}

export const usuariobusqueda = async (req, res) => {
    let muestro = false;
    res.render('usuario/usuariobusqueda', { muestro });
}

export const usuariosearch = async (req, res) => {
    let muestro = true, err = false, exito = false;
    let id = req.body.idhtml;
    let auxsql = "SELECT * FROM usuario WHERE idusuario = " + id + ";";
    try {
        const [registros, col] = await bdd.query(auxsql);
        exito = true;
        res.render('usuario/usuariobusqueda', { muestro, exito, registros, err });
    } catch (error) {
        console.log(error);
        let exito = false;
        err = true;
        res.render('usuario/usuariobusqueda', { muestro, exito, err });
    }
}