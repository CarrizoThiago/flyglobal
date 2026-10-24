import express from "express";
import { vuelomenu, vuelover, vuelovertodo, vuelovervigente, vuelobusqueda, vuelosearch, vueloalta, vuelonuevo, vuelobaja, vuelodelete, vuelomodificaciones, vuelomodificacionagarre, vuelomodificacion } from "../controller/controllervuelo.js"

const rvuelo = express.Router();

rvuelo.get('/vuelo', vuelomenu)

rvuelo.get('/vuelover', vuelover)

rvuelo.post('/vuelovertodo', vuelovertodo)

rvuelo.post('/vuelovervigente', vuelovervigente)

rvuelo.get('/vuelobusqueda', vuelobusqueda)

rvuelo.post('/vuelosearch', vuelosearch)

rvuelo.get('/vueloalta', vueloalta)

rvuelo.post('/vuelonuevo', vuelonuevo)

rvuelo.get('/vuelobaja', vuelobaja)

rvuelo.post('/vuelodelete', vuelodelete)

rvuelo.get('/vuelomodificaciones', vuelomodificaciones)

rvuelo.post('/vuelomodificacionagarre', vuelomodificacionagarre)

rvuelo.post('/vuelomodificacion', vuelomodificacion)

export { rvuelo }

