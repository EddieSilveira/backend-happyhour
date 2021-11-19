const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const InicializaMongoServer = require("./config/db");
InicializaMongoServer();
const jwt = require("jsonwebtoken");
const tokenSecret = process.env.SECRET;
const Usuario = require("./model/Usuario");

const rotasCategoria = require("./routes/Categoria");
const rotasProduto = require("./routes/Produto");
const rotasUsuario = require("./routes/Usuario");
const rotasPedido = require("./routes/Pedido");
const rotasUpload = require("./routes/Upload");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use("/files", express.static(path.resolve(__dirname, "public", "uploads")));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API adega funcionando!", versao: "1.0.3" });
});

function verificaJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, tokenSecret, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token" });

    req.userId = decoded.id;
    next();
  });
}

//Inclui um novo usuário
app.post("/cadastro", async (req, res) => {
  errors = [];
  //Verifica se o usuário já existe
  console.log(req.body);
  const { nome, cpf, email, senha } = req.body;
  let usuario = await Usuario.findOne({ nome });
  if (usuario)
    return res.status(200).json({
      errors: [{ message: "Já existe um usuario com o nome informado" }],
    });
  if (nome === "" || cpf === "" || email === "" || senha === "")
    return res.status(200).json({
      errors: [{ message: "Preencha os campos!" }],
    });
  try {
    let usuario = new Usuario(req.body);
    usuario.nivelAcesso = 1;
    await usuario.save();
    res.send(usuario);
  } catch (err) {
    return res.status(500).json({
      errors: [{ message: `Erro ao salvar o usuario: ${err.message}` }],
    });
  }
});

//Autenticação
app.post("/auth", async (req, res, next) => {
  const usuarios = await Usuario.find();

  const usuario = usuarios.find(
    (usuario) =>
      usuario.email === req.body.email && usuario.senha === req.body.password
  );
  if (!usuario)
    return res.status(400).send("Não foi possível encontrar o usuário!");

  try {
    if (
      req.body.email === usuario.email &&
      req.body.password === usuario.senha
    ) {
      const userAtivo = {
        id: usuario._id,
        email: usuario.email,
        nome: usuario.nome,
        cpf: usuario.cpf,
        nivelAcesso: usuario.nivelAcesso,
        status: usuario.status,
        createdAt: usuario.createdAt,
        rua: usuario.rua,
        numero: usuario.numero,
        bairro: usuario.bairro,
        cidade: usuario.cidade,
        cep: usuario.cep,
        telefone: usuario.telefone,
        dataNascimento: usuario.dataNascimento,
        foto: {
          path: usuario.foto.path,
          originalName: usuario.foto.originalName,
          size: usuario.foto.size,
          mimetype: usuario.foto.mimetype,
        },
      };
      const token = jwt.sign(userAtivo, tokenSecret, {
        expiresIn: 999,
      });

      return res.json({ auth: true, token: token });
    } else {
      return res.status(500).json({ message: "Login Inválido!" });
    }
  } catch (e) {
    res.status(500).send({ message: `Erro ${e}` });
  }

  // usuarios.forEach((usuario) => {
  //   if (
  //     req.body.email === usuario.email &&
  //     req.body.password === usuario.senha
  //   ) {
  //     const id = usuario._id;
  //     const token = jwt.sign({ id }, tokenSecret, {
  //       expiresIn: 999,
  //     });
  //     console.log(usuario)
  //     return res.json({ auth: true, token: token, usuario: usuario });
  //   } else {
  //     return res.status(500).json({ message: 'Login Inválido!' });
  //   }
  // });
});

app.post("/logout", function (req, res) {
  res.json({ auth: false, token: null });
});

app.use("/categorias", rotasCategoria);
app.use("/produtos", rotasProduto);
app.use("/pedidos", rotasPedido);
app.use("/usuarios", rotasUsuario);
app.use("/upload", rotasUpload);

app.use(function (req, res) {
  res.status(404).json({
    mensagem: `A rota ${req.originalUrl} não existe!`,
  });
});

app.listen(PORT, (req, res) => {
  console.log(`Servidor Web rodando na porta ${PORT}`);
});
