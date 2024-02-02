const knex = require('../conexao');
const Joi = require('joi');

const schemaLista = Joi.object({
  nome: Joi.string().required()
});

const criarLista = async (req, res) => {
  try {
    const { error } = schemaLista.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: error.details[0].message });
    }

    const { nome } = req.body;

    const nomeExistente = await knex('listas').where({ nome }).first();
    if (nomeExistente) {
      return res.status(400).json({ mensagem: "O nome informado já existe" });
    }

    const novaLista = await knex('listas').insert({ nome }).returning('*');
    return res.status(201).json({ mensagem: "Lista criada com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const obterListas = async (req, res) => {
  try {
    const listas = await knex('listas');
    return res.status(200).json(listas);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const obterListaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const lista = await knex('listas').where({ id }).first();

    if (!lista) {
      return res.status(404).json({ mensagem: 'Lista não encontrada' });
    }

    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor', error: error.message });
  }
};

const atualizarLista = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const idValido = await knex('listas').where({ id }).first();
    if (!idValido) {
      return res.status(404).json({ mensagem: "Id da lista inválido" });
    }

    const { error } = schemaLista.validate({ nome });
    if (error) {
      return res.status(400).json({ mensagem: error.details[0].message });
    }

    const nomeExistente = await knex('listas').where({ nome }).whereNot({ id }).first();
    if (nomeExistente) {
      return res.status(400).json({ mensagem: "O nome informado já existe" });
    }

    await knex('listas').update({ nome }).where({ id }).returning('*');

    return res.status(201).json({ mensagem: "Lista atualizada com sucesso(backend)" });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const excluirLista = async (req, res) => {
  try {
    const { id } = req.params;

    const idValido = await knex('listas').where({ id }).first();
    if (!idValido) {
      return res.status(404).json({ mensagem: "Id da lista inválido" });
    }

    await knex('listas').where({ id }).del();

    return res.status(200).json({ mensagem: "Lista excluída com sucesso" });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

module.exports = {
  criarLista,
  obterListas,
  atualizarLista,
  excluirLista,
  obterListaPorId
};
