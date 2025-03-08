import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export function readJsonFile(filepath: string) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function writeJsonFile(filepath: string, data: unknown) {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
