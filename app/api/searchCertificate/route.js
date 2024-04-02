// pages/api/searchCertificate.js

import Web3 from 'web3';
import CertificateStorage from '../../contracts/CertificateStorage.sol';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Initialize web3 with a provider
      const web3 = new Web3(process.env.NEXT_PUBLIC_WEB3_PROVIDER);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CertificateStorage.networks[networkId];
      const contract = new web3.eth.Contract(
        CertificateStorage.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const searchTerm = req.body.searchTerm;
      const certificateCount = await contract.methods.certificateCount().call();
      const searchResults = [];

      for (let i = 1; i <= certificateCount; i++) {
        const certificate = await contract.methods.certificates(i).call();
        if (certificate.studentName.includes(searchTerm) || certificate.studentId.includes(searchTerm)) {
          searchResults.push({
            name: certificate.studentName,
            studentId: certificate.studentId,
            certificateId: certificate.id,
            transactionHash: certificate.certificateHash, // Assuming the certificate hash is used as a proxy for transaction hash here
          });
        }
      }

      res.status(200).json(searchResults);
    } catch (error) {
      console.error('Error searching certificates:', error);
      res.status(500).json({ message: 'Failed to search certificates' });
    }
  } else {
    // Handle any requests that aren't POST
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
