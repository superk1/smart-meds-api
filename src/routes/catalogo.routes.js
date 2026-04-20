import express from 'express';
import { addMedicamentoController, getCatalogoController } from '../controllers/catalogo.controller.js';

const router = express.Router();

/**
 * GET /catalogo
 * Obtiene todos los medicamentos aprobados
 */
router.get('/', getCatalogoController);

/**
 * POST /catalogo/agregar
 * Agrega un medicamento (queda pendiente de aprobación)
 */
router.post('/agregar', addMedicamentoController);

export default router;