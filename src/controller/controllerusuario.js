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

    pasaporte = (req.body.pasaportehtml || "").toUpperCase();
    nombre = (req.body.nombrehtml || "").toUpperCase();
    apellido = (req.body.apellidohtml || "").toUpperCase();
    email = req.body.emailhtml || "";
    telefono = req.body.telefonohtml || "";
    contraseña = req.body.contraseñahtml || "";

    let consigna = 0, conpasaporte, conpasaporte2, connom, conape, conema, contele, concontra;

    conpasaporte = /^[A-Z 0-9]{2,9}$/.test(pasaporte);
    if (conpasaporte) {
        try {
            let passsql = "SELECT pasaporte FROM usuario WHERE pasaporte = '" + pasaporte + "';";
            const [regpasaporte, col] = await bdd.query(passsql);
            if (regpasaporte.length > 0) {
                conpasaporte2 = false;
            } else {
                conpasaporte2 = true;
            }
        } catch (error) {
            conpasaporte2 = false;
        }
    } else {
        conpasaporte2 = true;
    }
    connom = /^[A-ZÑÁÉÍÓÚ ]{1,30}$/.test(nombre);
    conape = /^[A-ZÑÁÉÍÓÚ ]{1,25}$/.test(apellido);
    conema = /^[a-zA-Z0-9@._-]{1,50}$/.test(email);
    contele = /^[0-9+\- ]{1,20}$/.test(telefono);
    if (contraseña != "") {
        if (contraseña.length > 45) { concontra = false; } else { concontra = true; }
    } else {
        concontra = true;
        contraseña = null;
    }
    if (conpasaporte == false) { consigna++; }
    if (conpasaporte2 == false) { consigna++; }
    if (connom == false) { consigna++; }
    if (conape == false) { consigna++; }
    if (conema == false) { consigna++; }
    if (contele == false) { consigna++; }
    if (concontra == false) { consigna++; }
    try {
        if (consigna == 0) {
            let idreg = [], coincidencia;

            let idsql = "SELECT idusuario FROM usuario;";
            [idreg] = await bdd.query(idsql);
            for (let i = 1; i < idreg.length + 2; i++) {
                id = i;
                coincidencia = false;
                for (let j = 0; j < idreg.length; j++) {
                    if (id == idreg[j].idusuario) {
                        coincidencia = true;
                        break;
                    }
                }
                if (coincidencia == false) {
                    break;
                }
            }

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
            res.render('usuario/usuarioalta', { muestro, subido, conpasaporte, conpasaporte2, connom, conape, conema, contele, concontra, id, pasaporte, nombre, apellido, email, telefono, contraseña });
        }
    } catch (error) {
        console.log(error);
        let subido = false;
        res.render('usuario/usuarioalta', { muestro, subido, conpasaporte, conpasaporte2, connom, conape, conema, contele, concontra, id, pasaporte, nombre, apellido, email, telefono, contraseña });
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
    let muestro = true, exito = false, err = false;
    let id = req.body.idhtml || "";
    try {
        let auxsql = "SELECT * FROM usuario WHERE idusuario = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        if (registros.length == 0 || registros[0].idusuario == null) {
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
    let id = req.body.idhtml || "";
    try {
        if (id == "" || !/^[0-9]+$/.test(id)) {
            exito = false;
            res.render('usuario/usuariobusqueda', { muestro, exito, err });
        } else {
            let auxsql = "SELECT * FROM usuario WHERE idusuario = " + id + ";";
            const [registros, col] = await bdd.query(auxsql);
            exito = true;
            res.render('usuario/usuariobusqueda', { muestro, exito, registros, err });
        }
    } catch (error) {
        console.log(error);
        let exito = false;
        err = true;
        res.render('usuario/usuariobusqueda', { muestro, exito, err });
    }
}

export const usuariomodificaciones = async (req, res) => {
    let muestro = false, muestro2 = false, cambiado = false;
    res.render('usuario/usuariomodificaciones', { muestro, muestro2, cambiado });
}

export const usuariomodificacionagarre = async (req, res) => {
    let muestro = true, muestro2 = false, cambiado = false;
    let id = req.body.idhtml || "";
    try {
        let auxsql = "SELECT * FROM usuario WHERE idusuario = '" + id + "';";
        const [registros, col] = await bdd.query(auxsql);
        let encontrado = true;
        if (registros.length == 0) {
            encontrado = false;
        }
        res.render('usuario/usuariomodificaciones', { muestro, muestro2, registros, encontrado, cambiado });
    } catch (error) {
        console.log(error);
        let muestro = true, encontrado = false;
        res.render('usuario/usuariomodificaciones', { muestro, muestro2, encontrado, cambiado });
    }
}

export const usuariomodificacion = async (req, res) => {
    let muestro = true, muestro2 = true, encontrado = true, cambiado = false;
    let registros = [], registros2 = [];
    let conid, conid2 = true, conpasaporte, conpasaporte2 = true, connom, conape, conema, contele, concontra;
    let consigna = 0;

    let idoriginal = req.body.idoriginal || "";
    let id = req.body.idhtml2 || "";
    let pasaporte = (req.body.pasaportehtml || "").toUpperCase();
    let nombre = (req.body.nombrehtml || "").toUpperCase();
    let apellido = (req.body.apellidohtml || "").toUpperCase();
    let email = req.body.emailhtml || "";
    let telefono = req.body.telefonohtml || "";
    let contraseña = req.body.contraseñahtml || "";

    if (id != "") {
        conid = /^[0-9]{1,10}$/.test(id);
        if (conid && id != idoriginal) {
            try {
                const [regId] = await bdd.query("SELECT idusuario FROM usuario WHERE idusuario = '" + id + "';");
                if (regId.length > 0) {
                    conid2 = false;
                    consigna++;
                }
            } catch (error) {
                conid2 = false;
                consigna++;
            }
        }
    } else {
        conid = true;
    }
    if (pasaporte != "") {
        conpasaporte = /^[A-Z 0-9]{2,9}$/.test(pasaporte);
        if (conpasaporte) {
            try {
                const [regPass] = await bdd.query("SELECT pasaporte FROM usuario WHERE pasaporte = '" + pasaporte + "' AND idusuario != '" + idoriginal + "';");
                if (regPass.length > 0) {
                    conpasaporte2 = false;
                    consigna++;
                }
            } catch (error) {
                conpasaporte2 = false;
                consigna++;
            }
        }
    } else {
        conpasaporte = true;
    }
    if (nombre != "") {
        connom = /^[A-ZÑÁÉÍÓÚ ]{1,30}$/.test(nombre);
    } else {
        connom = true;
    }
    if (apellido != "") {
        conape = /^[A-ZÑÁÉÍÓÚ ]{1,25}$/.test(apellido);
    } else {
        conape = true;
    }
    if (email != "") {
        conema = /^[a-zA-Z0-9@._-]{1,50}$/.test(email);
    } else {
        conema = true;
    }
    if (telefono != "") {
        contele = /^[0-9+\- ]{1,20}$/.test(telefono);
    } else {
        contele = true;
    }
    if (contraseña != "") {
        if (contraseña.length > 45) { concontra = false; } else { concontra = true; }
    } else {
        concontra = true;
    }
    if (conid == false) { consigna++; }
    if (conpasaporte == false) { consigna++; }
    if (connom == false) { consigna++; }
    if (conape == false) { consigna++; }
    if (conema == false) { consigna++; }
    if (contele == false) { consigna++; }
    if (concontra == false) { consigna++; }



    let selectsql = "SELECT * FROM usuario WHERE idusuario = '" + idoriginal + "';";
    let selectsqlfinal = "SELECT * FROM usuario WHERE idusuario = '" + id + "';";
    let idsql = "UPDATE usuario SET idusuario = '" + id + "' WHERE idusuario = '" + idoriginal + "';";
    let pasaportesql = "UPDATE usuario SET pasaporte = '" + pasaporte + "' WHERE idusuario = '" + idoriginal + "';";
    let nombresql = "UPDATE usuario SET nombre = '" + nombre + "' WHERE idusuario = '" + idoriginal + "';";
    let apellidosql = "UPDATE usuario SET apellido = '" + apellido + "' WHERE idusuario = '" + idoriginal + "';";
    let emailsql = "UPDATE usuario SET email = '" + email + "' WHERE idusuario = '" + idoriginal + "';";
    let telefonosql = "UPDATE usuario SET telefono = '" + telefono + "' WHERE idusuario = '" + idoriginal + "';";
    let contraseñasql = "UPDATE usuario SET contraseña = '" + contraseña + "' WHERE idusuario = '" + idoriginal + "';";

    try {
        [registros] = await bdd.query(selectsql);

        if (id == "" && pasaporte == "" && nombre == "" && apellido == "" && email == "" && telefono == "" && contraseña == "") {
            muestro2 = false;
        } else if (consigna == 0) {
            if (pasaporte != "") { await bdd.query(pasaportesql); }
            if (nombre != "") { await bdd.query(nombresql); }
            if (apellido != "") { await bdd.query(apellidosql); }
            if (email != "") { await bdd.query(emailsql); }
            if (telefono != "") { await bdd.query(telefonosql); }
            if (contraseña != "") { await bdd.query(contraseñasql); }
            if (id != "") {
                await bdd.query(idsql);
                [registros2] = await bdd.query(selectsqlfinal);
            } else { [registros2] = await bdd.query(selectsql); }


            cambiado = true;
        } else { cambiado = false; }
    } catch (error) {
        console.log(error);
        cambiado = false;
    }

    res.render('usuario/usuariomodificaciones', { muestro, muestro2, registros, registros2, encontrado, cambiado, conid, conid2, conpasaporte, conpasaporte2, connom, conape, conema, contele, concontra, id, pasaporte, nombre, apellido, email, telefono, contraseña });
}
