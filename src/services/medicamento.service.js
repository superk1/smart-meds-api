import prisma from '../config/database.js';
import { searchByBarcode as searchGoogle } from './google.service.js';
import { searchByBarcode as searchBenavides } from './benavides.service.js';

/**
 * Busca un medicamento primero en BD local, luego en Google, luego en Benavides
 * @param {string} barcode - Código de barras
 * @returns {Promise<{found: boolean, name?: string, source?: string, requiresConfirmation?: boolean}>}
 */
export async function resolveMedicamento(barcode) {
  // 1. Buscar en base de datos local (aprobados)
  const local = await prisma.medicamento.findUnique({
    where: { barcode, approved: true },
  });
  
  if (local) {
    return { found: true, name: local.name, source: 'local', requiresConfirmation: false };
  }
  
  // 2. Buscar en Google
  const google = await searchGoogle(barcode);
  if (google.found) {
    return { found: true, name: google.name, source: 'google', requiresConfirmation: true };
  }
  
  // 3. Buscar en Benavides
  const benavides = await searchBenavides(barcode);
  if (benavides.found) {
    return { found: true, name: benavides.name, source: 'benavides', requiresConfirmation: false };
  }
  
  return { found: false };
}

/**
 * Agrega un medicamento a la tabla de pendientes (requiere aprobación de admin)
 * @param {string} barcode - Código de barras
 * @param {string} name - Nombre del medicamento
 * @param {string} brand - Marca (opcional)
 * @param {string} composition - Composición (opcional)
 */
export async function addPendingMedicamento(barcode, name, brand = '', composition = '') {
  return prisma.medicamento.upsert({
    where: { barcode },
    update: { name, brand, composition, approved: false },
    create: { barcode, name, brand, composition, approved: false },
  });
}

/**
 * Aprueba un medicamento pendiente (solo admin)
 * @param {string} barcode - Código de barras
 * @param {string} approvedBy - Email o ID del admin
 */
export async function approveMedicamento(barcode, approvedBy) {
  return prisma.medicamento.update({
    where: { barcode },
    data: { approved: true, approvedBy },
  });
}

/**
 * Obtiene todos los medicamentos pendientes (solo admin)
 */
export async function getPendingMedicamentos() {
  return prisma.medicamento.findMany({
    where: { approved: false },
  });
}

/**
 * Obtiene todos los medicamentos aprobados
 */
export async function getAllMedicamentos() {
  return prisma.medicamento.findMany({
    where: { approved: true },
  });
}