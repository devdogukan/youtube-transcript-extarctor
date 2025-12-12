# YouTube Transcript Extractor

A simple, plug-and-play Node.js module that extracts clean transcripts from YouTube videos. No UI, no website - just a reusable backend module.

## Features

- ✅ Extracts transcripts from YouTube videos (manual and auto-generated captions)
- ✅ Returns transcript segments with text, duration, offset, and language
- ✅ Multiple output formats: JSON, Text, Markdown, SRT
- ✅ CLI support for command-line usage
- ✅ Works without YouTube login
- ✅ No external dependencies (uses Node.js built-in fetch)
- ✅ Error handling for videos without captions

## Installation

This module requires Node.js 18.0.0 or higher (for built-in fetch support).

### As a Module

Copy the project folder to your project and import it:

```javascript
import { getTranscriptFromUrl } from './youtube-transcript-extractor/src/index.js';
```

### As a CLI Tool (Global Installation)

```bash
npm install -g .
```

After installation, you can use the `youtube-transcript` command globally.

## Quick Start

### CLI Usage

```bash
# JSON format (default, outputs to console)
node src/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Text format
node src/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format text

# Markdown format with timestamps, save to file
node src/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format markdown --output transcript.md --timestamps

# SRT format, save to file
node src/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format srt --output transcript.srt

# Show help
node src/cli.js --help
```

If installed globally:

```bash
youtube-transcript https://www.youtube.com/watch?v=dQw4w9WgXcQ --format text
```

### Module Usage

```javascript
import { getTranscriptFromUrl } from './src/index.js';

// JSON format (default)
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

// Text format
const text = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  format: 'text',
  formatOptions: { sentencesPerParagraph: 3 }
});

// Markdown format with timestamps, save to file
await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  format: 'markdown',
  formatOptions: { includeTimestamps: true },
  outputFile: './transcript.md'
});
```

## API Reference

### `getTranscriptFromUrl(url, options)`

Extracts transcript from a YouTube video URL or video ID.

**Parameters:**
- `url` (string): YouTube video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`) or video ID
- `options` (Object, optional): Configuration options
  - `format` (string): Output format - `'json'`, `'text'`, `'markdown'`, or `'srt'` (default: `'json'`)
  - `outputFile` (string, optional): File path to save output
  - `formatOptions` (Object, optional): Format-specific options
    - `sentencesPerParagraph` (number): For `'text'` format - number of sentences per paragraph (default: 3)
    - `includeTimestamps` (boolean): For `'markdown'` format - include timestamps (default: false)

**Returns:**
- `Promise<Array|Object|string>`: 
  - Array of transcript segments (JSON format)
  - String (text, markdown, or srt formats)
  - Object with `success`, `file`, and `format` properties (when `outputFile` is specified)
  - Error object with `error` and `videoId` fields on failure

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
youtube-transcript-extractor/
├── src/
│   ├── index.js             # Main entry point (module export)
│   ├── cli.js               # CLI interface
│   ├── constants.js         # Constants and regex patterns
│   ├── formatters/
│   │   └── index.js         # Format converters (text, markdown, srt, json)
│   ├── services/
│   │   ├── fetchTranscript.js   # Fetches transcript XML from YouTube
│   │   └── parseTranscript.js   # Parses XML into segment objects
│   └── utils/
│       ├── videoUtils.js    # Video ID extraction and HTTP utilities
│       └── fileWriter.js     # File writing utilities
├── package.json
└── README.md
```

## Output Formats

- **JSON** (default): Returns an array of segment objects with `text`, `duration`, `offset`, and `lang` properties
- **Text**: Plain text format with paragraphs (configurable sentences per paragraph)
- **Markdown**: Markdown formatted text with optional timestamps
- **SRT**: Standard SRT subtitle format for video players

## How It Works

1. **URL Parsing**: Extracts video ID from YouTube URL
2. **API Key Extraction**: Fetches YouTube watch page and extracts Innertube API key
3. **Caption Discovery**: Uses YouTube Innertube API to discover available caption tracks
4. **Transcript Fetching**: Downloads transcript XML from YouTube's caption endpoint
5. **Parsing**: Parses XML into segment objects with text, duration, offset, and language
6. **Formatting**: Converts segments to requested format (JSON, text, markdown, or SRT)

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

