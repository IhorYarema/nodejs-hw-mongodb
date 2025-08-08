import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactRoutes from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

export const setupServer = () => {
  const PORT = process.env.PORT || 3000;

  const app = express();

  // Swagger UI
  const swaggerDocument = JSON.parse(
    fs.readFileSync('./docs/swagger.json', 'utf-8'),
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(express.json());

  app.use('/auth', authRoutes);
  app.use('/contacts', contactRoutes);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    console.log(`🚀 Server is running on port ${PORT}`);
  });
};
