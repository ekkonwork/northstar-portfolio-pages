#!/usr/bin/env node
import {randomBytes} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://ekkonwork.github.io/northstar-portfolio-pages/';
const ALLOWED = {
  '--source': new Set(['outreach', 'portfolio', 'direct']),
  '--medium': new Set(['email', 'referral']),
  '--campaign': new Set(['agency_oct26', 'brand_oct26', 'smallbusiness_oct26', 'qa_oct26'])
};
const USAGE = 'Usage: node scripts/campaign_link.mjs --page <local-html-route> [--hash <series-N>] --source <outreach|portfolio|direct> --medium <email|referral> --campaign <agency_oct26|brand_oct26|smallbusiness_oct26|qa_oct26> [--json]';

function fail(message) {
  console.error(`${message}\n${USAGE}`);
  process.exitCode = 2;
}

function parseArgs(args) {
  const values = new Map();
  let json = false;
  for (let i = 0; i < args.length; i += 1) {
    const option = args[i];
    if (option === '--json') {
      if (json) throw new Error('Duplicate option: --json');
      json = true;
      continue;
    }
    if (!['--page', '--hash', ...Object.keys(ALLOWED)].includes(option)) throw new Error(`Unknown option: ${option}`);
    if (values.has(option)) throw new Error(`Duplicate option: ${option}`);
    const value = args[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
    values.set(option, value);
    i += 1;
  }
  for (const option of ['--page', ...Object.keys(ALLOWED)]) {
    if (!values.has(option)) throw new Error(`Missing required option: ${option}`);
  }
  for (const [option, allowed] of Object.entries(ALLOWED)) {
    if (!allowed.has(values.get(option))) throw new Error(`Invalid value for ${option}`);
  }
  return {values, json};
}

function parseLocalPage(raw, explicitHash = '') {
  // Routes stay at the published site root. Reject absolute URLs, queries, encoded
  // separators and path traversal instead of trying to normalize them silently.
  if (raw.includes('?') || raw.includes('%') || raw.includes('\\') || raw.startsWith('/')) {
    throw new Error('Page must be a local HTML route without a query string.');
  }
  const parts = raw.split('#');
  if (parts.length > 2 || (parts[1] && explicitHash)) throw new Error('Provide one anchor, either in --page or --hash.');
  const route = parts[0];
  const hash = explicitHash || parts[1] || '';
  if (!/^[a-z0-9][a-z0-9-]*\.html$/.test(route) || route.includes('..')) {
    throw new Error('Page must be a simple local HTML filename.');
  }
  if (hash && !/^series-[1-9]\d*$/.test(hash)) {
    throw new Error('Only existing series-N anchors are supported.');
  }
  const routePath = path.join(ROOT, route);
  if (!fs.existsSync(routePath) || !fs.statSync(routePath).isFile()) throw new Error('Page is not an existing public HTML route.');
  if (hash) {
    const html = fs.readFileSync(routePath, 'utf8');
    const escaped = hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`\\bid=["']${escaped}["']`).test(html)) throw new Error('Anchor does not exist on the selected page.');
  }
  return {route, hash};
}

function main() {
  if (process.argv.includes('--help')) {
    console.log(USAGE);
    return;
  }
  try {
    const {values, json} = parseArgs(process.argv.slice(2));
    const {route, hash} = parseLocalPage(values.get('--page'), values.get('--hash') || '');
    const ref = randomBytes(16).toString('base64url');
    const url = new URL(route, BASE);
    url.searchParams.set('utm_source', values.get('--source'));
    url.searchParams.set('utm_medium', values.get('--medium'));
    url.searchParams.set('utm_campaign', values.get('--campaign'));
    url.searchParams.set('ref', ref);
    if (hash) url.hash = hash;

    if (json) {
      console.log(JSON.stringify({url: url.toString(), page: route, ...(hash ? {anchor: hash} : {}), source: values.get('--source'), medium: values.get('--medium'), campaign: values.get('--campaign'), ref}, null, 2));
    } else {
      console.log(url.toString());
    }
  } catch (error) {
    fail(error.message);
  }
}

main();
