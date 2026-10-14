import express from "express";
import { aeropuerto, aeropuertoVerTodo, aeropuertoAlta, aeropuertoNuevo, aeropuertobaja, aeropuertodelete, aeropuertobusqueda, aeropuertosearch } from "../controller/controlleraeropuerto.js";

const raeropuerto = express.Router();

raeropuerto.get('/aeropuerto', aeropuerto);

raeropuerto.get('/aeropuertovertodo', aeropuertoVerTodo)

raeropuerto.get('/aeropuertoalta', aeropuertoAlta)

raeropuerto.post('/aeropuertonuevo', aeropuertoNuevo)

raeropuerto.get('/aeropuertobaja', aeropuertobaja)

raeropuerto.post('/aeropuertodelete', aeropuertodelete)

raeropuerto.get('/aeropuertobusqueda', aeropuertobusqueda)

raeropuerto.post('/aeropuertosearch', aeropuertosearch)

export { raeropuerto }

