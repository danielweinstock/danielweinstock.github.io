const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

// Version tracking
const APP_VERSION = "1.3.0";
console.log(`🚀 Freeflow Door Display System v${APP_VERSION} loaded at ${new Date().toLocaleString()}`);

const firebaseConfig = {
  apiKey: "AIzaSyDM3BKwXhk8BH8MJNpLoWGRlpEBU7oy904",
  authDomain: "freeflow-internal-projects.firebaseapp.com",
  databaseURL: "https://freeflow-internal-projects-default-rtdb.firebaseio.com",
  projectId: "freeflow-internal-projects",
  storageBucket: "freeflow-internal-projects.firebasestorage.app",
  messagingSenderId: "728885809902",
  appId: "1:728885809902:web:2921c4e10d1d1d09b8d9ff",
  measurementId: "G-PVQGK976ML"
};

let db = null;
let auth = null;

// Initialize Firebase if available
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    auth = firebase.auth();
    console.log('Firebase initialized successfully');
    
    // If using anonymous authentication (Option A), sign in anonymously
    auth.signInAnonymously()
      .then(() => {
        console.log('Anonymous authentication successful');
      })
      .catch((error) => {
        console.error('Anonymous authentication failed:', error);
      });
    
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase not available - running in demo mode');
}

// Rest of your existing code stays the same...
let fadeTimeout = null;
let idleTimeout = null;
let clockInterval = null;
let currentScreenId = null;
let dashboardTimeout = null;

// [All your existing functions remain unchanged from here down]
function getScreenIdentifier() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for reset parameter
  if (urlParams.get('reset') === 'true') {
    localStorage.removeItem('screencloudScreenId');
    console.log('Screen ID reset via URL parameter');
    return Promise.resolve(null);
  }
  
  // 1. First priority: Check ScreenCloud SDK
  if (typeof window.ScreenCloud !== 'undefined') {
    console.log('ScreenCloud SDK detected, fetching configuration...');
    
    return new Promise((resolve) => {
      let resolved = false;
      
      const resolveOnce = (value) => {
        if (!resolved) {
          resolved = true;
          resolve(value);
        }
      };
      
      // Set a timeout to prevent hanging
      setTimeout(() => {
        if (!resolved) {
          console.log('ScreenCloud SDK timeout, falling back');
          resolveOnce(fallbackScreenIdCheckSync());
        }
      }, 2000);
      
      try {
        // Method 1: Try getting custom data directly
        if (window.ScreenCloud.getCustomData && typeof window.ScreenCloud.getCustomData === 'function') {
          window.ScreenCloud.getCustomData((data) => {
            if (data && data.sc_screen_door) {
              console.log('Screen door from ScreenCloud SDK getCustomData:', data.sc_screen_door);
              const validatedId = validateAndSetScreenId(data.sc_screen_door);
              if (validatedId) {
                resolveOnce(validatedId);
                return;
              }
            }
            resolveOnce(fallbackScreenIdCheckSync());
          });
          return;
        }
        
        // Method 2: Try getting screen info
        if (window.ScreenCloud.getScreenInfo && typeof window.ScreenCloud.getScreenInfo === 'function') {
          window.ScreenCloud.getScreenInfo((screenInfo) => {
            if (screenInfo && screenInfo.customData && screenInfo.customData.sc_screen_door) {
              console.log('Screen door from ScreenCloud SDK getScreenInfo:', screenInfo.customData.sc_screen_door);
              const validatedId = validateAndSetScreenId(screenInfo.customData.sc_screen_door);
              if (validatedId) {
                resolveOnce(validatedId);
                return;
              }
            }
            resolveOnce(fallbackScreenIdCheckSync());
          });
          return;
        }
        
        // Method 3: Try direct property access
        if (window.ScreenCloud.customData && window.ScreenCloud.customData.sc_screen_door) {
          console.log('Screen door from ScreenCloud SDK direct access:', window.ScreenCloud.customData.sc_screen_door);
          const validatedId = validateAndSetScreenId(window.ScreenCloud.customData.sc_screen_door);
          if (validatedId) {
            resolveOnce(validatedId);
            return;
          }
        }
        
        // Method 4: Try config/settings
        if (window.ScreenCloud.getConfig && typeof window.ScreenCloud.getConfig === 'function') {
          window.ScreenCloud.getConfig((config) => {
            if (config && config.sc_screen_door) {
              console.log('Screen door from ScreenCloud SDK getConfig:', config.sc_screen_door);
              const validatedId = validateAndSetScreenId(config.sc_screen_door);
              if (validatedId) {
                resolveOnce(validatedId);
                return;
              }
            }
            resolveOnce(fallbackScreenIdCheckSync());
          });
          return;
        }
        
        console.log('ScreenCloud SDK available but no suitable methods found');
        resolveOnce(fallbackScreenIdCheckSync());
        
      } catch (error) {
        console.error('Error accessing ScreenCloud SDK:', error);
        resolveOnce(fallbackScreenIdCheckSync());
      }
    });
  } else {
    console.log('ScreenCloud SDK not available, checking other sources');
    return Promise.resolve(fallbackScreenIdCheckSync());
  }
}

