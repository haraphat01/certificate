This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


# Decentralized Student Certificate Management App

This repository contains the code for a decentralized application (DApp) aimed at managing student certificates using blockchain technology. The app provides a secure and transparent platform for educational institutions to issue certificates, students to access and share their certificates, and employers to verify the authenticity of certificates.

## Features

- **Certificate Issuance:** Educational institutions can securely issue digital certificates to students on the blockchain.
- **Certificate Access:** Students can easily access and share their certificates with employers or other authorized parties.
- **Certificate Verification:** Employers and recruiters can verify the authenticity of student certificates through a transparent verification process.
- **Blockchain Integration:** The app utilizes the Ethereum blockchain for secure storage and management of certificate data.

## Installation

To run the app locally, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.


# Environment Variables Configuration

This repository contains an file that stores environment variables for the student certificate management project. Below is a brief description of the key variables present in the file:

- **NEXT_PUBLIC_BLOCKCHAIN_URL**: Ethereum Blockchain URL (e.g., Infura).
- **ETHEREUM_NETWORK**: Ethereum network identifier.
- **CONTRACT_ADDRESS**: Smart Contract Address.
- **INFURA_PROJECT_ID**: IPFS Infura Project ID for file uploads.
- **INFURA_PROJECT_SECRET**: IPFS Infura Project Secret for file uploads.
- **META_PRIVATE**: Private metadata information.
- **NEXT_PUBLIC_WEB3_PROVIDER**: Public Web3 Provider URL.
- **APIKey**: API key for authentication.
- **APISecret**: API secret for authentication.
- **PINATA_JWT**: JWT token for Pinata.
- **NEXT_PUBLIC_GATEWAY_URL**: Public gateway URL.

Ensure to set these variables with appropriate values before running the project. Do not expose sensitive information like API keys and secrets publicly.

## Usage

1. Register as an educational institution, student, or employer.
2. Educational institutions can issue certificates to students.
3. Students can access and share their certificates with employers.
4. Employers can verify the authenticity of certificates.

## Technologies Used

- Ethereum Blockchain
- Solidity Smart Contracts
- React.js
- IPFS (InterPlanetary File System)
- MetaMask Wallet

## Contributing

Contributions are welcome! If you have any ideas for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

Special thanks to [List of contributors or any external libraries used].

