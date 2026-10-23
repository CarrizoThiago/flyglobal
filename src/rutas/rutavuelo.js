import express from "express";
import { vuelomenu, vuelovertodo, vuelobusqueda, vuelosearch, vueloalta, vuelonuevo, vuelobaja, vuelodelete, vuelomodificaciones, vuelomodificacionagarre, vuelomodificacion } from "../controller/controllervuelo.js"

const rvuelo = express.Router();

rvuelo.get('/vuelo', vuelomenu)

rvuelo.get('/vuelovertodo', vuelovertodo)

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

