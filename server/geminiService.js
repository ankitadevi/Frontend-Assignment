import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractAndParseJson, validateStudySet } from './validator.js';
import { getMockStudySet } from './mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// gemini-2.5-flash is Google's active, high-speed free tier model
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * System instruction enforcing strict JSON response format.
 */
const SYSTEM_INSTRUCTION = `
You are an expert educational curriculum designer.
Given study notes, text, or a topic, your job is to generate a structured, comprehensive interactive study set.

CRITICAL REQUIREMENTS:
1. You MUST respond with ONLY a single, valid, parseable JSON object.
2. Do NOT wrap output in markdown codeblocks (no \`\`\`json or \`\`\`).
3. Do NOT include any conversational filler, greeting, preamble, or notes outside the JSON.
4. Adhere strictly to the required JSON schema:
{
  "topic": "Concise, descriptive title (string)",
  "summary": "Clear 2-3 sentence overview explaining core concepts (string)",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "estimatedStudyTimeMinutes": number (integer between 5 and 60),
  "keyConcepts": [
    {
      "id": "c1",
      "concept": "Concept Name (string)",
      "definition": "Clear concise definition or explanation (string)",
      "importance": "Essential" | "High" | "Helpful"
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Concise question or prompt testing recall (string)",
      "back": "Clear, informative answer (string)",
      "hint": "Optional hint to trigger recall without giving answer away (string)",
      "category": "Subtopic or category (string)"
    }
  ],
  "quiz": [
    {
      "id": 1,
      "question": "Clear multiple choice question testing understanding (string)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Detailed explanation of why the correct option is right and others are wrong (string)"
    }
  ]
}

Ensure all flashcards and quiz questions are factually accurate, clear, and relevant to the provided text.
`;

/**
 * Calls Google Gemini REST API or falls back to mock generator.
 */
export async function generateStudySet({
  text,
  mode = 'all',
  difficulty = 'Intermediate',
  isRefinement = false,
  existingData = null,
  refinementInstruction = '',
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini API key configured, use deterministic rich mock fallback
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('[GeminiService] No GEMINI_API_KEY provided; operating in Mock Fallback mode.');
    const mockData = getMockStudySet(text, mode, difficulty);
    return {
      data: mockData,
      source: 'mock-engine',
      warning: 'Operating in demo mode. Add GEMINI_API_KEY in .env for live Gemini generation.',
    };
  }

  let userPrompt = `
Generate an interactive study set for the following study material or topic:

---
${text}
---

Configuration:
- Target Mode: ${mode} (generate both flashcards and quiz questions)
- Difficulty Level: ${difficulty}
- Minimum flashcards: 4
- Minimum quiz questions: 3
- Minimum key concepts: 3

Remember: Output ONLY valid JSON adhering strictly to the schema.
`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.3,
      topP: 0.85,
      responseMimeType: 'application/json',
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[GeminiService] API error (${response.status}):`, errorText);

      // Handle 429 Rate Limit / Quota Exhaustion gracefully by falling back to mock
      if (response.status === 429) {
        console.warn('[GeminiService] 429 Quota Exceeded. Falling back to Mock Engine.');
        const fallback = getMockStudySet(text, mode, difficulty);
        return {
          data: fallback,
          source: 'mock-fallback',
          warning: 'Gemini free quota was exceeded; returned mock response so your workflow is uninterrupted.',
        };
      }

      throw new Error(`Gemini API error ${response.status}: ${errorText.slice(0, 150)}`);
    }

    const jsonResponse = await response.json();
    const candidate = jsonResponse.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('Gemini API returned an empty or invalid candidate response');
    }

    const rawOutput = candidate.content.parts[0].text;

    // Parse through resilient JSON extractor
    const parsed = extractAndParseJson(rawOutput);

    // Validate with Zod
    const validated = validateStudySet(parsed);

    return {
      data: validated,
      source: 'gemini-live',
    };
  } catch (error) {
    console.error('[GeminiService] Generation failed:', error.message);
    throw error;
  }
}
