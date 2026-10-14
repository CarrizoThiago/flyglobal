import express from "express";
import { raeropuerto } from "./rutaeropuerto.js";

const rinicio = express.Router();

rinicio.get('/', (req, res) => {
    res.render('index');
});

rinicio.use(raeropuerto);



export { rinicio };