const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const { METAMASK_SECRET_CODE, INFURA_KEY } = require("../../dev");
const compiledFactory = require("./build/FactoryProject.json");

const provider = new HDWalletProvider(METAMASK_SECRET_CODE, INFURA_KEY);

const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log("attemting to deploy contract from account", accounts[0]);

    const factory = await new web3.eth.Contract(
      JSON.parse(compiledFactory.interface)
    )
      .deploy({ data: compiledFactory.bytecode })
      .send({ from: accounts[0], gas: "1000000" });

    console.log("contract address", factory.options.address);
  } catch (err) {
    console.log(err);
  }
};
deploy();

//contract  0xEd977069614c27b1D4E640D50364b2ce3c85Cd71
