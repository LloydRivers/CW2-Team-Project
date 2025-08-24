import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

const SUPABASE_BASE = "https://kjyxxyagwqdqdgcnrlpk.supabase.co/functions/v1";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXh4eWFnd3FkcWRnY25ybHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjE5ODIsImV4cCI6MjA2OTYzNzk4Mn0.ZnDaE9s81RHnR7YKjmhaex8SeGjKXGfqlShwBnBrWw8";

app.use(express.json());
app.use(cors());

// Explicit route for seasons/:year
app.get("/api/seasons/:year", async (req, res) => {
  try {
    const year = req.params.year;
    console.log("________");
    console.log("________");
    console.log("________");
    console.log(year);
    console.log("________");
    console.log("________");
    console.log("________");
    const url = `${SUPABASE_BASE}/seasons/${year}`;
    console.log("Proxying request to:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error (seasons):", err);
    res.status(500).json({ error: "Failed to fetch seasons from Supabase" });
  }
});

// Explicit route for sessions/latest
app.get("/api/sessions/latest", async (req, res) => {
  try {
    const url = `${SUPABASE_BASE}/sessions/latest`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error (sessions):", err);
    res
      .status(500)
      .json({ error: "Failed to fetch latest sessions from Supabase" });
  }
});

// Catch-all for any other endpoints
app.get("/api/*", async (req, res) => {
  try {
    const endpoint = req.params[0];
    const url = `${SUPABASE_BASE}/${endpoint}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error (catch-all):", err);
    res.status(500).json({ error: "Failed to fetch from Supabase" });
  }
});

app.listen(PORT, () =>
  console.log(`Proxy running at http://localhost:${PORT}`)
);
