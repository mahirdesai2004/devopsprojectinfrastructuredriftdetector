#!/bin/bash

# ==============================================================================
# Demo Script: Infrastructure Drift Detector
# Purpose: Automatically demonstrate configuration drift detection using Puppet
# Project: CSE3253 DevOps 
# ==============================================================================

LOG_FILE="/opt/project/logs/drift_log.txt"

# Ensure logs directory exists
mkdir -p /opt/project/logs
touch "$LOG_FILE"
chmod 666 "$LOG_FILE"

log_event() {
  local timestamp=$(date +"%H:%M:%S")
  local event="$1"
  local status="$2"
  echo "$timestamp | $event | $status" >> "$LOG_FILE"
}

echo "============================================================"
echo "Infrastructure Drift Detection Demo"
echo ""

# Step 1: Apply baseline configuration
echo "[$(date +"%H:%M:%S")] Applying baseline configuration with Puppet"
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp >/dev/null 2>&1
echo ""

echo "[$(date +"%H:%M:%S")] Baseline configuration created"
log_event "baseline applied" "success"

echo "— Current Configuration —"
cat /opt/configdrift/critical_app.conf
echo ""

sleep 2

# Step 2: Simulate Drift
echo "[$(date +"%H:%M:%S")] Simulating configuration drift"
sed -i 's/timeout=30/timeout=999/g' /opt/configdrift/critical_app.conf
log_event "drift introduced" "warning"
echo ""

echo "— Drifted Configuration —"
cat /opt/configdrift/critical_app.conf
echo ""

sleep 2

# Step 3: Run Puppet again to detect and remediate drift
echo "[$(date +"%H:%M:%S")] Running Puppet to detect drift"
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp >/dev/null 2>&1
echo ""

echo "[$(date +"%H:%M:%S")] Drift detected"
log_event "drift detected" "alert"

sleep 2

# Step 4: Verify Remediation
echo "[$(date +"%H:%M:%S")] Puppet restoring configuration"
log_event "configuration restored" "success"
echo ""

echo "— Restored Configuration —"
cat /opt/configdrift/critical_app.conf
echo ""

echo "============================================================"
echo "Demo Completed"
