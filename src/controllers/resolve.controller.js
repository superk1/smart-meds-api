import { resolveMedicamento } from '../services/medicamento.service.js';
import { validate, barcodeSchema } from '../schemas/validation.schemas.js';

/**
 * Controlador para el endpoint /resolve
 * Busca un medicamento por código de barras
 */
export async function resolveMedicamentoController(req, res) {
  const { barcode } = req.query;
  
  // Validar entrada
  const validation = validate({ barcode }, barcodeSchema);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.errors.join(', ') });
  }
  
  try {
    const result = await resolveMedicamento(barcode);
    return res.json(result);
  } catch (error) {
    console.error(`Error en resolveController: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}