# System Design Document: Infrastructure Drift Detector

## 1. System Architecture Overview
The project architecture is optimized for a self-contained, reproducible testing environment suitable for coursework grading. 
The system consists of three main logical components:
1. **The Infrastructure Code Repository (Host)**: Where Puppet manifests and scripts are authored dynamically.
2. **The Docker Engine (Host/Hypervisor layer)**: Provides isolated runtime environments.
3. **The Target Node (Containerized)**: An Ubuntu container running the Puppet agent that evaluates its local state against the provided manifests.

## 2. Explanation of Puppet Configuration Management
Puppet is a declarative Configuration Management tool. Instead of writing scripts detailing *how* to set up a server, DevOps engineers write manifests detailing *what state the server should be in*.

### The Idempotency Loop
When `puppet apply` is run:
1. Puppet compiles the manifest into a catalog.
2. It evaluates the current real-world state of the node (e.g., examining file contents and permissions).
3. It compares the current state to the desired state defined in the catalog.
4. If there is a discrepancy (drift), Puppet makes exactly the changes necessary to reconcile the state. **If the state already matches, Puppet does nothing.**

This is crucial because it means Puppet can run repeatedly, continuously enforcing compliance without breaking functioning systems.

## 3. Explanation of Docker Container Usage
Installing Puppet directly onto a host machine (like a student's personal MacBook) can clutter system paths and cause permission conflicts. To provide a clean, risk-free grading environment:
- **Dockerfile**: Creates a customized Ubuntu image with only the necessary dependencies installed (`puppet`, `cron`, `vim`).
- **Docker Compose**: Orchestrates the container lifecycle and, crucially, maps the local project volume into the container (`- ../../:/opt/project`). This means changes made in an IDE on the host are instantly readable by Puppet inside the container, without needing to rebuild images.

## 4. Drift Detection Workflow
The core workflow of detecting drift operates natively through Puppet log outputs:
1. The desired file `/opt/configdrift/critical_app.conf` is established via Puppet.
2. An unauthorized external change occurs (e.g., someone editing it with `vim`).
3. During the next Puppet run (in production this would be automated via the puppet agent daemon or a cron job; in this local demo, it's triggered manually/via script), the drift is detected.

## 5. Explanation of Monitoring & Remediation
While full monitoring platforms like Nagios are out of scope for the current local-only sandbox, proper monitoring relies on the logs generated during remediation. 

When Puppet detects drift, it automatically remediates the issue (rewriting the file). During this process, it outputs key forensic logs:
```
Notice: /Stage[main]/Main/File[/opt/configdrift/critical_app.conf]/content: content changed '{md5}72f6aa...' to '{md5}4b22c7...'
```
In a larger enterprise architecture, these Notice logs are forwarded to centralized observation platforms (e.g., Splunk, Datadog, or ELK Stack) triggering alerts so security teams can investigate *who* caused the initial unauthorized change.
