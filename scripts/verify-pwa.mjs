import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

function fail(message) {
  console.error(`PWA verification failed: ${message}`);
  process.exitCode = 1;
}

function assertFile(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  if (!existsSync(filePath)) {
    fail(`missing ${relativePath}`);
    return false;
  }
  return true;
}

function readJson(relativePath) {
  const filePath = path.join(rootDir, relativePath);
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`cannot parse ${relativePath}: ${error.message}`);
    return null;
  }
}

function verifyManifest() {
  const manifest = readJson('public/manifest.json');
  if (!manifest) return;

  const requiredStringFields = ['name', 'short_name', 'start_url', 'display', 'theme_color'];
  for (const field of requiredStringFields) {
    if (typeof manifest[field] !== 'string' || manifest[field].trim() === '') {
      fail(`manifest field "${field}" must be a non-empty string`);
    }
  }

  if (manifest.display !== 'standalone') {
    fail('manifest display should be "standalone" for installable PWA behavior');
  }

  if (!Array.isArray(manifest.icons) || manifest.icons.length < 2) {
    fail('manifest must define at least two icons');
    return;
  }

  const requiredIconSizes = new Set(['192x192', '512x512']);
  for (const icon of manifest.icons) {
    if (requiredIconSizes.has(icon.sizes)) {
      requiredIconSizes.delete(icon.sizes);
    }

    if (!icon.src || !assertFile(path.join('public', icon.src.replace(/^\//, '')))) {
      fail(`manifest icon "${icon.src}" does not point to an existing public file`);
    }
  }

  for (const missingSize of requiredIconSizes) {
    fail(`manifest missing ${missingSize} icon`);
  }
}

function verifyPublicAssets() {
  assertFile('public/favicon.svg');
  assertFile('public/images/scenes/living-room.svg');
  assertFile('public/images/scenes/living-room.png');
}

function verifyDistArtifacts() {
  if (!existsSync(distDir)) {
    fail('missing dist directory; run "npm run build" before "npm run verify:pwa"');
    return;
  }

  assertFile('dist/index.html');
  assertFile('dist/manifest.json');
  assertFile('dist/favicon.svg');
  assertFile('dist/icons/icon-192.png');
  assertFile('dist/icons/icon-512.png');
  assertFile('dist/images/scenes/living-room.svg');

  const distFiles = readdirSync(distDir);
  const hasServiceWorker = distFiles.includes('sw.js');
  const hasWorkboxRuntime = distFiles.some((fileName) => /^workbox-.*\.js$/.test(fileName));

  if (!hasServiceWorker) {
    fail('missing dist/sw.js service worker');
  }

  if (!hasWorkboxRuntime) {
    fail('missing dist/workbox-*.js runtime file');
  }
}

verifyManifest();
verifyPublicAssets();
verifyDistArtifacts();

if (process.exitCode) {
  process.exit();
}

console.log('PWA verification passed: manifest, assets, service worker, and Workbox artifacts are present.');
