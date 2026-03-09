# User Guide: Infrastructure Drift Detector

## Prerequisites
To successfully run this project, your local machine must have the following installed and configured:
- **Git**: For cloning the repository.
- **Docker**: The Docker Engine must be running to spin up the test node container.
- **Docker Compose**: Used to orchestrate the container build and volume mounting.

## 1. Installation Instructions
Begin by cloning the GitHub repository to your local machine:
```bash
git clone https://github.com/mahirdesai2004/devopsprojectinfrastructuredriftdetector.git
cd devopsprojectinfrastructuredriftdetector
```

## 2. Start the Docker Environment
The project relies on an isolated Ubuntu container pre-configured with Puppet.
1. Navigate to the Docker compose directory:
   ```bash
   cd infrastructure/docker
   ```
2. Build and start the container as a detached background process:
   ```bash
   docker-compose up -d
   ```
3. Enter the running container to interact with it:
   ```bash
   docker exec -it puppet-node-demo bash
   ```
   *Note: Your prompt should now change, indicating you are inside the container (`root@<container-id>:/opt/project#`).*

## 3. How to Run the Automated Demo Script
The easiest way to see the project functioning end-to-end is via the included automation script. From inside the container:
```bash
./src/scripts/demo_drift_detection.sh
```

## 4. How to Manually Simulate Configuration Drift
If you prefer to run the steps manually (e.g., during a live grading session), follow these steps:

### Step A: Apply the Baseline Configuration
Run Puppet to enforce the desired state defined in the manifest:
```bash
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
```

### Step B: Identify the Managed File
Puppet has now created the defined file. Check its contents:
```bash
cat /opt/configdrift/critical_app.conf
```
*Expected Output:*
```
app_mode=production
timeout=30
enable_secure_mode=true
```

### Step C: Cause Unauthorized Drift
Simulate a misconfiguration or malicious edit by opening the file with `vim` or using `sed`:
```bash
sed -i 's/timeout=30/timeout=999/g' /opt/configdrift/critical_app.conf
```
*Verify the file has drifted:*
```bash
cat /opt/configdrift/critical_app.conf
```

### Step D: Detect and Remediate
Run Puppet again to trigger drift detection and automatic remediation:
```bash
puppet apply /opt/project/infrastructure/puppet/drift_detector.pp
```
*Expected Output:*
```
Notice: /Stage[main]/Main/File[/opt/configdrift/critical_app.conf]/content: content changed '{md5}72f6aa...' to '{md5}4b22c7...'
```

### Step E: Verify Remediation
Check the file one last time to prove the `timeout=30` value has been automatically restored.
```bash
cat /opt/configdrift/critical_app.conf
```
