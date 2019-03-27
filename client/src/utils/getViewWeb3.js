import Web3 from "web3";

const getViewWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {
        const ws = "wss://rinkeby.infura.io/v3/55cae59f2b154159ab53dd24c3781ff3";
        const provider = new Web3.providers.WebsocketProvider(ws);
        const web3 = new Web3(provider);
        if(web3){
            resolve(web3);
        } else {
            reject(ws)
        }
    });
  });

export default getViewWeb3;
