pragma solidity ^0.5.6;

contract Equivalents {

    struct Record {
        address owner;
        string name;
        string description;
    }

    mapping(uint64 => Record) internal records;
    uint64 public countRecords;

    event Added(uint64 index, string name, string description);
    event EditedDescription(uint64 index, string name, string description);

    constructor() public {
        countRecords = 0;
    }
    /// @notice Get record by name
    function getRecord(uint64 index) public view returns (address, string memory, string memory) {
        return (records[index].owner, records[index].name, records[index].description);
    }

    /// @notice Add some record to contract
    function add(string memory name, string memory description) public {
        uint64 index = countRecords;
        countRecords = countRecords + 1;
        records[index] = Record(msg.sender, name, description);
        emit Added(index, name, description);
    }

    /// @notice Edit own record
    function edit(uint64 index, string memory name, string memory description) public {
        require(index < countRecords);
        require(records[index].owner == msg.sender);
        records[index].name = name;
        records[index].description = description;
        emit EditedDescription(index, name, description);
    }
}