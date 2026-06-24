// server.js
require('dotenv').config(); // ✅ Load environment variables first

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routers
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoutes');
const getProductsRouter = require('./routes/getProducts');
const cartRoutes = require('./routes/cartRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const orderRoute = require('./routes/orderRoute');
const adminOrderRoutes = require('./routes/adminOrderRoutes');

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Check MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in environment variables. Exiting.');
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// ✅ Middleware setup
const allowedOrigins = [
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy does not allow origin ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send('👋 Hello from backend — server is running smoothly!');
});
// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/getProducts', getProductsRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', stripeRoutes);
app.use('/api/order', orderRoute);
app.use('/api/admin', adminOrderRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is now running on port ${PORT}`);
});
