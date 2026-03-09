# Screenshots Documentation

**Purpose**: This directory serves as a placeholder to store screenshots of your Infrastructure Drift Detector project to be included in your final report or README.

*Please add your presentation or grading screenshots here.*

### Recommended Screenshots:
1. **Container Start**: A screenshot of `docker-compose up -d` successfully starting the test node.
2. **Initial Puppet Run**: The terminal output showing Puppet creating the `/opt/configdrift/critical_app.conf` file for the first time.
3. **Drift Detection**: The Notice alert shown during `puppet apply` when it detects the configuration file was manually altered.
4. **Restored File**: A screenshot showing `cat /opt/configdrift/critical_app.conf` returning the original `timeout=30` value after remediation.
