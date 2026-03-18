import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

interface Medication {
  id: string;
  name: string;
  description: string;
  timeOfDay: "Morning" | "Afternoon" | "Evening";
  taken: boolean;
  lastTakenDate: string | null;
}

let medications: Medication[] = [
  {
    id: "1",
    name: "Lisinopril",
    description: "For high blood pressure",
    timeOfDay: "Morning",
    taken: true,
    lastTakenDate: new Date().toISOString().split('T')[0],
  },
  {
    id: "2",
    name: "Multivitamin",
    description: "General health",
    timeOfDay: "Morning",
    taken: false,
    lastTakenDate: null,
  },
  {
    id: "3",
    name: "Metformin",
    description: "For blood sugar",
    timeOfDay: "Afternoon",
    taken: false,
    lastTakenDate: null,
  },
  {
    id: "4",
    name: "Atorvastatin",
    description: "For cholesterol",
    timeOfDay: "Evening",
    taken: false,
    lastTakenDate: null,
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/medications", (req, res) => {
    // Reset "taken" status if it's a new day
    const today = new Date().toISOString().split('T')[0];
    medications = medications.map(med => {
      if (med.lastTakenDate !== today) {
        return { ...med, taken: false };
      }
      return med;
    });
    res.json(medications);
  });

  app.post("/api/medications/:id/take", (req, res) => {
    const { id } = req.params;
    const today = new Date().toISOString().split('T')[0];
    medications = medications.map(med => {
      if (med.id === id) {
        return { ...med, taken: true, lastTakenDate: today };
      }
      return med;
    });
    res.json({ success: true });
  });

  app.post("/api/medications", (req, res) => {
    const { name, description, timeOfDay } = req.body;
    const newMed: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      timeOfDay,
      taken: false,
      lastTakenDate: null,
    };
    medications.push(newMed);
    res.json(newMed);
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
