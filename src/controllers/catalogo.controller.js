import { addPendingMedicamento, getAllMedicamentos } from '../services/medicamento.service.js';
import { validate, addMedicamentoSchema } from '../schemas/validation.schemas.js';

/**
 * Controlador para agregar un medicamento al catálogo (usuario normal)
 * Guarda como pendiente, requiere aprobación de admin
 */
export async function addMedicamentoController(req, res) {
  const { barcode, name, brand, composition } = req.body;
  
  // Validar entrada
  const validation = validate({ barcode, name, brand, composition }, addMedicamentoSchema);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.errors.join(', ') });
  }
  
  try {
    const result = await addPendingMedicamento(barcode, name, brand || '', composition || '');
    return res.json({ 
      success: true, 
      message: 'Medicamento guardado pendiente de aprobación',
      data: result 
    });
  } catch (error) {
    console.error(`Error en addMedicamentoController: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Controlador para obtener todos los medicamentos aprobados
 */
export async function getCatalogoController(req, res) {
  try {
    const medicamentos = await getAllMedicamentos();
    return res.json({ total: medicamentos.length, medicamentos });
  } catch (error) {
    console.error(`Error en getCatalogoController: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}