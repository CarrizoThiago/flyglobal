import mysql from 'mysql2/promise';

let pool = null;

export async function conectar() {
    try {
        if (!pool) {
            pool = mysql.createPool({
                host: 'localhost',
                database: 'ruiz_bd',
                user: 'root',
                password: 'RiverPlate1986!',
                dateStrings: true
            });
            console.log('conexion exitosa');
        }
        return pool;
    } catch (error) {
        console.log(error);
        return null;
    }
}
