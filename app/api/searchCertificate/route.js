import fetch from 'node-fetch';
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  let passedValue = await new Response(req.body).text();
  let bodyreq = JSON.parse(passedValue);
  const imageCID = bodyreq.hash;
  

  if (req.method === 'POST') {
    try {
      const imageUrl = `https://ipfs.io/ipfs/${imageCID}`;
      
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.buffer();
      const base64ImageData = imageBuffer.toString('base64');
      return NextResponse.json(base64ImageData);
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      return NextResponse.send({ message: 'Failed to retrieve file from IPFS' }, { status: 500 });
    }
  } else {
    // Handle any requests that aren't POST
    return NextResponse.error(new Error(`Method ${req.method} Not Allowed`));
  }
}
