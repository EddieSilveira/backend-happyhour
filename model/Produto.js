const mongoose = require('mongoose');

const ProdutoSchema = mongoose.Schema(
  {
    nome: { type: String, unique: true },
    descricao: {type: String},
    categoria: { type: String },
    quantidade: { type: Number },
    valor: { type: Number },
    status: { type: String, enum: ['ativo', 'inativo'], default: 'ativo' },
    foto: {
      originalName: { type: String },
      path: { type: String },
      size: { type: Number },
      mimetype: { type: String },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('produto', ProdutoSchema);
