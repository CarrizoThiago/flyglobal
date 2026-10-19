import express from "express";
import { avionmenu } from "../controller/controlleravion.js";
const ravion = express.Router();

ravion.get('/avion', avionmenu)

export { ravion }