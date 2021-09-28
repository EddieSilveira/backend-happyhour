const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Usuario = require('../model/Usuario');

//Lista todos os usuarios
router.get('/', async (req, res) => {
  try {
    const usuario = await Usuario.find();
    res.json(usuario);
    console.log(usuario);
  } catch (err) {
    res.status(500).send({
      errors: [{ message: 'Não foi possível obter os usuários!' }],
    });
  }
});

//Lista o usuário pelo Id
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
  } catch (err) {
    res.status(500).send({
      errors: [
        {
          message: `Não foi possível obter o usuário com o id ${req.params.id}!`,
        },
      ],
    });
  }
});

const validaUsuario = [
  check('nome', 'Nome do Usuário é obrigatório').not().isEmpty(),
  check('cpf', 'CPF do Usuário é obrigatório').not().isEmpty(),
  check('email', 'Email do usuário é obrigatório').not().isEmpty(),
  check('email', 'Deve ser um email').isEmail(),
  check('senha', 'Senha é um campo obrigatório').not().isEmpty(),
  check('senha', 'A senha deve ter mais de 6 digitos').isLength({ min: 6 }),
  check('status', 'Informe um status válido para a categoria').isIn([
    'ativo',
    'inativo',
  ]),
];

//Inclui uma novo usuário
router.post('/', validaUsuario, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  //Verifica se o usuário já existe
  const { nome } = req.body;
  let usuario = await Usuario.findOne({ nome });
  if (usuario)
    return res.status(200).json({
      errors: [{ message: 'Já existe um usuario com o nome informado' }],
    });
  try {
    let usuario = new Usuario(req.body);
    await usuario.save();
    res.send(usuario);
  } catch (err) {
    return res.status(500).json({
      errors: [{ message: `Erro ao salvar o usuario: ${err.message}` }],
    });
  }
});

//Deletar um usuario
router.delete('/:id', async (req, res) => {
  await Usuario.findByIdAndRemove(req.params.id)
    .then((usuario) => {
      res.send({
        message: `Usuario ${usuario.nome} removido com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível apagar o usuário com o id ${req.params.id}`,
          },
        ],
      });
    });
});

//Altera os dados do usuario informado
router.put('/', validaUsuario, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  let dados = req.body;
  await Usuario.findByIdAndUpdate(
    req.body._id,
    {
      $set: dados,
    },
    { new: true },
  )
    .then((usuario) => {
      res.send({
        message: `Usuario ${usuario.nome} alterado com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(500).send({
        errors: [
          {
            message: `Não foi possível alterar o usuario com o id ${req.body._id}`,
          },
        ],
      });
    });
});

module.exports = router;
