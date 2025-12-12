/**
 * Formats transcript segments into different output formats
 */

/**
 * Formats segments as plain text paragraphs.
 * @param {Array<Object>} segments - Array of transcript segments
 * @param {Object} [options={}] - Formatting options
 * @param {number} [options.sentencesPerParagraph=3] - Number of sentences per paragraph
 * @returns {string} Formatted text with paragraphs separated by double newlines
 */
export function formatAsText(segments, options = {}) {
  const { sentencesPerParagraph = 3 } = options;
  const texts = segments.map(s => s.text.trim()).filter(Boolean);
  
  // Group sentences into paragraphs
  const paragraphs = [];
  for (let i = 0; i < texts.length; i += sentencesPerParagraph) {
    const paragraph = texts.slice(i, i + sentencesPerParagraph).join(' ');
    paragraphs.push(paragraph);
  }
  
  return paragraphs.join('\n\n');
}

/**
 * Formats segments as markdown.
 * @param {Array<Object>} segments - Array of transcript segments
 * @param {Object} [options={}] - Formatting options
 * @param {boolean} [options.includeTimestamps=false] - Include timestamps in format [MM:SS]
 * @returns {string} Markdown formatted text
 */
export function formatAsMarkdown(segments, options = {}) {
  const { includeTimestamps = false } = options;
  const texts = segments.map(s => {
    if (includeTimestamps) {
      const minutes = Math.floor(s.offset / 60);
      const seconds = Math.floor(s.offset % 60);
      return `**[${minutes}:${seconds.toString().padStart(2, '0')}]** ${s.text}`;
    }
    return s.text;
  });
  
  return texts.join(' ');
}

/**
 * Formats segments as SRT subtitle format.
 * @param {Array<Object>} segments - Array of transcript segments
 * @returns {string} SRT formatted text
 */
export function formatAsSRT(segments) {
  return segments.map((segment, index) => {
    const start = formatSRTTime(segment.offset);
    const end = formatSRTTime(segment.offset + segment.duration);
    return `${index + 1}\n${start} --> ${end}\n${segment.text}\n`;
  }).join('\n');
}

/**
 * Formats time in seconds to SRT time format (HH:MM:SS,mmm).
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatSRTTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Formats segments as JSON string.
 * @param {Array<Object>} segments - Array of transcript segments
 * @returns {string} JSON formatted string
 */
export function formatAsJSON(segments) {
  return JSON.stringify(segments, null, 2);
}

