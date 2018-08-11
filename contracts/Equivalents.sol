pragma solidity ^0.4.24;

contract Equivalents {

    //fixme due to code review 11/08 - what purpose of the `owner`?
    address public owner;

    // Structure for some record
    struct Record {
        address owner;
        string name; //fixme due to code review 11/08 - name could be removed (stored as key in mapping)
        string description;
    }

    //fixme due to code review 11/08 - where is token payments for addition to register

    // All records
    mapping(bytes8 => Record) public records;

    // For checking unique name
    mapping(bytes32 => bytes8) public names;

    //fixme due to code review 11/08 - why not use `mapping(string => Record) records` what is the purpose of the `key`?

    event Added(bytes8 indexed key, bytes32 name, string description);
    event EditedDescription(bytes8 indexed key, string description);

    // Create a contract
    constructor() public {
        owner = msg.sender;
    }

    // add some record to contract
    function add(bytes8 key, bytes32 name, string description) public returns(bool status)
    {
        //fixme due to code review 11/08 - why not use `require`?
        if(records[key].owner != 0x0) {
            return false;
        }
        if(names[name] != 0) {
            return false;
        }
        //fixme due to code review 11/08 - not necesary if use `string => Record`
        names[name] = key;
        uint8 i;
        uint8 count = 0;
        for (i = 0; i < 32; i+=1) {
            if (name[i] != 0){
                count+=1;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(count);
        for (i = 0; i < count; i+=1) {
            bytesStringTrimmed[i] = name[i];
        }

        records[key] = Record(msg.sender, string(bytesStringTrimmed), description);
        emit Added(key, name, description);
        return true;
    }


    // edit own record
    function editDescription(bytes8 key, string description) public returns(bool status)
    {
        //fixme due to code review 11/08 - why not use `require`?
        if(records[key].owner != msg.sender) {
            return false;
        }
        records[key].description = description;
        emit EditedDescription(key, description);
        return true;
    }

    //fixme due to code review 11/08 - should use simple getter for struct (will return null values if empty)
    // get record by name
    function getByName(bytes32 name) public view returns(address _owner, bytes8 key, string description)
    {
        //fixme due to code review 11/08 - key not needed
        bytes8 foundKey = names[name];
        if(foundKey == 0){
            return (0x0, 0, '');
        }
        Record memory record = records[foundKey];
        return (record.owner, foundKey, record.description);
    }
}