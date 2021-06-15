import web3 from "./web3";
import compiledFactory from "./build/FactoryProject.json";

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactory.interface),
  "0xEd977069614c27b1D4E640D50364b2ce3c85Cd71"
);

export default instance;
