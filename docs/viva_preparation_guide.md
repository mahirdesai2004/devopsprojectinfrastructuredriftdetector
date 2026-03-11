# 🎓 Infrastructure Drift Detector - Viva & Presentation Guide

This guide is explicitly designed to help you confidently present your project, explain the code, and ace the Viva questions, especially when the professor asks **"Why did you use this, and why not that?"**

---

## PART 1 — PROJECT AUDIT
Your GitHub repository is **fully complete, structurally sound, and academically defensible.** 

- ✅ **`infrastructure/docker/`**: Contains the `Dockerfile` and `docker-compose.yml`. Provides a clean, isolated execution environment.
- ✅ **`infrastructure/puppet/drift_detector.pp`**: The Puppet manifest. Correctly enforces configuration idempotency.
- ✅ **`src/scripts/demo_drift_detection.sh`**: The automation script. Accurately simulates configuration drift and triggers remediation.
- ✅ **`logs/drift_log.txt`**: Logs events chronologically with correct system timestamps.
- ✅ **`ui/`**: The dashboard reads exactly from the log file to visualize data without requiring a complex backend.
- ✅ **`README.md`**: Deeply documents the setup, execution, and project structure.
- ✅ **`presentations/ & deliverables/`**: Contains your slides and demo video.

**Verdict:** The project is technically robust. It proves you understand Infrastructure as Code (IaC), immutability, and observability.

---

## PART 2 — ARCHITECTURE EXPLANATION ("Why this and not that?")

If the professor asks for the architecture, explain this flow:
`Developer Code -> Docker Container -> Puppet Configuration -> Simulated Drift -> Puppet Detection & Remediation -> Dashboard Visualization`

**The "Why" Defense:**
1. **Why Puppet (and not Ansible/Chef)?**
   *Answer:* "I chose Puppet because its declarative nature perfectly demonstrates **idempotency**. Puppet allows me to define the 'desired state' of the system, and it automatically continuously enforces that state. Ansible is great, but it requires pushing configurations via SSH. Puppet's agent-based pull model is better suited for continuous local drift detection in this specific isolated container."
2. **Why Docker (and not a Virtual Machine)?**
   *Answer:* "I used Docker instead of a heavy VM like VirtualBox because containers share the host OS kernel, making them incredibly lightweight and fast to start. It guarantees that the project runs the exact same way on my machine, your machine, or a CI/CD pipeline, avoiding the 'it works on my machine' problem."
3. **Why Bash Automation?**
   *Answer:* "I used a simple Bash script to automate the drift simulation because Bash is the universal language of Linux administration. It allowed me to cleanly orchestrate the text substitution and Puppet triggers without introducing unnecessary Python dependencies."
4. **Why purely Frontend HTML/JS (and no Node.js/Python backend)?**
   *Answer:* "This is the most critical DevOps decision I made: **Separation of Concerns**. The core of this project is Infrastructure management. A heavy backend server would be overkill and over-complicate the architecture. By making the UI a decoupled frontend that simply tails a flat log file, I am mimicking enterprise log forwarders. It demonstrates that the UI is purely an 'observer' and doesn't interfere with the infrastructure."

---

## PART 3 — CODE EXPLANATION FOR VIVA (Line-by-Line)

### 1. Puppet Manifest (`infrastructure/puppet/drift_detector.pp`)
```puppet
file { '/opt/project/config/system_settings.conf':
  ensure  => file,
  content => "app_mode=production\ntimeout=30\nenable_secure_mode=true\n",
  mode    => '0644',
  owner   => 'root',
  group   => 'root',
}
```
* **What you say:**
  "This is a declarative resource block. I am not telling Puppet *how* to make the file; I am telling it what the final state *must* be. `ensure => file` guarantees the file exists. The `content` string is the unbreakable baseline. If the actual file on the hard drive ever stops matching this exact string, Puppet detects the drift and forcefully overwrites it back to this state. This guarantees **Idempotency**—running this code 100 times yields the exact same safe result without causing errors."

### 2. Dockerfile (`infrastructure/docker/Dockerfile`)
```dockerfile
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y puppet-agent nano bash
ENV PATH="/opt/puppetlabs/bin:${PATH}"
CMD ["tail", "-f", "/dev/null"]
```
* **What you say:**
  "I start with `ubuntu:22.04` as my reliable base image. I install the `puppet-agent` directly into the OS. The `CMD ["tail", "-f", "/dev/null"]` command is a classic DevOps trick—it keeps the container running indefinitely in the background so I can execute my scripts inside it without the container shutting down immediately."

