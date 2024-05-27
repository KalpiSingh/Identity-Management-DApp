// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Identity {
    struct UserInfo {
        bool isRegistered;
        string name;
        string email;
    }

    mapping(bytes32 => UserInfo) public users;
    mapping(address => bool) public registeredAddresses;

    event IdentityRegistered(address indexed user, string name, string email);

    // Register an identity
    function registerIdentity(string memory _name, string memory _email) public {
        bytes32 key = getKey(_name, _email);

        // Check if the identity is already registered
        require(!users[key].isRegistered, "Identity already registered");

        // Check if the address is already registered
        require(!registeredAddresses[msg.sender], "Address already registered");

        // Mark the address as registered
        registeredAddresses[msg.sender] = true;

        // Create a new UserInfo instance
        UserInfo memory newUser = UserInfo({
            isRegistered: true,
            name: _name,
            email: _email
        });

        // Store the new user information
        users[key] = newUser;

        emit IdentityRegistered(msg.sender, _name, _email);
    }

    // Display details of an identity
    function displayDetails(string memory _name, string memory _email) public view returns (bool, string memory, string memory) {
        bytes32 key = getKey(_name, _email);

        // Retrieve the user information
        UserInfo storage user = users[key];

        // Check if user exists
        if (!user.isRegistered) {
            return (false, "", ""); // Return defaults if user not found
        }

        return (true, user.name, user.email);
    }

    // Function to generate unique key
    function getKey(string memory _name, string memory _email) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(_name, _email));
    }
}
