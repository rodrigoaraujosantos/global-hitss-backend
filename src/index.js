require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routers/rotas');

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// Middleware para parsing de JSON
app.use(express.json());

// Rotas
app.use(router);

// Middleware para tratamento de rota desconhecida
app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensagem: 'Erro interno do servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
