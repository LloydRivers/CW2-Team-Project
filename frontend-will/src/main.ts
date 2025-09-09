// F1 Insights Project
// Will Marsden - 22233576

import './style.css';

// API endpoint configuration
const API_URL = 'http://localhost:3000/api';
const app = document.getElementById('app')!;

async function startApp() {
  // Check if user already has a session
  let userSession = getSavedSession();
  
  // Decide what to show them
  if (userSession && checkSessionValid(userSession)) {
    // They're logged in, show dashboard
    renderDashboard(userSession.user);
  } else {
    // No valid session, clear any old stuff and show login
    wipeSessionData();
    renderLoginScreen();
  }
}

// Retrieve session from browser storage
function getSavedSession() {
    // Try to grab session from localStorage
    try {
    const savedData = localStorage.getItem('cw2_f1_insights_session');
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    // REMEMBER: remove this debug log before submission
    console.log("Session data parsing error:", error);
    return null;
  }
}

// Quick validation check for session object
function checkSessionValid(session) {
  // Basic sanity check
  if (!session) return false;
  
  // TODO: Could add token expiry validation here 
  return true;
}

// Store session data in browser storage
function saveSessionData(data) {
  // Store session in localStorage so it persists between page loads
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
  // Get the email and password from form
  let email = (document.getElementById('email') as HTMLInputElement).value;
  let pass = (document.getElementById('password') as HTMLInputElement).value;

  // Check if both fields are filled
  if (!email || !pass) {
    showMessage('Please enter both email and password', true);
    return;
  }

  try {
    // Make request to login API
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
      // Login failed for some reason
      showMessage(result.message || 'Login error - check credentials', true);
    } else {
      // Login worked - save the session data
      let userData = {
        token: result.token || result.access_token || result.jwt,
        user: { 
          id: result.user?.id || email,
          email: email 
        },
        expiresAt: result.expiresAt || result.expires_at
      };
      
      saveSessionData(userData);
      renderDashboard(userData.user);
    }
  } catch (error) {
    // REMEMBER: error messages need updating for submission
    // Network or other error
    showMessage('Connection error - check network', true);
    console.error('Login error:', error);
  }
}

// Handle registration attempt
async function doSignUp() {
  // Get user inputs from form
  let email = (document.getElementById('email') as HTMLInputElement).value;
  let pass = (document.getElementById('password') as HTMLInputElement).value;

  // Basic validation checks
  if (!email || !pass) {
    showMessage('Both fields are required', true);
    return;
  }

  // Check password length (basic security)
  if (pass.length < 8) {
    showMessage('Password needs to be at least 8 characters', true);
    return;
  }

  try {
    // Send signup request to backend
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
      showMessage(result.message || 'Account creation failed', true);
    } else {
      // Registration successful
      showMessage('Account created successfully! Please sign in.', false);
    }
  } catch (err) {
    // Network error
    showMessage('Server error - please try again', true);
  }
}

// Display message to user
function showMessage(msg, isError = true) {
  let msgBox = document.getElementById('errorMessage');
  if (!msgBox) return;
  
  msgBox.textContent = msg;
  
  // Different styling for errors vs success messages
  if (isError) {
    msgBox.className = 'text-sm text-red-600';
  } else {
    msgBox.className = 'text-sm text-green-600';
  }
  
  msgBox.classList.remove('hidden');
}

