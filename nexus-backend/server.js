require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const path     = require('path');
const helmet   = require('helmet');

const authRoutes  = require('./routes/authRoutes');
const cartRoutes  = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      "connect-src": ["'self'", "https://*.mongodb.net", "http://localhost:*", "http://127.0.0.1:*"],
    },
  },
}));

// Refined CORS
const ALLOWED_ORIGINS = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:5001',
  'http://127.0.0.1:5001',
  'https://nexus-app.onrender.com' // Example production URL
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin) || process.env.NODE_ENV !== 'production') {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/cart',   cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api', (req, res) => res.json({ status: 'NEXUS API running ✅' }));

// ── Static Frontend ───────────────────────────────────────────────────────────
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Handle SPA routing: serve index.html for any unknown non-API routes
app.get('/*all', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ── Error Handling ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} | ${req.method} ${req.url}`);
  console.error(err.stack);

  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred.' 
    : err.message;

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
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
