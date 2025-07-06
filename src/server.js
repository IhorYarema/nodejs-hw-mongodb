import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactRoutes from './routes/contactRoutes.js';

export const setupServer = () => {
  const PORT = process.env.PORT || 3000;

  const app = express();

  app.use(cors());
  app.use(pino());

  app.use(express.json());

  app.use('/', contactRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Server is running on port ${PORT}`);
  });
};
