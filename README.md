# Infrastructure Drift Detector

**Student Details:**
- **Name**: Mahir Desai
- **Registration Number**: 23FE10CSE00345
- **Course**: CSE3253 DevOps 
- **Project Title**: Infrastructure Drift Detector
- **Category**: Puppet / Monitoring
- **Difficulty**: Intermediate

## Project Overview
This project focuses on detecting and remediating configuration drift within managed infrastructure environments. It leverages Puppet as a configuration management tool alongside essential monitoring tools to ensure server configurations are maintained and automatically restored to the desired state if unauthorized modifications occur.

## Problem Statement
In modern IT environments, manual changes or unexpected events can lead to systems continuously evolving from their baseline configurations. This phenomenon, known as configuration drift, can result in security vulnerabilities, system instability, and compliance failures. Detecting and resolving drift is a significant challenge when managing infrastructure at scale.

## Objectives
- Ensure that essential system files and configurations match their declared state.
- Continuously monitor target nodes for unauthorized changes.
- Automatically remediate identified configuration drift to enforce compliance.
- Provide alerts and visibility into drifted systems through basic monitoring logs.

## Technology Stack
- **Configuration Management**: Puppet 
- **Monitoring**: Nagios (or basic logging mechanisms via standard outputs / system logs)
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Infrastructure as Code**: Terraform
- **CI/CD**: Jenkins, GitHub Actions

## Installation Instructions
1. Clone the repository: `git clone https://github.com/mahirdesai2004/devopsprojectinfrastructuredriftdetector.git`
2. Change into the project directory: `cd devopsprojectinfrastructuredriftdetector`
3. Ensure you have a functioning Puppet environment (e.g., Puppet Server and Agents).
4. Apply Puppet manifests (for example):
   ```bash
   puppet apply infrastructure/puppet/drift_detector.pp
   ```
5. Deploy supporting container infrastructure via Docker or Kubernetes manifests provided.

## Project Structure
```
devopsprojectinfrastructuredriftdetector/
├── README.md                 # Project documentation
├── .gitignore                # Git ignored files
├── LICENSE                   # Project license
├── src/                      # Source code (configs, scripts, tests)
├── docs/                     # Detailed project documentation and guides
├── infrastructure/           # IaC and deployment manifests (Docker, K8s, Puppet, Terraform)
├── pipelines/                # CI/CD pipeline definitions
├── tests/                    # Testing suites (unit, integration, selenium)
├── monitoring/               # Nagios configurations and dashboards
├── presentations/            # Presentation files and scripts
└── deliverables/             # Final assessments and demo recordings
```

## Drift Detection Explanation
Drift detection is accomplished using Puppet's idempotent nature. Puppet continuously checks the target node's current state against the desired state defined in its manifests (e.g., specific file contents, permissions, or running services). If a discrepancy is found (drift), Puppet logs the change and automatically reapplies the configuration to enforce the correct state.

## Monitoring Explanation
Monitoring complements Puppet by tracking events and the broader health of the infrastructure. Utilizing basic logs and tools like Nagios or centralized syslog, alerts are triggered when Puppet reports corrective actions, allowing administrators to investigate the root cause of the unauthorized changes.