// NOTE: remove debug stuff before final submission.
// TODO: Add better navigation for different sections.
// Render the main dashboard after successful login
function renderDashboard(user) {
  // Build the main app interface
  app.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      <nav class="shadow bg-white">
        <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex items-center space-x-8">
              <h1 class="text-xl font-semibold text-gray-900">F1 Insights</h1>
              <div class="hidden md:flex space-x-4">
                <button class="nav-btn px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900" data-section="featured-driver">🏎️ Featured Driver</button>
                <button class="nav-btn px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900" data-section="featured-team">🏁 Featured Team</button>
                <button class="nav-btn px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900" data-section="race-weekend">🏆 Latest Race Weekend</button>
                <button class="nav-btn px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900" data-section="highlights">📺 Latest Highlights</button>
              </div>
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
        <div id="content" class="px-4 py-6 sm:px-0">
          <!-- Content loads here -->
        </div>
      </main>
    </div>
  `;

  // Wire up navigation and logout functionality
  document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Clear active state from all buttons
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('border-b-2', 'border-indigo-500', 'text-indigo-600'));
      // Set active state on clicked button
      (e.target as HTMLElement).classList.add('border-b-2', 'border-indigo-500', 'text-indigo-600');
      
      let section = (e.target as HTMLElement).getAttribute('data-section');
      loadSection(section);
    });
  });

  // Default to showing featured driver section
  loadSection('featured-driver');
}

// Handle user logout
async function handleLogout() {
  try {
    let session = getSavedSession();
    // Clear session data (no backend logout endpoint yet)
    wipeSessionData();
    
    // Always return to login screen
    renderLoginScreen();
  } catch (err) {
    // If something goes wrong, still log them out locally
    console.error('Logout error:', err);
    wipeSessionData();
    renderLoginScreen();
  }
}

// Load different sections based on user navigation
async function loadSection(section) {
  let content = document.getElementById('content');
  if (!content) return;

  switch(section) {
    case 'featured-driver':
      await renderFeaturedDriverSection(content);
      break;
    case 'featured-team':
      await renderFeaturedTeamSection(content);
      break;
    case 'race-weekend':
      await renderRaceWeekendSection(content);
      break;
    case 'highlights':
      await renderHighlightsSection(content);
      break;
  }
}

async function renderFeaturedDriverSection(container) {
  // Set up the basic structure with a featured driver and searchable grid
  container.innerHTML = `
    <div class="space-y-6">
      <div class="items-center flex justify-between">
        <h2 class="font-bold text-2xl text-gray-900">🏎️ Featured Driver</h2>
        <button id="refreshDriverButton" class="text-white bg-indigo-600 rounded-md py-2 px-4 hover:bg-indigo-700">
          Next Driver
        </button>
      </div>
      <div id="featuredDriverCard" class="max-w-2xl">
        <div class="py-8 text-center">Loading featured driver data...</div>
      </div>
      
      <div class="pt-6 border-t">
        <h3 class="mb-4 font-semibold text-lg text-gray-900">All Drivers</h3>
        <input 
          type="text" 
          id="driverSearch" 
          placeholder="Search drivers by name..." 
          class="mb-4 border w-64 rounded-md px-4 py-2"
        />
        <div id="driversGrid" class="gap-6 grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1">
          <div class="py-8 text-center">Getting driver list...</div>
        </div>
      </div>
    </div>
  `;

  // 20 current drivers, until 2026 with Cadillac which will introduce 2 new drivers, meaning this should be changed to 22 next year.
  let currentOffset = 20;

  await loadFeaturedDriver(currentOffset);

  // Add event listener for refresh button, which picks a random driver to feature.
  document.getElementById('refreshDriverButton')?.addEventListener('click', async () => {
    currentOffset = Math.floor(Math.random() * 100); // Pick random driver for the featured card.
    await loadFeaturedDriver(currentOffset);
  });

  // Get the search input and add event listener for filtering the drivers grid
  let searchInput = document.getElementById('driverSearch') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    let query = (e.target as HTMLInputElement).value;
    loadAllDrivers(query);
  });

  // Also load the drivers grid, unfiltered at this point.
  await loadAllDrivers();
}

// Load a single featured driver by offs
async function loadFeaturedDriver(offset = 20) {
  try {
    let url = `${API_URL}/drivers?limit=1&offset=${offset}`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let driver = data.drivers?.[0];
    
    let card = document.getElementById('featuredDriverCard');
    if (!card) return;

    if (!resp.ok || !driver) {
      card.innerHTML = '<div class="text-center py-8 text-gray-500">No driver data available</div>';
      return;
    }

    // Render the driver card, with basic info, wikipedia link, team and their number.
    card.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex items-center space-x-6">
          <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-indigo-600 font-bold text-2xl">${driver.number || '?'}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900">${driver.name} ${driver.surname}</h3>
            <p class="text-lg text-gray-600">${driver.nationality}</p>
            <p class="text-gray-500">Born: ${driver.birthday}</p>
            <p class="text-gray-500">Team: ${driver.teamId}</p>
            ${driver.url ? `<a href="${driver.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm">Wikipedia →</a>` : ''}
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Unable to load featured driver:', error);
    let card = document.getElementById('featuredDriverCard');
    if (card) {
      card.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, no driver data found.</div>';
    }
  }
}

// Load and display all drivers, with optional search filtering
async function loadAllDrivers(searchQuery = '') {
  try {
    let url = `${API_URL}/drivers?limit=50`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let drivers = data.drivers || [];
    
    // Apply search filter if query provided
    if (searchQuery) {
      drivers = drivers.filter(driver => 
        driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    let grid = document.getElementById('driversGrid');
    if (!grid) return;

    if (!resp.ok || drivers.length === 0) {
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No drivers match your search</div>';
      return;
    }

    // Render the driver card, with basic info, wikipedia link, team and their number.
    grid.innerHTML = drivers.map(driver => `
      <div class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-indigo-600 font-bold">${driver.number || '?'}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${driver.name} ${driver.surname}</h3>
            <p class="text-gray-600">${driver.nationality}</p>
            <p class="text-gray-500 text-sm">Born: ${driver.birthday}</p>
            <p class="text-gray-500 text-sm">Team: ${driver.teamId}</p>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Unable to load drivers list:', error);
    let grid = document.getElementById('driversGrid');
    if (grid) {
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">An error has occured, no drivers found.</div>';
    }
  }
}

