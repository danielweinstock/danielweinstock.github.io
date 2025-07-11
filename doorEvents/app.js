const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "freeflow-internal-projects.firebaseapp.com",
  databaseURL: "https://freeflow-internal-projects-default-rtdb.firebaseio.com",
  projectId: "freeflow-internal-projects",
  storageBucket: "freeflow-internal-projects.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;

// Initialize Firebase if available
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase not available - running in demo mode');
}

let fadeTimeout = null;
let idleTimeout = null;
let clockInterval = null;
let currentScreenId = null;
let dashboardTimeout = null;

function getScreenIdentifier() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('screenId')) return urlParams.get('screenId');
  const storedScreenId = localStorage.getItem('screencloudScreenId');
  if (storedScreenId) return storedScreenId;
  return null;
}

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
    }, 1000); // 1 second delay between plays
    
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

  useEffect(function() {
    const interval = setInterval(function() {
      setTime(formatTime());
      setDate(formatDate());
    }, 1000);
    return function() { clearInterval(interval); };
  }, []);

  return e('div', { className: 'idle-container fade-in' },
    e('img', { 
      className: 'idle-logo',
      src: 'freeflow-logo-white-transparent.png',
      alt: 'Freeflow Logo'
    }),
    e('div', { className: 'idle-content' },
      e('h1', { className: 'idle-greeting' }, getTimeBasedGreeting()),
      e('div', { className: 'clock-container' },
        e('div', { className: 'time' }, time),
        e('div', { className: 'date' }, date)
      )
    )
  );
}

function WelcomeMessage(props) {
  const data = props && props.data ? props.data : {};
  const firstName = data.user_fname || data.fname || '';
  const lastName = data.user_lname || data.lname || '';
  const fullName = data.user || (firstName + ' ' + lastName).trim() || "Guest";
  
  return e('div', { className: 'content-container fade-in' },
    e('div', { className: 'welcome-large' },
      e('h2', { className: 'welcome-title' }, 'Welcome'),
      e('h1', { className: 'welcome-name' }, fullName)
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
  const locationString = locationParts.length > 0 ? locationParts.join(' • ') : 'Location TBD';
  
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
        e('div', { className: 'job-customer' }, job.customerName || job.customer_name || '—'),
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
            e('div', { className: 'parts-description' }, part.description || 'Part description'),
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

  return e('div', { className: 'setup-screen' },
    e('h1', null, 'Screen Setup Required'),
    e('p', null, 'Please select this screen\'s location:'),
    e('button', { 
      className: 'setup-button',
      onClick: function() { handleSetScreenId('front_door'); }
    }, 'Front Door'),
    e('button', { 
      className: 'setup-button',
      onClick: function() { handleSetScreenId('back_door'); }
    }, 'Back Door'),
    e('button', { 
      className: 'setup-button',
      onClick: function() { handleSetScreenId('side_entrance'); }
    }, 'Side Entrance'),
    e('button', { 
      className: 'setup-button',
      onClick: function() { handleSetScreenId('main_lobby'); }
    }, 'Main Lobby')
  );
}

function showIdleMessage() {
  if (dashboardTimeout) clearTimeout(dashboardTimeout);
  ReactDOM.render(e(IdleMessage), document.getElementById("root"));
}

function renderWelcome(data) {
  ReactDOM.render(e(WelcomeMessage, { data: data }), document.getElementById("root"));
  if (fadeTimeout) clearTimeout(fadeTimeout);
  if (idleTimeout) clearTimeout(idleTimeout);
  if (clockInterval) clearInterval(clockInterval);
}

function renderDashboard(dashboard, timeout) {
  ReactDOM.render(e(Dashboard, { dashboard: dashboard }), document.getElementById("root"));
  if (fadeTimeout) clearTimeout(fadeTimeout);
  if (idleTimeout) clearTimeout(idleTimeout);
  if (clockInterval) clearInterval(clockInterval);
  dashboardTimeout = setTimeout(showIdleMessage, timeout || 35000);
}

function setupScreenId() {
  ReactDOM.render(e(SetupScreen), document.getElementById("root"));
}

function isMessageForThisScreen(data) {
  if (!data.targetScreen) return true;
  if (data.targetScreen === currentScreenId) return true;
  if (data.targetScreenName && currentScreenId) return false;
  return false;
}

function initializeApp() {
  showIdleMessage();

  if (db) {
    db.ref('doorEvents').limitToLast(1).on('child_added', async function(snapshot) {
      const data = snapshot.val();
      console.log('Inbound RTDB event data:', data);
      
      if (!isMessageForThisScreen(data)) {
        console.log('Message not for this screen, ignoring');
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
            setTimeout(function() {
              renderDashboard(dashboard, 35000);
            }, 1500);
          } else {
            console.error('Failed to fetch dashboard data');
            setTimeout(showIdleMessage, timeout);
          }
        } catch (e) {
          console.error("Error fetching dashboard from Make.com:", e);
          setTimeout(showIdleMessage, timeout);
        }
      } else {
        setTimeout(showIdleMessage, timeout);
      }
    });
    console.log('App initialized with Firebase, waiting for data pushes...');
  } else {
    console.log('App initialized without Firebase - demo mode');
    
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
        renderDashboard(demoDashboard, 35000);
      }, 1500);
    }, 5000);
  }
}

window.onload = function() {
  currentScreenId = getScreenIdentifier();
  if (currentScreenId) {
    console.log('Screen ID determined:', currentScreenId);
    initializeApp();
  } else {
    console.log('Screen ID not found, showing setup');
    setupScreenId();
  }
};
