import express from "express";
import { estadisticamenu, estadisticageneral, estadisticaaeropuertos, estadisticaaviones, estadisticavuelos, estadisticavuelo, estadisticausuarios, estadisticareservas } from "../controller/controllerestadistica.js";

const restadistica = express.Router();

restadistica.get('/estadistica', estadisticamenu);
restadistica.post('/estadisticageneral', estadisticageneral);
restadistica.post('/estadisticaaeropuertos', estadisticaaeropuertos);
restadistica.post('/estadisticaaviones', estadisticaaviones);
restadistica.post('/estadisticavuelos', estadisticavuelos);
restadistica.post('/estadisticavuelo', estadisticavuelo);
restadistica.post('/estadisticausuarios', estadisticausuarios);
restadistica.post('/estadisticareservas', estadisticareservas);

export { restadistica };
