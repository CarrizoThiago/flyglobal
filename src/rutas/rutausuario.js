import express from "express";
import { usuariomenu, usuarioalta, usuariovertodo, usuarionuevo, usuariobaja, usuariodelete, usuariobusqueda, usuariosearch, usuariomodificaciones, usuariomodificacionagarre, usuariomodificacion } from "../controller/controllerusuario.js";

const rusuario = express.Router();

rusuario.get('/usuario', usuariomenu)

rusuario.get('/usuariovertodo', usuariovertodo)

rusuario.get('/usuarioalta', usuarioalta)

rusuario.post('/usuarionuevo', usuarionuevo)

rusuario.get('/usuariobaja', usuariobaja)

rusuario.post('/usuariodelete', usuariodelete)

rusuario.get('/usuariobusqueda', usuariobusqueda)

rusuario.post('/usuariosearch', usuariosearch)

rusuario.get('/usuariomodificaciones', usuariomodificaciones)

rusuario.post('/usuariomodificacionagarre', usuariomodificacionagarre)

rusuario.post('/usuariomodificacion', usuariomodificacion)

export { rusuario }