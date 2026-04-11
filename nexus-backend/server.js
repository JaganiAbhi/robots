require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');

const authRoutes  = require('./routes/authRoutes');
const cartRoutes  = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
// Allow any localhost / 127.0.0.1 origin during development
const ALLOWED_ORIGINS = /^(null|https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?)$/;
app.use(cors({
  origin: (origin, cb) => {
    // Allow if no origin (e.g. mobile apps, curl) or if origin is allowed
    // For Render deployment, we might just allow all if we aren't strict, or we add production URL later.
    // To make it easy, we will allow all in production.
    if (!origin || ALLOWED_ORIGINS.test(origin) || process.env.NODE_ENV === 'production') return cb(null, true);
    // As a fallback for Render deployment, just let it pass if not explicitly failing
    return cb(null, true); 
  },
  credentials: true
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/cart',   cartRoutes);
app.use('/api/orders', orderRoutes);

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api', (req, res) => res.json({ status: 'NEXUS API running ✅' }));

// Catch-all route to serve index.html for SPA (if applicable) or default page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Database ──────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nexus';

// Function to mask the MONGO_URI for logging (hides password)
const getMaskedUri = (uri) => {
  try {
    const url = new URL(uri.startsWith('mongodb') ? uri : `mongodb://${uri}`);
    if (url.password) url.password = '****';
    return url.toString();
  } catch (e) {
    return 'Sensitive URI (masked)';
  }
};

console.log('');
console.log('╔══════════════════════════════════════════╗');
console.log('║     NEXUS BACKEND  — DEBUG BUILD         ║');
console.log(`║     Started: ${new Date().toISOString()}  ║`);
console.log('╚══════════════════════════════════════════╝');
console.log('');
console.log('⏳ Connecting to MongoDB...');

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Fail fast if can't connect (5s)
})
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`✅  MongoDB connected → ${getMaskedUri(MONGO_URI)}`);
    console.log(`📁  Target Database: ${dbName}`);
    app.listen(PORT, () => {
      console.log(`🚀  NEXUS backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌  CRITICAL: MongoDB connection failed!');
    console.error('    Error detail:', err.message);
    if (err.message.includes('timeout')) {
      console.log('    (Connection timed out - usually an IP Whitelisting issue in Atlas)');
    }
    console.log('\nPossible fixes:');
    console.log('1. Check if your current IP is whitelisted in MongoDB Atlas.');
    console.log('2. Verify the MONGO_URI in your .env file.');
    console.log('3. Ensure your database user has "readWrite" permissions.');
    process.exit(1); 
  });
