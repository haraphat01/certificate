import { NextResponse } from 'next/server'
import Web3 from 'web3';
import fs from 'fs';
import { Readable } from 'stream';
import path from 'path';
import fetch from 'node-fetch'; // Import fetch for server-side usage
// Use the api keys by specifying your api key and api secret
const pinataSDK = require('@pinata/sdk');
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

const network = process.env.ETHEREUM_NETWORK;
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
  ),
);


export async function POST(req, res) {
  let passedValue = await new Response(req.body).text();
  let bodyreq = JSON.parse(passedValue);
  console.log("new",bodyreq)
  const { name, studentId, studentYear, studentM, accounts } = bodyreq
  try {
    const base64Image = bodyreq.imagePath;
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Data, 'base64');

    const stream = new Readable();
    stream.push(imageData);
    stream.push(null); // Signal the end of the stream
    const pinataRes = await pinata.pinFileToIPFS(stream, { pinataMetadata: { name: name } });;
    console.log('pinataRes:', pinataRes);
    const { IpfsHash } = await pinataRes
    console.log('IpfsHash:', IpfsHash);
    // console.log("Ipfs response", IpfsHash);
    // Connect to Ethereum via Web3
    
    const contractABI = require('../../contracts/CertificateStorage.json');
    console.log('ContarctAbi:', contractABI);
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log('ContarctAddress:', contractAddress);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    
    await contract.methods.addCertificate(name, studentId, studentM, studentYear, IpfsHash).send({ from: accounts[0], gas: 230000 });

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'Certificate uploaded successfully', fileHash: fileHash });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({ error: 'Failed to upload certificate' });
  }
}