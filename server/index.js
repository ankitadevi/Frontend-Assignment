import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'StudyCraft AI API Server',
    author: 'Ankita Devi',
  });
});

app.listen(PORT, () => {
  console.log(`[StudyCraft Server] Running on http://localhost:${PORT}`);
});
