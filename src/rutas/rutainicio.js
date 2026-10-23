import express from "express";
import { raeropuerto } from "./rutaeropuerto.js";
import { ravion } from "./rutaavion.js";
import { rusuario } from "./rutausuario.js";
import { rvuelo } from "./rutavuelo.js";
const rinicio = express.Router();

rinicio.get('/', (req, res) => {
    res.render('index');
});

rinicio.use(raeropuerto);

rinicio.use(ravion);

rinicio.use(rusuario);

rinicio.use(rvuelo);

export { rinicio };