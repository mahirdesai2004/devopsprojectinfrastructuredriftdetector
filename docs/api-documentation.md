# Documentation: API and Internal Scripts

This document outlines the internal implementation configurations and scripts used in the Infrastructure Drift Detector project. Since this project focuses on foundational DevOps configuration management rather than REST APIs, this document details the "interfaces" of the IaC logic.

## 1. Puppet Manifest: `drift_detector.pp`

### Location
`infrastructure/puppet/drift_detector.pp`

### Object Specifications

#### `file { '/opt/configdrift': }`
- **Purpose**: Ensures the root directory for configuration files exists.
- **Attributes**:
  - `ensure => directory`: Specifies that the resource must be a directory.
  - `owner => 'root'`: Assigns root ownership.
  - `mode => '0755'`: Enforces readable/executable permissions for standard users, writeable for root.

#### `file { '/opt/configdrift/critical_app.conf': }`
- **Purpose**: Tracks the actual target configuration file for drift.
- **Attributes**:
  - `ensure => file`: Ensures it's a standard file.
  - `content => ...`: Hardcoded string defining the exact desired state of the file (`app_mode=production\ntimeout=30\nenable_secure_mode=true\n`).
  - `require => File['/opt/configdrift']`: Enforces execution order (directory must exist first).

#### `service { 'cron': }`
- **Purpose**: Example of managing running services instead of just files.
- **Attributes**:
  - `ensure => running`: puppet ensures the daemon stays active.
  - `enable => true`: Automatically start on boot.

## 2. Shell Script: `demo_drift_detection.sh`

### Location
`src/scripts/demo_drift_detection.sh`

### Logic Flow Specification
1. **Apply Baseline Phase**: Executes `puppet apply` to enforce the initial correct state.
2. **Drift Simulation Phase**: Utilizes `sed -i` to forcefully rewrite the string `timeout=30` to `timeout=999` directly in the target configuration file, acting as an unauthorized manual edit.
3. **Verification Output**: Runs `cat` on the modified file to display the drift to the user via stdout.
4. **Remediation Phase**: Re-executes `puppet apply`. Puppet internally checks the file hash against the catalog hash, detects the change, prints a Notice to stdout, and rewrites the file.
5. **Final Output**: The script cats the file one final time to prove it has been successfully restored.
