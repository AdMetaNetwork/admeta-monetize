import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyTarget } from './verify.mjs';

const cliRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bundledSkill = path.join(cliRoot, 'skill');
const configTemplate = `export const admetaConfig = {
  mode: process.env.ADMETA_MODE === 'byo' ? 'byo' : 'sandbox',
  publisher: process.env.ADMETA_PUBLISHER ?? 'local-demo',
} as const;
`;

function defaultSkillDestination() {
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex');
  return path.join(codexHome, 'skills', 'admeta-monetize');
}

function dependencies(manifest) {
  return { ...(manifest.dependencies ?? {}), ...(manifest.devDependencies ?? {}) };
}

export async function installSkill({ destination = defaultSkillDestination(), force = false } = {}) {
  const target = path.resolve(destination);
  if (existsSync(target)) {
    if (!force) throw new Error(`${target} already exists. Re-run with --force to replace it.`);
    await rm(target, { recursive: true, force: true });
  }
  await mkdir(path.dirname(target), { recursive: true });
  await cp(bundledSkill, target, { recursive: true });
  return target;
}

export async function initializeProject(targetDirectory, { force = false } = {}) {
  const target = path.resolve(targetDirectory);
  const manifestPath = path.join(target, 'package.json');
  if (!existsSync(manifestPath)) throw new Error(`No package.json found in ${target}. Run init from an app directory.`);
  const configPath = path.join(target, 'admeta.config.ts');
  if (existsSync(configPath) && !force) {
    throw new Error(`${configPath} already exists. Re-run with --force to replace it.`);
  }
  await writeFile(configPath, configTemplate, 'utf8');
  return configPath;
}

export async function doctorTarget(targetDirectory, { log = console.log } = {}) {
  const target = path.resolve(targetDirectory);
  let manifest;
  try {
    manifest = JSON.parse(await readFile(path.join(target, 'package.json'), 'utf8'));
  } catch {
    log('✗ package.json not found');
    return { passed: false, target };
  }

  const allDependencies = dependencies(manifest);
  const checks = [
    ['package.json found', true],
    ['Next.js dependency found', Boolean(allDependencies.next)],
    ['Vercel AI SDK dependency found', Boolean(allDependencies.ai || allDependencies['@ai-sdk/react'])],
    ['@admeta/sdk dependency found', Boolean(allDependencies['@admeta/sdk'])],
    ['App Router directory found', existsSync(path.join(target, 'app')) || existsSync(path.join(target, 'src', 'app'))],
  ];
  log(`admeta doctor: ${target}\n`);
  for (const [label, passed] of checks) log(`${passed ? '✓' : '✗'} ${label}`);
  const passed = checks.slice(0, 3).every(([, result]) => result);
  log(passed ? '\nCompatible with the v0.1 golden path.' : '\nNot compatible with the v0.1 golden path.');
  return { checks, passed, target };
}

function parseCommand(argumentsList) {
  const [command, ...rest] = argumentsList;
  const force = rest.includes('--force');
  const pathFlagIndex = rest.indexOf('--path');
  const pathFlag = pathFlagIndex === -1 ? undefined : rest[pathFlagIndex + 1];
  const positional = rest.filter((value, index) => {
    const isPathValue = pathFlagIndex !== -1 && index === pathFlagIndex + 1;
    return value !== '--force' && value !== '--path' && !isPathValue;
  });
  return { command, force, pathFlag, positional };
}

export async function runCli(argumentsList, { log = console.log } = {}) {
  const { command, force, pathFlag, positional } = parseCommand(argumentsList);
  if (!command || command === '--help' || command === 'help') {
    log('Usage: admeta <install|doctor|init|verify> [directory] [--path directory] [--force]');
    return 0;
  }
  if (command === 'install') {
    const destination = await installSkill({ destination: pathFlag ?? positional[0], force });
    log(`Installed admeta monetize Skill to ${destination}`);
    return 0;
  }
  const target = positional[0] ?? process.cwd();
  if (command === 'init') {
    const configPath = await initializeProject(target, { force });
    log(`Created ${configPath}`);
    log('Next: install @admeta/sdk, then ask Codex to “monetize this agent”.');
    return 0;
  }
  if (command === 'doctor') return (await doctorTarget(target, { log })).passed ? 0 : 1;
  if (command === 'verify') return (await verifyTarget(target, { log })).passed ? 0 : 1;
  throw new Error(`Unknown command: ${command}`);
}
