import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

const F1_API_BASE = "https://f1api.dev/api";
const SUPABASE_BASE = "https://kjyxxyagwqdqdgcnrlpk.supabase.co/functions/v1";
const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXh4eWFnd3FkcWRnY25ybHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjE5ODIsImV4cCI6MjA2OTYzNzk4Mn0.ZnDaE9s81RHnR7YKjmhaex8SeGjKXGfqlShwBnBrWw8";


// Added console.log statements for debugging requests when an error occurs.
// Added some endpoints as f1connectapi.vercel.app gave me CORS issues and was unreachable, auto-completed with AI so Mena or myself will need to rewrite this before submission.


app.use(express.json());
app.use(cors());

app.get("/api/drivers", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const limit = req.query.limit || 1;
    const offset = req.query.offset || 20;
    
    let url = `${F1_API_BASE}/current/drivers`;
    
    console.log("Fetching drivers from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    
    if (data.drivers) {
      let drivers = data.drivers;
      
      if (searchQuery) {
        drivers = drivers.filter(driver => 
          driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          driver.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      res.json({ drivers });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers from F1 API" });
  }
});

app.get("/api/teams", async (req, res) => {
  try {
    const limit = req.query.limit || 1;
    const offset = req.query.offset || 0;
    
    const url = `${F1_API_BASE}/current/teams`;
    console.log("Fetching teams from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    
    if (data.teams) {
      res.json({ teams: data.teams });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams from F1 API" });

    console.log("Request:", req.params, req.query);
  }
});

app.get("/api/seasons/:year", async (req, res) => {
  try {
    const year = req.params.year;
    const url = `${F1_API_BASE}/${year}`;
    console.log("Fetching season data from:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    
    if (data.championship && data.races) {
      res.json({ championship: data.championship, races: data.races });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Error fetching season data:", err);
    res.status(500).json({ error: "Failed to fetch season data from F1 API" });

    console.log("Request:", req.params, req.query);
  }
});

app.get("/api/sessions/:year/:round/:session", async (req, res) => {
  try {
    const url = `${F1_API_BASE}/current/last`;
    console.log("Fetching session data from:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      }
    });

    const data = await response.json();
    
    if (data.race) {
      res.json({ races: data.race });
    } else {
      res.json(data);
    }
  } catch (err) {
    console.error("Proxy error (sessions):", err);
    res
      .status(500)
      .json({ error: "Failed to fetch latest sessions from Supabase" });
    
      console.log("Request:", req.params, req.query);
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

    res.json(data);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Failed to login via Supabase" });
  }
});

app.post("/api/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const url = `${SUPABASE_BASE}/signup`;
    console.log("Proxying signup request to:", url);

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

    res.json(data);
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Failed to signup via Supabase" });
  }
});

app.listen(PORT, () =>
  console.log(`Proxy server running at http://localhost:${PORT}`)
);