import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const packageDirectory = path.resolve(scriptDirectory, '..');
const repositoryRoot = path.resolve(packageDirectory, '..', '..');
const destination = path.join(packageDirectory, 'skill');
const entries = ['SKILL.md', 'agents', 'assets', 'references'];

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
for (const entry of entries) {
  await cp(path.join(repositoryRoot, entry), path.join(destination, entry), { recursive: true });
}
