import { handleLogin } from "../api/login";
import { lockApp } from "./unlockApp";

export function initAuthUI() {
  console.log("click the login button");
  const authModal = document.getElementById("auth-modal")!;
  const loginBtn = document.getElementById("login-btn")!;
  const closeBtn = document.getElementById("close-auth")!;
  const authForm = document.getElementById("auth-form") as HTMLFormElement;
  const logoutBtn = document.getElementById("logout-btn")!;

  // Show modal
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    authModal.classList.remove("hidden");
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    authModal.classList.add("hidden");
  });

  // Handle login form
  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = (document.getElementById("auth-email") as HTMLInputElement)
      .value;
    const password = (
      document.getElementById("auth-password") as HTMLInputElement
    ).value;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const result = await handleLogin(email, password);
    if (result) {
      authModal.classList.add("hidden");
      authForm.reset();
    }
  });

  // Handle logout
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    lockApp();
  });
}
