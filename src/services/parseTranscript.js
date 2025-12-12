import { RE_XML_TRANSCRIPT } from '../constants.js';

/**
 * Parses YouTube transcript XML into an array of segment objects.
 * @param {string} transcriptXml - Raw XML transcript data from YouTube
 * @param {string} lang - Language code of the transcript
 * @returns {Array<Object>} Array of transcript segment objects
 * @returns {string} returns[].text - The transcript text for this segment
 * @returns {number} returns[].duration - Duration of the segment in seconds
 * @returns {number} returns[].offset - Start time offset of the segment in seconds
 * @returns {string} returns[].lang - Language code of the transcript
 * @throws {Error} If no transcript segments are found in the XML
 */
export function parseTranscript(transcriptXml, lang) {
  const results = [...transcriptXml.matchAll(RE_XML_TRANSCRIPT)];
  
  if (results.length === 0) {
    throw new Error('No transcript segments found in XML');
  }

  const segments = results.map((match) => ({
    text: match[3],
    duration: parseFloat(match[2]),
    offset: parseFloat(match[1]),
    lang,
  }));

  return segments;
}

