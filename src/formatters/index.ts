import { TranscriptSegment, FormatOptions } from '../types.js';

/**
 * Formats transcript segments into different output formats
 */

/**
 * Formats segments as plain text paragraphs.
 * @param segments - Array of transcript segments
 * @param options - Formatting options
 * @param options.sentencesPerParagraph - Number of sentences per paragraph
 * @returns Formatted text with paragraphs separated by double newlines
 */
export function formatAsText(segments: TranscriptSegment[], options: FormatOptions = {}): string {
  const { sentencesPerParagraph = 3 } = options;
  const texts = segments.map(s => s.text.trim()).filter(Boolean);
  
  // Group sentences into paragraphs
  const paragraphs: string[] = [];
  for (let i = 0; i < texts.length; i += sentencesPerParagraph) {
    const paragraph = texts.slice(i, i + sentencesPerParagraph).join(' ');
    paragraphs.push(paragraph);
  }
  
  return paragraphs.join('\n\n');
}

/**
 * Formats segments as markdown.
 * @param segments - Array of transcript segments
 * @param options - Formatting options
 * @param options.includeTimestamps - Include timestamps in format [MM:SS]
 * @returns Markdown formatted text
 */
export function formatAsMarkdown(segments: TranscriptSegment[], options: FormatOptions = {}): string {
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
 * @param segments - Array of transcript segments
 * @returns SRT formatted text
 */
export function formatAsSRT(segments: TranscriptSegment[]): string {
  return segments.map((segment, index) => {
    const start = formatSRTTime(segment.offset);
    const end = formatSRTTime(segment.offset + segment.duration);
    return `${index + 1}\n${start} --> ${end}\n${segment.text}\n`;
  }).join('\n');
}

/**
 * Formats time in seconds to SRT time format (HH:MM:SS,mmm).
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
}

/**
 * Formats segments as JSON string.
 * @param segments - Array of transcript segments
 * @returns JSON formatted string
 */
export function formatAsJSON(segments: TranscriptSegment[]): string {
  return JSON.stringify(segments, null, 2);
}

