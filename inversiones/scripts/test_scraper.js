/**
 * Script de prueba y verificación de Web Scraping
 * Scotiabank Finmarkets (Bolsa de Santiago & Indicadores Económicos)
 *
 * Ejecución: node scripts/test_scraper.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function parseChileanNumber(str) {
  if (!str) return null;
  // Ejemplo: "11.137,23" -> 11137.23, "-1,06%" -> -1.06, "+0,57%" -> 0.57
  const cleaned = str.replace(/[+%]/g, '').trim().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function parseCorredoraHtml(html) {
  // 1. IPSA Principal
  const ipsaPriceMatch = html.match(/class="valor"[^>]*>\s*<strong>([^<]+)<\/strong>/);
  const ipsaVarMatch = html.match(/Var\. % d[ií]a[\s\S]*?class="nemo[^"]*">\s*([^<\s]+)/);
  const ipsaDateMatch = html.match(/Fecha\s*<strong>([^<]+)<\/strong>/);
  const ipsaPointsMatch = html.match(/\[\s*<span[^>]*class="nemo[^"]*">\s*([^<]+)\s*<\/span>\s*\]/);

  // Rentabilidades y Min/Max
  const minValMatch = html.match(/Valor\s+m(?:[ií]|&iacute;)nimo\s+del\s+d(?:[ií]|&iacute;)a:[\s\S]*?<span class="valor">\s*([^<]+)\s*<\/span>/i);
  const maxValMatch = html.match(/Valor\s+m(?:[aá]|&aacute;)ximo\s+del\s+d(?:[ií]|&iacute;)a:[\s\S]*?<span class="valor">\s*([^<]+)\s*<\/span>/i);
  const rentMtdMatch = html.match(/Mes a la fecha:[\s\S]*?<span class="[^"]*">\s*([^<]+)\s*<\/span>/i);
  const rent1mMatch = html.match(/1 Mes:[\s\S]*?<span class="[^"]*">\s*([^<]+)\s*<\/span>/i);
  const rent3mMatch = html.match(/3 Meses:[\s\S]*?<span class="[^"]*">\s*([^<]+)\s*<\/span>/i);
  const rent6mMatch = html.match(/6 Meses:[\s\S]*?<span class="[^"]*">\s*([^<]+)\s*<\/span>/i);
  const rentYtdMatch = html.match(/(?:Año|A&ntilde;o)\s+a\s+la\s+Fecha:[\s\S]*?<span class="[^"]*">\s*([^<]+)\s*<\/span>/i);

  const ipsa = {
    fecha_mercado: ipsaDateMatch ? ipsaDateMatch[1].trim() : null,
    precio: parseChileanNumber(ipsaPriceMatch ? ipsaPriceMatch[1] : null),
    precio_str: ipsaPriceMatch ? ipsaPriceMatch[1].trim() : null,
    variacion_pct: parseChileanNumber(ipsaVarMatch ? ipsaVarMatch[1] : null),
    variacion_puntos: parseChileanNumber(ipsaPointsMatch ? ipsaPointsMatch[1] : null),
    min_dia: parseChileanNumber(minValMatch ? minValMatch[1] : null),
    max_dia: parseChileanNumber(maxValMatch ? maxValMatch[1] : null),
    rent_mes_fecha: parseChileanNumber(rentMtdMatch ? rentMtdMatch[1] : null),
    rent_1m: parseChileanNumber(rent1mMatch ? rent1mMatch[1] : null),
    rent_3m: parseChileanNumber(rent3mMatch ? rent3mMatch[1] : null),
    rent_6m: parseChileanNumber(rent6mMatch ? rent6mMatch[1] : null),
    rent_ytd: parseChileanNumber(rentYtdMatch ? rentYtdMatch[1] : null)
  };

  // 2. Metadatos de Constituyentes desde JS
  const constituentsMap = {};
  const jsonConstituentsMatch = html.match(/var jsonConstituents = (\[.*?\]);/s);
  if (jsonConstituentsMatch) {
    try {
      const list = JSON.parse(jsonConstituentsMatch[1]);
      list.forEach(c => {
        constituentsMap[c.symbol] = c.name;
      });
    } catch (e) {
      console.error('Error parseando jsonConstituents:', e.message);
    }
  }

  // 3. Acciones IPSA (30 acciones)
  const stockRowRegex = /<td class="con-nombre">\s*<span class="ins constituentsNotation"[^>]*title="([^"]+)"[^>]*>\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-valor">\s*<span[^>]*>\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-var">\s*<span[^>]*class="nemo\s+([^"]+)"[^>]*>\s*([^<]+)\s*<\/span>/g;
  let match;
  const acciones = [];
  while ((match = stockRowRegex.exec(html)) !== null) {
    const symbol = match[1].trim();
    acciones.push({
      symbol: symbol,
      nombre: constituentsMap[symbol] || symbol,
      precio: parseChileanNumber(match[3]),
      precio_str: match[3].trim(),
      direccion: match[4].trim(),
      variacion_pct: parseChileanNumber(match[5]),
      variacion_str: match[5].trim()
    });
  }

  // 4. Índices Sectoriales
  const sectorRegex = /<span id="[0-9]+_([A-Z0-9]+)" class="ins indicesSectorialName">\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-valor">\s*<span[^>]*>\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-var">\s*<span class="nemo\s+([^"]+)"[^>]*>\s*([^<]+)\s*<\/span>/g;
  const sectoriales = [];
  while ((match = sectorRegex.exec(html)) !== null) {
    sectoriales.push({
      codigo: match[1].trim(),
      puntos: parseChileanNumber(match[3]),
      puntos_str: match[3].trim(),
      direccion: match[4].trim(),
      variacion_pct: parseChileanNumber(match[5]),
      variacion_str: match[5].trim()
    });
  }

  // 5. Mayores Alzas
  const topRegex = /<span class="ins stockTop" title=([^>]+) id="TOP_name_[0-9]+">\s*([^<]+)\s*<\/span>[\s\S]*?<span class="off" id="TOP_price_[0-9]+">\s*([^<]+)\s*<\/span>[\s\S]*?<span class="([^"]+)" id="TOP_pct_[0-9]+">\s*([^<]+)\s*<\/span>/g;
  const mayores_alzas = [];
  let pos = 1;
  while ((match = topRegex.exec(html)) !== null) {
    mayores_alzas.push({
      posicion: pos++,
      symbol: match[2].trim(),
      precio: parseChileanNumber(match[3]),
      variacion_pct: parseChileanNumber(match[5]),
      direccion: match[4].trim()
    });
  }

  // 6. Mayores Bajas
  const flopRegex = /<span class="ins stockFlop" title=([^>]+) id="FLOP_name_[0-9]+">\s*([^<]+)\s*<\/span>[\s\S]*?<span class="off" id="FLOP_price_[0-9]+">\s*([^<]+)\s*<\/span>[\s\S]*?<span class="([^"]+)" id="FLOP_pct_[0-9]+">\s*([^<]+)\s*<\/span>/g;
  const mayores_bajas = [];
  pos = 1;
  while ((match = flopRegex.exec(html)) !== null) {
    mayores_bajas.push({
      posicion: pos++,
      symbol: match[2].trim(),
      precio: parseChileanNumber(match[3]),
      variacion_pct: parseChileanNumber(match[5]),
      direccion: match[4].trim()
    });
  }

  return { ipsa, acciones, sectoriales, mayores_alzas, mayores_bajas };
}

function parseInversionesHtml(html) {
  // Indicadores Económicos (UF, UTM, Dólar Observado, IPC, Tasas)
  const indRegex = /<span id="[0-9]+_([^"]+)" class="ins currencyName">\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-valor">\s*<span[^>]*>\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-var">\s*<span class="([^"]+)"[^>]*>\s*([^<]+)\s*<\/span>/g;
  let match;
  const indicadores = [];
  while ((match = indRegex.exec(html)) !== null) {
    indicadores.push({
      nombre: match[2].trim(),
      valor: parseChileanNumber(match[3]),
      valor_str: match[3].trim(),
      direccion: match[4].trim(),
      variacion_pct: parseChileanNumber(match[5]),
      variacion_str: match[5].trim()
    });
  }

  // Commodities (Cobre Cash, Cobre Futuro, Petróleo, Oro, Plata, Celulosa)
  const commRegex = /<span id="[0-9]+_([^"]+)" class="ins commmoditiesName">\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-valor">\s*<span[^>]*>\s*([^<]+)\s*<\/span>\s*<\/td>\s*<td class="con-var">\s*<span class="([^"]+)"[^>]*>\s*([^<]+)\s*<\/span>/g;
  const commodities = [];
  while ((match = commRegex.exec(html)) !== null) {
    commodities.push({
      nombre: match[2].trim(),
      valor: parseChileanNumber(match[3]),
      valor_str: match[3].trim(),
      direccion: match[4].trim(),
      variacion_pct: parseChileanNumber(match[5]),
      variacion_str: match[5].trim()
    });
  }

  return { indicadores, commodities };
}

async function main() {
  console.log('=== Iniciando Verificación de Scraping Scotiabank Finmarkets ===\n');

  let corredoraHtml = '';
  let inversionesHtml = '';

  try {
    console.log('Intentando conectar en vivo...');
    [corredoraHtml, inversionesHtml] = await Promise.all([
      fetchUrl('https://scotiabankchile.finmarketslive.cl/www/corredora.html'),
      fetchUrl('https://scotiabankchile.finmarketslive.cl/www/inversiones.html')
    ]);
    console.log('✓ Conexión en vivo exitosa.');
  } catch (err) {
    console.log('Aviso: Conexión externa no disponible en sandbox, cargando archivos locales de prueba...');
    const localCorredora = path.resolve(__dirname, 'sample_corredora.html');
    const localInversiones = path.resolve(__dirname, 'sample_inversiones.html');
    if (fs.existsSync(localCorredora)) corredoraHtml = fs.readFileSync(localCorredora, 'utf8');
    if (fs.existsSync(localInversiones)) inversionesHtml = fs.readFileSync(localInversiones, 'utf8');
  }

  if (!corredoraHtml) {
    console.error('No se pudo obtener el contenido HTML de corredora.');
    return;
  }

  const corredoraData = parseCorredoraHtml(corredoraHtml);
  console.log('\n--- 1. IPSA PRINCIPAL ---');
  console.log(corredoraData.ipsa);

  console.log(`\n--- 2. ACCIONES IPSA (${corredoraData.acciones.length} encontradas) ---`);
  console.log(corredoraData.acciones.slice(0, 5));

  console.log(`\n--- 3. ÍNDICES SECTORIALES (${corredoraData.sectoriales.length}) ---`);
  console.log(corredoraData.sectoriales);

  console.log(`\n--- 4. MAYORES ALZAS (${corredoraData.mayores_alzas.length}) ---`);
  console.log(corredoraData.mayores_alzas);

  console.log(`\n--- 5. MAYORES BAJAS (${corredoraData.mayores_bajas.length}) ---`);
  console.log(corredoraData.mayores_bajas);

  if (inversionesHtml) {
    const inversionesData = parseInversionesHtml(inversionesHtml);
    console.log(`\n--- 6. INDICADORES ECONÓMICOS (${inversionesData.indicadores.length}) ---`);
    console.log(inversionesData.indicadores);

    console.log(`\n--- 7. COMMODITIES (${inversionesData.commodities.length}) ---`);
    console.log(inversionesData.commodities);
  }

  console.log('\n✓ Parseo completado con éxito y listo para almacenar en PostgreSQL.');
}

if (require.main === module) {
  main();
}

module.exports = { parseCorredoraHtml, parseInversionesHtml, parseChileanNumber };
