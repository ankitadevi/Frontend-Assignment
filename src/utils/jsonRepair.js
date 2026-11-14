/**
 * Client-side robust JSON extractor & repair fallback.
 * Prevents UI crashes when dealing with untrusted AI payloads.
 */
export function safeParseJson(input) {
  if (!input) {
    throw new Error('Empty payload received');
  }

  if (typeof input === 'object') {
    return input;
  }

  let cleaned = String(input).trim();

  // Strip markdown fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // Find outermost curly braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('Received payload did not contain a valid JSON object structure');
  }

  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Repair trailing commas
    const repaired = cleaned
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    return JSON.parse(repaired);
  }
}
