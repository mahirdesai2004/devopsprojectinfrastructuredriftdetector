# Use an Ubuntu base image
FROM ubuntu:22.04

# Avoid user interaction during apt installations
ENV DEBIAN_FRONTEND=noninteractive

# Update system and install required packages: Puppet and Cron
RUN apt-get update && \
    apt-get install -y puppet cron vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create directory for the project inside the container
WORKDIR /opt/project

# Copy the Puppet manifest to the container
# (This will be overridden by the volume mount in docker-compose, but it's good practice)
COPY infrastructure/puppet/drift_detector.pp /opt/project/infrastructure/puppet/drift_detector.pp

# Command to keep the container running so we can interact with it
CMD ["tail", "-f", "/dev/null"]
