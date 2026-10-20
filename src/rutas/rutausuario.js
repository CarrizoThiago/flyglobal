import express from "express";
import { usuariomenu, usuarioalta, usuarionuevo } from "../controller/controllerusuario.js";

const rusuario = express.Router();

rusuario.get('/usuario', usuariomenu)

rusuario.get('/usuarioalta', usuarioalta)

rusuario.post('/usuarionuevo', usuarionuevo)
export { rusuario }