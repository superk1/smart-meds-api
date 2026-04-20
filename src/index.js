import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

// Importar rutas
import resolveRoutes from './routes/resolve.routes.js';
import catalogoRoutes from './routes/catalogo.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Configurar logger
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/resolve', resolveRoutes);
app.use('/catalogo', catalogoRoutes);
app.use('/admin', adminRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Smart Meds API',
    version: '1.0.0',
    endpoints: {
      resolve: 'GET /resolve?barcode=XXXXX',
      catalogo: 'GET /catalogo',
      agregar: 'POST /catalogo/agregar',
      admin: 'GET /admin/pendientes | POST /admin/aprobar/:barcode',
      health: 'GET /health',
    },
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Smart Meds API corriendo en puerto ${PORT}`);
});