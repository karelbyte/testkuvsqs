const express = require('express');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuración del cliente SQS
// En AWS EKS, las credenciales se manejan mediante IAM Roles for Service Accounts (IRSA),
// por lo que no necesitarás quemar llaves de acceso aquí.
const sqsClient = new SQSClient({ region: process.env.AWS_REGION || 'us-east-2' });
const QUEUE_URL = process.env.SQS_QUEUE_URL;

app.post('/api/evento', async (req, res) => {
    console.log('>>> Petición recibida en /api/evento:', req.body);
    
    try {
      const command = new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: JSON.stringify(req.body)
      });
  
      console.log('>>> Enviando a SQS URL:', process.env.SQS_QUEUE_URL);
      const response = await sqsClient.send(command);
      console.log('>>> ÉXITO SQS MessageId:', response.MessageId);
  
      return res.json({ status: 'queued', messageId: response.MessageId });
    } catch (error) {
      console.error('>>> ERROR AL ENVIAR A SQS:', error);
      return res.status(500).json({ status: 'error', error: error.message });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Express escuchando en el puerto ${PORT}`);
});