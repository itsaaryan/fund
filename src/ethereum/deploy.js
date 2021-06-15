const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/FactoryProject.json");

const provider = new HDWalletProvider(
  "ticket patrol execute rely reward salon voyage exclude yellow perfect erase marble",
  "https://rinkeby.infura.io/v3/6a78b8cf50db466191ca329b50fcc516"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("attemting to deploy contract from account", accounts[0]);

  const factory = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("contract address", factory.options.address);
};
deploy();

//contract  0xEd977069614c27b1D4E640D50364b2ce3c85Cd71
