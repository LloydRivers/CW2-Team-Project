// F1 Insights Project
// Will Marsden - 22233576

import './style.css';

// API endpoint configuration
const API_URL = 'http://localhost:3000/api';
const app = document.getElementById('app')!;

// Get the team and return the css class for its colour.
function getTeamColourClass(teamId: string): string {
  if (!teamId) return '';
  
  const teamLower = teamId.toLowerCase();

  if (teamLower.includes('ferrari') || teamLower.includes('scuderia_ferrari')) return 'ferrariRed';
  if (teamLower.includes('mclaren')) return 'mclarenOrange';
  if (teamLower.includes('rb') || teamLower.includes('visa')) return 'visaBlue';
  if (teamLower.includes('haas')) return 'haasGray';
  if (teamLower.includes('sauber')) return 'kickGreen';
  if (teamLower.includes('red_bull') || (teamLower.includes('red'))) return 'redbullBlue';
  if (teamLower.includes('alpine')) return 'alpineBlue';
  if (teamLower.includes('mercedes')) return 'mercedesGreen';
  if (teamLower.includes('williams')) return 'williamsBlue';
  if (teamLower.includes('aston_martin') || (teamLower.includes('aston'))) return 'astonmartinGreen';
  
  // Default, no colour
  return ''; 
}

async function startApp() {
  // Check if user already has a session
  let userSession = getSavedSession();
  
  // Decide what to show them
  if (userSession && checkValidSession(userSession)) {
    // They're logged in, show dashboard
    renderDashboard(userSession.user || { email: 'Unknown User' });
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
    
    showMessage("Session data parsing error:", true);
    
    return null;
  }
}

// Quick validation check for session object
function checkValidSession(session: any) {
  // Basic sanity check
  if (!session) return false;
  
  // TODO: Could add token expiry validation here 
  return true;
}

