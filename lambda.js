const { Pool } = require('pg');

// Configuración de la base de datos usando variables de entorno de AWS
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Crucial para que AWS Lambda conecte a RDS
});

exports.handler = async (event) => {
    console.log(`Recibidos ${event.Records.length} mensajes desde SQS.`);
    
    for (const record of event.Records) {
        try {
            const datos = JSON.parse(record.body);
            
            const query = 'INSERT INTO eventos (id_usuario, accion) VALUES ($1, $2)';
            const values = [datos.id_usuario, datos.accion];
            
            await pool.query(query, values);
            console.log(`Insertado con éxito usuario: ${datos.id_usuario}`);
            
        } catch (error) {
            console.error('Error procesando mensaje individual:', error);
            throw error; // Al lanzar el error, SQS sabe que el mensaje falló y no lo borra
        }
    }
    
    return { status: 'Lote Procesado' };
};