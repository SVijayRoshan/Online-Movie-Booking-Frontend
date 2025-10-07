#!/usr/bin/env node

/**
 * Cross-platform script to kill processes running on a specific port
 * Usage: node scripts/kill-port.js [PORT]
 * Example: node scripts/kill-port.js 5002
 */

import { exec } from 'child_process';
import process from 'process';

const port = process.argv[2] || '5002';

console.log(`🔍 Looking for processes on port ${port}...`);

// Cross-platform port killing
const isWindows = process.platform === 'win32';

let command;
if (isWindows) {
  // Windows: Use netstat and taskkill
  command = `for /f "tokens=5" %a in ('netstat -aon ^| find ":${port}"') do taskkill /f /pid %a`;
} else {
  // macOS/Linux: Use lsof and kill
  command = `lsof -ti:${port} | xargs kill -9`;
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    if (error.message.includes('No such process') || 
        error.message.includes('not found') ||
        stderr.includes('No such process')) {
      console.log(`✅ No processes found on port ${port}`);
    } else {
      console.log(`❌ Error: ${error.message}`);
    }
    return;
  }
  
  if (stdout) {
    console.log(`✅ Killed processes on port ${port}`);
    console.log(stdout);
  } else {
    console.log(`✅ No processes found on port ${port}`);
  }
});