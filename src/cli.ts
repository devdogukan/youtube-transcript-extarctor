#!/usr/bin/env node

import { getTranscriptFromUrl } from './index.js';
import { OutputFormat, ParsedArgs, TranscriptOptions } from './types.js';

/**
 * Parses command line arguments
 * @returns Parsed options
 */
function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const options: ParsedArgs = {
    url: null,
    format: OutputFormat.JSON,
    output: null,
    sentencesPerParagraph: 3,
    timestamps: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--format') || arg === '-f') {
      const value = arg.includes('=') ? arg.split('=')[1] : args[++i];
      if (value && ['json', 'text', 'markdown', 'srt'].includes(value.toLowerCase())) {
        options.format = value.toLowerCase() as OutputFormat | string;
      }
    } else if (arg.startsWith('--output') || arg === '-o') {
      const value = arg.includes('=') ? arg.split('=')[1] : args[++i];
      if (value) options.output = value;
    } else if (arg.startsWith('--sentences-per-paragraph')) {
      const value = arg.includes('=') ? arg.split('=')[1] : args[++i];
      if (value) options.sentencesPerParagraph = parseInt(value, 10);
    } else if (arg === '--timestamps') {
      options.timestamps = true;
    } else if (!arg.startsWith('-') && !options.url) {
      options.url = arg;
    }
  }

  return options;
}

/**
 * Displays help message
 */
function showHelp(): void {
  console.log(`
YouTube Transcript Extractor - CLI

Usage:
  node src/cli.js <url> [options]

Arguments:
  url                    YouTube video URL or video ID (required)

Options:
  -f, --format <format>  Output format: json, text, markdown, srt (default: json)
  -o, --output <file>    Save output to file
  --sentences-per-paragraph <number>  For text format: sentences per paragraph (default: 3)
  --timestamps           For markdown format: include timestamps
  -h, --help             Show this help message

Examples:
  # JSON format (default)
  node src/cli.js https://youtube.com/watch?v=dQw4w9WgXcQ

  # Text format
  node src/cli.js https://youtube.com/watch?v=dQw4w9WgXcQ --format text

  # Markdown format with timestamps, save to file
  node src/cli.js https://youtube.com/watch?v=dQw4w9WgXcQ --format markdown --output transcript.md --timestamps

  # SRT format, save to file
  node src/cli.js https://youtube.com/watch?v=dQw4w9WgXcQ --format srt --output transcript.srt
`);
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (!options.url) {
    console.error('Error: YouTube URL or video ID is required');
    console.error('Use --help or -h for usage information');
    process.exit(1);
  }

  try {
    const formatOptions: TranscriptOptions['formatOptions'] = {};
    
    if (options.format === OutputFormat.TEXT || options.format === 'text') {
      formatOptions.sentencesPerParagraph = options.sentencesPerParagraph;
    } else if (options.format === OutputFormat.MARKDOWN || options.format === 'markdown') {
      formatOptions.includeTimestamps = options.timestamps;
    }

    const result = await getTranscriptFromUrl(options.url, {
      format: options.format,
      outputFile: options.output || undefined,
      formatOptions,
    });

    // Check if result is an error object
    if (typeof result === 'object' && !Array.isArray(result) && 'error' in result) {
      console.error(`Error: ${result.error}`);
      if (result.videoId && result.videoId !== 'unknown') {
        console.error(`Video ID: ${result.videoId}`);
      }
      process.exit(1);
    }

    // Check if result is a success object
    if (typeof result === 'object' && !Array.isArray(result) && 'success' in result && result.success) {
      console.log(`✓ Successfully saved transcript to ${result.file}`);
      console.log(`Format: ${result.format}`);
    } else {
      // Output to console
      if (Array.isArray(result)) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(result);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error: ${errorMessage}`);
    process.exit(1);
  }
}

main();

