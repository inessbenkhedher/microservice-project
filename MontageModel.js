const mongoose = require('./db');

const MontageSchema = new mongoose.Schema({
  titre: String,
  nombre_pieces: Number,
  // Ajoutez d'autres champs nécessaires ici
});

const Montage = mongoose.model('Montage', MontageSchema);

module.exports = Montage;
