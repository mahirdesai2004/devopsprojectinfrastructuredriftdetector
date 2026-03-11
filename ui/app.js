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
    console.warn("Could not fetch logs. If viewing directly via file://, CORS will block this. Use localhost via python -m http.server", error);
  }
}

function resetNodes() {
  const nodes = ['node-docker', 'node-puppet', 'node-file', 'node-drift', 'node-fix'];
  nodes.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.className = 'node';
  });
  const fileStatus = document.getElementById('file-status-text');
  if(fileStatus) fileStatus.innerHTML = '(Checking...)';
}

function updateVisualization(status, event) {
  resetNodes();
  
  const docker = document.getElementById('node-docker');
  const puppet = document.getElementById('node-puppet');
  const file = document.getElementById('node-file');
  const drift = document.getElementById('node-drift');
  const fix = document.getElementById('node-fix');
  const fileText = document.getElementById('file-status-text');

  // Architecture foundations always pulsing light green to show heartbeat
  docker.classList.add('active-safe');
  puppet.classList.add('active-safe');

  if (status === 'success' && event.includes('baseline')) {
    file.classList.add('active-safe');
    fileText.innerHTML = '<strong>(Secure)</strong>';
  } else if (status === 'warning' || event.includes('introduced')) {
    file.classList.add('active-warning');
    fileText.innerHTML = '<strong>(Tampered)</strong>';
    drift.classList.add('active-warning');
  } else if (status === 'alert' || event.includes('detected')) {
    file.classList.add('active-danger');
    fileText.innerHTML = '<strong>(Drifted)</strong>';
    drift.classList.add('active-danger');
    fix.classList.add('active-fix');
  } else if (status === 'success' && event.includes('restored')) {
    file.classList.add('active-safe');
    fileText.innerHTML = '<strong>(Remediated)</strong>';
    fix.classList.add('active-safe');
  }
}

function processLogs(logText) {
  const lines = logText.trim().split('\n').filter(line => line.length > 0);
  const timeline = document.getElementById('timeline');
  const logOutput = document.getElementById('log-output');
  const configElement = document.getElementById('config-state');
  
  timeline.innerHTML = '';
  logOutput.innerHTML = '';

  let currentState = "... awaiting configuration ...";
  let lastStatus = null;
  let lastEvent = null;

  lines.forEach(line => {
    // Write raw log out to terminal display with light parsing
    const div = document.createElement('div');
    if(line.includes('| warning')) {
        div.className = 'log-warn';
    } else if(line.includes('| alert')) {
        div.className = 'log-err';
    }
    div.textContent = `> ${line}`;
    logOutput.appendChild(div);

    // Parse the pipeline format: timestamp | event | status
    const parts = line.split('|').map(p => p.trim());
    if (parts.length === 3) {
      const time = parts[0];
      const event = parts[1];
      const status = parts[2].toLowerCase();

      lastStatus = status;
      lastEvent = event;

      const li = document.createElement('li');
      li.className = `status-${status}`;
      
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = time;

      const eventSpan = document.createElement('span');
      eventSpan.className = 'event-text';
      eventSpan.textContent = event.charAt(0).toUpperCase() + event.slice(1);

      li.appendChild(timeSpan);
      li.appendChild(eventSpan);
      timeline.appendChild(li);

      // Mutate theoretical configuration state based on detected events
      if (status === 'success' && event.includes('baseline')) {
        currentState = "app_mode=production\ntimeout=30\nenable_secure_mode=true";
        configElement.className = "code-block";
      } else if (status === 'warning' || event.includes('introduced')) {
        currentState = "app_mode=production\ntimeout=999   <-- DRIFT DETECTED\nenable_secure_mode=true";
        configElement.className = "code-block config-warning";
      } else if (event.includes('restored')) {
        currentState = "app_mode=production\ntimeout=30\nenable_secure_mode=true";
        configElement.className = "code-block";
      }
    }
  });

  if (lines.length === 0) {
    timeline.innerHTML = '<li class="timeline-empty">Waiting for DevOps pipeline events...</li>';
    resetNodes();
  } else {
    // Update the live architecture chart based on the LAST known event in the log
    updateVisualization(lastStatus, lastEvent);
  }

  configElement.textContent = currentState;
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Auto-refresh logs every 1 second for snappy presentation
setInterval(fetchLogs, 1000);
fetchLogs();
