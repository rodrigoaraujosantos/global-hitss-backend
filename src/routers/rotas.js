const express = require('express');
const { criarLista, obterListas, atualizarLista, excluirLista } = require('../controllers/listas');
const { cadastrarItem, obterItens, atualizarItem, excluirItem } = require('../controllers/itens');

const rota = express.Router();

rota.post('/lista', criarLista);
rota.get('/lista', obterListas);
rota.put('/lista/:id', atualizarLista);
rota.delete('/lista/:id', excluirLista);

rota.post('/item', cadastrarItem);
rota.get('/item', obterItens);
rota.put('/item/:id', atualizarItem);
rota.delete('/item/:id', excluirItem);

module.exports = rota;