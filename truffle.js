/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        dev: {
            host: 'localhost',
            port: 8545,
            network_id: '*'
        },
        ganache: {
            host: 'localhost',
            port: 7545,
            network_id: '*',
            gas: 6721975
        },
        rinkeby: {
            provider: () => {
                let mnemonic = "mystery together swear picture category one math trophy baby off pass shallow";
                return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/4086b3432d5941a29b19ae75f0322589")
            },
            network_id: 4,
            gas: 3000000,
            gasPrice: 10000000000
        }
    },
    compilers: {
        solc: {
            version: "0.5.6"
        },
    },
};