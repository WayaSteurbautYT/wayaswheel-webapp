module.exports = {
  webpack: (config) => {
    // Fix for allowedHosts issue
    config.devServer = {
      ...config.devServer,
      allowedHosts: 'all'
    };
    return config;
  }
};
