// F1 Insights Project
// Will Marsden - 22233576

import './style.css';

// API endpoint
const API_URL = 'http://localhost:3000/api';
const app = document.getElementById('app')!;

async function startApp() {
  // Check if user is already logged in
  let userSession = getSavedSession();
  
  // Show appropriate view based on login status
  if (userSession && checkSessionValid(userSession)) {
    // User has valid session, show their dashboard
    renderDashboard(userSession.user);
  } else {
    // No session found, clear any old data
    wipeSessionData();
    renderLoginScreen();
  }
}

// Get session from browser storage
function getSavedSession() {
    // Grab session from localStorage if it exists
    try {
    const saved = localStorage.getItem('cw2_f1_insights_session');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    // Parsing error of some sort
    console.log("Couldn't parse session data");
    return null;
  }
}

// Quick validation check for session object
function checkSessionValid(session) {
  // Basic validation
  if (!session) return false;
  
  // Could add token expiry check here too
  return true;
}

// Save session data to browser storage
function saveSessionData(data) {
  // Store in localStorage for persistence
  localStorage.setItem('cw2_f1_insights_session', JSON.stringify(data));
}
  
// Remove session data from storage
function wipeSessionData() {
  localStorage.removeItem('cw2_f1_insights_session');
}

// Show the login/signup form
function renderLoginScreen() {
  // Render login form with Tailwind css styling.
  app.innerHTML = `
    <div class="min-h-screen flex py-12 px-4 items-center justify-center bg-gray-50 sm:px-6 lg:px-8">
      <div class="space-y-8 w-full max-w-md">
        <div>
          <h2 class="mt-6 font-extrabold text-center text-3xl text-gray-900">
            F1 Insights
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Sign in to access your Formula 1 data
          </p>
        </div>
        <form class="mt-8 space-y-6" id="authForm">
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              class="appearance-none w-full px-3 py-2 border-gray-300 text-gray-900 rounded-md relative block focus:outline-none sm:text-sm focus:ring-indigo-500 placeholder-gray-500 focus:z-10 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              class="appearance-none w-full rounded-md px-3 py-2 border-gray-300 focus:outline-none relative block text-gray-900 focus:border-indigo-500 sm:text-sm placeholder-gray-500 focus:ring-indigo-500 focus:z-10"
            />
          </div>
          <div id="errorMessage" class="hidden text-red-600 text-sm"></div>
          <div class="flex space-x-4">
            <button
              type="button"
              id="signInButton"
              class="py-2 px-4 text-sm bg-indigo-600 text-white w-full rounded-md font-medium focus:outline-none hover:bg-indigo-700 justify-center flex relative focus:ring-2 group border-transparent focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
            <button
              type="button"
              id="signUpButton"
              class="py-2 px-4 text-sm bg-white text-gray-700 w-full rounded-md font-medium focus:outline-none hover:bg-gray-50 justify-center flex relative focus:ring-2 group border-gray-300 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  // Hook up event handlers
  document.getElementById('signInButton')?.addEventListener('click', doSignIn);
  document.getElementById('signUpButton')?.addEventListener('click', doSignUp);
}

// Handle login attempt
async function doSignIn() {
  // Get form values
  let email = (document.getElementById('email') as HTMLInputElement).value;
  let pass = (document.getElementById('password') as HTMLInputElement).value;

  // Basic validation
  if (!email || !pass) {
    showMessage('Both email and password are required', true);
    return;
  }

  try {
    // Send login request to API
    let resp = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email, 
        password: pass 
      }),
    });

    let result = await resp.json();

    if (!resp.ok) {
      // Login failed
      showMessage(result.message || 'Incorrect credentials', true);
    } else {
      // Login successful - save session
      let userData = {
        token: result.token,
        user: { 
          id: result.user?.id || email,
          email: email 
        },
        expiresAt: result.expiresAt
      };
      
      saveSessionData(userData);
      renderDashboard(userData.user);
    }
  } catch (error) {
    // REMEMBER: messages need to be updated for submission
    // Network or other error
    showMessage('Network Error, check logs.', true);
    console.error('Login error:', error);
  }
}

// Handle registration attempt
async function doSignUp() {
  // Get user input
  let email = (document.getElementById('email') as HTMLInputElement).value;
  let pass = (document.getElementById('password') as HTMLInputElement).value;

  // Validate inputs
  if (!email || !pass) {
    showMessage('Please fill in both fields', true);
    return;
  }

  // Simple password strength check
  if (pass.length < 8) {
    showMessage('Password must be at least 8 characters', true);
    return;
  }

  try {
    // Send registration request
    let resp = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password: pass 
      }),
    });

    let result = await resp.json();

    if (!resp.ok) {
      // Registration failed
      showMessage(result.message || 'Could not create account', true);
    } else {
      // Registration successful
      showMessage('Your account has been created! You can now sign in.', false);
    }
  } catch (err) {
    // Network error
    showMessage('Server connection failed - please try again later', true);
  }
}

// Display message to user
function showMessage(msg, isError = true) {
  let msgBox = document.getElementById('errorMessage');
  if (!msgBox) return;
  
  msgBox.textContent = msg;
  
  // Set appropriate styling based on message type
  if (isError) {
    msgBox.className = 'text-sm text-red-600';
  } else {
    msgBox.className = 'text-sm text-green-600';
  }
  
  msgBox.classList.remove('hidden');
}

// REMEMBER: remove debugging stuff before submission.
// TO-DO: Add navigation bar for different data outputs.
// Render the main dashboard after login
function renderDashboard(user) {
  // Show the main app interface
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="shadow bg-white">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex items-center">
              <h1 class="text-xl font-semibold text-gray-900">F1 Insights</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700 text-sm">Hi, ${user.email}</span>
              <button
                id="logoutButton"
                class="px-4 py-2 text-white bg-red-600 text-sm rounded-md font-medium hover:bg-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main class="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="flex h-96 border-4 border-dashed items-center justify-center rounded-lg border-gray-200">
            <div class="text-center">
              <h2 class="mb-4 text-2xl font-bold text-gray-900">Welcome to Your F1 Insights Dashboard</h2>
              <p class="text-gray-600">You've successfully logged in</p>
              <p class="mt-2 text-gray-500 text-sm">Account ID (Debugging): ${user.id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  // Add logout handler
  document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
}

// Process user logout
async function handleLogout() {
  try {
    let session = getSavedSession();
    // Clear local data first, no /logout endpoint on API yet
    wipeSessionData();
    
    // Always go back to login screen
    renderLoginScreen();
  } catch (err) {
    // Even if there is an error, log the user out.
    console.error('Logout error:', err);
    wipeSessionData();
    renderLoginScreen();
  }
}

// Start the frontend app when DOM is loaded.
document.addEventListener('DOMContentLoaded', () => {
  console.log('CW2 F1 Insights Frontend starting up...');
  startApp();
});
