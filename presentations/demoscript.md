# Live Demo Presentation Script

**Project Title:** Infrastructure Drift Detector  
**Course:** CSE3253 DevOps  
**Student:** Mahir Desai  

## Preparation (Before the presentation)
Open your terminal and ensure Docker Desktop is running on your Mac.

---

## 1. Introduction (1 minute)
*"Hello, my name is Mahir Desai, and this is my presentation for CSE3253 DevOps. My project is the 'Infrastructure Drift Detector'. Configuration drift is a major issue in DevOps where manual changes or unexpected events cause a server's configuration to differ from its baseline, leading to vulnerabilities or outages. I am using Puppet and Docker to solve this by continuously enforcing a declarative state."*

## 2. Starting the Environment (1 minute)
*"To ensure this demo is reproducible safely without altering my host machine, I've containerized the environment using Docker."*

**Action:** Explain you are starting the isolated Ubuntu node and entering it.
```bash
cd infrastructure/docker
docker-compose up -d
docker exec -it puppet-node-demo bash
```

## 3. Applying the Baseline (1 minute)
*"Inside the container, I'll use Puppet as our Configuration Management tool. I have written a manifest detailing what a critical configuration file should look like. Right now, the file does not exist."*

**Action:** Run Puppet for the first time.
```bash
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
```
*"As you can see from the Notice logs, Puppet has evaluated the node, determined the directory and file were missing, and created them with the exact contents specified in my infrastructure code."*

**Action:** Show the newly created file.
```bash
cat /opt/configdrift/critical_app.conf
```
*"Notice the `timeout=30` definition."*

## 4. Simulating Configuration Drift (1 minute)
*"Now, let's simulate a problem. Suppose an administrator logs in and manually edits this file during an incident, changing `timeout=30` to an insecure `timeout=999`. Or perhaps a rogue process modifies it. This is configuration drift."*

**Action:** Execute the manual edit to break the config.
```bash
sed -i 's/timeout=30/timeout=999/g' /opt/configdrift/critical_app.conf
```
**Action:** Prove the file is broken.
```bash
cat /opt/configdrift/critical_app.conf
```

## 5. Automatic Remediation (1 minute)
*"In a production environment, Puppet agents run continuously in the background (e.g., every 30 minutes). When the agent runs again, its idempotency property comes into play. It compares the current state of the drifted file against the hardcoded manifest."*

**Action:** Run Puppet the second time to trigger the fix.
```bash
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
```

## 6. Conclusion (1 minute)
*"Puppet detected the MD5 hash discrepancy, logged a Notice alert for our monitoring systems, and automatically remediated the drift by rewriting the file back to its secure baseline."*

**Action:** Prove the fix was successful.
```bash
cat /opt/configdrift/critical_app.conf
```

*"The `<timeout=30>` value is restored. This concludes the demonstration of declarative Infrastructure as Code solving configuration drift."*
