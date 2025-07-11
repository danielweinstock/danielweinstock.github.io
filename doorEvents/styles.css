@import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Poppins:wght@200;300;400;500;600;700&display=swap');

:root {
  --kelly-green: #00a651;
  --dark-green: #007a3d;
  --black: #000000;
  --white: #ffffff;
  --light-gray: #f5f5f5;
  --dark-gray: #333333;
  --bodyFontFamily: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --titleFontFamily: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --alert-red: #ff4444;
  --warning-orange: #ff8800;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--bodyFontFamily);
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, var(--kelly-green) 0%, var(--dark-green) 50%, var(--black) 100%);
  color: var(--white);
  overflow: hidden;
}

.content-container, .idle-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.content-container.fade-in,
.idle-container.fade-in {
  opacity: 1;
}

.content-container.fade-out,
.idle-container.fade-out {
  opacity: 0;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 3px solid var(--kelly-green);
  min-height: 100px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-placeholder {
  width: 70px;
  height: 70px;
  background: var(--white);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--kelly-green);
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.2;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.company-name {
  font-family: var(--titleFontFamily);
  font-size: 2rem;
  font-weight: 600;
  color: var(--white);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-text {
  font-family: var(--titleFontFamily);
  font-size: 1.6rem;
  font-weight: 400;
  color: var(--kelly-green);
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Idle Screen Styles */
.idle-container {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.idle-greeting {
  font-size: 4.5rem;
  margin-bottom: 3rem;
  color: var(--white);
  font-weight: 300;
  font-family: var(--titleFontFamily);
  letter-spacing: -0.02em;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.time {
  font-size: 4rem;
  font-weight: 200;
  color: var(--kelly-green);
  font-family: var(--titleFontFamily);
  letter-spacing: -0.01em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.date {
  font-size: 2rem;
  font-weight: 300;
  color: var(--white);
  font-family: var(--bodyFontFamily);
  opacity: 0.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Welcome Screen Styles */
.welcome-large {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  text-align: center;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  color: var(--white);
  font-family: var(--titleFontFamily);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-name {
  font-size: 6rem;
  font-weight: 600;
  color: var(--kelly-green);
  font-family: var(--titleFontFamily);
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  line-height: 1.1;
}

/* Content Screen Styles */
.content-body {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--kelly-green);
  margin-bottom: 2rem;
  font-family: var(--titleFontFamily);
  display: flex;
  align-items: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.section-icon {
  width: 40px;
  height: 40px;
  background: var(--kelly-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--white);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Job Cards */
.job-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  margin-bottom: 2rem;
  overflow: hidden;
  border: 2px solid rgba(0, 166, 81, 0.3);
  transition: all 0.3s ease;
  backdrop-filter: blur(15px);
  opacity: 0;
  transform: translateX(-80px);
  animation: slideInFromLeft 0.8s ease-out forwards;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.job-card:nth-child(even) {
  transform: translateX(80px);
  animation: slideInFromRight 0.8s ease-out forwards;
}

.job-card:nth-child(2) { animation-delay: 0.2s; }
.job-card:nth-child(3) { animation-delay: 0.4s; }
.job-card:nth-child(4) { animation-delay: 0.6s; }
.job-card:nth-child(5) { animation-delay: 0.8s; }
.job-card:nth-child(6) { animation-delay: 1.0s; }

.job-card-content {
  display: flex;
  height: 100%;
  min-height: 120px;
}

.job-time-bar {
  width: 90px;
  background: linear-gradient(135deg, var(--kelly-green), var(--dark-green));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 0;
  position: relative;
}

.job-time {
  writing-mode: vertical-lr;
  text-orientation: mixed;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--white);
  text-align: center;
  transform: rotate(180deg);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.job-details {
  flex: 1;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
}

.job-customer {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 0.8rem;
  font-family: var(--titleFontFamily);
}

.job-location {
  font-size: 1.3rem;
  color: var(--white);
  opacity: 0.8;
  margin-bottom: 1rem;
  font-weight: 300;
}

.job-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.job-number {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--white);
  background: var(--kelly-green);
  padding: 0.5rem 1rem;
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.job-category {
  font-size: 1.2rem;
  color: var(--white);
  opacity: 0.7;
  font-weight: 400;
}

.job-status {
  font-size: 1.2rem;
  color: var(--kelly-green);
  opacity: 0.9;
  font-weight: 500;
}

/* Parts Transfer Cards */
.parts-card {
  background: rgba(255, 136, 0, 0.15);
  border: 3px solid var(--warning-orange);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(15px);
  opacity: 0;
  transform: translateY(-50px);
  animation: slideInFromTop 0.8s ease-out forwards;
  box-shadow: 0 8px 32px rgba(255, 136, 0, 0.2);
}

.parts-card:nth-child(2) { animation-delay: 0.2s; }
.parts-card:nth-child(3) { animation-delay: 0.4s; }

.parts-description {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 0.8rem;
  font-family: var(--titleFontFamily);
}

.parts-job {
  font-size: 1.3rem;
  color: var(--warning-orange);
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.parts-notes {
  font-size: 1.2rem;
  color: var(--white);
  opacity: 0.8;
  font-style: italic;
  line-height: 1.4;
}

/* Messages Cards */
.message-card {
  background: rgba(0, 166, 81, 0.2);
  border: 3px solid var(--kelly-green);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(15px);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  opacity: 0;
  transform: translateX(80px);
  animation: slideInFromRight 0.8s ease-out forwards;
  box-shadow: 0 8px 32px rgba(0, 166, 81, 0.2);
}

.message-card:nth-child(2) { animation-delay: 0.2s; }
.message-card:nth-child(3) { animation-delay: 0.4s; }

.message-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--kelly-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: var(--white);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.message-text {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--white);
  flex: 1;
  line-height: 1.4;
}

/* Animations */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(255, 68, 68, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 12px 40px rgba(255, 68, 68, 0.5);
  }
}

.pulse-animation {
  animation: pulse 2s infinite;
}

/* Alert Styles */
.parts-alert {
  background: var(--alert-red);
  color: var(--white);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
  font-size: 1.4rem;
  animation: pulse 1.5s infinite;
  box-shadow: 0 4px 16px rgba(255, 68, 68, 0.4);
}

/* Responsive Design for Portrait Mode */
@media screen and (max-width: 768px) and (orientation: portrait) {
  .header-section {
    padding: 1rem;
    min-height: 80px;
  }
  
  .company-name {
    font-size: 1.6rem;
  }
  
  .welcome-text {
    font-size: 1.2rem;
  }
  
  .idle-greeting {
    font-size: 3.5rem;
  }
  
  .time {
    font-size: 3rem;
  }
  
  .date {
    font-size: 1.6rem;
  }
  
  .welcome-name {
    font-size: 4rem;
  }
  
  .job-time-bar {
    width: 70px;
  }
  
  .job-time {
    font-size: 1rem;
  }
  
  .job-customer {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }

  .content-body {
    padding: 1rem;
  }
}

/* No Jobs Message */
.no-jobs {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--white);
  opacity: 0.7;
  font-size: 1.6rem;
  font-weight: 300;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

/* Setup screen styles */
.setup-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: var(--bodyFontFamily);
  z-index: 9999;
  text-align: center;
  padding: 2rem;
}

.setup-screen h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: var(--kelly-green);
  font-family: var(--titleFontFamily);
}

.setup-screen p {
  font-size: 1.5rem;
  margin-bottom: 3rem;
  color: var(--white);
}

.setup-button {
  margin: 1rem;
  padding: 1.5rem 3rem;
  font-size: 1.3rem;
  background: var(--kelly-green);
  color: var(--white);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.setup-button:hover {
  background: var(--dark-green);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
