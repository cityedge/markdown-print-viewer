// npm install --no-save playwright jszip, or point MPV_TEST_NODE_MODULES at an existing installation.
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
const output = path.join(__dirname, 'tmp', appVersion, 'mermaid');
fs.mkdirSync(output, { recursive: true });
const offline = fs.readFileSync(path.join(root, 'offline/index.html'), 'utf8');
const assets = new Map([...offline.matchAll(/<!-- [^\n]*source: (https:[^ ]+) -->\s*<script>([\s\S]*?)<\/script>/g)]
  .map(match => [match[1], match[2]]));
const demo = fs.readFileSync(path.join(root, 'examples/mermaid.md'), 'utf8');
const fence = source => '```mermaid\n' + source + '\n```';
const results = [];
async function upload(page, source, name = 'diagrams.md') {
  await page.locator('#fileInput').setInputFiles({ name, mimeType: 'text/markdown', buffer: Buffer.from(source) });
}
async function ready(page) {
  try {
    await page.waitForFunction(() => document.querySelector('#rendered').getAttribute('aria-busy') === 'false');
    await page.waitForFunction(() => !document.querySelector('#wordBtn').disabled);
  } catch (error) {
    console.error('Page status:', await page.locator('#statusText').textContent());
    throw error;
  }
}
async function check(page, label) {
  await upload(page, demo);
  await ready(page);
  const figures = page.locator('.mermaid-diagram img');
  assert.equal(await figures.count(), 6, await page.locator('#statusText').innerText());
  assert.equal(await page.locator('.mermaid-notice').count(), 0);
  assert(await figures.evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)));
  assert.equal(await page.locator('#rendered h1').count(), 1);
  assert.equal(await page.locator('.mermaid-staging').count(), 0);
  assert.match(await page.title(), /diagrams.md — Markdown Print Viewer/);
  const downloadEvent = page.waitForEvent('download');
  await page.locator('#wordBtn').click();
  const download = await downloadEvent;
  const docxPath = path.join(output, label + '.docx');
  await download.saveAs(docxPath);
  await page.waitForFunction(() => !document.querySelector('#wordBtn').disabled);
  const zip = await JSZip.loadAsync(fs.readFileSync(docxPath));
  const media = Object.keys(zip.files).filter(name => /^word\/media\/.*\.png$/.test(name));
  assert.equal(media.length, 6, 'Every diagram is embedded as PNG');
  const xml = await zip.file('word/document.xml').async('string');
  assert.equal((xml.match(/<w:drawing>/g) || []).length, 6);
  assert(!xml.includes('[Image:'));
  await page.screenshot({ path: path.join(output, label + '-desktop.png') });
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme), 'light');
  assert.equal(await page.locator('.toolbar').evaluate(el => getComputedStyle(el).display), 'none');
  await page.pdf({ path: path.join(output, label + '.pdf'), preferCSSPageSize: true, printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, label + '-mobile.png') });
  assert(await figures.evaluateAll(imgs => imgs.every(img => img.getBoundingClientRect().right <= innerWidth + 1)));
  await page.locator('#brandToggle').click();
  assert.equal(await page.locator('#brandToggle').getAttribute('aria-expanded'), 'false');
  await page.locator('#brandToggle').click();
  await page.setViewportSize({ width: 1280, height: 900 });
  results.push(label + ': six diagram types, Word PNGs, PDF, mobile, toolbar passed');
}
async function checkLicenses(page, label) {
  await page.locator('#licensesBtn').click();
  assert(await page.locator('#licenseDialog').isVisible());
  const frame = page.frameLocator('#licenseFrame');
  await frame.locator('details[data-component="elkjs"]').waitFor();
  const language = await page.locator('html').getAttribute('lang');
  assert.equal(await frame.locator('html').getAttribute('lang'), language);
  assert((await frame.locator('details[data-component]').count()) >= 150);
  await frame.locator('details[data-component="elkjs"] summary').click();
  assert.match(await frame.locator('details[data-component="elkjs"] pre').innerText(), /Eclipse Public License/);
  assert.match(await frame.locator('details[data-component="elkjs"] a').first().getAttribute('href'), /ff5771d7165445c42c408bb8a090c8035272218c/);
  await frame.locator('#language').click();
  assert.equal(await frame.locator('html').getAttribute('lang'), language === 'ja' ? 'en' : 'ja');
  await page.locator('#licenseClose').click();
  assert(!(await page.locator('#licenseDialog').isVisible()));
  await page.locator('#langBtn').click();
  await page.locator('#licensesBtn').click();
  await frame.locator('html[lang="' + (language === 'ja' ? 'en' : 'ja') + '"]').waitFor();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: path.join(output, label + '-licenses-mobile.png') });
  assert(await frame.locator('html').evaluate(el => el.scrollWidth <= innerWidth + 1));
  await page.locator('#licenseClose').click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.locator('#langBtn').click();
  results.push(label + ': full license notices, exact source link, bilingual dialog, mobile and closing passed');
}
(async () => {
  let browser;
  const server = http.createServer((req, res) => {
    const filename = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(filename, (error, data) => {
      if (error) { res.writeHead(404).end(); return; }
      const type = filename.endsWith('.html') ? 'text/html; charset=utf-8' : filename.endsWith('.js') ? 'text/javascript' : filename.endsWith('.webmanifest') ? 'application/manifest+json' : 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type }); res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('Browser error:', error.message); });
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    let mermaidRequests = 0;
    await context.route('https://cdn.jsdelivr.net/**', async route => {
      if (route.request().url().includes('/mermaid@')) mermaidRequests++;
      assert(assets.has(route.request().url()), 'Known pinned dependency');
      await route.fulfill({ body: assets.get(route.request().url()), contentType: 'text/javascript' });
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    assert.equal(await page.title(), 'Markdown Print Viewer');
    assert(await page.locator('#openBtn').isVisible());
    assert.equal(mermaidRequests, 0, 'Mermaid is loaded on demand');
    await checkLicenses(page, 'standard');
    await check(page, 'standard');
    assert.equal(mermaidRequests, 1);

    await page.locator('#folderInput').setInputFiles(path.join(root, 'examples'));
    await page.waitForFunction(() => document.querySelector('#folderStatus').textContent.includes('examples'));
    await ready(page);
    await page.locator('#fileInput').setInputFiles(path.join(root, 'examples/sample.md'));
    await page.waitForFunction(() => document.querySelector('#rendered img')?.src.startsWith('blob:'));
    await ready(page);
    assert.equal(await page.locator('#rendered table').count(), 1);
    assert.equal(await page.locator('#rendered .footnotes').count(), 1);
    assert.equal(await page.locator('#rendered input[type=checkbox]').count(), 2);
    assert(await page.locator('#rendered img').evaluate(async img => { await img.decode(); return img.naturalWidth > 0; }));
    results.push('Existing Markdown tables, footnotes, tasks, and folder-relative SVG image passed');

    const regression = '# Regression\n\n第二は**因果的な根拠づけ（grounding）**です。\n\n**特権（privilege）**と**権威（authority）**\n\n**171 emotion concepts ... 0%**を確認。\n\n```javascript\nconst mermaid = "text";\n```\n\n' + fence('flowchart LR\nA[broken') + '\n\n' + fence('flowchart LR\nA[正常] --> B[表示]');
    await upload(page, regression);
    await ready(page);
    assert.equal(await page.locator('.mermaid-notice').count(), 1);
    assert.equal(await page.locator('.mermaid-diagram img').count(), 1);
    assert.equal(await page.locator('pre code.language-mermaid').count(), 1);
    assert.equal(await page.locator('pre code.language-javascript').count(), 1);
    await page.locator('#japaneseCompat').check();
    await ready(page);
    assert.equal(await page.locator('#rendered strong').count(), 4);
    await page.locator('#langBtn').click();
    assert.match(await page.locator('.mermaid-notice').innerText(), /could not be rendered/);
    await page.screenshot({ path: path.join(output, 'syntax-error.png') });
    await page.locator('#japaneseCompat').uncheck();
    await ready(page);
    const standardStrongCount = await page.evaluate(source => {
      const html = window.markdownit({ html: true, linkify: true }).render(source);
      return new DOMParser().parseFromString(html, 'text/html').querySelectorAll('strong').length;
    }, regression);
    assert.equal(await page.locator('#rendered strong').count(), standardStrongCount);
    results.push('Syntax errors isolated; code, Japanese compatibility, and language switching passed');

    // Diagram directives must not enable HTML execution, interactive links, or document-wide CSS.
    await page.evaluate(() => { window.mermaidAttack = false; });
    await upload(page, fence('%%{init: {"securityLevel":"loose","htmlLabels":true,"themeCSS":"body {display:none}"}}%%\nflowchart LR\nA["<img src=x onerror=window.mermaidAttack=true>"] --> B[Safe]\nclick B "javascript:window.mermaidAttack=true"'));
    await ready(page);
    assert.equal(await page.evaluate(() => window.mermaidAttack), false);
    assert(await page.locator('#openBtn').isVisible());
    assert.equal(await page.locator('#rendered script, #rendered iframe, #rendered svg').count(), 0);
    results.push('Strict Mermaid configuration and SVG image isolation passed');

    // Slow first render: outputs stay disabled, and switching files cancels stale work.
    await page.reload();
    await page.addScriptTag({ content: assets.get('https://cdn.jsdelivr.net/npm/mermaid@12.3.0/dist/mermaid.min.js') });
    await page.evaluate(() => {
      const api = window.mermaid || window.__esbuild_esm_mermaid_nm.mermaid.default;
      const render = api.render.bind(api);
      api.render = async (...args) => { await new Promise(resolve => setTimeout(resolve, 300)); return render(...args); };
    });
    await upload(page, fence('flowchart LR\nOld --> Diagram'), 'old.md');
    await page.waitForFunction(() => document.querySelector('.mermaid-staging'));
    assert(await page.locator('#wordBtn').isDisabled());
    assert(await page.locator('#printBtn').isDisabled());
    await upload(page, '# New document\n\nCurrent text.', 'new.md');
    await ready(page);
    await page.waitForFunction(() => !document.querySelector('.mermaid-staging'));
    assert.equal(await page.locator('#rendered h1').innerText(), 'New document');
    assert.equal(await page.locator('.mermaid-diagram').count(), 0);
    results.push('Slow rendering blocks export and cannot overwrite a newly opened file');
    assert.deepEqual(errors, [], 'No unexpected browser errors');
    await context.close();

    const missingContext = await browser.newContext({ serviceWorkers: 'block' });
    await missingContext.route('https://cdn.jsdelivr.net/**', route => route.request().url().includes('/mermaid@')
      ? route.abort('failed') : route.fulfill({ body: assets.get(route.request().url()), contentType: 'text/javascript' }));
    const missingPage = await missingContext.newPage();
    await missingPage.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await upload(missingPage, '# Still readable\n\n' + fence('flowchart LR\nA --> B'));
    await ready(missingPage);
    assert.equal(await missingPage.locator('#rendered h1').innerText(), 'Still readable');
    assert.equal(await missingPage.locator('[data-mermaid-message=mermaidUnavailable]').count(), 1);
    assert.equal(await missingPage.locator('pre code.language-mermaid').count(), 1);
    await missingContext.close();
    results.push('Blocked Mermaid download retains Markdown, original code, and enabled output controls');

    const offlineContext = await browser.newContext({ viewport: { width: 1280, height: 900 }, offline: true });
    const offlinePage = await offlineContext.newPage();
    const offlineRequests = [];
    offlinePage.on('request', request => { if (/^https?:/.test(request.url())) offlineRequests.push(request.url()); });
    await offlinePage.goto(require('node:url').pathToFileURL(path.join(root, 'offline/index.html')).href);
    await checkLicenses(offlinePage, 'offline');
    await check(offlinePage, 'offline');
    assert.deepEqual(offlineRequests, [], 'No network requests in the fully offline edition');
    await offlineContext.close();

    if (process.env.MPV_TEST_LIVE_CDN === '1') {
      const liveContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const livePage = await liveContext.newPage();
      const liveErrors = [];
      livePage.on('pageerror', error => liveErrors.push(error.message));
      await livePage.goto(`http://127.0.0.1:${server.address().port}/index.html`);
      await livePage.evaluate(async () => {
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) {
          await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
        }
      });
      assert(await livePage.evaluate(async () => {
        const cache = await caches.open('markdown-print-viewer-v1.7.1');
        return Boolean(await cache.match('https://cdn.jsdelivr.net/npm/mermaid@12.3.0/dist/mermaid.min.js'));
      }), 'Live CDN Mermaid is precached');
      await upload(livePage, demo);
      await ready(livePage);
      assert.equal(await livePage.locator('.mermaid-diagram img').count(), 6);
      await liveContext.setOffline(true);
      await livePage.reload();
      await checkLicenses(livePage, 'offline-pwa');
      await upload(livePage, demo);
      await ready(livePage);
      assert.equal(await livePage.locator('.mermaid-diagram img').count(), 6);
      assert.deepEqual(liveErrors, []);
      await liveContext.close();
      results.push('Live CDN, Service Worker cache, offline PWA reload and six diagrams passed');
    }
    fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
    console.log(results.join('\n'));
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
