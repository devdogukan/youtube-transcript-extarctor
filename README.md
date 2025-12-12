# YouTube Transcript Extractor

A simple, plug-and-play Node.js module that extracts clean transcripts from YouTube videos. No UI, no website - just a reusable backend module.

## Features

- ✅ Extracts transcripts from YouTube videos (manual and auto-generated captions)
- ✅ Returns transcript segments with text, duration, offset, and language
- ✅ Works without YouTube login
- ✅ No external dependencies (uses Node.js built-in fetch)
- ✅ Error handling for videos without captions

## Installation

This module requires Node.js 18.0.0 or higher (for built-in fetch support).

No npm installation needed - just copy the `transcript-engine` folder to your project.

## Quick Start

### Standalone Usage

```javascript
import { getTranscriptFromUrl } from './transcript-engine/index.js';

const result = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

if (result.error) {
  console.log('Error:', result.error);
  console.log('Video ID:', result.videoId);
} else {
  // result is an array of transcript segments
  console.log(`Found ${result.length} segments`);
  result.forEach((segment, index) => {
    console.log(`Segment ${index + 1}:`, segment.text);
    console.log(`  Duration: ${segment.duration}s, Offset: ${segment.offset}s`);
  });
}
```

### Running Tests

```bash
node tests/runTests.js
```

Or using npm:

```bash
npm test
```

## API Reference

### `getTranscriptFromUrl(url)`

Extracts transcript from a YouTube video URL or video ID.

**Parameters:**
- `url` (string): YouTube video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`) or video ID

**Returns:**
- `Promise<Array|Object>`: Array of transcript segments on success, or error object on failure

**Success Response (Array of segments):**
```javascript
[
  {
    text: '♪ Never gonna give you up ♪',
    duration: 1.96,
    offset: 161.4,
    lang: 'en'
  },
  {
    text: '♪ Never gonna let you down ♪',
    duration: 2.2,
    offset: 163.44,
    lang: 'en'
  },
  // ... more segments
]
```

**Error Response (Object):**
```javascript
{
  error: "No transcript available",
  videoId: "dQw4w9WgXcQ"
}
```

## Integration Examples

### Next.js API Route

```javascript
// pages/api/transcript.js or app/api/transcript/route.js
import { getTranscriptFromUrl } from '../../../transcript-engine/index.js';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await getTranscriptFromUrl(url);
    
    if (result.error) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### Express Server

```javascript
// server.js
import express from 'express';
import { getTranscriptFromUrl } from './transcript-engine/index.js';

const app = express();

app.get('/api/transcript', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await getTranscriptFromUrl(url);
    
    if (result.error) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Standalone Node Module

```javascript
// my-script.js
import { getTranscriptFromUrl } from './transcript-engine/index.js';

async function main() {
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const result = await getTranscriptFromUrl(videoUrl);

  if (result.error) {
    console.error('Failed to get transcript:', result.error);
    return;
  }

  // result is an array of segments
  console.log(`Found ${result.length} transcript segments`);
  
  // Combine all text
  const fullText = result.map(segment => segment.text).join(' ');
  console.log('\n--- Full Transcript ---');
  console.log(fullText);
  
  // Or work with individual segments
  result.forEach((segment, index) => {
    console.log(`\n[${segment.offset}s] ${segment.text}`);
  });
}

main();
```

## Module Structure

```
transcript-engine/
├── index.js                 # Main entry point
├── services/
│   ├── fetchTranscript.js   # Fetches transcript XML from YouTube
│   └── parseTranscript.js   # Parses XML into segment objects
├── tests/
│   └── runTests.js         # Test script
├── package.json
└── README.md
```

## How It Works

1. **URL Parsing**: Extracts video ID from YouTube URL
2. **API Key Extraction**: Fetches YouTube watch page and extracts Innertube API key
3. **Caption Discovery**: Uses YouTube Innertube API to discover available caption tracks
4. **Transcript Fetching**: Downloads transcript XML from YouTube's caption endpoint
5. **Parsing**: Parses XML into segment objects with text, duration, offset, and language

## Error Handling

The module handles various error scenarios:

- **Video Unavailable**: Video doesn't exist or has been removed
- **No Transcript Available**: Video doesn't have captions
- **Transcripts Disabled**: Captions are disabled for the video
- **Too Many Requests**: Rate limiting from YouTube

All errors return a JSON response with `error` and `videoId` fields.

## Requirements

- Node.js >= 18.0.0 (for built-in fetch API)
- No external dependencies required

## License

MIT

## Notes

- This module uses YouTube's public caption endpoints - no authentication required
- Supports both manual and auto-generated captions
- Works with any public YouTube video that has captions available
- The module is designed to be simple, modular, and easy to integrate

