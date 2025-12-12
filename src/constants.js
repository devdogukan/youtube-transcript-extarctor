const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const RE_YOUTUBE =
  /(?:v=|watch\?.*v=|youtu\.be\/|\/v\/|\/embed\/|\/e\/|vi?\/|watch\?.*vi?=)([a-zA-Z0-9_-]{11})/i;

const RE_VIDEO_ID = /^[a-zA-Z0-9_-]{11}$/;
const RE_INNERTUBE_API_KEY = /"INNERTUBE_API_KEY":"([^"]+)"/;
const RE_INNERTUBE_API_KEY_ESCAPED = /INNERTUBE_API_KEY\\":\\"([^\\"]+)\\"/;
const RE_FMT_PARAM = /&fmt=[^&]+$/;

const ANDROID_CLIENT_NAME = 'ANDROID';
const ANDROID_CLIENT_VERSION = '20.10.38';

const RE_XML_TRANSCRIPT = /<text start="([^"]*)" dur="([^"]*)">([^<]*)<\/text>/g;

export {
  DEFAULT_USER_AGENT,
  RE_YOUTUBE,
  RE_VIDEO_ID,
  RE_INNERTUBE_API_KEY,
  RE_INNERTUBE_API_KEY_ESCAPED,
  RE_FMT_PARAM,
  ANDROID_CLIENT_NAME,
  ANDROID_CLIENT_VERSION,
  RE_XML_TRANSCRIPT,
};