// Render the featured team section
async function renderFeaturedTeamSection(container) {
  // Basic layout with featured team and all teams grid
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">🏁 Featured Team</h2>
        <button id="refreshTeamBtn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Next Team
        </button>
      </div>
      <div id="featuredTeamCard" class="max-w-2xl">
        <div class="text-center py-8">Loading featured team...</div>
      </div>
      
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">All Teams</h3>
        <div id="teamsGrid" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="text-center py-8">Loading teams...</div>
        </div>
      </div>
    </div>
  `;

  let currentOffset = 0; // Start with first team

  // Load featured team first
  await loadFeaturedTeam(currentOffset);

  // Handle refresh button clicks
  document.getElementById('refreshTeamBtn')?.addEventListener('click', async () => {
    currentOffset = Math.floor(Math.random() * 10);
    await loadFeaturedTeam(currentOffset);
  });

  // Load the teams grid as well
  await loadAllTeams();
}

async function loadFeaturedTeam(offset = 0) {
  try {
    let url = `${API_URL}/teams?limit=1&offset=${offset}`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let team = data.teams?.[offset] || data.teams?.[0];
    
    let card = document.getElementById('featuredTeamCard');
    if (!card) return;

    if (!resp.ok || !team) {
      card.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, no featured team found.</div>';
      return;
    }

    // Render the team card with basic info and wikipedia link
    card.innerHTML = `
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex items-center space-x-6">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <span class="text-red-600 font-bold text-lg">🏁</span>
          </div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-900">${team.teamName}</h3>
            <p class="text-lg text-gray-600">${team.teamNationality}</p>
            <p class="text-gray-500">Championships: ${team.constructorsChampionships || 0}</p>
            <p class="text-gray-500">First appeared: ${team.firstAppeareance || 'Unknown'}</p>
            ${team.url ? `<a href="${team.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm">View Wikipedia →</a>` : ''}
          </div>
        </div>
      </div>
    `;

  } catch (error) {
    console.error('Unable to load featured team:', error);
    let card = document.getElementById('featuredTeamCard');
    if (card) {
      card.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, no featured team found.</div>';
    }
  }
}

async function loadAllTeams() {
  try {
    // Fetch all teams (limit to 20 until 2026)
    let url = `${API_URL}/teams?limit=20`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let teams = data.teams || [];
    
    let grid = document.getElementById('teamsGrid');
    if (!grid) return;

    if (!resp.ok || teams.length === 0) {
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">An error has occured, no teams found.</div>';
      return;
    }

    // Render each team card with basic info, and wikipedia link
    grid.innerHTML = teams.map(team => `
      <div class="rounded-lg shadow bg-white  p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12  rounded-full flex bg-red-100 items-center justify-center">
            <span class="text-red-600 font-bold">🏁</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">${team.teamName}</h3>
            <p class="text-gray-600">${team.teamNationality}</p>
            <p class="text-gray-500 text-sm">Championships: ${team.constructorsChampionships || 0}</p>
          </div>
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Unable to load teams:', error);
    let grid = document.getElementById('teamsGrid');
    if (grid) {
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">An error has occured, no teams found.</div>';
    }
  }
}

