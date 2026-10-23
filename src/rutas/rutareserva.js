import express from "express";
import { reservamenu, reservavertodo, reservabusqueda, reservasearch, reservaalta, reservanuevo, reservabaja, reservadelete, reservamodificaciones, reservamodificacionagarre, reservamodificacion } from "../controller/controllerreserva.js";

const rreserva = express.Router();

rreserva.get('/reserva', reservamenu);

rreserva.get('/reservavertodo', reservavertodo);

rreserva.get('/reservabusqueda', reservabusqueda);
rreserva.post('/reservasearch', reservasearch);

rreserva.get('/reservaalta', reservaalta);
rreserva.post('/reservanuevo', reservanuevo);

rreserva.get('/reservabaja', reservabaja);
rreserva.post('/reservadelete', reservadelete);

rreserva.get('/reservamodificaciones', reservamodificaciones);
rreserva.post('/reservamodificacionagarre', reservamodificacionagarre);
rreserva.post('/reservamodificacion', reservamodificacion);

export { rreserva }
