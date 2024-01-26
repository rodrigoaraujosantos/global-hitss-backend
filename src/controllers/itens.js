const knex = require('../conexao');

const cadastrarItem = async (req, res) => {
  const { nome, quantidade, id_lista } = req.body;

  console.log(nome, quantidade, id_lista);
  
  if (!nome ){
    return res.status(400).json({mensagem: "O campo'nome' é obrigatório."})
  };

  if (!quantidade ){
    return res.status(400).json({mensagem: "O campo 'quantidade' é obrigatório."})
  };

  if (id_lista === undefined || id_lista === null || id_lista === "") {
    return res.status(400).json({mensagem: "O campo 'id_lista' é obrigatório."});
  }

  // if (!id_lista ){
  //   return res.status(400).json({mensagem: "O campo 'id_lista' é obrigatório."})
  // };

  const listaValida = await knex('listas').where({id: id_lista}).first();

  if (!listaValida){
    return res.status(404).json({mensagem: "Id da lista não encontrado."})
  };

  try {

    const itemExistente = await knex('item').where({nome, id_lista}).first();

    if (itemExistente) {
      
      const atualizaQuantidade = await knex('item').where({id: itemExistente.id}).increment({quantidade: quantidade})
    } else {
      const novoItem = await knex('item').insert({nome, quantidade, id_lista});
    }

    return res.status(201).json({mensagem: "Novo item cadastrado com sucesso."});
    
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})    
  };
};

const obterItens = async (req, res) => {
  try {
    // const itens = await knex('item');
    const itens = await knex('item as i')
      .select('i.id', 'i.nome', 'i.quantidade', 'l.nome as nome_lista')
      .innerJoin('listas as l', 'i.id_lista', 'l.id');

    return res.status(200).json(itens)
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };
};

const atualizarItem = async (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, id_lista } = req.body;

  const idValido = await knex('item').where({id}).first();

  if (!idValido){
    return res.status(404).json({mensagem: "Id invalido."})
  };

  if (!nome || !quantidade || !id_lista){
    return res.status(400).json({mensagem: "Os campos 'nome', 'quantidade' e 'id_lista' são obrigatórios."})
  };

  const nomeExistente = await knex('item').where({nome}).first();

  if (nomeExistente) {
    return res.status(400).json({mensagem: "O nome informado já existe"})
  };

  try {

    const itemAtualizado = await knex('item').update({nome, quantidade, id_lista}).where({id});

    return res.status(201).json({mensagem: "Item atualizado com sucesso."});
    
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };
};

const excluirItem = async (req, res) => {
  const { id } = req.params;

  const idValido = await knex('item').where({id}).first();

  if (!idValido) {
    return res.status(404).json({mensagem: "Id invalido."})
  };

  try {
    const itemExcluido = await knex('item').where({id}).del();

    return res.status(200).json({mensagem: "Item escluido com sucesso."});
    
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };
};

module.exports = {
  cadastrarItem,
  obterItens,
  atualizarItem,
  excluirItem
}