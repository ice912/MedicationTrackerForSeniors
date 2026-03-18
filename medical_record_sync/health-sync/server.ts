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

  // Mock API for hospital connection
  app.get("/api/hospitals", (req, res) => {
    res.json([
      { id: "1", name: "General Memorial Hospital", location: "Downtown" },
      { id: "2", name: "St. Jude Medical Center", location: "North Side" },
      { id: "3", name: "City Health Clinic", location: "West End" },
      { id: "4", name: "Mercy Wellness Institute", location: "South Shore" },
    ]);
  });

  app.post("/api/connect", (req, res) => {
    const { hospitalId } = req.body;
    console.log(`Connecting to hospital: ${hospitalId}`);
    // Simulate processing delay
    setTimeout(() => {
      res.json({ success: true, message: "Successfully connected to hospital records." });
    }, 2000);
  });

  app.post("/api/upload", (req, res) => {
    console.log("Processing paper record upload...");
    // Simulate processing delay
    setTimeout(() => {
      res.json({ success: true, message: "Record processed and synced." });
    }, 3000);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
