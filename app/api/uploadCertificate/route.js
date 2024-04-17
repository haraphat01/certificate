"use server"
import { NextResponse } from 'next/server'
import Web3 from 'web3';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (_req_, _file_, _cb_) {
    _cb_(null, 'uploads/');
  },
  filename: function (_req_, _file_, _cb_) {
    _cb_(null, _file_.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

export async function POST(req) {

  if (req.method === 'POST') {
    try {
      await new Promise((resolve, reject) => {
        upload.single('certificate')(req, {}, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      console.log(req)
      if (!req.file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
      }

      const file = fs.readFileSync(path.resolve(req.file.path));
     
      const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
        body: file,
      });

      const { IpfsHash } = await pinataRes.json();
      
      // Connect to Ethereum via Web3
      const web3 = new Web3(process.env.INFURA_URL);
      const contractABI = require('../../contracts/CertificateStorage.json');
      const contractAddress = process.env.CONTRACT_ADDRESS;
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Call the smart contract function to add the certificate
      const accounts = await web3.eth.getAccounts();
      const { name, studentId, studentYear, studentM } = req.body;
      await contract.methods.addCertificate(name, studentId, studentM, studentYear, IpfsHash).send({ from: accounts[0] });

      // Clean up the uploaded file
      fs.unlinkSync(req.file.path);

      return NextResponse.json({ message: 'Certificate uploaded successfully', IpfsHash: IpfsHash }, { status: 200 });
    } catch (error) {
      console.error('Error uploading certificate:', error);
      return NextResponse.json({ error: 'Failed to upload certificate' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}