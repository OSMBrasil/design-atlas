#!/usr/bin/env node
import { startHttpServer, startStdioServer } from '../src/server.js';

const args = process.argv.slice(2);

function getArgValue(flag, fallback) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) {
    return args[idx + 1];
  }
  return fallback;
}

const transport = getArgValue('--transport', 'stdio');
const port = Number(getArgValue('--port', process.env.PORT || '3846'));
const host = getArgValue('--host', process.env.HOST || '127.0.0.1');
const root = getArgValue('--root', process.env.ATLAS_ROOT);

if (transport === 'http') {
  startHttpServer({ port, host, root });
} else {
  startStdioServer({ root });
}
