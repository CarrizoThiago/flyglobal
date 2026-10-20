import express from "express";
import { usuariomenu, usuarioalta, usuariovertodo, usuarionuevo } from "../controller/controllerusuario.js";

const rusuario = express.Router();

rusuario.get('/usuario', usuariomenu)

rusuario.get('/usuariovertodo', usuariovertodo)

rusuario.get('/usuarioalta', usuarioalta)

rusuario.post('/usuarionuevo', usuarionuevo)
export { rusuario }