function validateAndSetScreenId(screenCloudDoor) {
  const validDoors = ['warehouse_door', 'main_entrance', 'freeflow_office', 'all_doors'];
  if (validDoors.includes(screenCloudDoor)) {
    console.log('Using ScreenCloud door assignment:', screenCloudDoor);
    // Update localStorage to keep it in sync
    localStorage.setItem('screencloudScreenId', screenCloudDoor);
    return screenCloudDoor;
  } else {
    console.warn('Invalid ScreenCloud door assignment:', screenCloudDoor, 'Expected one of:', validDoors);
    return null;
  }
}

function fallbackScreenIdCheckSync() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // 2. Second priority: Check URL parameters for legacy support
  if (urlParams.get('sc_screen_door')) {
    const screenCloudDoor = urlParams.get('sc_screen_door');
    console.log('Screen door from URL parameter:', screenCloudDoor);
    const validatedId = validateAndSetScreenId(screenCloudDoor);
    if (validatedId) {
      return validatedId;
    }
  }
  
  // 3. Third priority: Check manual URL override
  if (urlParams.get('screenId')) {
    const manualId = urlParams.get('screenId');
    console.log('Using manual URL screenId:', manualId);
    return manualId;
  }
  
  // 4. Fourth priority: Check localStorage (existing manual setup)
  const storedScreenId = localStorage.getItem('screencloudScreenId');
  if (storedScreenId) {
    console.log('Using stored screenId:', storedScreenId);
    return storedScreenId;
  }
  
  // 5. No configuration found
  console.log('No screen configuration found');
  return null;
}

// Enhanced Firebase connection monitoring
function setupFirebaseConnectionMonitoring() {
  if (!db) return;
  
  const connectedRef = db.ref('.info/connected');
  connectedRef.on('value', (snapshot) => {
    if (snapshot.val() === true) {
      console.log('✅ Firebase connected');
    } else {
      console.log('❌ Firebase disconnected');
    }
  });
}

