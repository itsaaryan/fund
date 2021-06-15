import web3 from "./web3";
import compiledProject from "./build/Project.json";

function Project(address) {
  return new web3.eth.Contract(JSON.parse(compiledProject.interface), address);
}

export default Project;
