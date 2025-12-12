import { writeFile } from 'node:fs/promises';

/**
 * Writes content to a file.
 * @param content - Content to write
 * @param filepath - Output file path
 * @param encoding - File encoding
 * @returns Promise that resolves when file is written
 * @throws {Error} If file writing fails
 */
export async function writeToFile(
  content: string | object,
  filepath: string,
  encoding: BufferEncoding = 'utf8'
): Promise<void> {
  const contentToWrite = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  await writeFile(filepath, contentToWrite, encoding);
}

