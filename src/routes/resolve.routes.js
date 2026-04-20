import express from 'express';
import { resolveMedicamentoController } from '../controllers/resolve.controller.js';

const router = express.Router();

/**
 * GET /resolve?barcode=XXXXX
 * Busca un medicamento por código de barras
 */
router.get('/', resolveMedicamentoController);

export default router;