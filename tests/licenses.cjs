// No test dependencies required. Run after the offline build.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const manifest = JSON.parse(read('licenses/dependencies.json'));
const texts = read('THIRD_PARTY_LICENSES.txt');
const sources = read('THIRD_PARTY_SOURCES.md');
const page = read('licenses.html');
const offline = read('offline/index.html');
for (const [file, expected] of Object.entries(manifest.documents)) {
  const bytes = fs.readFileSync(path.join(root, file));
  assert.equal(hash(bytes), expected, file + ': reviewed document hash');
  assert.notEqual(bytes.subarray(0, 3).toString('hex'), 'efbbbf', file + ': no BOM');
}
for (const component of manifest.components) {
  assert(component.licenseFiles.length, component.name + ': license text available');
  assert(texts.includes(`===== ${component.name} | ${component.version} |`));
  assert(sources.includes(component.sourceUrl), component.name + ': corresponding source');
  assert.equal(new URL(component.sourceUrl).protocol, 'https:');
  assert(page.includes(`data-component="${component.name.replaceAll('&', '&amp;')}"`));
}
assert.equal(manifest.components.find(c => c.name === 'markdown-it-task-lists').selectedLicense, 'ISC');
assert.equal(manifest.components.find(c => c.name === 'elkjs').selectedLicense, 'EPL-2.0');
assert.equal(manifest.components.find(c => c.name === 'dompurify').selectedLicense, 'Apache-2.0');
assert.equal(manifest.components.find(c => c.name === 'jszip').selectedLicense, 'MIT');
for (const fragment of ['Eclipse Public License - v 1.0', 'Eclipse Public License - v 2.0', 'Copyright', 'Facebook, Inc.', 'Mark Adler', '323312916048544e4e594eab3303cdb0d01e2929', 'ff5771d7165445c42c408bb8a090c8035272218c']) {
  assert(texts.includes(fragment), 'Required full notice/source: ' + fragment);
}
const payload = offline.match(/<script type="application\/json" id="third-party-licenses">([\s\S]*?)<\/script>/);
assert(payload, 'Portable HTML retains complete notices');
assert.equal(JSON.parse(payload[1]), page, 'Offline notices equal the reviewed readable page');
assert(!/<script\s+[^>]*src\s*=/.test(offline), 'No external offline script');
const embedded = [...offline.matchAll(/<!-- [^\n]*source: (https:[^ ]+) -->\s*<script>([\s\S]*?)<\/script>/g)];
assert.equal(embedded.length, manifest.runtime.length);
for (const dependency of manifest.runtime) {
  const code = embedded.find(m => m[1] === dependency.url)?.[2].trim();
  assert(code?.length > 100, dependency.name + ': embedded code');
  assert(read('service-worker.js').includes(dependency.url));
}
for (const file of ['index.html', 'offline/index.template.html', 'offline/index.html']) {
  const html = read(file);
  new vm.Script(html.slice(html.lastIndexOf('  <script>') + 10, html.lastIndexOf('</script>')), { filename: file });
  assert(html.includes('id="licensesBtn"'));
}
console.log(`PASS: ${manifest.components.length} notice entries, document hashes, exact source links, dual-license selections, standalone embedded notices, six dependencies and app script syntax.`);
