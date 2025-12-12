import { fetchTranscript } from './services/fetchTranscript.js';
import { parseTranscript } from './services/parseTranscript.js';
import { retrieveVideoId } from './utils/videoUtils.js';
import { formatAsText, formatAsMarkdown, formatAsSRT } from './formatters/index.js';
import { writeToFile } from './utils/fileWriter.js';
import { OutputFormat, TranscriptOptions, TranscriptResponse, TranscriptSegment } from './types.js';

/**
 * Extracts transcript segments from a YouTube video URL or video ID.
 * @param url - YouTube video URL or 11-character video ID
 * @param options - Options for formatting and output
 * @param options.format - Output format: 'json', 'text', 'markdown', 'srt' (default: 'json')
 * @param options.outputFile - Optional file path to save output
 * @param options.formatOptions - Format-specific options
 * @param options.formatOptions.sentencesPerParagraph - For 'text' format: number of sentences per paragraph
 * @param options.formatOptions.includeTimestamps - For 'markdown' format: include timestamps
 * @returns Formatted output based on format option, or error object on failure
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
export async function getTranscriptFromUrl(url: string, options: TranscriptOptions = {}): Promise<TranscriptResponse> {
  const { format = OutputFormat.JSON, outputFile, formatOptions = {} } = options;
  let videoId = 'unknown';

  try {
    videoId = retrieveVideoId(url);
  } catch {
    // If extraction fails, keep default 'unknown'
  }

  try {
    const { transcriptXml, lang } = await fetchTranscript(url);
    const segments = parseTranscript(transcriptXml, lang);

    let formattedOutput: TranscriptSegment[] | string;
    
    // Normalize format to lowercase string (enum values are already lowercase)
    const formatLower: string = typeof format === 'string' 
      ? format.toLowerCase() 
      : format;
    
    switch (formatLower) {
      case OutputFormat.TEXT:
        formattedOutput = formatAsText(segments, formatOptions);
        break;
      case OutputFormat.MARKDOWN:
        formattedOutput = formatAsMarkdown(segments, formatOptions);
        break;
      case OutputFormat.SRT:
        formattedOutput = formatAsSRT(segments);
        break;
      default:
        // JSON format returns array for backward compatibility
        formattedOutput = segments;
        break;
    }

    // Write to file if specified
    if (outputFile) {
      await writeToFile(formattedOutput, outputFile);
      return { success: true, file: outputFile, format: formatLower };
    }

    return formattedOutput;
  } catch (error) {
    return {
      error: 'No transcript available',
      videoId: videoId,
    };
  }
}

