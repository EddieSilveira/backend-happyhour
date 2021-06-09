const mongoose = require('mongoose');

const PedidoSchema = mongoose.Schema(
  {
    numeroPedido: { type: Number },
    idUsuario: { type: String },
    produtos: [
      {
        nome: { type: String },
        quantidade: { type: Number },
        valorUnidade: { type: Number },
      },
    ],
    valorPedido: { type: Number },
  },
  { timestamps: true },
);

module.exports = mongoose.model('pedido', PedidoSchema);
