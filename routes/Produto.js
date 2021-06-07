const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Produto = require('../model/Produto');

router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).send({
      errors: [{ message: 'Não foi possível obter os produtos!' }],
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    res.json(produto);
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: `Não foi possível obter o produto com o id ${req.params.id}!`,
        },
      ],
    });
  }
});

const validaProduto = [
  check('nome', 'Nome do Produto é obrigatório').not().isEmpty(),
  check('categoria', 'Nome da Categoria é obrigatório').not().isEmpty(),
  check('quantidade', 'A quantidade é obrigatória').not().isEmpty(),
  check('valor', 'O valor é obrigatório').not().isEmpty(),
  check('status', 'Informe um status válido para a categoria').isIn([
    'ativo',
    'inativo',
  ]),
];

//Inclui um novo produto
router.post('/', validaProduto, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  //Verifica se o produto já existe
  const { nome } = req.body;
  let produto = await Produto.findOne({ nome });
  if (produto)
    return res.status(200).json({
      errors: [{ message: 'Já existe um produto com o nome informado' }],
    });
  try {
    let produto = new Produto(req.body);
    await produto.save();
    res.send(produto);
  } catch (err) {
    return res.status(500).json({
      errors: [{ message: `Erro ao salvar o produto: ${err.message}` }],
    });
  }
});

//Deletar um produto
router.delete('/:id', async (req, res) => {
  await Produto.findByIdAndRemove(req.params.id)
    .then((produto) => {
      res.send({
        message: `Produto ${produto.nome} removida com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível apagar o produto com o id ${req.params.id}`,
          },
        ],
      });
    });
});

//Altera os dados do produto informado
router.put('/', validaProduto, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  let dados = req.body;
  await Produto.findByIdAndUpdate(
    req.body._id,
    {
      $set: dados,
    },
    { new: true },
  )
    .then((produto) => {
      res.send({
        message: `Produto ${produto.nome} alterado com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível alterar o produto com o id ${req.body._id}`,
          },
        ],
      });
    });
});

module.exports = router;