function initializeApp() {
  console.log(`[v${APP_VERSION}] Initializing app with screen ID: ${currentScreenId}`);
  showIdleMessage();

  if (db) {
    // Set up connection monitoring
    setupFirebaseConnectionMonitoring();
    
    // Wait for authentication to complete before setting up database listeners
    const setupDatabaseListener = () => {
      db.ref('doorEvents').limitToLast(1).on('child_added', async function(snapshot) {
        const data = snapshot.val();
        console.log(`[v${APP_VERSION}] Inbound RTDB event data:`, data);
        
        if (!isMessageForThisScreen(data)) {
          console.log(`[v${APP_VERSION}] Message not for this screen, ignoring`);
          return;
        }

        const firstName = data.user_fname || data.fname || '';
        const lastName = data.user_lname || data.lname || '';
        const fullName = data.user || (firstName + ' ' + lastName).trim() || "Guest";
        const eventType = data.event || "entry";
        const timeout = data.timeout || 30000;
        const eventData = Object.assign({}, data, { 
          user_fname: firstName,
          user_lname: lastName,
          user: fullName,
          eventType: eventType, 
          timeout: timeout 
        });

        renderWelcome(eventData);

        if (data.sf_id) {
          try {
            const resp = await fetch('https://hook.us1.make.celonis.com/t3yygxqt3ir6ybqo4uyms9d9gaahasxg?sf_id=' + encodeURIComponent(data.sf_id));
            if (resp.ok) {
              const dashboard = await resp.json();
              dashboard.userPayload = eventData;
              
              // Check if user has no data at all (no jobs, no parts, no messages)
              if (hasNoDataAtAll(dashboard)) {
                console.log(`[v${APP_VERSION}] User has no data at all, staying on welcome screen for 8 seconds`);
                setTimeout(fadeOutAndShowIdle, 8000); // 8 second timeout with fade out
              }
              // Check if there's usable data to display
              else if (hasUsableData(dashboard)) {
                setTimeout(function() {
                  renderDashboard(dashboard, 30000);
                }, 1500);
              } else {
                console.log(`[v${APP_VERSION}] No usable data in dashboard, staying on welcome screen`);
                setTimeout(showIdleMessage, 10000); // 10 second timeout for no data
              }
            } else {
              console.error(`[v${APP_VERSION}] Failed to fetch dashboard data`);
              setTimeout(showIdleMessage, timeout);
            }
          } catch (e) {
            console.error(`[v${APP_VERSION}] Error fetching dashboard from Make.com:`, e);
            setTimeout(showIdleMessage, timeout);
          }
        } else {
          setTimeout(showIdleMessage, timeout);
        }
      });
      console.log(`[v${APP_VERSION}] App initialized with Firebase, waiting for data pushes...`);
    };

    // If using anonymous auth, wait for it to complete
    if (auth) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log('User authenticated:', user.isAnonymous ? 'Anonymous' : user.uid);
          setupDatabaseListener();
        } else {
          console.log('User not authenticated');
          // If not authenticated, you might want to handle this case
          setupDatabaseListener(); // Or remove this if you require auth
        }
      });
    } else {
      // No auth configured, proceed directly
      setupDatabaseListener();
    }
  } else {
    console.log(`[v${APP_VERSION}] App initialized without Firebase - demo mode`);
    
    setTimeout(function() {
      const demoData = {
        user: "Daniel Weinstock",
        user_fname: "Daniel",
        user_lname: "Weinstock", 
        sf_id: "demo_id",
        event: "entry",
        timeout: 30000,
        door: "Freeflow Office",
        emp_id: "demo-emp-id",
        timestamp: Math.floor(Date.now() / 1000)
      };
      renderWelcome(demoData);
      
      setTimeout(function() {
        // Demo dashboard with data - comment/uncomment as needed for testing
        const demoDashboard = {
          userPayload: demoData,
          dispatch: {
            ASSIGNED: {
              tech1: {
                job1: {
                  jobNumber: "12345",
                  jobStartDate: "2025-07-10",
                  startMin: 540,
                  customerName: "ABC Beverage Co",
                  city_state: "Boston, MA",
                  postal_code: "02101",
                  job_category: "Installation",
                  jobStatusName: "Scheduled"
                },
                job2: {
                  jobNumber: "12346",
                  jobStartDate: "2025-07-10",
                  startMin: 720,
                  customerName: "XYZ Restaurant",
                  city_state: "Springfield, MA",
                  postal_code: "01103",
                  job_category: "Maintenance",
                  jobStatusName: "Confirmed"
                }
              }
            }
          },
          parts_transfer: [
            {
              transfer_id: "pt1",
              description: "CO2 Regulator - Model XR500",
              job_number: "12345",
              notes: "Required for installation tomorrow"
            }
          ],
          messages: [
            {
              messageId: "msg1",
              message_text: "Remember to check equipment before departure"
            }
          ]
        };
        
        // Test no data scenario: Uncomment below and comment out above for testing
        // const demoDashboard = {
        //   userPayload: demoData,
        //   dispatch: { ASSIGNED: {} },
        //   parts_transfer: [],
        //   messages: []
        // };
        
        // Check if user has no data at all (no jobs, no parts, no messages)
        if (hasNoDataAtAll(demoDashboard)) {
          console.log(`[v${APP_VERSION}] Demo: User has no data at all, staying on welcome screen for 8 seconds`);
          setTimeout(fadeOutAndShowIdle, 8000); // 8 second timeout with fade out
        } else {
          renderDashboard(demoDashboard, 30000);
        }
      }, 1500);
    }, 5000);
  }
}

