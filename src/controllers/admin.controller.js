import { approveMedicamento, getPendingMedicamentos } from '../services/medicamento.service.js';

// Clave secreta para autenticación de admin (cámbiala por una segura)
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'mi-clave-secreta-admin-2025';

/**
 * Verifica si la petición tiene autorización de admin
 */
function isAdmin(req) {
  const token = req.headers['x-admin-token'];
  return token === ADMIN_SECRET;
}

/**
 * Controlador para obtener medicamentos pendientes (solo admin)
 */
export async function getPendingController(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  try {
    const pendientes = await getPendingMedicamentos();
    return res.json({ total: pendientes.length, pendientes });
  } catch (error) {
    console.error(`Error en getPendingController: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

/**
 * Controlador para aprobar un medicamento (solo admin)
 */
export async function approveController(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  
  const { barcode } = req.params;
  const approvedBy = req.headers['x-admin-email'] || 'admin';
  
  if (!barcode) {
    return res.status(400).json({ error: 'barcode requerido' });
  }
  
  try {
    const result = await approveMedicamento(barcode, approvedBy);
    return res.json({ success: true, message: 'Medicamento aprobado', data: result });
  } catch (error) {
    console.error(`Error en approveController: ${error.message}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}