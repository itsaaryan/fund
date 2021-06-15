const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const compiledFactory = require("../ethereum/build/FactoryProject.json");
const compiledProject = require("../ethereum/build/Project.json");

let accounts;
let factory;
let project;
let projectAddress;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createProject("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [projectAddress] = await factory.methods.getDeployedProjects().call();

  project = await new web3.eth.Contract(
    JSON.parse(compiledProject.interface),
    projectAddress
  );
});

describe("Project", () => {
  it("deploys a factory and a project", () => {
    assert.ok(factory.options.address);
    assert.ok(project.options.address);
  });

  it("is caller owner", async () => {
    const owner = await project.methods.owner().call();
    assert.equal(owner, accounts[0]);
  });

  it("can fund", async () => {
    await project.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    let isContributor = await project.methods.contributors(accounts[1]).call();
    assert(isContributor);
  });

  it("requires a minimum fund", async () => {
    try {
      await project.methods.contribute().send({
        from: accounts[0],
        value: "99",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allows a owner to make a payment request", async () => {
    await project.methods.createRequest("New fuel", "100", accounts[1]).send({
      from: accounts[0],
      gas: "1000000",
    });
    const request = await project.methods.requests(0).call();
    assert.equal(request.description, "New fuel");
  });

  it("process request", async () => {
    await project.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await project.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: "1000000" });

    await project.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await project.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 103);
  });
});
