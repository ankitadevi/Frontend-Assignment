import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateStudySet } from './geminiService.js';
import { extractAndParseJson, validateStudySet } from './validator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'StudyCraft AI API Server',
    author: 'Ankita Devi',
    aiProvider: hasGeminiKey ? 'Gemini 1.5 Flash (Live)' : 'Mock Engine (Offline/Demo)',
    hasGeminiKey,
  });
});

// Generation endpoint
app.post('/api/generate', async (req, res) => {
  const { text, mode, difficulty, isRefinement, existingData, refinementInstruction } = req.body;

  if (!text && !refinementInstruction) {
    return res.status(400).json({
      error: 'Invalid request: "text" or "refinementInstruction" is required.',
      code: 'MISSING_INPUT',
    });
  }

  try {
    const result = await generateStudySet({
      text,
      mode: mode || 'all',
      difficulty: difficulty || 'Intermediate',
      isRefinement: Boolean(isRefinement),
      existingData,
      refinementInstruction,
    });

    return res.json(result);
  } catch (error) {
    console.error('[API /api/generate] Error:', error.message);

    // Return structured error payload for client resilience
    return res.status(500).json({
      error: error.message || 'Failed to generate study materials',
      code: error.zodIssues ? 'SCHEMA_VALIDATION_ERROR' : 'LLM_GENERATION_ERROR',
      details: error.zodIssues || error.rawSnippet || null,
      timestamp: new Date().toISOString(),
    });
  }
});

// Error simulation endpoint (for testing & evaluator verification)
app.post('/api/simulate-error', (req, res) => {
  const { type } = req.body;

  switch (type) {
    case 'malformed_json':
      return res.status(200).send('{"topic": "Broken JSON example", "flashcards": [{"id": 1, "front": "Cut off mid-sentence');

    case 'schema_mismatch':
      return res.status(200).json({
        unexpectedKey: 'This does not match StudySetSchema at all',
        numberInsteadOfObject: 12345,
      });

    case 'server_500':
      return res.status(500).json({
        error: 'Simulated internal server crash (HTTP 500)',
        code: 'SIMULATED_CRASH',
      });

    case 'timeout':
      // Delay 15 seconds to test client AbortController
      return setTimeout(() => {
        res.json({ status: 'Delayed response completed' });
      }, 15000);

    default:
      return res.status(400).json({ error: 'Unknown simulation type. Available: malformed_json, schema_mismatch, server_500, timeout' });
  }
});

app.listen(PORT, () => {
  console.log(`[StudyCraft Server] Running on http://localhost:${PORT}`);
  console.log(`[StudyCraft Server] Gemini API Key status: ${Boolean(process.env.GEMINI_API_KEY) ? 'Configured' : 'Missing (using mock fallback)'}`);
});
