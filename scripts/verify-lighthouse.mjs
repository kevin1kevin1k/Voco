import { mkdirSync, readFileSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const rootDir = process.cwd();
const reportDir = path.join(rootDir, 'test-results');
const reportPath = path.join(reportDir, 'lighthouse-voco.json');
const lighthouseBin = path.join(
  rootDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse'
);

const thresholds = {
  accessibility: Number(process.env.VOCO_LH_ACCESSIBILITY_MIN || 0.9),
  'best-practices': Number(process.env.VOCO_LH_BEST_PRACTICES_MIN || 0.8),
};

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: rootDir,
      stdio: 'inherit',
      ...options,
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

function getAvailablePort() {
  if (process.env.VOCO_PREVIEW_PORT) {
    return Promise.resolve(Number(process.env.VOCO_PREVIEW_PORT));
  }

  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 4173;
      server.close(() => resolve(port));
    });
  });
}

async function waitForPreview(url) {
  const deadline = Date.now() + 15000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Retry until Vite preview is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`preview server did not become ready at ${url}`);
}

function parseScore(category) {
  return Math.round(category.score * 100);
}

function verifyScores() {
  const report = JSON.parse(readFileSync(reportPath, 'utf8'));
  const failures = [];

  for (const [categoryId, minimum] of Object.entries(thresholds)) {
    const category = report.categories?.[categoryId];
    if (!category) {
      failures.push(`missing Lighthouse category "${categoryId}"`);
      continue;
    }

    if (category.score < minimum) {
      failures.push(
        `${category.title} score ${parseScore(category)} is below ${Math.round(minimum * 100)}`
      );
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join('\n'));
  }

  const scoreSummary = Object.keys(thresholds)
    .map((categoryId) => `${categoryId}: ${parseScore(report.categories[categoryId])}`)
    .join(', ');

  console.log(`Lighthouse verification passed: ${scoreSummary}. Report: ${reportPath}`);
}

async function main() {
  mkdirSync(reportDir, { recursive: true });

  await run('npm', ['run', 'build']);

  const port = await getAvailablePort();
  const url = `http://127.0.0.1:${port}`;

  const preview = spawn(
    process.execPath,
    [
      path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js'),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: rootDir,
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );

  preview.stdout.on('data', (chunk) => process.stdout.write(chunk));
  preview.stderr.on('data', (chunk) => process.stderr.write(chunk));

  try {
    await waitForPreview(url);

    await run(
      lighthouseBin,
      [
        url,
        '--quiet',
        '--output=json',
        `--output-path=${reportPath}`,
        '--only-categories=accessibility,best-practices',
        '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
      ],
      {
        env: {
          ...process.env,
          CHROME_PATH: process.env.CHROME_PATH || chromium.executablePath(),
        },
      }
    );

    verifyScores();
  } finally {
    preview.kill();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
