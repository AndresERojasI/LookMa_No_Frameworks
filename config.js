/**
 * Create and export configuration variables
 */

// Container for all environment variables
const environments = {};

// Staging (default) environment
environments.staging = {
    'port': 3000,
    'envName': 'staging',
    'serverHost': 'http://localhost'
}

// Production environment
environments.production = {
    'port': 5000,
    'envName': 'production',
    'serverHost': 'http://localhost'
}

// Determine which environment to export
const currentEnvironment = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : '';

// Check if is one of the defined environments
module.exports = currentEnvironment in environments ? environments[currentEnvironment] : environments.staging;
