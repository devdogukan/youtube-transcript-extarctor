import {
  DEFAULT_USER_AGENT,
  RE_YOUTUBE,
  RE_VIDEO_ID,
} from '../constants.js';
import { HttpMethod, FetchOptions } from '../types.js';

/**
 * Extracts YouTube video ID from a URL or returns the ID if already provided.
 * @param videoIdOrUrl - YouTube video URL or 11-character video ID
 * @returns The extracted video ID
 * @throws {Error} If the input is not a valid YouTube URL or video ID
 */
export function retrieveVideoId(videoIdOrUrl: string): string {
  if (videoIdOrUrl.length === 11 && RE_VIDEO_ID.test(videoIdOrUrl)) {
    return videoIdOrUrl;
  }
  
  const matchId = videoIdOrUrl.match(RE_YOUTUBE);
  if (matchId) {
    return matchId[1];
  }
  
  throw new Error('Invalid YouTube video ID or URL');
}

/**
 * Performs an HTTP fetch request with default headers including User-Agent.
 * @param options - Fetch options
 * @param options.url - The URL to fetch
 * @param options.method - HTTP method (GET, POST, etc.)
 * @param options.body - Request body (used for POST requests)
 * @param options.headers - Additional headers to include
 * @returns The fetch response
 */
export async function defaultFetch({ url, method = HttpMethod.GET, body, headers = {} }: FetchOptions): Promise<Response> {
  const fetchOptions: {
    method: string;
    headers: Record<string, string>;
    body?: string;
  } = {
    method,
    headers: {
      'User-Agent': DEFAULT_USER_AGENT,
      ...headers,
    },
  };

  if (body && method === HttpMethod.POST) {
    fetchOptions.body = body;
  }

  return fetch(url, fetchOptions);
}

