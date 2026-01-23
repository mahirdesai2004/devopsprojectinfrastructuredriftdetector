# ConfigDrift

Student Name: Mahir Desai  
Registration Number: 23FE10CSE00345  
Course: CSE3253 – DevOps  
Semester: VI  
Project Type: Configuration Management & Monitoring  
Difficulty Level: Intermediate  

## Academic Project Topic
Infrastructure Drift Detector

---

## Project Overview
ConfigDrift is an Infrastructure Drift Detection tool designed to identify configuration changes in managed systems. The project focuses on detecting deviations between the desired infrastructure state and the actual system state using Puppet-based configuration management.

---

## Problem Statement
In real-world infrastructure environments, manual changes or unintended updates can cause systems to drift from their intended configuration. Such configuration drift can lead to security vulnerabilities, system instability, and compliance issues. This project aims to detect and report such drifts effectively.

---

## Objectives
- Define the desired system configuration using Puppet
- Apply and enforce configuration consistency
- Detect configuration drift caused by manual or unintended changes
- Log and report detected drift for monitoring purposes

---

## Technology Stack
- Operating System: macOS / Linux
- Version Control: Git & GitHub
- Configuration Management: Puppet
- Monitoring: Log-based drift reporting

---

## Project Structure
ConfigDrift/
├── README.md
├── src/
│     └── puppet/
├── docs/
├── infrastructure/
├── monitoring/
│     └── drift_logs/
├── presentations/
└── deliverables/ 

---

## How the Project Works
1. Puppet manifests define the desired configuration state
2. Puppet applies the configuration to the system
3. Any manual or unintended configuration change introduces drift
4. Puppet detects this drift
5. Drift details are logged for monitoring and analysis

---

## Current Status
- Repository initialized
- Project structure created
- Documentation in progress
- Puppet implementation pending

---

## Author
Mahir Desai  
GitHub: https://github.com/mahirdesai2004
