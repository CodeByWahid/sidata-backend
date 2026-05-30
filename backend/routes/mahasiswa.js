const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mahasiswa = require('../models/Mahasiswa');

// GET /api/mahasiswa - list with optional search?q=
router.get('/', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = {};
    if (q) {
      filter.$or = [{ nama: { $regex: q, $options: 'i' } }, { nim: { $regex: q, $options: 'i' } }];
    }
    const list = await Mahasiswa.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/mahasiswa/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const doc = await Mahasiswa.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/mahasiswa
router.post('/', auth, async (req, res) => {
  try {
    const { nama, nim, jurusan, ipk, angkatan } = req.body;
    if (!nama || !nim || !jurusan) return res.status(400).json({ error: 'Missing required fields' });
    if (typeof ipk !== 'number' || ipk < 0 || ipk > 4) return res.status(400).json({ error: 'Invalid IPK' });
    if (typeof angkatan !== 'number') return res.status(400).json({ error: 'Invalid angkatan' });

    const exists = await Mahasiswa.findOne({ nim });
    if (exists) return res.status(409).json({ error: 'NIM already exists' });

    const m = new Mahasiswa({ nama, nim, jurusan, ipk, angkatan });
    await m.save();
    res.status(201).json(m);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/mahasiswa/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const { nama, nim, jurusan, ipk, angkatan } = req.body;
    const update = {};
    if (nama) update.nama = nama;
    if (nim) update.nim = nim;
    if (jurusan) update.jurusan = jurusan;
    if (typeof ipk === 'number') update.ipk = ipk;
    if (typeof angkatan === 'number') update.angkatan = angkatan;

    const doc = await Mahasiswa.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/mahasiswa/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await Mahasiswa.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
