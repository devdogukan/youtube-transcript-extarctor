import {
  RE_INNERTUBE_API_KEY,
  RE_INNERTUBE_API_KEY_ESCAPED,
  RE_FMT_PARAM,
  ANDROID_CLIENT_NAME,
  ANDROID_CLIENT_VERSION,
} from '../constants.js';
import { retrieveVideoId, defaultFetch } from '../utils.js';

/**
 * Fetches transcript XML and metadata from YouTube for a given video URL or ID.
 * @param {string} url - YouTube video URL or 11-character video ID
 * @returns {Promise<Object>} Object containing transcriptXml, videoId, and lang
 * @returns {string} returns.transcriptXml - The raw XML transcript data
 * @returns {string} returns.videoId - The extracted video ID
 * @returns {string} returns.lang - The language code of the transcript
 * @throws {Error} If video is unavailable, transcript is not available, or rate limited
 */
export async function fetchTranscript(url) {
  const identifier = retrieveVideoId(url);

  const watchUrl = `https://www.youtube.com/watch?v=${identifier}`;
  const videoPageResponse = await defaultFetch({ url: watchUrl });

  if (!videoPageResponse.ok) {
    throw new Error(`Video unavailable: ${identifier}`);
  }

  const videoPageBody = await videoPageResponse.text();

  if (videoPageBody.includes('class="g-recaptcha"')) {
    throw new Error('Too many requests. Please try again later.');
  }

  const apiKeyMatch =
    videoPageBody.match(RE_INNERTUBE_API_KEY) ||
    videoPageBody.match(RE_INNERTUBE_API_KEY_ESCAPED);

  if (!apiKeyMatch) {
    throw new Error(`No transcript available for video: ${identifier}`);
  }
  const apiKey = apiKeyMatch[1];

  const playerEndpoint = `https://www.youtube.com/youtubei/v1/player?key=${apiKey}`;
  const playerBody = {
    context: {
      client: {
        clientName: ANDROID_CLIENT_NAME,
        clientVersion: ANDROID_CLIENT_VERSION,
      },
    },
    videoId: identifier,
  };

  const playerRes = await defaultFetch({
    url: playerEndpoint,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playerBody),
  });

  if (!playerRes.ok) {
    throw new Error(`Video unavailable: ${identifier}`);
  }

  const playerJson = await playerRes.json();

  const tracklist =
    playerJson?.captions?.playerCaptionsTracklistRenderer ??
    playerJson?.playerCaptionsTracklistRenderer;

  const tracks = tracklist?.captionTracks;
  const isPlayableOk = playerJson?.playabilityStatus?.status === 'OK';

  if (!playerJson?.captions || !tracklist) {
    if (isPlayableOk) {
      throw new Error(`Transcripts are disabled for video: ${identifier}`);
    }
    throw new Error(`No transcript available for video: ${identifier}`);
  }

  if (!Array.isArray(tracks) || tracks.length === 0) {
    throw new Error(`Transcripts are disabled for video: ${identifier}`);
  }

  const selectedTrack = tracks[0];

  let transcriptURL = selectedTrack.baseUrl || selectedTrack.url;
  if (!transcriptURL) {
    throw new Error(`No transcript available for video: ${identifier}`);
  }
  transcriptURL = transcriptURL.replace(RE_FMT_PARAM, '');

  const transcriptResponse = await defaultFetch({ url: transcriptURL });

  if (!transcriptResponse.ok) {
    if (transcriptResponse.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }
    throw new Error(`No transcript available for video: ${identifier}`);
  }

  const transcriptXml = await transcriptResponse.text();
  const lang = selectedTrack.languageCode;

  return {
    transcriptXml,
    videoId: identifier,
    lang,
  };
}

