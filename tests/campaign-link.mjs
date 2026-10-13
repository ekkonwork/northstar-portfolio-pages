import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(root, 'scripts', 'campaign_link.mjs');
const common = ['--source', 'outreach', '--medium', 'email', '--campaign', 'agency_oct26'];

function run(args) {
  return spawnSync(process.execPath, [cli, ...args], {cwd: root, encoding: 'utf8'});
}

{
  const result = run(['--page', 'food.html#series-1', ...common, '--json']);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  const link = new URL(output.url);
  assert.equal(link.origin, 'https://ekkonwork.github.io');
  assert.equal(link.pathname, '/northstar-portfolio-pages/food.html');
  assert.equal(link.hash, '#series-1');
  assert.equal(link.searchParams.get('utm_source'), 'outreach');
  assert.equal(link.searchParams.get('utm_medium'), 'email');
  assert.equal(link.searchParams.get('utm_campaign'), 'agency_oct26');
  assert.match(link.searchParams.get('ref'), /^[A-Za-z0-9_-]{21}[AQgw]$/);
  assert.equal(output.ref, link.searchParams.get('ref'));
  assert(!/[@\s]|example|company|client/i.test(output.url), 'Generated link must not contain identity data.');

  const explicitHash = run(['--page', 'food.html', '--hash', 'series-1', ...common]);
  assert.equal(explicitHash.status, 0, explicitHash.stderr);
  assert.equal(new URL(explicitHash.stdout.trim()).hash, '#series-1');

  const second = run(['--page', 'food.html', ...common]);
  assert.equal(second.status, 0, second.stderr);
  assert.notEqual(new URL(second.stdout.trim()).searchParams.get('ref'), output.ref, 'Each generated ref should be fresh.');
}

for (const invalidPage of ['https://example.com/food.html', '../food.html', 'food.html?email=user@example.com', 'missing.html']) {
  const result = run(['--page', invalidPage, ...common]);
  assert.notEqual(result.status, 0, `Rejected invalid route: ${invalidPage}`);
}

for (const args of [
  ['--page', 'food.html', '--source', 'misha@example.com', '--medium', 'email', '--campaign', 'agency_oct26'],
  ['--page', 'food.html', '--source', 'outreach', '--medium', 'whatsapp', '--campaign', 'agency_oct26'],
  ['--page', 'food.html', '--source', 'outreach', '--medium', 'email', '--campaign', 'client-123'],
  ['--page', 'food.html', ...common, '--email', 'misha@example.com'],
  ['--page', 'food.html#categoryTitle', ...common],
  ['--page', 'food.html', '--hash', 'series-99', ...common],
  ['--page', 'food.html#series-1', '--hash', 'series-2', ...common]
]) {
  const result = run(args);
  assert.notEqual(result.status, 0, `Rejected invalid campaign or option: ${args.join(' ')}`);
}

console.log('Campaign link CLI verified: local routes and real anchors only, allowlisted campaign values, opaque fresh ref, and rejection of PII-shaped inputs.');
