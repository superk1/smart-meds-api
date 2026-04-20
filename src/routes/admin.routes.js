import express from 'express';
import { getPendingController, approveController } from '../controllers/admin.controller.js';

const router = express.Router();

/**
 * GET /admin/pendientes
 * Obtiene medicamentos pendientes de aprobación (solo admin)
 */
router.get('/pendientes', getPendingController);

/**
 * POST /admin/aprobar/:barcode
 * Aprueba un medicamento (solo admin)
 */
router.post('/aprobar/:barcode', approveController);

export default router;