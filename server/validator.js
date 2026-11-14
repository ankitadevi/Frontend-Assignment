import { z } from 'zod';

export const KeyConceptSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val) => String(val)),
  concept: z.string().min(1, 'Concept name is required'),
  definition: z.string().min(1, 'Definition is required'),
  importance: z.enum(['Essential', 'High', 'Helpful']).default('High'),
});

export const FlashcardSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) return Math.floor(Math.random() * 10000);
    return num;
  }),
  front: z.string().min(1, 'Flashcard front question is required'),
  back: z.string().min(1, 'Flashcard back answer is required'),
  hint: z.string().optional().default(''),
  category: z.string().optional().default('General'),
});

export const QuizQuestionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((val, ctx) => {
    const num = Number(val);
    if (isNaN(num)) return Math.floor(Math.random() * 10000);
    return num;
  }),
  question: z.string().min(1, 'Quiz question is required'),
  options: z.array(z.string().min(1)).min(2, 'At least 2 options required'),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(1, 'Explanation is required'),
}).refine((data) => data.correctIndex < data.options.length, {
  message: 'correctIndex must point to a valid option index',
  path: ['correctIndex'],
});

export const StudySetSchema = z.object({
  topic: z.string().min(1, 'Topic title is required'),
  summary: z.string().min(1, 'Summary is required'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Intermediate'),
  estimatedStudyTimeMinutes: z.number().int().positive().default(15),
  keyConcepts: z.array(KeyConceptSchema).default([]),
  flashcards: z.array(FlashcardSchema).default([]),
  quiz: z.array(QuizQuestionSchema).default([]),
});

/**
 * Robust JSON extraction & repair utility.
 * Handles markdown fences, trailing commas, truncated brackets, and stray quotes.
 */
export function extractAndParseJson(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('LLM output was empty or not a string');
  }

  // 1. Strip markdown code fences if present (```json ... ``` or ``` ... ```)
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 2. Locate first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('LLM response did not contain a valid JSON object structure');
  }

  cleaned = cleaned.substring(firstBrace, lastBrace + 1);

  // 3. Attempt direct parse
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // 4. Attempt common heuristics repair:
    // Remove trailing commas before } or ]
    let repaired = cleaned
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    try {
      return JSON.parse(repaired);
    } catch (secondaryErr) {
      // 5. Attempt quote balancing or line-break sanitization inside strings
      repaired = repaired
        .replace(/[\u201C\u201D]/g, '"') // smart double quotes
        .replace(/[\u2018\u2019]/g, "'"); // smart single quotes

      try {
        return JSON.parse(repaired);
      } catch (finalErr) {
        const errorSnippet = cleaned.length > 200 ? cleaned.slice(0, 200) + '...' : cleaned;
        const parseError = new Error(`Malformed JSON syntax from AI: ${initialErr.message}`);
        parseError.rawSnippet = errorSnippet;
        throw parseError;
      }
    }
  }
}

/**
 * Validates and normalizes parsed data against the StudySetSchema.
 */
export function validateStudySet(parsedData) {
  const result = StudySetSchema.safeParse(parsedData);
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
    const validationError = new Error(`Data validation error: ${formattedErrors}`);
    validationError.zodIssues = result.error.errors;
    throw validationError;
  }
  return result.data;
}
