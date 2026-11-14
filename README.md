# StudyCraft AI - Interactive Study Assistant & Quiz Engine

> A React application that converts free-form text and study notes into interactive flashcards and adaptive quizzes, with structured JSON parsing, error resilience, and re-testing of weak concepts.

Built for the **Frontend Internship Assignment** by **Ankita Devi**.

---

## 🌟 What It Does

1. **Free-Form Text Input**: Paste raw study notes, lecture excerpts, or enter any topic (e.g. *Photosynthesis*, *Git Version Control*, *World History*).
2. **Structured AI Generation**: The backend calls Google Gemini (`gemini-1.5-flash`) with strict JSON schema instructions and safe fallback handling.
3. **Interactive 3D Flashcards**: Flip through cards to test active recall (click card or flip button, navigate with Next/Previous).
4. **Interactive Quiz**: Multiple-choice questions with immediate green/red feedback and detailed explanations for every answer.
5. **Re-Test Wrong Answers**: When the quiz finishes, users can click **"Re-Test Wrong Answers"** to isolate and practice only the questions they missed until mastery is reached.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React (Functional Components & Hooks), Vite, Tailwind CSS, Lucide React.
- **Backend Proxy**: Node.js & Express server (`server/index.js`).
  - Keeps the API key secure on the backend (never leaked in browser bundle).
  - Validates structured AI output using **Zod** schema.
  - Automatically heals malformed JSON (cleans markdown fences, removes trailing commas).
  - Includes offline **Mock Fallback Engine** so the app runs out-of-the-box even without configuring an API key.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ankitadevi/Frontend-Assignment.git
cd Frontend-Assignment
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file in the root folder (or copy `.env.example`):
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
```
> **Note**: If `GEMINI_API_KEY` is not provided, the app will automatically run in **Mock Engine mode** with pre-built study sets, allowing instant evaluation without requiring API credits!

### 3. Run Locally
Run both backend and frontend concurrently with a single command:
```bash
npm start
```
The application will open at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 🛡️ Handling Bad AI Output & Resilience

Handling unpredictability in LLM responses is central to this project:
- **Markdown Fence Stripping**: The model output is sanitized of ` ```json ` and trailing fences.
- **JSON Syntax Repair**: Automatically catches trailing commas or unclosed braces before parsing.
- **Schema Validation**: Validates the payload structure with Zod. If the shape is incorrect, a user-friendly error banner appears with a **1-click Retry** option instead of crashing the UI.
- **Loading & Empty States**: Clean feedback during asynchronous generation and clear empty state guidance.

---

## 🤖 AI Tools Disclosure

As required by the assignment guidelines:
- **AI Tools Used**: Google Antigravity & Gemini.
- **What they were used for**: Drafting initial project scaffolding, structuring the Zod validation schema, and organizing systematic git commits.
- **Code Comprehension**: All code is thoroughly understood, organized into clean functional components, and ready to be explained, modified, or extended live during the technical interview.

---

## ⚠️ Known Limitations

1. **Very Long Documents**: Extremely long text excerpts (>10,000 words) may exceed single-turn prompt limits.
2. **Deterministic Fallback**: In offline mock mode, pre-configured datasets are used for demonstration.

---

## ⏱️ Time Spent

- **Total Time**: Approximately **5 hours** (well within the suggested ~8 hours limit).
  - Backend API & JSON validation: ~1.5 hours
  - Interactive Flashcards & Quiz components: ~2 hours
  - Re-test wrong answers state machine: ~1 hour
  - Documentation, testing & git commit flow: ~0.5 hours
