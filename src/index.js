const express = require('express');

const knex = require('./conexao');

const rota = require('./routers/rotas');

const app = express();

app.use(express.json());

app.use(rota);

app.listen(process.env.PORT);