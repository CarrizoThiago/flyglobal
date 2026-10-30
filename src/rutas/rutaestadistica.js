import express from "express";
import { estadisticamenu, estadisticageneral, estadisticaaeropuertos } from "../controller/controllerestadistica.js";

const restadistica = express.Router();

restadistica.get('/estadistica', estadisticamenu);
restadistica.post('/estadisticageneral', estadisticageneral);
restadistica.post('/estadisticaaeropuertos', estadisticaaeropuertos);

export { restadistica };