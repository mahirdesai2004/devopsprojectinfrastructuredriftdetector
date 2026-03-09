# Infrastructure Drift Detector

**Student Details:**
- **Name**: Mahir Desai
- **Registration Number**: 23FE10CSE00345
- **Course**: CSE3253 DevOps 
- **Project Title**: Infrastructure Drift Detector
- **Category**: Puppet / Monitoring
- **Difficulty**: Intermediate

## Project Overview
This project focuses on detecting and remediating configuration drift within managed infrastructure environments. It leverages Puppet as a configuration management tool alongside Docker containers to ensure server configurations are maintained and automatically restored to their desired state if unauthorized modifications occur.

## Problem Statement
In modern IT environments, manual changes, unexpected events, or malicious activities can cause systems to continuously evolve away from their baseline configurations. This phenomenon, known as configuration drift, can result in security vulnerabilities, compliance failures, and system downtime. Detecting and resolving drift is a significant challenge when managing infrastructure at scale.

## Objectives
- Ensure that essential system files and configurations continuously match their declared state.
- Monitor target nodes for unauthorized changes utilizing Puppet's idempotency.
- Automatically remediate identified configuration drift to enforce compliance.
- Provide a reproducible, containerized demonstration environment.

## Key Features
- **Idempotent Configuration Enforcement**: Puppet continuously ensures the state matches the code.
- **Automated Remediation**: Drifted files are automatically overwritten with the correct baselines.
- **Containerized Testing Environment**: Ships with a Docker Compose setup for safe and isolated testing.
- **Automated Demonstration Script**: Includes a shell script to automate the entire drift and remediation lifecycle for easy grading/presentation.

## Technology Stack
- **Configuration Management**: Puppet 
- **Containerization**: Docker & Docker Compose
- **Scripting**: Bash

## Project Architecture Explanation
The architecture relies on a standalone Puppet agent running inside an Ubuntu Docker container. 
1. The desired state of the infrastructure is defined in the `drift_detector.pp` manifest.
2. The Docker Compose file maps the local project directory into the container (`/opt/project`), allowing real-time manifest updates.
3. When `puppet apply` runs, it evaluates the current state of the tracked resources (like `/opt/configdrift/critical_app.conf`).
4. Since Puppet is declarative, if the current state doesn't match the manifesto, Puppet automatically corrects it.

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/mahirdesai2004/devopsprojectinfrastructuredriftdetector.git
   cd devopsprojectinfrastructuredriftdetector
   ```
2. Ensure you have Docker and Docker Compose installed on your system.
3. Make the demonstration script executable (if not already):
   ```bash
   chmod +x src/scripts/demo_drift_detection.sh
   ```

## How to Run the Docker Environment
Start the interactive Puppet node container:
```bash
cd infrastructure/docker
docker-compose up -d
```
Access the running container's shell:
```bash
docker exec -it puppet-node-demo bash
```

## How to Run the Drift Detection Demo Script
Once inside the Docker container shell (`puppet-node-demo`), you can run the automated script that applies the baseline, simulates an unauthorized change, and runs Puppet again to demonstrate the fix:
```bash
./src/scripts/demo_drift_detection.sh
```

## Demonstration Screenshots

Below are captures of the project running end-to-end, showcasing the isolated Docker environment, Puppet enforcing the baseline configuration, and the automatic remediation of simulated configuration drift.

1. **Docker Environment Running**  
   ![Docker Container Running](docs/screenshots/docker-running.png)
   
2. **Drift Detected by Puppet**  
   ![Configuration Drift Detected](docs/screenshots/drift-detected.png)

3. **Configuration Restored**  
   ![Configuration Restored](docs/screenshots/drift-restored.png)

## Example Expected Output
When running the demo script, you will see output similar to this:
```text
======================================================================
 Starting Infrastructure Drift Detection Demo
======================================================================

[1/4] Applying baseline configuration using Puppet...
Notice: Compiled catalog for 5c881ce066a7 in environment production in 0.02 seconds
Notice: /Stage[main]/Main/File[/opt/configdrift]/ensure: created
Notice: /Stage[main]/Main/File[/opt/configdrift/critical_app.conf]/ensure: defined content as '{md5}4b22c7eb84de88102eb9289bc195feaf'
Notice: Applied catalog in 0.03 seconds

[2/4] Simulating configuration drift...
      Modifying: /opt/configdrift/critical_app.conf
      Changing 'timeout=30' to 'timeout=999' (Unauthorized change)

--- Current File Contents (DRIFTED) ---
app_mode=production
timeout=999
enable_secure_mode=true
---------------------------------------

[3/4] Running Puppet again to detect drift...
Notice: Compiled catalog for 5c881ce066a7 in environment production in 0.02 seconds
Notice: /Stage[main]/Main/File[/opt/configdrift/critical_app.conf]/content: content changed '{md5}72f6aa6a2b8e390cdd36715f53dc44ee' to '{md5}4b22c7eb84de88102eb9289bc195feaf'
Notice: Applied catalog in 0.03 seconds

[4/4] Verifying the configuration was restored...
--- Current File Contents (RESTORED) ---
app_mode=production
timeout=30
enable_secure_mode=true
----------------------------------------

======================================================================
 Demo Completed Successfully!
======================================================================
```

## Repository Structure
```text
devopsprojectinfrastructuredriftdetector/
├── README.md                 # Project documentation (this file)
├── .gitignore                # Git ignored files
├── LICENSE                   # Project license
├── src/                      
│   └── scripts/              # Automated demonstration scripts
│       └── demo_drift_detection.sh
├── docs/                     # Detailed project documentation and guides
│   ├── projectplan.md
│   ├── designdocument.md
│   ├── userguide.md
│   ├── apidocumentation.md
│   └── screenshots/          # Empty placeholder for demo images
├── infrastructure/           # IaC and deployment manifests 
│   ├── docker/
│   │   ├── Dockerfile
│   │   └── docker-compose.yml
│   └── puppet/
│       └── drift_detector.pp # Core configuration management manifest
├── pipelines/                # CI/CD pipeline definitions
├── tests/                    # Testing suites 
├── monitoring/               # Nagios configurations and dashboards
├── presentations/            # Presentation files and scripts
│   └── demoscript.md         # Walkthrough script for live grading
└── deliverables/             # Final assessments and demo recordings
```

## Conclusion
This coursework project effectively demonstrates intermediate DevOps principles by utilizing declarative Infrastructure as Code (Puppet) to solve the real-world operational problem of configuration drift. The containerized environment abstracts away host dependencies, making the project easily reproducible for grading and evaluation.
