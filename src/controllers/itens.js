const knex = require('../conexao');
const Joi = require('joi');

const schemaItem = Joi.object({
  nome: Joi.string().required(),
  quantidade: Joi.number().required(),
  id_lista: Joi.number().required()
});

const criarItem = async (req, res) => {
  try {
    const { error } = schemaItem.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: error.details[0].message });
    }

    const { nome, quantidade, id_lista } = req.body;

    const listaValida = await knex('listas').where({ id: id_lista }).first();
    if (!listaValida) {
      return res.status(404).json({ mensagem: "Id da lista não encontrado." });
    }

    const itemExistente = await knex('itens').where({ nome, id_lista }).first();
    if (itemExistente) {
      await knex('itens').where({ id: itemExistente.id }).increment({ quantidade: quantidade });
    } else {
      await knex('itens').insert({ nome, quantidade, id_lista });
    }

    return res.status(201).json({ mensagem: "Novo item cadastrado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const obterItens = async (req, res) => {
  try {
    const itens = await knex('itens as i')
      .select('i.id', 'i.nome', 'i.quantidade', 'l.nome as nome_lista')
      .innerJoin('listas as l', 'i.id_lista', 'l.id');

    return res.status(200).json(itens);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const atualizarItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = schemaItem.validate(req.body);
    if (error) {
      return res.status(400).json({ mensagem: error.details[0].message });
    }

    const { nome, quantidade, id_lista } = req.body;

    const idValido = await knex('itens').where({ id }).first();
    if (!idValido) {
      return res.status(404).json({ mensagem: "Id inválido." });
    }

    const nomeExistente = await knex('itens').where({ nome }).whereNot({ id }).first();
    if (nomeExistente) {
      return res.status(400).json({ mensagem: "O nome informado já existe." });
    }

    await knex('itens').update({ nome, quantidade, id_lista }).where({ id });

    return res.status(200).json({ mensagem: "Item atualizado com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

const excluirItem = async (req, res) => {
  try {
    const { id } = req.params;

    const idValido = await knex('itens').where({ id }).first();
    if (!idValido) {
      return res.status(404).json({ mensagem: "Id inválido." });
    }

    await knex('itens').where({ id }).del();

    return res.status(200).json({ mensagem: "Item excluído com sucesso." });
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor", error: error.message });
  }
};

module.exports = {
  criarItem,
  obterItens,
  atualizarItem,
  excluirItem
};
