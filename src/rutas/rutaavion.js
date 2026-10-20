import express from "express";
import { avionmenu, avionalta, avionnuevo, avionbaja, aviondelete, avionmodificaciones, avionvertodo, avionbusqueda } from "../controller/controlleravion.js";
const ravion = express.Router();

ravion.get('/avion', avionmenu)

ravion.get('/avionalta', avionalta)

ravion.post('/avionnuevo', avionnuevo)

ravion.get('/avionbaja', avionbaja)

ravion.post('/aviondelete', aviondelete)

ravion.get('/avionmodificaciones', avionmodificaciones)

ravion.get('/avionvertodo', avionvertodo)

ravion.get('/avionbusqueda', avionbusqueda)

export { ravion }