import Web3 from 'web3';
import nextConnect from 'next-connect';
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

const handler = nextConnect();

handler.use(upload.single('certificate'));

handler.post(async (req, res) => {
  try {
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
    const contractABI = require('../../contracts/CertificateStorage.json').abi;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Call the smart contract function to add the certificate
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addCertificate(req.body.name, req.body.studentId, fileHash).send({ from: accounts[0] });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Certificate uploaded successfully', fileHash: fileHash });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
