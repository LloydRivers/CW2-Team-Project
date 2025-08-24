// API Configuration
const API_CONFIG = {
  //   baseUrl: "https://kjyxxyagwqdqdgcnrlpk.supabase.co/functions/v1",
  baseUrl: "http://localhost:3000/api",
  authToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqeXh4eWFnd3FkcWRnY25ybHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjE5ODIsImV4cCI6MjA2OTYzNzk4Mn0.ZnDaE9s81RHnR7YKjmhaex8SeGjKXGfqlShwBnBrWw8",
} as const;

export async function apiCall<T = any>(endpoint: string): Promise<T> {
  console.log(`API call initiated for ${endpoint}`);
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_CONFIG.authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}
