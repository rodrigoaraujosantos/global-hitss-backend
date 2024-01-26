const knex = require('../conexao');

const criarLista = async (req, res) => {
  const { nome } = req.body;


  if (!nome) {
    return res.status(400).json({mensagem: "O campo 'nome' é obrigatorio"})
  };

  const nomeExistente = await knex('listas').where({nome}).first();

  if (nomeExistente){
    return res.status(400).json({mensagem: "O nome informado ja existe"})
  };

  try {
    const novaLista = await knex('listas').insert({nome}).returning('*');

    return res.status(201).json({mensagem: "Lista criada com sucesso"})
    
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  }; 
};

const obterListas = async (req, res) => {
  
  const listas = await knex('listas');
  // console.log(listas);
  try {
    return res.status(200).json(listas)
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };
};

const atualizarLista = async (req, res) => {
  // console.log('atualizar lista front');
  const { id } = req.params;
  const { nome } = req.body;
  
  const idValido = await knex('listas').where({id}).first();

  if (!idValido){
    return res.status(404).json({mensagem: "Id da lista invalido"})
  };

  if (!nome){
    return res.status(400).json({mensagem: "Informe o novo nome da lista."})
  };

  const nomeExistente = await knex('listas').where({nome}).first();

  if (nomeExistente) {
    return res.status(400).json({mensagem: "O nome informado já existe"})
  };

  try {
    const listaAtualizada = await knex('listas').update({nome}).where({id});

    return res.status(201).json({mensagem: "Lista atualizada com sucesso"})
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };
};

const excluirLista = async (req, res) => {
  const { id } = req.params;
  
  const idValido = await knex('listas').where({id: id}).first();

  if (!idValido){
    return res.status(404).json({mensagem: "Id da lista invalido"})
  };

  try {
    const listaExcluida = await knex('listas').where({id: id}).del();

    return res.status(200).json({mensagem: "Lista excluida com sucesso"})
    
  } catch (error) {
    return res.status(500).json({mensagem: "Erro interno do servidor", error: error.message})
  };

};


module.exports = {
  criarLista,
  obterListas,
  atualizarLista,
  excluirLista
}