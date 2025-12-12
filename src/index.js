import { fetchTranscript } from './services/fetchTranscript.js';
import { parseTranscript } from './services/parseTranscript.js';
import { retrieveVideoId } from './utils.js';

/**
 * Extracts transcript segments from a YouTube video URL or video ID.
 * @param {string} url - YouTube video URL or 11-character video ID
 * @returns {Promise<Array|Object>} Array of transcript segments on success, or error object with 'error' and 'videoId' fields on failure
 * @example
 * const result = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
 * if (result.error) {
 *   console.log('Error:', result.error);
 * } else {
 *   console.log(`Found ${result.length} segments`);
 * }
 */
export async function getTranscriptFromUrl(url) {
  let videoId = 'unknown';

  try {
    videoId = retrieveVideoId(url);
  } catch {
    // If extraction fails, keep default 'unknown'
  }

  try {
    const { transcriptXml, lang } = await fetchTranscript(url);
    const segments = parseTranscript(transcriptXml, lang);
    return segments;
  } catch (error) {
    return {
      error: 'No transcript available',
      videoId: videoId,
    };
  }
}