### 3. Docker Compose (`infrastructure/docker/docker-compose.yml`)
```yaml
services:
  puppet-node:
    build: .
    container_name: puppet-node-demo
    volumes:
      - ../../:/opt/project
```
* **What you say:**
  "Docker Compose handles my orchestration. The most important line here is `volumes: - ../../:/opt/project`. This is a bind mount. It links my local Mac/Windows directory directly into the container's `/opt/project` folder. Because of this, my scripts and Puppet manifests synchronize into the container instantly without me having to rebuild the Docker image every time I change a file."

### 4. Bash Demo Script (`src/scripts/demo_drift_detection.sh`)
* **What you say:**
  "This script is the orchestrator.
  **Stage 1:** It runs `puppet apply` to create the secure baseline and logs it.
  **Stage 2:** It uses `sed` (a stream editor) to maliciously overwrite `timeout=30` to `timeout=999`, creating a security vulnerability (configuration drift).
  **Stage 3:** It runs `puppet apply` again. Puppet compares the file hash with its manifest, realizes it was tampered with, and automatically restores it to `timeout=30`."

---

## PART 4 — TERMINAL DEMO FLOW (What to exactly do and say)

**STEP 1 — Start the UI Dashboard**
1. Open terminal locally, run: `python3 -m http.server 8000`
2. Open Chrome to: `http://localhost:8000/ui/`
3. Put the browser on the left half of the screen. Put a new Terminal on the right half.

**STEP 2 — Explain the setup**
*Say:* "Sir, this project demonstrates automated mitigation of Configuration Drift. On the left is my decoupled observability dashboard. On the right, I am connected to an isolated Ubuntu Docker container."

**STEP 3 — Run the script**
*Type:* `docker exec -it puppet-node-demo bash src/scripts/demo_drift_detection.sh`
*Say:* "I am now executing the demo script inside the container. 
Watch the dashboard. 
First, Puppet applies the secure baseline. The dashboard registers 100% compliance.
Next, my script mimics a malicious actor and alters the configuration file. Notice the graph instantly drops to 0% Drifted, and the UI flashes red!
Finally, Puppet detects this unauthorized change, instantly restores the file, and compliance returns to green. The observability dashboard tracked the entire lifecycle seamlessly without needing a backend server."

---

## PART 5 — VIVA QUESTIONS & CONFIDENT ANSWERS

**Q1: What is configuration drift?**
**Your Answer:** "Configuration drift happens when the actual state of a server (like its files or software) gradually changes from the approved, documented state over time—usually due to manual hotfixes, unrecorded updates, or malicious tampering. It breaks environments and causes vulnerabilities."

**Q2: What is Puppet and why do we use it?**
**Your Answer:** "Puppet is a Configuration Management tool. We use it to enforce 'Infrastructure as Code' (IaC). Instead of manually logging into 100 servers to change a setting, I write one Puppet manifest, and Puppet ensures all 100 servers match that configuration exactly and continuously."

**Q3: What does 'Idempotency' mean?**
**Your Answer:** "Idempotency means that no matter how many times I run a systemic command, the end result is exactly the same, and it doesn't break the system. If I tell Puppet 'ensure this file exists', it will create it the first time, but if I run it again, Puppet checks, sees it exists, and safely does nothing."

**Q4: How exactly does Puppet detect the drift in your project?**
**Your Answer:** "Puppet calculates the MD5 hash of the string defined in my manifest and compares it to the MD5 hash of the actual file on the Docker container. Since I used `sed` to change `timeout=30` to `timeout=999`, the hash changed. Puppet detects this mismatch and forces the file back to the original string."

**Q5: Why is automation important in DevOps?**
**Your Answer:** "Automation is the heart of DevOps. It removes human error, guarantees consistency across environments, and allows systems to self-heal. In this project, an administrator didn't need to manually fix the drifted file; the automation remediated the security risk instantly."

---

You are completely prepared. Take a deep breath. Your architecture is smart, your code is clean, and your UI is practically enterprise-grade. You will dominate this presentation. Good luck!
