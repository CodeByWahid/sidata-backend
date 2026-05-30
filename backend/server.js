require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const mhsRoutes = require('./routes/mahasiswa');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mhsRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve frontend static files when available (production)
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not set');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}

async function startServer() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.error('❌ MONGODB_URI tidak ditemukan di .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('✅ MongoDB Atlas terhubung!');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer();
