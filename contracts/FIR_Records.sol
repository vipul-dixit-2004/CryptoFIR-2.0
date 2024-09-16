//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

contract FIR_Records {
    uint recordId;
    mapping(uint => Record) private records;
    struct Record {
        string complainId;
        uint _recordId;
        uint timestamp;
        string complain;
    }
    event recordAdded(
        string _complainId,
        uint _recordId,
        uint _timestamp,
        string _complain
    );

    function createComplain(
        string memory _complainId,
        string memory _complain
    ) public {
        records[recordId] = Record(
            _complainId,
            recordId,
            block.timestamp,
            _complain
        );
        emit recordAdded(
            _complainId,
            recordId,
            records[recordId].timestamp,
            _complain
        );
        recordId++;
    }

    function fetchComplain(uint _recordId) public view returns (Record memory) {
        return records[_recordId];
    }

    function recordCount() public view returns (uint) {
        return recordId;
    }
}
