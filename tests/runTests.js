import { getTranscriptFromUrl } from '../src/index.js';

const testUrls = [
  'https://youtu.be/e8qC2fST5C0?si=OMhbddtAr76-P7uv',
];

async function runTests() {
  console.log('=== YouTube Transcript Extractor Tests ===\n');

  for (const [index, url] of testUrls.entries()) {
    console.log(`Test ${index + 1}: ${url}`);

    try {
      const result = await getTranscriptFromUrl(url);

      if (result.error) {
        console.log(`✗ ERROR: ${result.error} (Video ID: ${result.videoId})`);
      } else if (Array.isArray(result)) {
        console.log(`✓ SUCCESS: ${result.length} segments, Language: ${result[0]?.lang || 'unknown'}`);
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('✗ UNEXPECTED FORMAT');
      }
    } catch (error) {
      console.log(`✗ EXCEPTION: ${error.message}`);
    }

    console.log('');
  }
}

runTests().catch((error) => {
  console.error('Test execution failed:', error);
  process.exit(1);
});

