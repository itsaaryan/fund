pragma solidity ^0.4.17;


contract FactoryProject{
    address[] public deployedProjects;
    
    function createProject(uint minimum) public{
        address newProject=new Project(minimum,msg.sender);
        deployedProjects.push(newProject);
    }
    
    function getDeployedProjects() public view returns(address[]){
        return deployedProjects;
    }
}

contract Project{
    
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address=>bool) approvers;
    }
    
    address public owner;
    uint public minimumContribution;
    mapping(address=>bool) public contributors;
    uint public contributorCount;
    Request[] public requests;
    
    modifier restricted(){
      require(msg.sender==owner);
      _;
    }
    
    function Project(uint minimum,address owneraddress) public{
        minimumContribution=minimum;
        owner=owneraddress;
    }
    
    function contribute() public payable{
        require(msg.value>minimumContribution);
        contributors[msg.sender]=true;
        contributorCount++;
    }
    
    function createRequest(string description,uint value,address recipient) public restricted{
        Request memory newRequest=Request ({
           description:description,
           value:value,
           recipient:recipient,
           complete:false,
           approvalCount:0
        });
        requests.push(newRequest);
    }
    
    function approveRequest(uint index) public{
        require(contributors[msg.sender]);
        Request storage request=requests[index];
        require(!request.approvers[msg.sender]);
        request.approvers[msg.sender]=true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request=requests[index];
        require(request.approvalCount>(contributorCount/2));
        require(request.value<=this.balance);
        request.complete=true;
        request.recipient.transfer(request.value);
    }
    
    function getSummary() public view returns(uint,uint,uint,uint,address){
        return (
           minimumContribution,
            this.balance,
            requests.length,
            contributorCount,
            owner
            );
    }
    
    function getRequestCount() public view returns(uint){
        return requests.length;
    }
}