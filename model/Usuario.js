const mongoose = require("mongoose");

const UsuarioSchema = mongoose.Schema(
  {
    nome: { type: String },
    cpf: { type: String },
    email: { type: String },
    senha: { type: String },
    nivelAcesso: { type: Number },
    rua: { type: String },
    numero: { type: Number },
    bairro: { type: String },
    cidade: { type: String },
    telefone: { type: String },
    dataNascimento: { type: String },
    cep: { type: String },
    status: { type: String, enum: ["ativo", "inativo"], default: "ativo" },
    foto: {
      originalName: { type: String },
      path: { type: String },
      size: { type: Number },
      mimetype: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usuario", UsuarioSchema);
