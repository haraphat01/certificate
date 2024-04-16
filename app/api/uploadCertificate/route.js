import Web3 from 'web3';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { create } from 'ipfs-http-client';


// Initialize IPFS
const ipfs = create('https://ipfs.infura.io:5001');

// Set up storage with Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      upload.single('certificate')(req, res, async function (err) {
        if (err) {
          return res.status(400).send('Error uploading file.');
        }

        if (!req.file) {
          return res.status(400).send('No file uploaded.');
        }

        // Read the file from the filesystem
        const file = fs.readFileSync(path.resolve(req.file.path));
        // Add file to IPFS
        const added = await ipfs.add(file);
        const fileHash = added.path;

        // Connect to Ethereum via Web3
        const web3 = new Web3(process.env.INFURA_URL);
        const contractABI = require('../../contracts/CertificateStorage').abi;
        const contractAddress = process.env.CONTRACT_ADDRESS;
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Call the smart contract function to add the certificate
        const accounts = await web3.eth.getAccounts();
        const { name, studentId, studentYear, studentM } = req.body;
        await contract.methods.addCertificate(name, studentId, studentM, studentYear, fileHash).send({ from: accounts[0] });

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);
        res.status(200).json({ message: 'Certificate uploaded successfully', fileHash: fileHash });
      });
    } catch (error) {
      console.error('Error uploading certificate:', error);
      res.status(500).json({ error: 'Failed to upload certificate' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
