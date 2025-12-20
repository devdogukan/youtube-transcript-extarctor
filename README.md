# YouTube Transcript Extractor

A simple, plug-and-play Node.js module that extracts clean transcripts from YouTube videos. No UI, no website - just a reusable backend module.

## Features

- ✅ Extracts transcripts from YouTube videos (manual and auto-generated captions)
- ✅ Returns transcript segments with text, duration, offset, and language
- ✅ Multiple output formats: JSON, Text, Markdown, SRT
- ✅ Automatic HTML entity decoding (converts `&amp;#39;` to `'`, etc.)
- ✅ CLI support for command-line usage
- ✅ Written in TypeScript with full type definitions
- ✅ Works without YouTube login
- ✅ Minimal dependencies (TypeScript for development, Node.js built-in fetch)
- ✅ Error handling for videos without captions

## Installation

This module requires Node.js 18.0.0 or higher (for built-in fetch support).

### Building the Project

First, install dependencies and build the TypeScript code:

```bash
npm install
npm run build
```

This will compile TypeScript files from `src/` to `dist/`.

### As a Module

After building, import from the compiled output:

```javascript
import { getTranscriptFromUrl } from './youtube-transcript-extractor/dist/index.js';
```

Or if using TypeScript in your project, you can import directly from source:

```typescript
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
node dist/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ

# Text format
node dist/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format text

# Markdown format with timestamps, save to file
node dist/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format markdown --output transcript.md --timestamps

# SRT format, save to file
node dist/cli.js https://www.youtube.com/watch?v=dQw4w9WgXcQ --format srt --output transcript.srt

# Show help
node dist/cli.js --help
```

If installed globally:

```bash
youtube-transcript https://www.youtube.com/watch?v=dQw4w9WgXcQ --format text
```

### Module Usage

**JavaScript:**

```javascript
import { getTranscriptFromUrl } from './dist/index.js';

// JSON format (default)
const result = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
  console.log('Error:', result.error);
  console.log('Video ID:', result.videoId);
} else if (Array.isArray(result)) {
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

**TypeScript:**

```typescript
import { getTranscriptFromUrl, OutputFormat } from './src/index.js';
import type { TranscriptSegment } from './src/types.js';

// JSON format (default)
const result = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
  console.log('Error:', result.error);
  console.log('Video ID:', result.videoId);
} else if (Array.isArray(result)) {
  // TypeScript knows result is TranscriptSegment[]
  const segments: TranscriptSegment[] = result;
  console.log(`Found ${segments.length} segments`);
  segments.forEach((segment, index) => {
    console.log(`Segment ${index + 1}:`, segment.text);
    console.log(`  Duration: ${segment.duration}s, Offset: ${segment.offset}s`);
  });
}

// Text format with enum
const text = await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  format: OutputFormat.TEXT,
  formatOptions: { sentencesPerParagraph: 3 }
});

// Markdown format with timestamps, save to file
await getTranscriptFromUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', {
  format: OutputFormat.MARKDOWN,
  formatOptions: { includeTimestamps: true },
  outputFile: './transcript.md'
});
```

## API Reference

### `getTranscriptFromUrl(url, options)`

Extracts transcript from a YouTube video URL or video ID.

**TypeScript Signature:**
```typescript
function getTranscriptFromUrl(
  url: string,
  options?: TranscriptOptions
): Promise<TranscriptResponse>
```

**Parameters:**
- `url` (string): YouTube video URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`) or video ID
- `options` (TranscriptOptions, optional): Configuration options
  - `format` (OutputFormat | string): Output format - `OutputFormat.JSON`, `OutputFormat.TEXT`, `OutputFormat.MARKDOWN`, or `OutputFormat.SRT` (default: `OutputFormat.JSON`)
  - `outputFile` (string, optional): File path to save output
  - `formatOptions` (FormatOptions, optional): Format-specific options
    - `sentencesPerParagraph` (number): For `'text'` format - number of sentences per paragraph (default: 3)
    - `includeTimestamps` (boolean): For `'markdown'` format - include timestamps (default: false)

**Returns:**
- `Promise<TranscriptResponse>`: 
  - `TranscriptSegment[]` - Array of transcript segments (JSON format)
  - `string` - Formatted string (text, markdown, or srt formats)
  - `{ success: true; file: string; format: string }` - Success object (when `outputFile` is specified)
  - `{ error: string; videoId: string }` - Error object on failure

