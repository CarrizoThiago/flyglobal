import express from "express";
import { estadisticamenu } from "../controller/controllerestadistica.js";

const restadistica = express.Router();

restadistica.get('/estadistica', estadisticamenu);

export { restadistica };