const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");

fs.removeSync(buildPath);

const ProjectPath = path.resolve(__dirname, "contracts", "Project.sol");

const source = fs.readFileSync(ProjectPath, "utf8");

const output = solc.compile(source, 1).contracts;

//console.log(output);

for (let contract in output) {
  const name = contract.substring(1);
  fs.outputJSONSync(path.resolve(buildPath, name + ".json"), output[contract]);
}