**Type Definitions:**
```typescript
// Available enums
enum OutputFormat {
  JSON = 'json',
  TEXT = 'text',
  MARKDOWN = 'markdown',
  SRT = 'srt'
}

// Transcript segment structure
interface TranscriptSegment {
  text: string;
  duration: number;
  offset: number;
  lang: string;
}

// Options interface
interface TranscriptOptions {
  format?: OutputFormat | string;
  outputFile?: string;
  formatOptions?: FormatOptions;
}

interface FormatOptions {
  sentencesPerParagraph?: number;
  includeTimestamps?: boolean;
}
```

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

```typescript
// pages/api/transcript.ts or app/api/transcript/route.ts
import { getTranscriptFromUrl } from '../../../transcript-engine/dist/index.js';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await getTranscriptFromUrl(url);
    
    if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
```

### Express Server

```typescript
// server.ts
import express from 'express';
import { getTranscriptFromUrl } from './transcript-engine/dist/index.js';

const app = express();

app.get('/api/transcript', async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const result = await getTranscriptFromUrl(url);
    
    if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
      return res.status(404).json(result);
    }
    
    return res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Standalone Node Module

```typescript
// my-script.ts
import { getTranscriptFromUrl } from './transcript-engine/dist/index.js';
import type { TranscriptSegment } from './transcript-engine/src/types.js';

async function main(): Promise<void> {
  const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const result = await getTranscriptFromUrl(videoUrl);

  if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
    console.error('Failed to get transcript:', result.error);
    return;
  }

  if (Array.isArray(result)) {
    // TypeScript knows result is TranscriptSegment[]
    const segments: TranscriptSegment[] = result;
    console.log(`Found ${segments.length} transcript segments`);
    
    // Combine all text
    const fullText = segments.map(segment => segment.text).join(' ');
    console.log('\n--- Full Transcript ---');
    console.log(fullText);
    
    // Or work with individual segments
    segments.forEach((segment, index) => {
      console.log(`\n[${segment.offset}s] ${segment.text}`);
    });
  }
}

main();
```

## Module Structure

```
youtube-transcript-extractor/
├── src/                      # TypeScript source files
│   ├── index.ts              # Main entry point (module export)
│   ├── cli.ts                # CLI interface
│   ├── constants.ts          # Constants and regex patterns
│   ├── types.ts              # TypeScript type definitions and enums
│   ├── formatters/
│   │   └── index.ts          # Format converters (text, markdown, srt, json)
│   ├── services/
│   │   ├── fetchTranscript.ts   # Fetches transcript XML from YouTube
│   │   └── parseTranscript.ts   # Parses XML into segment objects
│   └── utils/
│       ├── videoUtils.ts     # Video ID extraction and HTTP utilities
│       ├── fileWriter.ts     # File writing utilities
│       └── htmlEntities.ts   # HTML entity decoding utilities
├── dist/                     # Compiled JavaScript (generated after build)
├── tsconfig.json             # TypeScript configuration
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
6. **HTML Entity Decoding**: Automatically decodes HTML entities (e.g., `&amp;#39;` → `'`, `&amp;quot;` → `"`) to ensure clean, readable text
7. **Formatting**: Converts segments to requested format (JSON, text, markdown, or SRT)

## Error Handling

The module handles various error scenarios:

- **Video Unavailable**: Video doesn't exist or has been removed
- **No Transcript Available**: Video doesn't have captions
- **Transcripts Disabled**: Captions are disabled for the video
- **Too Many Requests**: Rate limiting from YouTube

All errors return a JSON response with `error` and `videoId` fields.

## Requirements

- Node.js >= 18.0.0 (for built-in fetch API)
- TypeScript >= 5.3.3 (for development)
- @types/node >= 20.10.6 (for TypeScript types)

## Development

To work with the source code:

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Watch mode for development
npm run dev
```

The compiled JavaScript files will be output to the `dist/` directory.

## License

MIT

## Notes

- This module uses YouTube's public caption endpoints - no authentication required
- Supports both manual and auto-generated captions
- Works with any public YouTube video that has captions available
- The module is designed to be simple, modular, and easy to integrate
- Written in TypeScript with full type safety and IntelliSense support
- All types and enums are exported from `src/types.ts` for use in TypeScript projects

