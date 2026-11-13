// Browser plugin not available: use the same Playwright installation as mermaid.cjs.
// Flow: open diagrams -> change document Size -> diagram labels/layout scale on screen, print and Word.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const dependency = process.env.MPV_TEST_NODE_MODULES
  ? createRequire(path.join(process.env.MPV_TEST_NODE_MODULES, '_mpv.cjs')) : require;
const { chromium } = dependency('playwright');
const JSZip = dependency('jszip');
const root = path.resolve(__dirname, '..');
const appVersion = JSON.parse(fs.readFileSync(path.join(root, 'licenses/dependencies.json'), 'utf8')).appVersion;
const output = path.join(__dirname, 'tmp', appVersion, 'mermaid-size');
fs.mkdirSync(output, { recursive: true });
const offline = fs.readFileSync(path.join(root, 'offline/index.html'), 'utf8');
const assets = new Map([...offline.matchAll(/<!-- [^\n]*source: (https:[^ ]+) -->\s*<script>([\s\S]*?)<\/script>/g)].map(m => [m[1], m[2]]));
const fence = text => '```mermaid\n' + text + '\n```';
const longChart = direction => 'flowchart ' + direction + '\n' + Array.from({ length: 12 }, (_, i) => `N${i}[工程 ${i} / Process ${i}] --> N${i + 1}`).join('\n');
const ordinaryImage = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'icons/icon-192.png')).toString('base64');
const source = fs.readFileSync(path.join(root, 'examples/mermaid.md'), 'utf8') + '\n\n## Wide diagram\n' + fence(longChart('LR')) + '\n\n## Tall diagram\n' + fence(longChart('TD')) + '\n\n## Ordinary image\n![Ordinary image](' + ordinaryImage + ')';
const results = [];
async function upload(page, markdown = source) {
  await page.locator('#fileInput').setInputFiles({ name: 'size-check.md', mimeType: 'text/markdown', buffer: Buffer.from(markdown) });
  await page.waitForFunction(() => document.querySelector('#rendered').getAttribute('aria-busy') === 'false' && !document.querySelector('#wordBtn').disabled);
}
const sizes = page => page.locator('#rendered img').evaluateAll(imgs => imgs.map(img => ({
  diagram: img.dataset.mermaid === 'true', width: img.getBoundingClientRect().width,
  height: img.getBoundingClientRect().height, nativeWidth: img.naturalWidth,
  nativeHeight: img.naturalHeight, source: img.src
})));
function compare(a, b, ratio, label, tolerance = .15) {
  assert.equal(a.length, b.length, label + ': all images retained');
  a.forEach((image, i) => {
    const scale = image.diagram ? ratio : 1;
    for (const dimension of ['width', 'height']) {
      assert(Math.abs(b[i][dimension] - image[dimension] * scale) <= tolerance, `${label}: ${i} ${dimension} ${image[dimension]} -> ${b[i][dimension]}`);
    }
    assert.equal(b[i].source, image.source, label + ': changing size must not rebuild the diagram');
  });
}
async function word(page, label) {
  const pending = page.waitForEvent('download');
  await page.locator('#wordBtn').click();
  const download = await pending;
  const target = path.join(output, label + '.docx');
  await download.saveAs(target);
  await page.waitForFunction(() => !document.querySelector('#wordBtn').disabled);
  const zip = await JSZip.loadAsync(fs.readFileSync(target));
  const xml = await zip.file('word/document.xml').async('string');
  const extents = [...xml.matchAll(/<wp:extent cx="(\d+)" cy="(\d+)"/g)].map(m => ({ width: Number(m[1]) / 9525, height: Number(m[2]) / 9525 }));
  const pngs = Object.keys(zip.files).filter(n => /^word\/media\/.*\.png$/.test(n));
  assert.equal(extents.length, 9);
  return { extents, pngs: await Promise.all(pngs.map(n => zip.file(n).async('base64'))) };
}
(async () => {
  const server = http.createServer((req, res) => {
    const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (error, bytes) => {
      if (error) { res.writeHead(404).end(); return; }
      res.writeHead(200, { 'Content-Type': file.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/javascript' });
      res.end(bytes);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    for (const edition of ['standard', 'offline']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, serviceWorkers: 'block', offline: edition === 'offline' });
      if (edition === 'standard') await context.route('https://cdn.jsdelivr.net/**', route => route.fulfill({ body: assets.get(route.request().url()), contentType: 'text/javascript' }));
      const page = await context.newPage();
      const errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
      const url = edition === 'standard' ? `http://127.0.0.1:${server.address().port}/index.html` : require('node:url').pathToFileURL(path.join(root, 'offline/index.html')).href;
      await page.goto(url);
      assert.equal(await page.title(), 'Markdown Print Viewer');
      assert(await page.locator('#openBtn').isVisible());
      await upload(page);
      assert.equal(await page.locator('.mermaid-diagram img').count(), 8);
      assert.equal(await page.locator('.mermaid-notice').count(), 0);
      const defaultSize = await sizes(page);
      assert.equal(defaultSize.length, 9);
      await page.locator('#sizeSelect').selectOption('12');
      const large = await sizes(page);
      compare(large, defaultSize, 10.5 / 12, edition + ': default size');
      assert(large[6].nativeWidth > large[6].width * 2, 'Wide diagram exercises width fitting');
      assert(large[7].nativeHeight > 1000, 'Tall diagram exercises height fitting');
      await page.screenshot({ path: path.join(output, edition + '-12pt.png') });
      const wordLarge = await word(page, edition + '-12pt');
      for (const size of ['11', '10.5', '10', '9.5', '9']) {
        await page.locator('#sizeSelect').selectOption(size);
        compare(large, await sizes(page), Number(size) / 12, edition + ': ' + size + ' pt');
        assert(Math.abs(await page.locator('#rendered').evaluate(el => parseFloat(getComputedStyle(el).fontSize)) - Number(size) * 4 / 3) < .01);
      }
      await page.screenshot({ path: path.join(output, edition + '-9pt.png') });
      const wordSmall = await word(page, edition + '-9pt');
      wordLarge.extents.forEach((item, i) => {
        const scale = i < 8 ? .75 : 1;
        for (const dimension of ['width', 'height']) assert(Math.abs(wordSmall.extents[i][dimension] - item[dimension] * scale) <= 1, edition + ': Word ' + i + ' ' + dimension);
      });
      assert.deepEqual(wordSmall.pngs.sort(), wordLarge.pngs.sort(), 'Word PNG resolution remains intact');
      await page.emulateMedia({ media: 'print' });
      await page.locator('#sizeSelect').selectOption('12', { force: true });
      const printLarge = await sizes(page);
      await page.locator('#sizeSelect').selectOption('9', { force: true });
      compare(printLarge, await sizes(page), .75, edition + ': print including tall diagrams');
      assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme), 'light');
      await page.pdf({ path: path.join(output, edition + '-9pt.pdf'), preferCSSPageSize: true, printBackground: true });
      await page.emulateMedia({ media: 'screen' });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.locator('#sizeSelect').selectOption('12');
      const mobileLarge = await sizes(page);
      await page.locator('#sizeSelect').selectOption('9');
      compare(mobileLarge, await sizes(page), .75, edition + ': mobile');
      assert(await page.locator('.mermaid-diagram img').evaluateAll(imgs => imgs.every(img => img.getBoundingClientRect().right <= innerWidth + 1)));
      await page.screenshot({ path: path.join(output, edition + '-9pt-mobile.png') });
      await page.setViewportSize({ width: 1280, height: 1000 });
      await page.reload();
      assert.equal(await page.locator('#sizeSelect').inputValue(), '9');
      await upload(page);
      assert(Math.abs((await sizes(page))[0].width - large[0].width * .75) < .15, 'Saved size applies to new diagrams');
      // Change size while Mermaid is still rendering: new images use the latest setting.
      await page.evaluate(() => {
        const api = window.mermaid || window.__esbuild_esm_mermaid_nm.mermaid.default;
        const render = api.render.bind(api);
        api.render = async (...args) => { await new Promise(resolve => setTimeout(resolve, 250)); return render(...args); };
      });
      await page.locator('#sizeSelect').selectOption('12');
      const pending = upload(page, fence('flowchart LR\nA[日本語] --> B[更新]'));
      await page.waitForFunction(() => document.querySelector('.mermaid-staging'));
      await page.locator('#sizeSelect').selectOption('9');
      await pending;
      const pendingSmall = await sizes(page);
      await page.locator('#sizeSelect').selectOption('12');
      compare(await sizes(page), pendingSmall, .75, edition + ': change during rendering');
      assert.deepEqual(errors, [], 'No relevant console or script errors');
      if (edition === 'offline') assert.deepEqual(requests, [], 'No offline network requests');
      await context.close();
      results.push(edition + ': six diagram types + wide/tall diagrams; all sizes, immediate updates, saved size, async render, unchanged ordinary image, print/PDF, Word dimensions/resolution and mobile PASS');
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
