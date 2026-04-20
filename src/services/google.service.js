import { google } from 'googleapis';

const customsearch = google.customsearch('v1');

/**
 * Busca un medicamento por código de barras usando Google Custom Search
 * @param {string} barcode - Código de barras del medicamento
 * @returns {Promise<{found: boolean, name?: string}>}
 */
export async function searchByBarcode(barcode) {
  try {
    const response = await customsearch.cse.list({
      auth: process.env.GOOGLE_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: barcode,
      num: 1,
    });

    const items = response.data.items;
    if (items && items.length > 0) {
      let title = items[0].title;
      
      // Limpiar el título
      if (title.includes('|')) title = title.split('|')[0].trim();
      if (title.includes('-')) title = title.split('-')[0].trim();
      if (title.length > 100) title = title.substring(0, 100);
      
      return { found: true, name: title };
    }
    
    return { found: false };
  } catch (error) {
    console.error(`Error en Google: ${error.message}`);
    return { found: false };
  }
}