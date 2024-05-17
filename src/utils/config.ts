import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as readline from 'readline';

async function getInputFromUser(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('Enter your input: ', (input) => {
      rl.close();
      resolve(input);
    });
  });
}

async function writeInputToFile(input: string, filePath: string): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, input);
    console.log('Input written to file successfully!');
  } catch (error) {
    console.error('Error writing input to file:', error);
  }
}

export default async function setApiKey() {
  const input = await getInputFromUser();
  const filePath = `${os.homedir()}/.config/openalex-cli/openalex-api-key.txt`;
  const keyDir = path.dirname(filePath);
  fs.mkdirSync(keyDir, { recursive: true });
  await writeInputToFile(input, filePath);
}
