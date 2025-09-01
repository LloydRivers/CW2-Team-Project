import { unlockApp } from "../auth/unlockApp";

export async function handleLogin(email: string, password: string) {
  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    console.log("Login response:", json);

    if (!res.ok || json.error) {
      throw new Error(json.error || "Login failed");
    }

    // Grab the access token
    const token = json.data.session.access_token;
    console.log("Login successful, access token:", token);

    // Optionally store token somewhere for API calls
    window.localStorage.setItem("authToken", token);

    // Unlock the app
    unlockApp();

    return json;
  } catch (err) {
    console.error(err);
    alert("Login failed, please check your credentials");
  }
}
