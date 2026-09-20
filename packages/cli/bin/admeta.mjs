#!/usr/bin/env node

import { runCli } from '../src/index.mjs';

runCli(process.argv.slice(2)).catch((error) => {
  console.error(`admeta CLI: ${error.message}`);
  process.exitCode = 1;
});