// Render the race weekend section, showing latest race data (not live or even close to live for that matter!)
async function renderRaceWeekendSection(container) {
  // Basic layout
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">🏆 Latest Race Weekend Data</h2>
        <button id="refreshRaceWeekendButton" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Refresh Data
        </button>
      </div>
      
      <div id="raceWeekendData" class="space-y-6">
        <div class="text-center py-8">Loading race weekend data...</div>
      </div>
    </div>
  `;

  // Button to refresh the data
  document.getElementById('refreshRaceWeekendButton')?.addEventListener('click', async () => {
    await loadRaceWeekendData();
  });

  // Load the race weekend information
  await loadRaceWeekendData();
}

async function loadRaceWeekendData() {
  try {
    // Using the exact endpoint from the spec document
    let url = `${API_URL}/sessions/2024/1/fp1?limit=1`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    
    // REMEMBER: remove this debug statement before submission, having some issues with rate limiting at the moment :(
    console.log('Race weekend data:', data);
    
    let container = document.getElementById('raceWeekendData');
    if (!container) return;

    if (!resp.ok) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">Unable to load race data</div>';
      return;
    }

    // Parse the response data structure
    let races = data.races || [];
    
    if (races.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-gray-500">No race data available, you may have been rate limited.</div>';
      return;
    }

    let race = races[0];
    let schedule = race.schedule || {};

    // Render the race information, session schedule and circuit details
    // ALERT: Some of this code was auto-completed by GitHub Copilot, I am reviewing it still and will be confirmed before submission.
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Race Information -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">📍 ${race.raceName}</h3>
          <div class="space-y-2">
            <p class="text-gray-600"><strong>Round:</strong> ${race.round}</p>
            <p class="text-gray-600"><strong>Race Date:</strong> ${schedule.race?.date}</p>
            <p class="text-gray-600"><strong>Circuit:</strong> ${race.circuit?.circuitName}</p>
            <p class="text-gray-600"><strong>Location:</strong> ${race.circuit?.city}, ${race.circuit?.country}</p>
            <p class="text-gray-600"><strong>Winner:</strong> ${race.winner?.name} ${race.winner?.surname}</p>
            <p class="text-gray-600"><strong>Fastest Lap:</strong> ${race.fast_lap?.fast_lap || 'N/A'}</p>
            ${race.url ? `<a href="${race.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm">More details →</a>` : ''}
          </div>
        </div>

        <!-- Session Schedule -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">🕐 Session Schedule</h3>
          <div class="space-y-3">
            ${schedule.fp1 && schedule.fp1.date ? `
              <div class="border-l-4 border-green-500 pl-3">
                <h4 class="font-semibold text-gray-900">Free Practice 1</h4>
                <p class="text-sm text-gray-600">${schedule.fp1.date} at ${schedule.fp1.time}</p>
              </div>
            ` : ''}
            ${schedule.fp2 && schedule.fp2.date ? `
              <div class="border-l-4 border-blue-500 pl-3">
                <h4 class="font-semibold text-gray-900">Free Practice 2</h4>
                <p class="text-sm text-gray-600">${schedule.fp2.date} at ${schedule.fp2.time}</p>
              </div>
            ` : ''}
            ${schedule.fp3 && schedule.fp3.date ? `
              <div class="border-l-4 border-yellow-500 pl-3">
                <h4 class="font-semibold text-gray-900">Free Practice 3</h4>
                <p class="text-sm text-gray-600">${schedule.fp3.date} at ${schedule.fp3.time}</p>
              </div>
            ` : ''}
            ${schedule.qualy && schedule.qualy.date ? `
              <div class="border-l-4 border-red-500 pl-3">
                <h4 class="font-semibold text-gray-900">Qualifying</h4>
                <p class="text-sm text-gray-600">${schedule.qualy.date} at ${schedule.qualy.time}</p>
              </div>
            ` : ''}
            <div class="border-l-4 border-purple-500 pl-3">
              <h4 class="font-semibold text-gray-900">Race</h4>
              <p class="text-sm text-gray-600">${schedule.race?.date} at ${schedule.race?.time}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Circuit Information -->
      ${race.Circuit ? `
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">🏁 Circuit Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-gray-600"><strong>Circuit Name:</strong> ${race.Circuit.circuitName}</p>
              <p class="text-gray-600"><strong>Location:</strong> ${race.Circuit.Location?.locality}, ${race.Circuit.Location?.country}</p>
              ${race.Circuit.url ? `<a href="${race.Circuit.url}" target="_blank" class="text-indigo-600 hover:text-indigo-800 text-sm">Circuit Info →</a>` : ''}
            </div>
            <div>
              <p class="text-gray-600"><strong>Coordinates:</strong></p>
              <p class="text-sm text-gray-500">Lat: ${race.Circuit.Location?.lat}</p>
              <p class="text-sm text-gray-500">Long: ${race.Circuit.Location?.long}</p>
            </div>
          </div>
        </div>
      ` : ''}
    `;

  } catch (error) {
    console.error('Unable to load race weekend data:', error);
    let container = document.getElementById('raceWeekendData');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, no race data found.</div>';
    }
  }
}

