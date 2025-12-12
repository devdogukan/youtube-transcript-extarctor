import { writeFile } from 'fs/promises';

/**
 * Writes content to a file.
 * @param {string} content - Content to write
 * @param {string} filepath - Output file path
 * @param {string} [encoding='utf8'] - File encoding
 * @returns {Promise<void>}
 * @throws {Error} If file writing fails
 */
export async function writeToFile(content, filepath, encoding = 'utf8') {
  await writeFile(filepath, content, encoding);
}

