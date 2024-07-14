// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    // Event to emit when a certificate is added. Useful for the frontend to listen to.
    event CertificateAdded(
        string studentName,
        string studentId,
        string studentM,
        string studentYear,
        string fileHash,
        address indexed issuer
    );

    // Structure to hold certificate information
    struct Certificate {
        string studentName;
        string studentId;
        string studentM;
        string studentYear;
        string fileHash; // Hash of the certificate file for verification
        address issuer; // Address of the educational institution that issued the certificate
    }

    // Mapping of certificate ID to Certificate object
    mapping(string => Certificate) public certificates;

    // Address of the contract owner
    address public owner;

    // Constructor to set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }

    // Function to add a new certificate. Only callable by the contract owner (educational institution)
    function addCertificate(
        string memory _studentName,
        string memory _studentId,
        string memory _studentM,
        string memory _studentYear,
        string memory _fileHash
    ) public onlyOwner {
        certificates[_studentId] = Certificate(
            _studentName,
            _studentId,
            _studentM,
            _studentYear,
            _fileHash,
            msg.sender
        );
        emit CertificateAdded(
            _studentName,
            _studentId,
            _studentM,
            _studentYear,
            _fileHash,
            msg.sender
        );
    }
}
