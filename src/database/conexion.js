import mysql from 'mysql2/promise';
export async function conectar() {
    try {
        const bdd = await mysql.createPool({
            host: 'localhost',
            database: 'ruiz_bd',
            user: 'root',
            password: 'RiverPlate1986!'
        });
        console.log('conexion exitosa');
        return bdd;
    } catch (error) {
        console.log(error);
    }
}
