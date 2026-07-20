const express = require('express');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración del cliente SQS
// En AWS EKS, las credenciales se manejan mediante IAM Roles for Service Accounts (IRSA),
// por lo que no necesitarás quemar llaves de acceso aquí.
const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

app.post('/api/evento', async (req, res) => {
    try {
        const payload = req.body;

        // Preparamos el comando para enviar a la fila de SQS
        const command = new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(payload),
        });

        // Enviamos a SQS de forma asíncrona
        await sqsClient.send(command);

        // Respondemos de inmediato al cliente con un 202 (Aceptado)
        // No esperamos a que se guarde en la Base de Datos
        return res.status(202).json({ status: 'queued' });
    } catch (error) {
        console.error('Error enviando a SQS:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Express escuchando en el puerto ${PORT}`);
});