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
      valorPedido: { type: Number },
      valueTroco: { type: Number },
    },
    produtos: [
      //  [
      //   idProduto: {type: String},
      //   produto: {
      //     nome: {type: String},
      //     categoria: {type: String},
      //     descricao: {type: String},
      //     quantidade: {type: Number},
      //     valor: {type: Number},
      //     volume: {type: String},
      //     teor: {type: String}
      //     foto: {
      //       path: {type: String},
      //       mimetype: {type: String},
      //       path: {type: String},
      //       size: {type: Number}
      //     }
      //   }
      // ]
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("pedido", PedidoSchema);
