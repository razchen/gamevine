import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const rootDir = new URL('.', import.meta.url);
const srcDir = new URL('./src/', rootDir);
const distDir = new URL('./dist/', rootDir);

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });
await cp(srcDir, distDir, { recursive: true });

const copiedFiles = ['index.html', 'main.js', 'styles.css'].map((file) => join('dist', file));
console.log(`Static build ready: ${copiedFiles.join(', ')}`);
