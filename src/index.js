import { fetchTranscript } from './services/fetchTranscript.js';
import { parseTranscript } from './services/parseTranscript.js';
import { retrieveVideoId } from './utils/videoUtils.js';
import { formatAsText, formatAsMarkdown, formatAsSRT, formatAsJSON } from './formatters/index.js';
import { writeToFile } from './utils/fileWriter.js';

/**
 * Extracts transcript segments from a YouTube video URL or video ID.
 * @param {string} url - YouTube video URL or 11-character video ID
 * @param {Object} [options={}] - Options for formatting and output
 * @param {string} [options.format='json'] - Output format: 'json', 'text', 'markdown', 'srt' (default: 'json')
 * @param {string} [options.outputFile] - Optional file path to save output
 * @param {Object} [options.formatOptions={}] - Format-specific options
 * @param {number} [options.formatOptions.sentencesPerParagraph=3] - For 'text' format: number of sentences per paragraph
 * @param {boolean} [options.formatOptions.includeTimestamps=false] - For 'markdown' format: include timestamps
 * @returns {Promise<Array|Object|string>} Formatted output based on format option, or error object on failure
 * @example
 * // JSON format (default)
 * const result = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * 
 * // Text format
 * const text = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
 *   format: 'text',
 *   formatOptions: { sentencesPerParagraph: 3 }
 * });
 * 
 * // Markdown format with timestamps, save to file
 * await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
 *   format: 'markdown',
 *   formatOptions: { includeTimestamps: true },
 *   outputFile: './transcript.md'
 * });
 */
export async function getTranscriptFromUrl(url, options = {}) {
  const { format = 'json', outputFile, formatOptions = {} } = options;
  let videoId = 'unknown';

  try {
    videoId = retrieveVideoId(url);
  } catch {
    // If extraction fails, keep default 'unknown'
  }

  try {
    const { transcriptXml, lang } = await fetchTranscript(url);
    const segments = parseTranscript(transcriptXml, lang);

    let formattedOutput;
    
    switch (format.toLowerCase()) {
      case 'text':
        formattedOutput = formatAsText(segments, formatOptions);
        break;
      case 'markdown':
        formattedOutput = formatAsMarkdown(segments, formatOptions);
        break;
      case 'srt':
        formattedOutput = formatAsSRT(segments);
        break;
      case 'json':
      default:
        // JSON format returns array for backward compatibility
        formattedOutput = segments;
        break;
    }

    // Write to file if specified
    if (outputFile) {
      await writeToFile(formattedOutput, outputFile);
      return { success: true, file: outputFile, format };
    }

    return formattedOutput;
  } catch (error) {
    return {
      error: 'No transcript available',
      videoId: videoId,
    };
  }
}

