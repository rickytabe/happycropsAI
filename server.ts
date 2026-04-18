import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock API Route as requested
  app.post('/api/analyze', (req, res) => {
    // This is a simple fallback mock. 
    // The main app uses Gemini directly on the client as per security guidelines.
    const { region } = req.body;
    res.json({
      status: "healthy",
      disease_name: "Healthy Maize (Zea mays)",
      confidence_score: 0.95,
      risk_level: "low",
      cause: {
        biological: "None detected.",
        environmental: "Ideal growing conditions in " + region
      },
      treatment_steps: ["Continue regular watering.", "Check for pests weekly."],
      preventive_measures: ["Maintain soil nutrients.", "Ensure good drainage."],
      contextual_insight: "Your crop is thriving. This is a great time to apply organic mulch.",
      untreated_impact: "No immediate threat.",
      location_context: "Common in fertile valleys of " + region,
      seasonal_advice: "Keep an eye on humidity levels as the rainy season approaches."
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AgriNova AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
