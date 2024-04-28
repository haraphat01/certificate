import { NextResponse } from 'next/server'
import Web3 from 'web3';
import fs from 'fs';
import { Readable } from 'stream';

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
  // console.log("new", bodyreq)
  const { name, studentId, studentYear, studentM, accounts } = bodyreq
  try {
    const base64Image = bodyreq.imagePath;
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageData = Buffer.from(base64Data, 'base64');

    const stream = new Readable();
    stream.push(imageData);
    stream.push(null); // Signal the end of the stream
    const pinataRes = await pinata.pinFileToIPFS(stream, { pinataMetadata: { name: name } });;
    // console.log('pinataRes:', pinataRes);
    const { IpfsHash } = await pinataRes
    // console.log('IpfsHash:', IpfsHash);
    // console.log("Ipfs response", IpfsHash);
    // Connect to Ethereum via Web3

    const contractABI = require('../../contracts/CertificateStorage.json');
    // console.log('ContarctAbi:', contractABI);
    const contractAddress = process.env.CONTRACT_ADDRESS;
    // console.log('ContarctAddress:', contractAddress);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    // Sign the transaction automatically
    let privateKey = process.env.META_PRIVATE
    privateKey = Buffer.from(privateKey, 'hex');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    const transaction = {
      from: account.address,
      to: contractAddress,
      value: '0x0',
      gas: 300000,
      maxFeePerGas: 10000000000, // Adjust the maxFeePerGas value
      maxPriorityFeePerGas: 2500000000, // Adjust the maxPriorityFeePerGas value
      data: contract.methods.addCertificate(
        name,
        studentId,
        studentM,
        studentYear,
        IpfsHash
      ).encodeABI()
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(
      transaction,
      privateKey
    );

    let hashTransaction = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction, (error, transactionHash) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Transaction hash:', transactionHash);
      }
    });
    return NextResponse.json({
      success: 'Certificate uploaded successfully',
      hashTransaction: hashTransaction.transactionHash,
      IpfsHash: IpfsHash,
      name: name,
    }, { status: 200 })
  } catch (error) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json({ error: 'Failed to upload certificate' }, { status: 500 })
  }
}