pragma solidity ^0.4.24;

contract Equivalents {

    struct Record {
        address owner;
        string description;
    }

    mapping(string => Record) internal records;

    event Added(string name, string description);
    event EditedDescription(string name, string description);

    constructor() public {
        //empty
    }

    /// @notice Get record by name
    function getRecord(string name) public view returns(address, string) {
        return (records[name].owner, records[name].description);
    }

    /// @notice Add some record to contract
    function add(string name, string description) public {
        require(records[name].owner == address(0));
        records[name] = Record(msg.sender, description);
        emit Added(name, description);
    }

    /// @notice Edit own record
    function editDescription(string name, string description) public {
        require(records[name].owner == msg.sender);
        records[name].description = description;
        emit EditedDescription(name, description);
    }
}