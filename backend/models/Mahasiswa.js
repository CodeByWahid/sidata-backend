const mongoose = require('mongoose');

const MahasiswaSchema = new mongoose.Schema(
  {
    nama: { type: String, required: true },
    nim: { type: String, required: true, unique: true },
    jurusan: { type: String, required: true },
    ipk: { type: Number, required: true, min: 0, max: 4 },
    angkatan: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Mahasiswa', MahasiswaSchema);
