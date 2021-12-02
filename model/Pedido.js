const mongoose = require("mongoose");

const PedidoSchema = mongoose.Schema(
  {
    infoPedido: {
      id: { type: String },
      nome: { type: String },
      cpf: { type: String },
      dataNascimento: { type: String },
      email: { type: String },
      formPagamento: { type: String },
      telefone: { type: String },
      rua: { type: String },
      numero: { type: Number },
      bairro: { type: String },
      cidade: { type: String },

      valueTroco: { type: Number },
    },
    produtos: [],
    valorPedido: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("pedido", PedidoSchema);
