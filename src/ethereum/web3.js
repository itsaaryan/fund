import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({
    method: "eth_requestAccounts",
  });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "wss://rinkeby.infura.io/ws/v3/df96fb2234ed4e588465249944aef4a0"
  );
  web3 = new Web3(provider);
}

export default web3;
