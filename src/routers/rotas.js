const express = require('express');
const listaController = require('../controllers/listas');
const itemController = require('../controllers/itens');

const router = express.Router();

// Rotas para listas
router.post('/listas', listaController.criarLista);
router.get('/listas', listaController.obterListas);
router.get('/listas/:id', listaController.obterListaPorId);
router.put('/listas/:id', listaController.atualizarLista);
router.delete('/listas/:id', listaController.excluirLista);

// Rotas para itens
router.post('/itens', itemController.criarItem);
router.get('/itens', itemController.obterItens);
router.put('/itens/:id', itemController.atualizarItem);
router.delete('/itens/:id', itemController.excluirItem);

module.exports = router;
