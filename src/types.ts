/**
 * Output format types for transcript formatting
 */
export enum OutputFormat {
  JSON = 'json',
  TEXT = 'text',
  MARKDOWN = 'markdown',
  SRT = 'srt',
}

/**
 * HTTP method types
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
}

/**
 * Transcript segment structure
 */
export interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang: string;
}

/**
 * Format-specific options
 */
export interface FormatOptions {
  sentencesPerParagraph?: number;
  includeTimestamps?: boolean;
}

/**
 * Options for getTranscriptFromUrl function
 */
export interface TranscriptOptions {
  format?: OutputFormat | string;
  outputFile?: string;
  formatOptions?: FormatOptions;
}

/**
 * Options for fetch function
 */
export interface FetchOptions {
  url: string;
  method?: HttpMethod | string;
  body?: string;
  headers?: Record<string, string>;
}

/**
 * Parsed command line arguments
 */
export interface ParsedArgs {
  help?: boolean;
  url?: string | null;
  format?: OutputFormat | string;
  output?: string | null;
  sentencesPerParagraph?: number;
  timestamps?: boolean;
}

/**
 * Response type for getTranscriptFromUrl
 */
export type TranscriptResponse =
  | TranscriptSegment[]
  | string
  | { success: true; file: string; format: string }
  | { error: string; videoId: string };

/**
 * Response from fetchTranscript function
 */
export interface FetchTranscriptResponse {
  transcriptXml: string;
  videoId: string;
  lang: string;
}

/**
 * YouTube API player response structure
 */
export interface YouTubePlayerResponse {
  captions?: {
    playerCaptionsTracklistRenderer?: CaptionTracklistRenderer;
  };
  playerCaptionsTracklistRenderer?: CaptionTracklistRenderer;
  playabilityStatus?: {
    status: string;
  };
}

/**
 * Caption tracklist renderer structure
 */
export interface CaptionTracklistRenderer {
  captionTracks?: CaptionTrack[];
}

/**
 * Caption track structure
 */
export interface CaptionTrack {
  baseUrl?: string;
  url?: string;
  languageCode?: string;
}

