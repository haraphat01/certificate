import { NextResponse } from 'next/server'
import Web3 from 'web3';
import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import fetch from 'node-fetch'; // Import fetch for server-side usage
// Use the api keys by specifying your api key and api secret
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export async function POST(req, res) {
  let passedValue = await new Response(req.body).text();
  let bodyreq = JSON.parse(passedValue);
  const { name, studentId, studentYear, studentM } = bodyreq

  try {
   
    const base64Image = bodyreq.imagePath;
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Data, 'base64');

    const stream = new Readable();
    stream.push(imageData);
    stream.push(null); // Signal the end of the stream
    const pinataRes = await pinata.pinFileToIPFS(stream, { pinataMetadata: { name:  name }});;
   
    const { IpfsHash } = await pinataRes.json();
    console.log("Ipfs response", pinataRes);
    // Connect to Ethereum via Web3
    const web3 = new Web3(process.env.INFURA_URL);
    const contractABI = require('../../contracts/CertificateStorag.json').abi;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Call the smart contract function to add the certificate
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addCertificate(name, studentId, studentM, studentYear, IpfsHash).send({ from: accounts[0] });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Certificate uploaded successfully', fileHash: fileHash });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
}



