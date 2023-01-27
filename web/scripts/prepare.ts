/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import fs from 'node:fs';
// @ts-ignore
import path from 'node:path';

function prepareDirectories() {
  // @ts-ignore Issue w/ node types.
  const cwd = process.cwd();
  const dir = path.join(cwd, 'static', 'data');

  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

prepareDirectories();
