import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const MAX_BODY_BYTES = 20_000;
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain; charset=utf-8'};

function sendJson(response, statusCode, data) { response.writeHead(statusCode, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); response.end(JSON.stringify(data)); }
async function readJson(request) { let body = ''; for await (const chunk of request) { body += chunk; if (body.length > MAX_BODY_BYTES) throw new Error('Request is too large.'); } try { return JSON.parse(body || '{}'); } catch { throw new Error('Invalid request.'); } }
function validUrl(value) { try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url : null; } catch { return null; } }
async function tavily(endpoint, body) {
  if (!TAVILY_API_KEY) { const error = new Error('The Tavily server key is not configured yet.'); error.statusCode = 503; throw error; }
  const response = await fetch(`https://api.tavily.com/${endpoint}`, {method:'POST', headers:{'Authorization':`Bearer ${TAVILY_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify(body), signal:AbortSignal.timeout(45_000)});
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.detail?.error || data.error || 'Tavily could not complete the request.'); error.statusCode = response.status; throw error; }
  return data;
}
async function search(request, response) {
  const {query} = await readJson(request); if (typeof query !== 'string' || !query.trim() || query.length > 180) return sendJson(response, 400, {error:'Enter a syllabus search under 180 characters.'});
  const data = await tavily('search', {query:`${query.trim()} syllabus curriculum`, search_depth:'basic', max_results:8, topic:'general', include_answer:false, include_raw_content:false, include_images:false, include_favicon:false, safe_search:true});
  sendJson(response, 200, {results:(data.results || []).map(result => ({title:result.title, url:result.url, content:result.content, score:result.score}))});
}
async function extract(request, response) {
  const {url, query} = await readJson(request); if (!validUrl(url)) return sendJson(response, 400, {error:'This source URL is not valid.'});
  const data = await tavily('extract', {urls:url, query:typeof query === 'string' ? query.slice(0,180) : undefined, chunks_per_source:5, extract_depth:'basic', format:'text', include_images:false, include_favicon:false});
  const result = data.results?.[0]; if (!result?.raw_content) return sendJson(response, 422, {error:data.failed_results?.[0]?.error || 'The page has no readable text to download.'});
  sendJson(response, 200, {content:result.raw_content.slice(0, 1_000_000)});
}
async function staticFile(request, response) {
  const url = new URL(request.url, 'http://local'); const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname); const filePath = normalize(join(ROOT, requested));
  if (!filePath.startsWith(ROOT)) { response.writeHead(403); return response.end(); }
  try { const info = await stat(filePath); if (!info.isFile()) throw new Error(); response.writeHead(200, {'Content-Type':types[extname(filePath)] || 'application/octet-stream','Cache-Control':filePath.endsWith('sw.js') ? 'no-cache' : 'public, max-age=3600'}); createReadStream(filePath).pipe(response); } catch { response.writeHead(404); response.end('Not found'); }
}
createServer(async (request, response) => {
  try { if (request.method === 'POST' && request.url === '/api/tavily-search') return await search(request, response); if (request.method === 'POST' && request.url === '/api/tavily-extract') return await extract(request, response); if (request.method === 'GET' || request.method === 'HEAD') return await staticFile(request, response); response.writeHead(405); response.end('Method not allowed'); } catch (error) { sendJson(response, error.statusCode || 500, {error:error.message || 'Unexpected server error.'}); }
}).listen(PORT, '0.0.0.0', () => console.log(`Syllabus Flow is running at http://localhost:${PORT}`));
