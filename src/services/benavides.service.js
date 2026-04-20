import axios from 'axios';
import * as cheerio from 'cheerio';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Referer': 'https://www.google.com.mx/',
};

/**
 * Busca un medicamento por código de barras en Benavides
 * @param {string} barcode - Código de barras del medicamento
 * @returns {Promise<{found: boolean, name?: string}>}
 */
export async function searchByBarcode(barcode) {
  try {
    const url = `https://www.benavides.com.mx/catalogsearch/result/?q=${barcode}`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(data);

    const selectors = [
      '.product-item-link',
      'a.product-item-link',
      '.product-name a',
      'h2.product-name',
    ];

    for (const selector of selectors) {
      const name = $(selector).first().text().trim();
      if (name && name.length > 2) {
        return { found: true, name };
      }
    }

    return { found: false };
  } catch (error) {
    console.error(`Error en Benavides: ${error.message}`);
    return { found: false };
  }
}