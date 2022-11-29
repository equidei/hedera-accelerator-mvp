// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserLookup {
    address[] public governorAddressArray;
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    function setGovernorAddress(
        address _governorAddress
    ) public returns (address) {
        governorAddressArray.push(_governorAddress);
    }

    function getGovernorAddress() public view returns (address[] memory) {
        return governorAddressArray;
    }
}
