import express from "express";
import { usuariomenu, usuarioalta, usuariovertodo, usuarionuevo, usuariobaja, usuariodelete } from "../controller/controllerusuario.js";

const rusuario = express.Router();

rusuario.get('/usuario', usuariomenu)

rusuario.get('/usuariovertodo', usuariovertodo)

rusuario.get('/usuarioalta', usuarioalta)

rusuario.post('/usuarionuevo', usuarionuevo)

rusuario.get('/usuariobaja', usuariobaja)

rusuario.post('/usuariodelete', usuariodelete)

export { rusuario }