import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock database
  let medicationData = {
    name: "Metformin",
    dosage: "500mg Tablet",
    purpose: "To help control your blood sugar.",
    instructions: [
      {
        type: "dosage",
        text: "1 Tablet",
        subtext: "Twice a day (Morning and Night)",
        icon: "clock"
      },
      {
        type: "food",
        text: "With Food",
        subtext: "Take during or right after a meal.",
        icon: "utensils"
      }
    ],
    lastTaken: "Today at 8:15 AM",
    pillImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmbV1M6oX_F61Iq07sN6eqaBvjob04UNokWdBnHU9syzlr6bNcU0fvHECPLrX0ca3badA7JgRSxCHoIWAIpmeM4xPho_7122hA_F0DorygWk1DJNjNGlQyfM7YJBKUx2ewN1aKWT8E4SLyBqvg7mSfbG3f75mB7RkalIKNduNPHtzd8sSgyCZc_-z9TapQ5u_Colqht-N6Uo2DF-tRPqb-FnQmwH4QIJRiOS1G_Qu_1UJ4ga2oplbQeX8Uo2mueF295T8P6zLjlPo"
  };

  // API routes
  app.get("/api/medication", (req, res) => {
    res.json(medicationData);
  });

  app.post("/api/medication/take", (req, res) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    medicationData.lastTaken = `Today at ${timeString}`;
    res.json({ success: true, lastTaken: medicationData.lastTaken });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