// Render the highlights section, with latest YouTube highlights and 2024 season overview
async function renderHighlightsSection(container) {
  // Basic layout with featured highlight and season overview
  container.innerHTML = `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">📺 Latest Highlights</h2>
        <button id="refreshHighlightsButton" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Refresh
        </button>
      </div>
      
      <div id="featuredHighlight" class="mb-6">
        <div class="text-center py-8">Loading latest highlight...</div>
      </div>
      
      <div class="border-t pt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">2024 Season Overview</h3>
        <div id="seasonData">
          <div class="text-center py-8">Loading season data...</div>
        </div>
      </div>
    </div>
  `;

  // Set up the refresh button
  document.getElementById('refreshHighlightsButton')?.addEventListener('click', async () => {
    await loadHighlightsData();
  });

  // Load all the highlights content
  await loadHighlightsData();
}

async function loadHighlightsData() {
  // Get season overview data
  await loadSeasonData();
  
  // Load featured highlight (placeholder for now - YouTube API needs key)
  loadFeaturedHighlight();
}

// Load and display 2024 season overview, I could make a convuluted way to check whether the season is ongoing or not and make it dynamic, but no.
async function loadSeasonData() {
  try {
    let url = `${API_URL}/seasons/2024`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let races = data.races || [];
    
    let container = document.getElementById('seasonData');
    if (!container) return;

    if (!resp.ok || races.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, no season data found.</div>';
      return;
    }

    // Render a summary of the season, listing all races.
    container.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
        <h4 class="text-lg font-semibold text-gray-900">2024 F1 Season</h4>
        <p class="text-gray-600">${races.length} races scheduled</p>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          ${races.slice(0, 9).map(race => `
            <div class="border rounded p-3 hover:shadow-md transition-shadow">
              <h5 class="font-medium text-sm">${race.raceName}</h5>
              <p class="text-xs text-gray-500">Round ${race.round} - ${race.schedule?.race?.date}</p>
              <p class="text-xs text-gray-500">${race.circuit?.country}</p>
              <p class="text-xs text-gray-500">Winner: ${race.winner?.name} ${race.winner?.surname}</p>
            </div>
          `).join('')}
        </div>
        ${races.length > 9 ? `<p class="text-sm text-gray-500 mt-2">... and ${races.length - 9} more races</p>` : ''}
      </div>
    `;

  } catch (error) {
    // REMEMBER: debug statement to be removed before submission
    console.error('Unable to load season data:', error);
    let container = document.getElementById('seasonData');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occured, season data has not loaded.</div>';
    }
  }
}

// Placeholder function to load featured highlight (YouTube API key needed, which I don't have atm.)
function loadFeaturedHighlight() {
  let container = document.getElementById('featuredHighlight');
  if (!container) return;

  // Placeholder for YouTube highlight (requires API key, which I am having trouble obtaining. Curse you google.)
  container.innerHTML = `
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Latest F1 Highlights</h3>
      <div class="aspect-w-16 aspect-h-9 bg-gray-200 rounded flex items-center justify-center min-h-64">
        <div class="text-center">
          <div class="text-4xl mb-2">📺</div>
          <p class="text-gray-600">F1 Highlights</p>
          <p class="text-sm text-gray-500">YouTube integration available with API key</p>
          <a href="https://www.youtube.com/channel/UCB_qr75-ydFVKSF9Dmo6izg" target="_blank" 
             class="text-indigo-600 hover:text-indigo-800 text-sm">
            Visit F1 YouTube Channel
          </a>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('F1 Insights app starting...');
  startApp();
});
