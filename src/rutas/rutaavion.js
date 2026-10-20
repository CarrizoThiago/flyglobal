import express from "express";
import { avionmenu, avionalta, avionnuevo, avionbaja, aviondelete, avionmodificaciones, avionmodificacionagarre, avionmodificacion, avionvertodo, avionbusqueda, avionsearch } from "../controller/controlleravion.js";
const ravion = express.Router();

ravion.get('/avion', avionmenu)

ravion.get('/avionalta', avionalta)

ravion.post('/avionnuevo', avionnuevo)

ravion.get('/avionbaja', avionbaja)

ravion.post('/aviondelete', aviondelete)

ravion.get('/avionmodificaciones', avionmodificaciones)

ravion.post('/avionmodificacionagarre', avionmodificacionagarre)

ravion.post('/avionmodificacion', avionmodificacion)

ravion.get('/avionvertodo', avionvertodo)

ravion.get('/avionbusqueda', avionbusqueda)

ravion.post('/avionsearch', avionsearch)

export { ravion }