function decodeHtmlEntities(text) {
  if (!text) return text;
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

function debugScreenCloudData() {
  console.log('=== ScreenCloud Data Debug ===');
  
  // Check ScreenCloud SDK
  if (typeof window.ScreenCloud !== 'undefined') {
    console.log('✅ ScreenCloud SDK detected');
    console.log('ScreenCloud object:', window.ScreenCloud);
    
    // Check available methods
    const methods = ['getCustomData', 'getScreenInfo', 'getConfig', 'customData'];
    methods.forEach(method => {
      if (window.ScreenCloud[method]) {
        console.log(`✅ ScreenCloud.${method} available`);
        
        // Try to call methods that don't require callbacks
        if (method === 'customData' && typeof window.ScreenCloud[method] === 'object') {
          console.log(`ScreenCloud.${method}:`, window.ScreenCloud[method]);
        }
      } else {
        console.log(`❌ ScreenCloud.${method} not available`);
      }
    });
    
    // Try async methods
    if (window.ScreenCloud.getCustomData) {
      window.ScreenCloud.getCustomData((data) => {
        console.log('ScreenCloud.getCustomData result:', data);
      });
    }
    
    if (window.ScreenCloud.getScreenInfo) {
      window.ScreenCloud.getScreenInfo((info) => {
        console.log('ScreenCloud.getScreenInfo result:', info);
      });
    }
    
    if (window.ScreenCloud.getConfig) {
      window.ScreenCloud.getConfig((config) => {
        console.log('ScreenCloud.getConfig result:', config);
      });
    }
  } else {
    console.log('❌ ScreenCloud SDK not found');
  }
  
  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  console.log('URL sc_screen_door:', urlParams.get('sc_screen_door'));
  
  // Check legacy global objects
  if (typeof window.screencloud !== 'undefined') {
    console.log('Legacy screencloud object:', window.screencloud);
  } else {
    console.log('No legacy screencloud object found');
  }
  
  // Check meta tags
  const metaTag = document.querySelector('meta[name="sc_screen_door"]');
  console.log('Meta tag sc_screen_door:', metaTag ? metaTag.getAttribute('content') : 'Not found');
  
  // Check localStorage
  const scData = localStorage.getItem('screencloud_custom_data');
  console.log('ScreenCloud localStorage data:', scData);
  
  const storedId = localStorage.getItem('screencloudScreenId');
  console.log('Stored screen ID:', storedId);
  
  console.log('Current screen ID:', currentScreenId);
  console.log('===============================');
}

// Make debug function available globally for testing
window.debugScreenCloudData = debugScreenCloudData;

function playPartsAlert() {
  try {
    // Play parts-alert.mp3 twice
    const audio1 = new Audio('parts-alert.mp3');
    audio1.volume = 0.7;
    
    // Play first time immediately
    const playPromise1 = audio1.play();
    if (playPromise1 !== undefined) {
      playPromise1.catch(function(error) {
        console.log('Audio autoplay prevented by browser policy');
        addVisualAlert();
      });
    }
    
    // Play second time after a short delay
    setTimeout(function() {
      const audio2 = new Audio('parts-alert.mp3');
      audio2.volume = 0.7;
      const playPromise2 = audio2.play();
      if (playPromise2 !== undefined) {
        playPromise2.catch(function(error) {
          console.log('Second audio play failed');
        });
      }
    }, 8000); // 8 second delay between plays
    
  } catch (error) {
    console.log('Audio not supported, using visual alert');
    addVisualAlert();
  }
}

function addVisualAlert() {
  const alertElements = document.querySelectorAll('.parts-alert');
  alertElements.forEach(function(element) {
    element.style.animation = 'pulse 0.5s infinite';
  });
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
}

function formatTime() {
  return new Date().toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
}

function formatDate() {
  return new Date().toLocaleDateString([], { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function formatJobTime(startMin) {
  if (!startMin) return '';
  const mins = parseInt(startMin, 10);
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return displayHours + ':' + minutes.toString().padStart(2, '0') + ' ' + period;
}

function getFirstName(data) {
  if (data && data.user_fname) return data.user_fname;
  if (data && data.fname) return data.fname;
  if (data && data.user) return data.user.split(' ')[0];
  return 'Guest';
}

function IdleMessage() {
  const [time, setTime] = useState(formatTime());
  const [date, setDate] = useState(formatDate());
  const [showReset, setShowReset] = useState(false);

  useEffect(function() {
    const interval = setInterval(function() {
      setTime(formatTime());
      setDate(formatDate());
    }, 1000);
    return function() { clearInterval(interval); };
  }, []);

  function handleLogoClick() {
    setShowReset(!showReset);
    // Hide reset button after 10 seconds
    setTimeout(function() {
      setShowReset(false);
    }, 10000);
  }

  function handleReset() {
    if (confirm('Reset screen configuration? This will show the setup screen again.')) {
      localStorage.removeItem('screencloudScreenId');
      console.log('Screen ID reset via button');
      location.reload();
    }
  }

  return e('div', { className: 'idle-container fade-in' },
    e('img', { 
      className: 'idle-logo',
      src: 'freeflow-logo-white-transparent.png',
      alt: 'Freeflow Logo',
      onClick: handleLogoClick,
      style: { cursor: 'pointer' }
    }),
    e('div', { className: 'idle-content' },
      e('h1', { className: 'idle-greeting' }, getTimeBasedGreeting()),
      e('div', { className: 'clock-container' },
        e('div', { className: 'time' }, time),
        e('div', { className: 'date' }, date)
      ),
      showReset ? e('button', {
        className: 'reset-button',
        onClick: handleReset
      }, 'Reset Screen Configuration') : null
    )
  );
}

function WelcomeMessage(props) {
  const data = props && props.data ? props.data : {};
  const firstName = data.user_fname || data.fname || '';
  const lastName = data.user_lname || data.lname || '';
  const fullName = data.user || (firstName + ' ' + lastName).trim() || "Guest";
  
  // Show door name if "All Doors" is selected
  const showDoorName = currentScreenId === 'all_doors' && data.door;
  
  return e('div', { className: 'content-container fade-in' },
    e('div', { className: 'welcome-large' },
      e('h2', { className: 'welcome-title' }, 'Welcome'),
      e('h1', { className: 'welcome-name' }, fullName),
      showDoorName ? e('p', { className: 'welcome-door' }, 'at ' + data.door) : null
    )
  );
}

function JobCard(props) {
  const job = props && props.job ? props.job : {};
  const index = props && typeof props.index === 'number' ? props.index : 0;
  
  // Use the background color from the job data, fallback to kelly green
  const backgroundColor = job.background || '#00a651';
  
  // Build location string with street address
  const locationParts = [job.street_addr, job.city_state, job.postal_code].filter(Boolean);
  const locationString = locationParts.length > 0 ? locationParts.join(' • ').toUpperCase() : 'LOCATION TBD';
  
  return e('div', { 
    className: 'job-card',
    id: 'job-card-' + index
  },
    e('div', { className: 'job-card-content' },
      e('div', { 
        className: 'job-time-bar',
        style: { backgroundColor: backgroundColor }
      },
        e('div', { className: 'job-time' }, formatJobTime(job.startMin)),
        e('div', { className: 'job-number' }, job.jobNumber || 'N/A')
      ),
      e('div', { className: 'job-details' },
        e('div', { className: 'job-customer' }, decodeHtmlEntities(job.location_name || job.customerName || job.customer_name || '—').toUpperCase()),
        e('div', { className: 'job-location' }, locationString),
        e('div', { className: 'job-meta' },
          e('div', { className: 'job-status' }, job.jobStatusName || job.code || 'Scheduled'),
          e('div', { className: 'job-category' }, job.job_category || 'Service Call')
        )
      )
    )
  );
}

function animateJobCards() {
  const jobCards = document.querySelectorAll('.job-card');
  jobCards.forEach(function(card, index) {
    setTimeout(function() {
      card.classList.add('animate-in');
    }, index * 500);
  });
}

function checkAndScrollContent() {
  const contentBody = document.querySelector('.content-body');
  if (!contentBody) return;
  
  const contentHeight = contentBody.scrollHeight;
  const viewportHeight = contentBody.clientHeight;
  
  if (contentHeight > viewportHeight) {
    console.log('Content overflows, starting auto-scroll');
    
    // Clear any existing dashboard timeout
    if (dashboardTimeout) {
      clearTimeout(dashboardTimeout);
      dashboardTimeout = null;
    }
    
    const scrollDistance = contentHeight - viewportHeight;
    // Good readable scroll speed: 3+ seconds depending on content
    const scrollDuration = Math.max(3000, scrollDistance * 13); // 13ms per pixel with 3 second minimum
    
    console.log(`Scrolling ${scrollDistance}px over ${scrollDuration}ms`);
    
    // Custom smooth scroll animation
    let startTime = null;
    let startScrollTop = contentBody.scrollTop;
    
    function animateScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / scrollDuration, 1);
      
      // Easing function for smooth animation (ease-in-out)
      const easeInOutQuad = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentScrollTop = startScrollTop + (scrollDistance * easeInOutQuad);
      contentBody.scrollTop = currentScrollTop;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        console.log('Scroll animation completed');
      }
    }
    
    // Start the scroll animation
    requestAnimationFrame(animateScroll);
    
    // Calculate when scroll will complete (3 second delay + scroll duration)
    const scrollCompletionTime = 3000 + scrollDuration;
    
    // Use standard 30 second timeout, but if scroll takes longer, add 5 second buffer
    const standardTimeout = 30000;
    const timeoutDuration = scrollCompletionTime > standardTimeout ? 
      scrollCompletionTime + 5000 : standardTimeout;
    
    // Set timeout based on calculation above
    dashboardTimeout = setTimeout(showIdleMessage, timeoutDuration);
    
    console.log(`Custom scroll will take ${scrollDuration}ms, timeout set to: ${timeoutDuration}ms`);
  }
}

function Dashboard(props) {
  const dashboard = props && props.dashboard ? props.dashboard : {};
  
  let jobs = [];
  if (dashboard.dispatch && dashboard.dispatch.ASSIGNED) {
    try {
      const allVisits = Object.values(dashboard.dispatch.ASSIGNED).flatMap(function(obj) {
        return Object.values(obj);
      });
      jobs = allVisits.filter(function(j) {
        return j && j.jobNumber && j.jobStartDate;
      }).map(function(j) {
        let date = j.jobStartDate;
        let mins = parseInt(j.startMin || 0, 10);
        let startSort = Number.MAX_SAFE_INTEGER;
        if (date && !isNaN(mins)) {
          let dateParts = date.split('-').map(function(x) { return parseInt(x, 10); });
          let year = dateParts[0];
          let month = dateParts[1];
          let day = dateParts[2];
          startSort = new Date(year, month - 1, day, Math.floor(mins / 60), mins % 60).getTime();
        }
        return Object.assign({}, j, { startSort: startSort });
      }).sort(function(a, b) {
        return a.startSort - b.startSort;
      });
    } catch (error) {
      console.error('Error processing jobs:', error);
      jobs = [];
    }
  }

  const parts = dashboard.parts_transfer || [];
  const messages = dashboard.messages || [];
  const userFirstName = getFirstName(dashboard.userPayload || dashboard);

  useEffect(function() {
    if (parts.length > 0) {
      playPartsAlert();
    }
    
    setTimeout(function() {
      animateJobCards();
      // Wait 3 seconds after animations complete, then check for overflow and start auto-scroll
      setTimeout(checkAndScrollContent, 3000);
    }, 100);
  }, [parts.length]);

  const jobCards = jobs.length > 0 ? 
    jobs.map(function(job, index) {
      return e(JobCard, { job: job, index: index, key: (job.jobNumber || 'job') + '-' + index });
    }) : 
    [e('div', { className: 'no-jobs', key: 'no-jobs' }, 'No jobs scheduled for today.')];

  const partsCards = parts.length > 0 ? 
    parts.map(function(part, index) {
      const animationDelay = (index * 0.3) + 's';
      return e('div', {
        key: (part.transfer_id || 'part') + '-' + index,
        className: 'parts-card',
        style: { animationDelay: animationDelay }
      },
        e('div', { className: 'parts-card-content' },
          e('div', { className: 'parts-bin-bar' },
            e('div', { className: 'parts-bin-label' }, 'BIN'),
            e('div', { className: 'parts-bin' }, part.bin || 'N/A')
          ),
          e('div', { className: 'parts-details' },
            e('div', { className: 'parts-description' }, (part.description || 'Part description').toUpperCase()),
            e('div', { className: 'parts-job' }, 'For Job: ' + (part.job_number || 'N/A')),
            part.notes ? e('div', { className: 'parts-notes' }, part.notes) : null
          )
        )
      );
    }) : [];

  const messageCards = messages.length > 0 ?
    messages.map(function(message, index) {
      const animationDelay = (index * 0.3) + 's';
      return e('div', {
        key: (message.messageId || 'message') + '-' + index,
        className: 'message-card',
        style: { animationDelay: animationDelay }
      },
        e('div', { className: 'message-icon' }, '📢'),
        e('div', { className: 'message-text' }, message.message_text || 'No message text')
      );
    }) : [];

  const contentElements = [
    e('div', { className: 'section', key: 'jobs-section' },
      e('h2', { className: 'section-title' },
        e('div', { className: 'section-icon' }, '📅'),
        'Your Scheduled Jobs'
      ),
      jobCards
    )
  ];

  if (parts.length > 0) {
    contentElements.push(
      e('div', { className: 'section', key: 'parts-section' },
        e('div', { className: 'parts-alert' }, 'PARTS TRANSFER REQUIRED'),
        e('h2', { className: 'section-title' },
          e('div', { className: 'section-icon' }, '📦'),
          'Parts to Transfer'
        ),
        partsCards
      )
    );
  }

  if (messages.length > 0) {
    contentElements.push(
      e('div', { className: 'section', key: 'messages-section' },
        e('h2', { className: 'section-title' },
          e('div', { className: 'section-icon' }, '💬'),
          'Messages'
        ),
        messageCards
      )
    );
  }

  return e('div', { className: 'content-container fade-in' },
    e('div', { className: 'header-section' },
      e('div', { className: 'welcome-text' }, 'Welcome ' + userFirstName)
    ),
    e('div', { className: 'content-body' }, contentElements)
  );
}

function SetupScreen() {
  function handleSetScreenId(screenId) {
    localStorage.setItem('screencloudScreenId', screenId);
    currentScreenId = screenId;
    console.log('Screen ID set to:', screenId);
    initializeApp();
  }

  // Check if we have any ScreenCloud data available
  const urlParams = new URLSearchParams(window.location.search);
  const hasScreenCloudSDK = typeof window.ScreenCloud !== 'undefined';
  const hasScreenCloudData = urlParams.get('sc_screen_door') || hasScreenCloudSDK;

  return e('div', { className: 'setup-screen' },
    e('h1', null, 'Screen Setup Required'),
    hasScreenCloudData ? 
      e('p', { className: 'setup-info' }, hasScreenCloudSDK ? 'ScreenCloud SDK detected but no valid door assignment found. Please select manually:' : 'ScreenCloud configuration detected but invalid. Please select manually:') :
      e('p', null, 'Please select this screen\'s location:'),
    e('div', { className: 'setup-buttons' },
      e('button', { 
        className: 'setup-button',
        onClick: function() { handleSetScreenId('warehouse_door'); }
      }, 'Warehouse Door'),
      e('button', { 
        className: 'setup-button',
        onClick: function() { handleSetScreenId('main_entrance'); }
      }, 'Main Entrance'),
      e('button', { 
        className: 'setup-button',
        onClick: function() { handleSetScreenId('freeflow_office'); }
      }, 'Freeflow Office'),
      e('button', { 
        className: 'setup-button',
        onClick: function() { handleSetScreenId('all_doors'); }
      }, 'All Doors')
    ),
    e('div', { className: 'setup-help' },
      e('p', null, 'Configuration Priority:'),
      e('ol', null,
        e('li', null, 'ScreenCloud SDK (sc_screen_door field)'),
        e('li', null, 'URL parameter (?sc_screen_door=...)'),
        e('li', null, 'URL parameter (?screenId=...)'),
        e('li', null, 'Manual selection (this screen)')
      ),
      e('button', {
        className: 'debug-button',
        onClick: function() { debugScreenCloudData(); }
      }, 'Debug ScreenCloud Data (Check Console)')
    )
  );
}

function showIdleMessage() {
  if (dashboardTimeout) clearTimeout(dashboardTimeout);
  ReactDOM.render(e(IdleMessage), document.getElementById("root"));
}

function fadeOutAndShowIdle() {
  console.log(`[v${APP_VERSION}] Starting fade transition to idle screen`);
  
  // Find current content containers
  const currentContent = document.querySelector('.content-container');
  if (!currentContent) {
    console.log(`[v${APP_VERSION}] No current container found, showing idle directly`);
    showIdleMessage();
    return;
  }
  
  // Add fade-out class to current container
  currentContent.classList.remove('fade-in');
  currentContent.classList.add('fade-out');
  
  console.log(`[v${APP_VERSION}] Applied fade-out class, waiting 1000ms`);
  
  // Wait longer for CSS transition to complete, then render new content
  setTimeout(() => {
    console.log(`[v${APP_VERSION}] Rendering idle message after fade-out`);
    ReactDOM.render(e(IdleMessage), document.getElementById("root"));
  }, 1000); // INCREASED: from 600ms to 1000ms for longer pause
}

function renderWelcome(data) {
  console.log(`[v${APP_VERSION}] Rendering welcome message for: ${data.user || 'Guest'}`);
  ReactDOM.render(e(WelcomeMessage, { data: data }), document.getElementById("root"));
  if (fadeTimeout) clearTimeout(fadeTimeout);
  if (idleTimeout) clearTimeout(idleTimeout);
  if (clockInterval) clearInterval(clockInterval);
}

function renderDashboard(dashboard, timeout) {
  console.log(`[v${APP_VERSION}] Rendering dashboard with ${timeout}ms timeout`);
  ReactDOM.render(e(Dashboard, { dashboard: dashboard }), document.getElementById("root"));
  if (fadeTimeout) clearTimeout(fadeTimeout);
  if (idleTimeout) clearTimeout(idleTimeout);
  if (clockInterval) clearInterval(clockInterval);
  dashboardTimeout = setTimeout(showIdleMessage, timeout || 30000);
}

function setupScreenId() {
  ReactDOM.render(e(SetupScreen), document.getElementById("root"));
}

function hasUsableData(dashboard) {
  // Check if there's any usable data to display
  const hasJobs = dashboard.dispatch && 
                  dashboard.dispatch.ASSIGNED && 
                  Object.keys(dashboard.dispatch.ASSIGNED).length > 0;
  
  const hasParts = dashboard.parts_transfer && dashboard.parts_transfer.length > 0;
  const hasMessages = dashboard.messages && dashboard.messages.length > 0;
  
  return hasJobs || hasParts || hasMessages;
}

function hasNoDataAtAll(dashboard) {
  // Check if all three data arrays are completely empty
  let jobs = [];
  if (dashboard.dispatch && dashboard.dispatch.ASSIGNED) {
    try {
      const allVisits = Object.values(dashboard.dispatch.ASSIGNED).flatMap(function(obj) {
        return Object.values(obj);
      });
      jobs = allVisits.filter(function(j) {
        return j && j.jobNumber && j.jobStartDate;
      });
    } catch (error) {
      console.error('Error processing jobs for empty check:', error);
      jobs = [];
    }
  }
  
  const parts = dashboard.parts_transfer || [];
  const messages = dashboard.messages || [];
  
  return jobs.length === 0 && parts.length === 0 && messages.length === 0;
}

function isMessageForThisScreen(data) {
  // If this screen is set to "all_doors", show all events
  if (currentScreenId === 'all_doors') return true;
  
  // If no door specified in the event, don't show it
  if (!data.door) return false;
  
  // Check if the door matches this screen's configuration
  const doorMapping = {
    'warehouse_door': ['Warehouse Door', 'warehouse_door'],
    'main_entrance': ['Main Entrance', 'main_entrance'],
    'freeflow_office': ['Freeflow Office', 'freeflow_office']
  };
  
  if (doorMapping[currentScreenId]) {
    return doorMapping[currentScreenId].some(function(doorName) {
      return data.door.toLowerCase() === doorName.toLowerCase();
    });
  }
  
  return false;
}

window.onload = function() {
  console.log(`[v${APP_VERSION}] Window loaded, setting up event listeners and initializing`);
  
  // Add keyboard shortcut to reset screen configuration
  document.addEventListener('keydown', function(event) {
    // Ctrl + Shift + R to reset screen configuration
    if (event.ctrlKey && event.shiftKey && event.key === 'R') {
      event.preventDefault();
      if (confirm('Reset screen configuration? This will show the setup screen again.')) {
        localStorage.removeItem('screencloudScreenId');
        console.log(`[v${APP_VERSION}] Screen ID reset via keyboard shortcut`);
        location.reload();
      }
    }
  });

  // Handle async screen identification
  getScreenIdentifier().then((screenId) => {
    currentScreenId = screenId;
    if (currentScreenId) {
      console.log(`[v${APP_VERSION}] Screen ID determined: ${currentScreenId}`);
      initializeApp();
    } else {
      console.log(`[v${APP_VERSION}] Screen ID not found, showing setup`);
      setupScreenId();
    }
  }).catch((error) => {
    console.error(`[v${APP_VERSION}] Error getting screen ID:`, error);
    setupScreenId();
  });
};
