#!/usr/bin/env node

import { getTranscriptFromUrl } from './index.js';

/**
 * Parses command line arguments
 * @returns {Object} Parsed options
 */
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    return { help: true };
  }

  const options = {
    url: null,
    format: 'json',
    output: null,
    sentencesPerParagraph: 3,
    timestamps: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--format') || arg === '-f') {
      const value = arg.includes('=') ? arg.split('=')[1] : args[++i];
      if (value && ['json', 'text', 'markdown', 'srt'].includes(value.toLowerCase())) {
        options.format = value.toLowerCase();
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
function showHelp() {
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
async function main() {
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
    const formatOptions = {};
    
    if (options.format === 'text') {
      formatOptions.sentencesPerParagraph = options.sentencesPerParagraph;
    } else if (options.format === 'markdown') {
      formatOptions.includeTimestamps = options.timestamps;
    }

    const result = await getTranscriptFromUrl(options.url, {
      format: options.format,
      outputFile: options.output,
      formatOptions,
    });

    if (result.error) {
      console.error(`Error: ${result.error}`);
      if (result.videoId && result.videoId !== 'unknown') {
        console.error(`Video ID: ${result.videoId}`);
      }
      process.exit(1);
    }

    if (result.success) {
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
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();

