// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateStorage {
    // Event to emit when a certificate is added. Useful for the frontend to listen to.
    event CertificateAdded(uint256 indexed certificateId, string studentName, string studentId, address indexed issuer);

    // Structure to hold certificate information
    struct Certificate {
        uint256 id;
        string studentName;
        string studentId;
        string certificateHash; // Hash of the certificate file for verification
        address issuer; // Address of the educational institution that issued the certificate
    }

    // Mapping of certificate ID to Certificate object
    mapping(uint256 => Certificate) public certificates;

    // Counter to keep track of certificate IDs
    uint256 public certificateCount;

    // Function to add a new certificate. Only callable by the contract owner (educational institution)
    function addCertificate(string memory _studentName, string memory _studentId, string memory _certificateHash) public {
        certificateCount++; // Increment the certificate count to get a new ID
        certificates[certificateCount] = Certificate(certificateCount, _studentName, _studentId, _certificateHash, msg.sender);
        emit CertificateAdded(certificateCount, _studentName, _studentId, msg.sender);
    }

    // Function to retrieve certificate details by its ID
    function getCertificate(uint256 _certificateId) public view returns (Certificate memory) {
        require(_certificateId > 0 && _certificateId <= certificateCount, "Certificate ID is out of bounds.");
        return certificates[_certificateId];
    }
}
