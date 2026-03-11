# Infrastructure Drift Detector: Windows Presentation Guide

Follow these exact steps to run the presentation perfectly on a Windows machine.

### Prerequisites (Do this before the presentation)
1. Install **Git for Windows** (Git Bash).
2. Install **Docker Desktop for Windows** (Ensure WSL 2 backend is enabled in Windows Features).
3. Ensure **Python 3** is installed.

---

### Step 1: Open Terminal and Clone
Open **Git Bash** (or PowerShell) and run:
`git clone https://github.com/mahirdesai2004/devopsprojectinfrastructuredriftdetector.git`
`cd devopsprojectinfrastructuredriftdetector`

### Step 2: Start the Puppet Container
Ensure Docker Desktop is running, then type:
`cd infrastructure/docker`
`docker-compose up -d`
`cd ../..`

### Step 3: Start the UI Dashboard
Start the local web server to host the dashboard:
`python -m http.server 8000`

### Step 4: Open the Dashboard
Open **Google Chrome** or Edge and navigate to:
[http://localhost:8000/ui/](http://localhost:8000/ui/)
*(Leave this browser window open on one side of your screen)*

### Step 5: Run the Demo Script
Open a **new, second window** of Git Bash (or PowerShell).
Navigate back to the project folder (`cd devopsprojectinfrastructuredriftdetector`).
Run the automated drift script inside the container:
`docker exec -it puppet-node-demo bash src/scripts/demo_drift_detection.sh`

### Step 6: Watch and Present!
As the terminal script runs, point to the browser dashboard! The professor will see the Architecture Flow light up and the Compliance Graph track the drift and remediation in real-time!
