#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { verifyTarget } from '../packages/cli/src/verify.mjs';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.resolve(process.argv[2] ?? path.join(skillRoot, 'examples/travel-agent'));
const result = await verifyTarget(target);
if (!result.passed) process.exitCode = 1;
