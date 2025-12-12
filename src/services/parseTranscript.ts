import { RE_XML_TRANSCRIPT } from '../constants.js';
import { TranscriptSegment } from '../types.js';

/**
 * Parses YouTube transcript XML into an array of segment objects.
 * @param transcriptXml - Raw XML transcript data from YouTube
 * @param lang - Language code of the transcript
 * @returns Array of transcript segment objects
 * @throws {Error} If no transcript segments are found in the XML
 */
export function parseTranscript(transcriptXml: string, lang: string): TranscriptSegment[] {
  const results = [...transcriptXml.matchAll(RE_XML_TRANSCRIPT)];
  
  if (results.length === 0) {
    throw new Error('No transcript segments found in XML');
  }

  const segments: TranscriptSegment[] = results.map((match) => ({
    text: match[3],
    duration: parseFloat(match[2]),
    offset: parseFloat(match[1]),
    lang,
  }));

  return segments;
}

