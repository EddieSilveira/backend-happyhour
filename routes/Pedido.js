const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Pedido = require('../model/Pedido');

router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (err) {
    res.status(500).send({
      errors: [{ message: 'Não foi possível obter os pedidos!' }],
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    res.json(pedido);
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: `Não foi possível obter o pedido com o id ${req.params.id}!`,
        },
      ],
    });
  }
});

//Inclui um novo pedido
router.post('/', async (req, res) => {
  const errors = [];
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({
  //     errors: errors.array(),
  //   });
  // }

  // const { nome } = req.body;
  // let pedido = await Pedido.findOne({ nome });
  // console.log(pedido);
  // if (pedido)
  //   return res.status(200).json({
  //     errors: [{ message: 'Já existe um pedido com o nome informado' }],
  //   });
  try {
    let pedido = new Pedido(req.body);
    await pedido.save();
    res.send(pedido);
  } catch (err) {
    return res.status(500).json({
      errors: [{ message: `Erro ao salvar o pedido: ${err.message}` }],
    });
  }
});

//Deletar um pedido
router.delete('/:id', async (req, res) => {
  await Pedido.findByIdAndRemove(req.params.id)
    .then((pedido) => {
      res.send({
        message: `Pedido ${pedido.nome} removido com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível apagar o pedido com o id ${req.params.id}`,
          },
        ],
      });
    });
});

//Altera os dados do pedido informado
router.put('/', async (req, res) => {
  const errors = validationResult(req);
  let produto = {};
  req.body.produtos.forEach((item) => (produto = item));

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  let { nome, quantidade, preco } = produto;

  await Pedido.findByIdAndUpdate(
    req.body._id,
    {
      $set: nome,
      $set: quantidade,
      $set: preco,
    },
    { new: true },
  )
    .then((pedido) => {
      res.send({
        message: `Pedido ${pedido.nome} alterado com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível alterar o pedido com o id ${req.body._id}`,
          },
        ],
      });
    });
});

module.exports = router;
