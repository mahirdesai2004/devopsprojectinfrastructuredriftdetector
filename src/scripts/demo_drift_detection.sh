#!/bin/bash

# ==============================================================================
# Demo Script: Infrastructure Drift Detector
# Purpose: Automatically demonstrate configuration drift detection using Puppet
# Project: CSE3253 DevOps 
# ==============================================================================

echo "======================================================================"
echo " Starting Infrastructure Drift Detection Demo"
echo "======================================================================"
echo ""

# Step 1: Apply baseline configuration
echo "[1/4] Applying baseline configuration using Puppet..."
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
echo ""

# Step 2: Simulate Drift
echo "[2/4] Simulating configuration drift..."
echo "      Modifying: /opt/configdrift/critical_app.conf"
echo "      Changing 'timeout=30' to 'timeout=999' (Unauthorized change)"
sed -i 's/timeout=30/timeout=999/g' /opt/configdrift/critical_app.conf
echo ""

echo "--- Current File Contents (DRIFTED) ---"
cat /opt/configdrift/critical_app.conf
echo "---------------------------------------"
echo ""

# Step 3: Run Puppet again to detect and remediate drift
echo "[3/4] Running Puppet again to detect drift..."
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
echo ""

# Step 4: Verify Remediation
echo "[4/4] Verifying the configuration was restored..."
echo "--- Current File Contents (RESTORED) ---"
cat /opt/configdrift/critical_app.conf
echo "----------------------------------------"
echo ""

echo "======================================================================"
echo " Demo Completed Successfully!"
echo "======================================================================"