// Store session data in browser storage
function saveSessionData(data: { token: any; user: { id: any; email: string; }; expiresAt: any; }) {
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
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-100 to-zinc-50 flex items-center px-6 py-12">
      <div class="w-full max-w-md mx-auto">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="px-8 pt-8 pb-6">
            <div class="text-center space-y-2 mb-8">
              <h1 class="text-3xl font-bold tracking-tight text-gray-900">F1 Insights</h1>
              <p class="text-gray-500 text-sm font-medium">Access exclusive Formula 1 data and analytics</p>
            </div>
            
            <form id="authForm" class="space-y-5">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-gray-700 block">Your Email</label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your email address"
                />
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Password</label>
                <input 
                  id="password" 
                  type="password" 
                  required 
                  class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
              </div>
              
              <div id="errorMessage" class="hidden text-red-600 text-sm font-medium bg-red-50 rounded-lg p-3 border border-red-200"></div>
              
              <div class="pt-2 space-y-3">
                <button 
                  type="button" 
                  id="signInButton" 
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:ring-4 focus:ring-blue-200"
                >
                  SignIn
                </button>
                
                <button 
                  type="button" 
                  id="signUpButton" 
                  class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 focus:ring-4 focus:ring-gray-200"
                >
                  Create New Account
                </button>
              </div>
            </form>
          </div>
        </div>
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
        token: result.access_token,
        user: { 
          id: result.user?.id,
          email: email
        },
        expiresAt: result.expires_at
      };
      
      saveSessionData(userData);
      renderDashboard(userData.user);
    }
  } catch (error) {
    showMessage('Connection error - check network', true);
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
function showMessage(msg: string | null, isError = true) {
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

// Render the main dashboard after successful login
function renderDashboard(user: { id?: any; email?: string; }) {
  // Build the main app interface
  app.innerHTML = `
    <div style="min-height: 100vh; background-color: #f8f9fa;">
      <header style="background-color: white; border-bottom: 2px solid #e9ecef; padding: 15px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1 style="margin: 0; color: #333;">F1 Insights Dashboard</h1>
            <div>
              <span style="margin-right: 20px; color: #666;">Hello ${user.email || 'User'}</span>
              <button id="logoutButton" style="padding: 8px 16px; background-color: #dc3545; color: white; border: none; cursor: pointer;">
                Exit
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <nav style="background-color: #e9ecef; padding: 15px 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
          <div style="display: flex; flex-wrap: wrap; gap: 20px;">
            <button class="nav-btn" data-section="featured-driver" style="padding: 10px 15px; background-color: #007bff; color: white; border: none; cursor: pointer;">
              Current Drivers
            </button>
            <button class="nav-btn" data-section="all-drivers" style="padding: 10px 15px; background-color: #6c757d; color: white; border: none; cursor: pointer;">
              All Drivers
            </button>
            <button class="nav-btn" data-section="featured-team" style="padding: 10px 15px; background-color: #6c757d; color: white; border: none; cursor: pointer;">
              Teams
            </button>
            <button class="nav-btn" data-section="race-weekend" style="padding: 10px 15px; background-color: #6c757d; color: white; border: none; cursor: pointer;">
              Race Data
            </button>
            <button class="nav-btn" data-section="highlights" style="padding: 10px 15px; background-color: #6c757d; color: white; border: none; cursor: pointer;">
              Highlights
            </button>
          </div>
        </div>
      </nav>
      
      <main style="max-width: 1200px; margin: 0 auto; padding: 30px 20px;">
        <div id="content">
          <!-- Content loads here -->
        </div>
      </main>
    </div>
  `;

  // Not working sometimes, think its a safari thing.
  document.getElementById('logoutButton')?.addEventListener('click', handleLogout);
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Clear active state from all buttons
      document.querySelectorAll('.nav-btn').forEach(b => {
        (b as HTMLElement).style.backgroundColor = '#6c757d';
      });
      // Set active state on clicked button
      (e.target as HTMLElement).style.backgroundColor = '#007bff';
      
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
async function loadSection(section: string | null) {
  let content = document.getElementById('content');
  if (!content) return;

  switch(section) {
    case 'featured-driver':
      await renderFeaturedDriverSection(content);
      break;
    case 'all-drivers':
      await renderAllDriversSection(content);
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

async function renderAllDriversSection(container: HTMLElement) {
  // Set up the basic structure with a driver grid
  container.innerHTML = `
    <div>
      <h2 style="margin-bottom: 20px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">All Drivers Database</h2>
      
      <div style="margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; color: #333;">Search drivers:</label>
        <input
          type="text"
          id="allDriverSearch"
          placeholder="Type driver name..."
          style="padding: 8px; border: 1px solid #ccc; width: 300px;"
        />
      </div>
      
      <div id="allDriversGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        <div style="text-align: center; padding: 20px; color: #666;">Loading drivers...</div>
      </div>
    </div>
  `;

  // Get the search input and add event listener for filtering the drivers grid
  let searchInput = document.getElementById('allDriverSearch') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    let query = (e.target as HTMLInputElement).value;
    loadAllDrivers(query);
  });

  // Also load the drivers grid, unfiltered at this point.
  await loadAllDrivers();
}


async function renderFeaturedDriverSection(container: HTMLElement) {
  // Set up the basic structure with a featured driver and searchable grid

  // Show different driver not working, but its not essential to the project.
  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Featured Driver</h2>
        <button id="refreshDriverButton" style="padding: 10px 20px; background-color: #28a745; color: white; border: none; cursor: pointer;">
          Show Different Driver
        </button>
      </div>
      
      <div id="featuredDriverCard" style="margin-bottom: 30px;">
        <div style="text-align: center; padding: 20px; color: #666;">Loading featured driver...</div>
      </div>
      
      <hr style="margin: 30px 0; border: 1px solid #ddd;" />
      
      <h3 style="margin-bottom: 15px; color: #333;">Current Season Drivers</h3>
      <div style="margin-bottom: 20px;">
        <input 
          type="text" 
          id="driverSearch" 
          placeholder="Search current drivers..." 
          style="padding: 8px; border: 1px solid #ccc; width: 300px;"
        />
      </div>
      
      <div id="driversGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
        <div style="text-align: center; padding: 20px; color: #666;">Loading drivers...</div>
      </div>
    </div>
  `;

  // 20 current drivers, until 2026 with Cadillac which will introduce 2 new drivers, meaning this should be changed to 22 next year.
  let currentOffset = 20;

  await loadFeaturedDriver(currentOffset);

  // Add event listener for refresh button, which picks a random driver to feature.
  // This is broken, but team refresh works...
  document.getElementById('refreshDriverButton')?.addEventListener('click', async () => {
    currentOffset = Math.floor(Math.random() * 100); // Pick random driver for the featured card.
    await loadFeaturedDriver(currentOffset);
  });

  // Get the search input and add event listener for filtering the drivers grid
  let searchInput = document.getElementById('driverSearch') as HTMLInputElement;
  searchInput.addEventListener('input', (e) => {
    let query = (e.target as HTMLInputElement).value;
    loadDrivers(query);
  });

  // Also load the drivers grid, unfiltered at this point.
  await loadDrivers();
}

// Load a single featured driver by offs
async function loadFeaturedDriver(offset = 20) {
  try {
    let url = `${API_URL}/current/drivers?limit=1&offset=${offset}`;
    
    let resp = await fetch(url);
    let card = document.getElementById('featuredDriverCard');
    if (!card) return;

    if (!resp.ok) {
      // Handle different HTTP status codes
      if (resp.status === 429) {
        card.innerHTML = '<div class="text-center py-8 text-yellow-600">⚠️ Rate limit reached. Please wait a moment before refreshing.</div>';
        return;
      } else {
        card.innerHTML = '<div class="text-center py-8 text-red-500">❌ Unable to load driver data. Please try again later.</div>';
        return;
      }
    }

    let data = await resp.json();
    let driver = data.drivers?.[0];

    if (!driver) {
      card.innerHTML = '<div class="text-center py-8 text-gray-500">No driver data available</div>';
      return;
    }

    // Render the driver card, with basic info, wikipedia link, team and their number.
    card.innerHTML = `
      <div style="background: white; border: 2px solid #ddd; padding: 20px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 60px; height: 60px; background-color: #f0f0f0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <strong style="color: #333; font-size: 18px;">#${driver.number || '?'}</strong>
          </div>
          <div>
            <h3 style="margin: 0 0 5px 0; color: #333; font-size: 20px;">${driver.name} ${driver.surname}</h3>
            <p style="margin: 0 0 3px 0; color: #666;">${driver.nationality}</p>
            <p style="margin: 0; color: #999; font-size: 14px;">Born: ${driver.birthday}</p>
          </div>
        </div>
        <div style="border-top: 1px solid #eee; padding-top: 10px;">
          <p style="margin: 0 0 5px 0; color: #333; font-size: 14px;"><strong>Team:</strong> <span class="${getTeamColourClass(driver.teamId)}">${driver.teamId}</span></p>
          ${driver.url ? `<a href="${driver.url}" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px;">View Wikipedia Profile</a>` : ''}
        </div>
      </div>
    `;

  } catch (error: unknown) {
    console.error('Unable to load featured driver:', error);
    let card = document.getElementById('featuredDriverCard');
    if (card) {
      // likely rate limiting
      if (error instanceof Error && error.message && error.message.includes('Unexpected token')) {
        card.innerHTML = '<div class="text-center py-8 text-yellow-600">🚫 API rate limit reached. Please wait before trying again.</div>';
      } else {
        card.innerHTML = '<div class="text-center py-8 text-red-500">🛜 Network error occurred. Please check your connection and try again.</div>';
      }
    }
  }
}

async function loadAllDrivers(searchQuery = '') {
  try {
    let url = `${API_URL}/drivers`;

    let resp = await fetch(url);
    let grid = document.getElementById('allDriversGrid');
    if (!grid) return;

    if (!resp.ok) {
      // Handle different HTTP status codes
      if (resp.status === 429) {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff9800;">⚠️ Rate limit reached. Please wait a moment.</div>';
        return;
      } else {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">❌ Unable to load drivers list.</div>';
        return;
      }
    }

    let data = await resp.json();
    let drivers = data.drivers || [];
    
    // Apply search filter if query provided
    if (searchQuery) {
      drivers = drivers.filter((driver: { name: string; surname: string; nationality: string; }) => 
        driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (drivers.length === 0) {
      if (searchQuery) {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No drivers match your search</div>';
      } else {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No drivers available</div>';
      }
      return;
    }

    // Render driver cards with basic styling
    grid.innerHTML = drivers.map((driver: { url: any; number: any; name: any; surname: any; nationality: any; birthday: any; teamId: string; }) => `
      <div style="background: white; border: 1px solid #ddd; padding: 15px;">
        <div style="display: flex; margin-bottom: 10px;">
          <div style="width: 40px; height: 40px; background-color: #f5f5f5; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
            <strong style="color: #333; font-size: 14px;">#${driver.number || '?'}</strong>
          </div>
          <div>
            <h4 style="margin: 0 0 3px 0; color: #333; font-size: 16px;">${driver.name} ${driver.surname}</h4>
            <p style="margin: 0 0 2px 0; color: #666; font-size: 13px;">${driver.nationality}</p>
            <p style="margin: 0 0 2px 0; color: #999; font-size: 12px;">Born: ${driver.birthday}</p>
            <p style="margin: 0; color: #333; font-size: 12px;">Team: <span class="${getTeamColourClass(driver.teamId)}">${driver.teamId}</span></p>
          </div>
        </div>
        ${driver.url ? `<a href="${driver.url}" target="_blank" style="color: #007bff; font-size: 12px; text-decoration: underline;">Wikipedia</a>` : ''}
      </div>
    `).join('');

  } catch (error) {
    console.error('Unable to load drivers list:', error);
    let grid = document.getElementById('allDriversGrid');
    if (grid) {
      grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">Network error occurred.</div>';
    }
  }
}

// Load and display current drivers, with optional search filtering
async function loadDrivers(searchQuery = '') {
  try {
    let url = `${API_URL}/current/drivers`;
    
    let resp = await fetch(url);
    let grid = document.getElementById('driversGrid');
    if (!grid) return;

    if (!resp.ok) {
      // Handle different HTTP status codes
      if (resp.status === 429) {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff9800;">⚠️ Rate limit reached. Please wait a moment.</div>';
        return;
      } else {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">❌ Unable to load current drivers.</div>';
        return;
      }
    }

    let data = await resp.json();
    let drivers = data.drivers || [];
    
    // Apply search filter if query provided
    if (searchQuery) {
      drivers = drivers.filter((driver: { name: string; surname: string; nationality: string; }) => 
        driver.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.nationality?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (drivers.length === 0) {
      if (searchQuery) {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No current drivers match your search</div>';
      } else {
        grid.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">No current drivers available</div>';
      }
      return;
    }

    // Render current driver cards with basic styling
    grid.innerHTML = drivers.map((driver: { url: any; number: any; name: any; surname: any; nationality: any; birthday: any; teamId: string; }) => `
      <div style="background: white; border: 1px solid #ddd; padding: 12px;">
        <div style="display: flex; margin-bottom: 8px;">
          <div style="width: 35px; height: 35px; background-color: #e8f4fd; border: 1px solid #007bff; display: flex; align-items: center; justify-content: center; margin-right: 8px;">
            <strong style="color: #007bff; font-size: 12px;">#${driver.number || '?'}</strong>
          </div>
          <div>
            <h4 style="margin: 0 0 2px 0; color: #333; font-size: 14px;">${driver.name} ${driver.surname}</h4>
            <p style="margin: 0 0 1px 0; color: #666; font-size: 12px;">${driver.nationality}</p>
            <p style="margin: 0 0 1px 0; color: #999; font-size: 11px;">Born: ${driver.birthday}</p>
            <p style="margin: 0; color: #333; font-size: 11px;">Team: <span class="${getTeamColourClass(driver.teamId)}">${driver.teamId}</span></p>
          </div>
        </div>
        ${driver.url ? `<a href="${driver.url}" target="_blank" style="color: #007bff; font-size: 11px; text-decoration: underline;">Wikipedia</a>` : ''}
      </div>
    `).join('');

  } catch (error) {
    console.error('Unable to load drivers list:', error);
    let grid = document.getElementById('driversGrid');
    if (grid) {
      // likely rate limiting
      if (error instanceof Error && error.message && error.message.includes('Unexpected token')) {
        grid.innerHTML = '<div class="col-span-full text-center py-8 text-yellow-600">🚫 API rate limit reached. Please wait before loading drivers.</div>';
      } else {
        grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">🛜 Network error occurred. Please check your connection and try again.</div>';
      }
    }
  }
}

// Render the featured team section
// Define interfaces for the team data
interface Team {
  teamName: string;
  teamNationality: string;
  constructorsChampionships?: number;
  firstAppeareance?: string;
  url?: string;
}

async function renderFeaturedTeamSection(container: HTMLElement): Promise<void> {
  // Basic layout with featured team and all teams grid

  // Show different team is working, but driver one isn't, haven't looked too much into why...
  container.innerHTML = `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">Featured Team</h2>
        <button id="refreshTeamButton" style="padding: 10px 20px; background-color: #17a2b8; color: white; border: none; cursor: pointer;">
          Show Different Team
        </button>
      </div>
      
      <div id="featuredTeamCard" style="margin-bottom: 30px;">
        <div style="text-align: center; padding: 20px; color: #666;">Loading featured team...</div>
      </div>
      
      <hr style="margin: 30px 0; border: 1px solid #ddd;" />
      
      <h3 style="margin-bottom: 15px; color: #333;">All Teams</h3>
      <div id="teamsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
        <div style="text-align: center; padding: 20px; color: #666;">Loading teams...</div>
      </div>
    </div>
  `;

  let currentOffset: number = 0; // Start with first team
  // Load featured team first
  await loadFeaturedTeam(currentOffset);

  // Handle refresh button clicks
  document.getElementById('refreshTeamButton')?.addEventListener('click', async (): Promise<void> => {
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
      card.innerHTML = '<div class="text-center py-8 text-red-500">An error has occurred, no featured team found.</div>';
      return;
    }

    // Render the team card with basic info and wikipedia link
    card.innerHTML = `
      <div style="background: white; border: 2px solid #ddd; padding: 20px;">
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="width: 50px; height: 50px; background-color: #fff3cd; border: 1px solid #ffc107; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <span style="color: #856404; font-size: 20px;">🏁</span>
          </div>
          <div>
            <h3 style="margin: 0 0 5px 0; color: #333; font-size: 18px;"><span class="${getTeamColourClass(team.teamName)}">${team.teamName}</span></h3>
            <p style="margin: 0 0 3px 0; color: #666; font-size: 14px;">${team.teamNationality}</p>
            <p style="margin: 0 0 3px 0; color: #999; font-size: 13px;">Championships: ${team.constructorsChampionships || 0}</p>
            <p style="margin: 0; color: #999; font-size: 13px;">First appeared: ${team.firstAppeareance || 'Unknown'}</p>
          </div>
        </div>
        ${team.url ? `<div style="border-top: 1px solid #eee; padding-top: 10px;"><a href="${team.url}" target="_blank" style="color: #007bff; text-decoration: underline; font-size: 14px;">View Wikipedia Profile</a></div>` : ''}
      </div>
    `;

  } catch (error) {
    console.error('Unable to load featured team:', error);
    let card = document.getElementById('featuredTeamCard');
    if (card) {
      card.innerHTML = '<div class="text-center py-8 text-red-500">An error has occurred, no featured team found.</div>';
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
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">An error has occurred, no teams found.</div>';
      return;
    }

    // Render each team card with basic info, and wikipedia link
    grid.innerHTML = teams.map((team: { url: any; teamName: string; teamNationality: any; constructorsChampionships: any; }) => `
      <div class="bg-white rounded shadow p-4 hover:shadow-md">
      <a href="${team.url || '#'}" target="_blank">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span class="text-red-600 font-bold">🏁</span>
          </div>
          <div>
            <h3 class="font-semibold"><span class="${getTeamColourClass(team.teamName)}">${team.teamName}</span></h3>
            <p class="text-gray-600 text-sm">${team.teamNationality}</p>
            <p class="text-gray-500 text-xs">Championships: ${team.constructorsChampionships || 0}</p>
          </div>
        </div>
        </a>
      </div>
    `).join('');

  } catch (error) {
    console.error('Unable to load teams:', error);
    let grid = document.getElementById('teamsGrid');
    if (grid) {
      grid.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">An error has occurred, no teams found.</div>';
    }
  }
}

// Render the race weekend section, showing latest race data (not live or even close to live for that matter!)
async function renderRaceWeekendSection(container: HTMLElement) {
  // Basic layout
  container.innerHTML = `
    <div class="renderedSection">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">🏆 Latest Race Weekend Data</h2>
        <button id="refreshRaceWeekendButton" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Refresh Data
        </button>
      </div>
      
      <div id="raceWeekendData" class="space-y-4">
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
    var formatDate = schedule.race?.date ? new Date(schedule.race?.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">📍 ${race.raceName}</h3>
          <div class="space-y-2">
            <p class="text-gray-900"><strong>Round:</strong> ${race.round}</p>
            <p class="text-gray-900"><strong>Race Date:</strong> ${formatDate}</p>
            <p class="text-gray-900"><strong>Circuit:</strong> ${race.circuit?.circuitName}</p>
            <p class="text-gray-900"><strong>Location:</strong> ${race.circuit?.city}, ${race.circuit?.country}</p>
            <p class="text-gray-900"><strong>Winner:</strong> ${race.winner?.name} ${race.winner?.surname}</p>
            <p class="text-gray-900"><strong>Fastest Lap:</strong> ${race.fast_lap?.fast_lap || 'N/A'}</p>
          </div>
          ${race.url ? `<a href="${race.url}" target="_blank" class="mt-4 block text-indigo-600 hover:text-indigo-900 text-sm">More details →</a>` : ''}
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
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occurred, no race data found.</div>';
    }
  }
}

// Render the highlights section, with latest YouTube highlights and 2024 season overview
// Define interfaces for the data structures
interface HighlightData {
  title: string;
  videoId: string;
  publishedAt: string;
  thumbnailUrl: string;
}

async function renderHighlightsSection(container: HTMLElement): Promise<void> {
  // Basic layout with featured highlight and season overview
  container.innerHTML = `
    <div class="renderedSection">
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
  document.getElementById('refreshHighlightsButton')?.addEventListener('click', async (): Promise<void> => {
    await loadHighlightsData();
  });

  // Load all the highlights content (placeholder)
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
    let url = `${API_URL}/races/2024`;
    
    let resp = await fetch(url);
    let data = await resp.json();
    let races = data.races || [];
    
    let container = document.getElementById('seasonData');
    if (!container) return;

    if (!resp.ok || races.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occurred, no season data found.</div>';
      return;
    }

    // Render a summary of the season, listing all races.
    // Define interfaces for formula 1 race data
    interface Winner {
      name: string | null;
      surname: string | null;
    }

    interface Schedule {
      race?: {
      date: string;
      };
    }

    interface Circuit {
      country: string;
    }

    interface Race {
      raceName: string;
      round: string | number;
      schedule?: Schedule;
      circuit?: Circuit;
      winner?: Winner;
    }

    container.innerHTML = `
      <div class="bg-white rounded-lg shadow p-6">
      <h4 class="text-lg font-semibold text-gray-900">2024 F1 Season</h4>
      <p class="text-gray-600">${races.length} races scheduled</p>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        ${races.slice(0, 9).map((race: Race) => `
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
    let container = document.getElementById('seasonData');
    if (container) {
      container.innerHTML = '<div class="text-center py-8 text-red-500">An error has occurred, season data has not loaded.</div>';
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
