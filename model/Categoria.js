const mongoose = require('mongoose');

const CategoriaSchema = mongoose.Schema(
  {
    nome: { type: String, unique: true },
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

module.exports = mongoose.model('categoria', CategoriaSchema);
