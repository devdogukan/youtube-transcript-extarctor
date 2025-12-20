/**
 * Decodes HTML entities in a string without using external libraries.
 * Handles double-encoded entities, numeric entities (decimal and hexadecimal),
 * and common named entities.
 * 
 * @param text - Text containing HTML entities
 * @returns Decoded text with HTML entities converted to their actual characters
 * 
 * @example
 * decodeHtmlEntities("you&amp;#39;ll") // Returns "you'll"
 * decodeHtmlEntities("&amp;quot;Hello&amp;quot;") // Returns '"Hello"'
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  let decoded = text;

  // First pass: Decode &amp; to & (handles double-encoded entities like &amp;#39;)
  decoded = decoded.replace(/&amp;/g, '&');

  // Second pass: Decode numeric entities (decimal: &#39;, hexadecimal: &#x27;)
  // Handle decimal numeric entities (&#39;)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => {
    return String.fromCharCode(parseInt(num, 10));
  });

  // Handle hexadecimal numeric entities (&#x27; or &#X27;)
  decoded = decoded.replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Third pass: Decode common named entities
  const namedEntities: Record<string, string> = {
    '&quot;': '"',
    '&apos;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
  };

  for (const [entity, char] of Object.entries(namedEntities)) {
    decoded = decoded.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), char);
  }

  return decoded;
}

