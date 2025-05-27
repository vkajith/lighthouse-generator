import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import lighthouseRoutes from './routes/lighthouse.js';
import { errorHandler } from './middleware/errorHandler.js';
import { SERVER_CONFIG, RATE_LIMIT_CONFIG } from './constants/index.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: SERVER_CONFIG.ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());
app.use(rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/lighthouse', lighthouseRoutes);

app.use(errorHandler);

mongoose.connect(SERVER_CONFIG.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(SERVER_CONFIG.PORT, () => {
      logger.info(`Server running on port ${SERVER_CONFIG.PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }); 