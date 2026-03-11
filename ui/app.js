const LOG_FILE_URL = '../logs/drift_log.txt';
let lastLogContent = '';
let complianceChart;

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

function initChart() {
  const ctx = document.getElementById('complianceChart').getContext('2d');
  complianceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
        label: 'System Compliance (%)',
        data: [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 3,
        fill: true,
        stepped: true,
        pointRadius: 5,
        pointBackgroundColor: '#1e293b',
        pointBorderColor: '#10b981',
        pointHoverRadius: 7,
        tension: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 800 },
      scales: {
        y: {
          min: -10,
          max: 110,
          ticks: {
            stepSize: 50,
            callback: function(value) {
                if (value === 100) return 'Secure (100%)';
                if (value === 0) return 'Drifted (0%)';
                return '';
            },
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 }
          },
          grid: { color: 'rgba(51, 65, 85, 0.3)' }
        },
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Courier New', size: 11 } },
          grid: { color: 'rgba(51, 65, 85, 0.3)' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleFont: { family: 'Courier New', size: 13 },
            bodyFont: { family: 'Inter', size: 14, weight: 'bold' },
            padding: 12,
            borderColor: '#334155',
            borderWidth: 1
        }
      }
    }
  });
}

function updateChart(lines) {
  if (!complianceChart) initChart();
  
  const labels = [];
  const data = [];
  let currentCompliance = 100;
  
  lines.forEach(line => {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length === 3) {
      const time = parts[0];
      const event = parts[1].toLowerCase();
      const status = parts[2].toLowerCase();
      
      labels.push(time);
      
      if (status === 'success' && event.includes('baseline')) {
        currentCompliance = 100;
      } else if (status === 'warning' || event.includes('introduced')) {
        currentCompliance = 0;
      } else if (status === 'alert' || event.includes('detected')) {
        currentCompliance = 0;
      } else if (status === 'success' && event.includes('restored')) {
        currentCompliance = 100;
      }
      
      data.push(currentCompliance);
    }
  });
  
  // Dynamic coloring based on current end-state
  if (currentCompliance === 100) {
      complianceChart.data.datasets[0].borderColor = '#10b981';
      complianceChart.data.datasets[0].backgroundColor = 'rgba(16, 185, 129, 0.15)';
      complianceChart.data.datasets[0].pointBorderColor = '#10b981';
  } else {
      complianceChart.data.datasets[0].borderColor = '#ef4444';
      complianceChart.data.datasets[0].backgroundColor = 'rgba(239, 68, 68, 0.15)';
      complianceChart.data.datasets[0].pointBorderColor = '#ef4444';
  }
  
  complianceChart.data.labels = labels;
  complianceChart.data.datasets[0].data = data;
  complianceChart.update();
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
    drift.classList.add('active-safe');
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
    drift.classList.add('active-safe');
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
    if(complianceChart) updateChart([]); // Clear chart
  } else {
    // Update the live architecture chart based on the LAST known event in the log
    updateVisualization(lastStatus, lastEvent);
    
    // Update Data Visualization Graph
    updateChart(lines);
  }

  configElement.textContent = currentState;
  logOutput.scrollTop = logOutput.scrollHeight;
}

// Auto-refresh logs every 1 second for snappy presentation
setInterval(fetchLogs, 1000);
fetchLogs();
