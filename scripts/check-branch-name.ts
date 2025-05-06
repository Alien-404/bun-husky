import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const configPath = path.resolve('.commit-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const allowedTypes: string[] = config.allowedTypes || [];

const branch = execSync('git symbolic-ref --short HEAD').toString().trim();
const branchPattern = `^(hotfix|master|main|staging|dev)$|^(${allowedTypes.join(
  '|'
)})\\/\\S+`;
const regex = new RegExp(branchPattern);
const timestamp = new Date().toLocaleString('en-US', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

if (!regex.test(branch)) {
  console.error(`\n\x1b[41m\x1b[97m  BRANCH NAME VALIDATION FAILED  \x1b[0m\n`);
  console.error(
    `\x1b[31m❌ [${timestamp}]\x1b[0m Invalid branch name format.\n`
  );

  console.error(`\x1b[33mYour branch:\x1b[0m        "${branch}"`);
  console.error(
    `\x1b[36mExpected format:\x1b[0m    <type>/<issue-or-description>`
  );
  console.error(
    `\x1b[36mAllowed types:\x1b[0m      ${allowedTypes.join(
      ', '
    )}, hotfix, master, main, staging, dev`
  );
  console.error(`\x1b[36mExample:\x1b[0m           feat/login-flow\n`);

  console.error(
    `\x1b[90mHint:\x1b[0m Use consistent branch naming for clarity and automation.`
  );
  process.exit(1);
}
