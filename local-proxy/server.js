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
// POST route for login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const url = `${SUPABASE_BASE}/login`;
    console.log("Proxying login request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // return Supabase response to frontend
    res.json(data);
  } catch (err) {
    console.error("Proxy error (login):", err);
    res.status(500).json({ error: "Failed to login via Supabase" });
  }
});

app.get("/api/highlights", async (req, res) => {
  console.log("Fetching highlights data...");
  try {
    const url = `${SUPABASE_BASE}/highlights`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Fetched highlights data:", data);

    // Wrap single object in array
    res.json(data);
  } catch (err) {
    console.error("Proxy error (highlights):", err);
    res.status(500).json({ error: "Failed to fetch highlights" });
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
