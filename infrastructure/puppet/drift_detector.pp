# infrastructure/puppet/drift_detector.pp
# This manifest ensures that a critical configuration file remains exactly as desired.

# Ensure the parent directory exists
file { '/opt/configdrift':
  ensure => directory,
  owner  => 'root',
  group  => 'root',
  mode   => '0755',
}

# Define the desired state for a critical application configuration file
file { '/opt/configdrift/critical_app.conf':
  ensure  => file,
  owner   => 'root',
  group   => 'root',
  mode    => '0644',
  content => "app_mode=production\ntimeout=30\nenable_secure_mode=true\n",
  require => File['/opt/configdrift'],
  # When Puppet runs, it will check if '/opt/configdrift/critical_app.conf' contains exactly this content.
  # If someone manually edits the file (drift), Puppet will detect the discrepancy,
  # log a notice, and revert the file back to this declared content.
}

# Example to ensure a specific service is always running
service { 'cron':
  ensure => running,
  enable => true,
}
