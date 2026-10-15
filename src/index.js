import express from "express";
import colors from "colors";
import Path from "path";
import { fileURLToPath } from "url";


const puerto = 3000;
const app = express();


app.set('view engine', 'ejs');

const directorio = Path.dirname(fileURLToPath(import.meta.url));
console.log(directorio);
app.set('views', Path.join(directorio, 'vistas'));

app.use('/styles', express.static(Path.join(directorio, 'styles')));
app.use('/img', express.static(Path.join(directorio, 'img')));



app.use(express.urlencoded({ extended: false }));


import { rinicio } from "./rutas/rutainicio.js";
app.use(rinicio);


app.listen(puerto, () => {
    console.log(`Servidor iniciando en el puerto ${puerto}`.blue);
});