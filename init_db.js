const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

async function verEventos() {
    try {
        const res = await pool.query('SELECT * FROM eventos;');
        console.log('--- EVENTOS EN LA BASE DE DATOS ---');
        console.table(res.rows); // Esto te lo muestra ordenado como una tablita
    } catch (err) {
        console.error('Error al consultar:', err);
    } finally {
        await pool.end();
    }
}

verEventos();