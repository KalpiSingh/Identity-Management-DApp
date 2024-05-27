// truffle-config.js
module.exports = {
  networks: {
      ganache: {
          host: "127.0.0.1",     // Localhost (default: none)
          port: 7545,            // Standard Ganache port (default: none)
          network_id: "5777",       // Any network (default: none)
      },
  },
  compilers: {
      solc: {
          version: "0.8.19",    // Fetch exact version from solc-bin (default: truffle's version)
      },
  },
};
