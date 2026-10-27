import express from "express";
import { estadisticamenu, estadisticageneral } from "../controller/controllerestadistica.js";

const restadistica = express.Router();

restadistica.get('/estadistica', estadisticamenu);
restadistica.post('/estadisticageneral', estadisticageneral);

export { restadistica };