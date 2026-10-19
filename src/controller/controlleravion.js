import { conectar } from "../database/conexion.js";

const bdd = await conectar();

export const avionmenu = async (req, res) => {
    res.render('aviones/avionmenu');
}