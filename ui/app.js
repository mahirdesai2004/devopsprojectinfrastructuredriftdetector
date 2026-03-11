const LOG_FILE_URL = '../logs/drift_log.txt';
let lastLogContent = '';

async function fetchLogs() {
  try {
    const response = await fetch(LOG_FILE_URL + '?t=' + new Date().getTime());
    if (!response.ok) return;
    
    const text = await response.text();
    if (text !== lastLogContent) {
      lastLogContent = text;
      processLogs(text);
    }
  } catch (error) {
    console.warn("Could not fetch logs. If viewing locally (file://), your browser may block this. Try a local server like Live Server.", error);
  }
}

function processLogs(logText) {
  const lines = logText.trim().split('\n').filter(line => line.length > 0);
  const timeline = document.getElementById('timeline');
  const logOutput = document.getElementById('log-output');
  
  timeline.innerHTML = '';
  logOutput.innerHTML = '';

  let currentState = "... awaiting configuration ...";

  lines.forEach(line => {
    // Write raw log out to terminal display
    const div = document.createElement('div');
    div.textContent = `> ${line}`;
    logOutput.appendChild(div);

    // Parse the pipeline format: timestamp | event | status
    const parts = line.split('|').map(p => p.trim());
    if (parts.length === 3) {
      const time = parts[0];
      const event = parts[1];
      const status = parts[2].toLowerCase();

      const li = document.createElement('li');
      li.className = `status-${status}`;
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = time;

      const eventSpan = document.createElement('span');
      eventSpan.className = 'event-text';
      eventSpan.textContent = event;

      li.appendChild(timeSpan);
      li.appendChild(eventSpan);
      timeline.appendChild(li);

      // Mutate theoretical configuration state based on detected events
      if (status === 'success' && event.includes('baseline')) {
        currentState = "app_mode=production\ntimeout=30\nenable_secure_mode=true";
      } else if (status === 'warning') {
        currentState = "app_mode=production\ntimeout=999\nenable_secure_mode=true";
      } else if (event.includes('restored')) {
        currentState = "app_mode=production\ntimeout=30\nenable_secure_mode=true";
      }
    }
  });

  if (lines.length === 0) {
    timeline.innerHTML = '<li class="timeline-empty">Waiting for events...</li>';
  }

  document.getElementById('config-state').textContent = currentState;
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Auto-refresh logs every 2 seconds
setInterval(fetchLogs, 2000);
fetchLogs();
