import express from "express";

const rinicio = express.Router();

rinicio.get('/', (req, res) => {
    res.render('index');
});

export { rinicio };