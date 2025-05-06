import fs from 'fs';
import path from 'path';

const configPath = path.resolve('.commit-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const allowedTypes: string[] = config.allowedTypes || [];

const msgPath = process.argv[2] || '.git/COMMIT_EDITMSG';
const commitMsg = fs.readFileSync(msgPath, 'utf8').trim();

const typePattern = `^(${allowedTypes.join('|')}): .+`;
const regex = new RegExp(typePattern);
const timestamp = new Date().toISOString();

if (!regex.test(commitMsg)) {
  console.error(
    `\n\x1b[41m\x1b[97m  COMMIT MESSAGE VALIDATION FAILED  \x1b[0m\n`
  );
  console.error(
    `\x1b[31m❌ [${timestamp}]\x1b[0m Invalid commit message format.\n`
  );

  console.error(`\x1b[33mYour message:\x1b[0m       "${commitMsg}"`);
  console.error(
    `\x1b[36mExpected format:\x1b[0m    <type>: <short description>`
  );
  console.error(
    `\x1b[36mAllowed types:\x1b[0m      ${allowedTypes.join(', ')}`
  );
  console.error(
    `\x1b[36mExample:\x1b[0m           feat: implement login flow\n`
  );

  console.error(
    `\x1b[90mHint:\x1b[0m Keep your messages concise and meaningful.`
  );
  process.exit(1);
}
