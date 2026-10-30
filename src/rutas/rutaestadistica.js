import express from "express";
import { estadisticamenu, estadisticageneral, estadisticaaeropuertos, estadisticaaviones } from "../controller/controllerestadistica.js";

const restadistica = express.Router();

restadistica.get('/estadistica', estadisticamenu);
restadistica.post('/estadisticageneral', estadisticageneral);
restadistica.post('/estadisticaaeropuertos', estadisticaaeropuertos);
restadistica.post('/estadisticaaviones', estadisticaaviones);

export { restadistica };
