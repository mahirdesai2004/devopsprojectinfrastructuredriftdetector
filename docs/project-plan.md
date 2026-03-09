# Project Plan: Infrastructure Drift Detector

## Project Timeline
- **Week 1: Planning and Design**
  - Define project scope, requirements, and the problem statement.
  - Draft initial architecture and choose Puppet/Docker as the core stack.
- **Week 2: Environment Setup**
  - Create the GitHub repository and initial folder scaffolding.
  - Write Dockerfile and docker-compose configurations to establish a reproducible testing node.
- **Week 3: Core Implementation**
  - Write Puppet manifests to define the desired state (`drift_detector.pp`).
  - Test manifest idempotency within the container.
- **Week 4: Scripting & Automation**
  - Develop `demo_drift_detection.sh` to automate the simulation and remediation of drift for presentation purposes.
- **Week 5: Documentation & Finalization**
  - Finalize all markdown documentation (README, User Guide, Design Doc).
  - Prepare the live demonstration script.
  - Final review and submission.

## Milestones
1. **M1: Repository Scaffolding Complete** - Basic folder structure and git tracking established.
2. **M2: Containerized Environment Running** - Successfully bringing up an Ubuntu container with Puppet installed via Docker Compose.
3. **M3: Drift Remediation Proven** - Puppet successfully detecting manual file modifications and reverting them.
4. **M4: Automated Demo Script Working** - Bash script runs end-to-end without errors.
5. **M5: Project Submission** - All docs pushed, repo clean, ready for academic grading.

## Tools Used
- **Git & GitHub**: Version control and project collaboration/submission.
- **Docker**: Containerization to provide a clean, isolated environment without polluting the host Mac OS.
- **Docker Compose**: Orchestration of the test node and volume mapping.
- **Puppet**: The core Configuration Management tool used to enforce declarative state.
- **Bash Shell Scripting**: Automating the demonstration flow using standard Linux utilities (`sed`, `cat`, `echo`).
- **Markdown**: For academic documentation.

## Expected Deliverables
1. Complete, public GitHub repository.
2. Reproducible Docker environment (`docker-compose.yml` & `Dockerfile`).
3. Core Puppet Manifest (`drift_detector.pp`).
4. Automated Bash shell script for demonstration.
5. Project documentation (Design doc, user guides, presentations).
