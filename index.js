const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'es-MX,es;q=0.9',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Referer': 'https://www.google.com.mx/',
};

async function tryFahorro(barcode) {
  try {
    const url = `https://www.fahorro.com/catalogsearch/result/?q=${barcode}`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(data);

    // Intentar múltiples selectores posibles
    let name = '';
    const selectors = [
      '.product-item-link',
      '.product-item-info .product-item-link',
      'a.product-item-link',
      '.product-name a',
      'h2.product-name',
      '.item-info .product-name',
      'li.product-item h2 a',
      '[data-ui-id="page-title-wrapper"]',
      'ol.products li:first-child a.product-item-link',
    ];

    for (const sel of selectors) {
      name = $(sel).first().text().trim();
      if (name && name.length > 2) break;
    }

    return { found: !!name, name, selector_usado: name ? 'encontrado' : 'ninguno' };
  } catch(e) {
    return { found: false, error: e.message };
  }
}

async function tryBenavides(barcode) {
  try {
    // URL correcta de Benavides
    const url = `https://www.benavides.com.mx/catalogsearch/result/?q=${barcode}`;
    const { data, status } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    const $ = cheerio.load(data);

    let name = '';
    const selectors = [
      '.product-item-link',
      'a.product-item-link',
      '.product-name a',
      'h2.product-name',
    ];

    for (const sel of selectors) {
      name = $(sel).first().text().trim();
      if (name && name.length > 2) break;
    }

    return { found: !!name, name, status };
  } catch(e) {
    return { found: false, error: e.message, status: e.response?.status };
  }
}

app.get('/resolve', async (req, res) => {
  const { barcode } = req.query;
  if (!barcode) return res.status(400).json({ error: 'barcode requerido' });

  const r1 = await tryFahorro(barcode);
  if (r1.found) return res.json({ found: true, name: r1.name, brand: 'Farmacias del Ahorro', source: 'fahorro' });

  const r2 = await tryBenavides(barcode);
  if (r2.found) return res.json({ found: true, name: r2.name, brand: 'Benavides', source: 'benavides' });

  return res.json({ found: false });
});

// Endpoint de debug — muestra todos los selectores probados
app.get('/debug', async (req, res) => {
  const { barcode } = req.query;
  const r1 = await tryFahorro(barcode);
  const r2 = await tryBenavides(barcode);
  res.json({ fahorro: r1, benavides: r2 });
});

app.get('/html', async (req, res) => {
  const { barcode } = req.query;
  try {
    const url = `https://www.fahorro.com/catalogsearch/result/?q=${barcode}`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 10000 });
    // Devolver los primeros 3000 chars del HTML
    res.send('<pre>' + data.substring(0, 3000).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
  } catch(e) {
    res.json({ error: e.message });
  }
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Smart Meds API corriendo en puerto ${PORT}`));