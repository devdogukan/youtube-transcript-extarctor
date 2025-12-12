import {
  DEFAULT_USER_AGENT,
  RE_YOUTUBE,
  RE_VIDEO_ID,
} from '../constants.js';

/**
 * Extracts YouTube video ID from a URL or returns the ID if already provided.
 * @param {string} videoIdOrUrl - YouTube video URL or 11-character video ID
 * @returns {string} The extracted video ID
 * @throws {Error} If the input is not a valid YouTube URL or video ID
 */
export function retrieveVideoId(videoIdOrUrl) {
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
 * @param {Object} options - Fetch options
 * @param {string} options.url - The URL to fetch
 * @param {string} [options.method='GET'] - HTTP method (GET, POST, etc.)
 * @param {string} [options.body] - Request body (used for POST requests)
 * @param {Object} [options.headers={}] - Additional headers to include
 * @returns {Promise<Response>} The fetch response
 */
export async function defaultFetch({ url, method = 'GET', body, headers = {} }) {
  const fetchOptions = {
    method,
    headers: {
      'User-Agent': DEFAULT_USER_AGENT,
      ...headers,
    },
  };

  if (body && method === 'POST') {
    fetchOptions.body = body;
  }

  return fetch(url, fetchOptions);
}

