import dotenv from 'dotenv';
import express from 'express';
import { ethers } from 'ethers';
import axios from 'axios';

dotenv.config();

// load environment variables
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const COIN_API_URL = process.env.COIN_API_URL;

// initialize express server
const app = express();
app.use(express.json());

// ethereum provider and wallet
const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// smart contract ABI
const CONTRACT_ABI = [
    "function mintNFT(address recipient, string memory tokenURI) public",
    "function updateTokenURI(uint256 tokenId, string memory newTokenURI) public",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
    "function getTokenURI(uint256 tokenId) view returns (string)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

/// fetch all owned NFTs
async function getOwnedNFTs(walletAddress) {
    try {
        const ownedNFTs = [];
        
        // assuming we know the range of possible token IDs (in this case 0 to 49)
        for (let tokenId = 0; tokenId < 50; tokenId++) {
            try {
                const owner = await contract.ownerOf(tokenId);
                if (owner.toLowerCase() === walletAddress.toLowerCase()) {
                    ownedNFTs.push(tokenId);
                }
            } catch (error) {
                // skip if token doesn't exist or other errors
                continue;
            }
        }

        console.log(`Owned NFTs: ${ownedNFTs.join(', ')}`);
        return ownedNFTs;
    } catch (error) {
        console.error(`Error fetching owned NFTs: ${error.message}`);
        return [];
    }
}

/// check wallet and update metadata for each NFT
async function checkAndUpdateMetadata() {
    console.log('Checking and updating metadata for all owned NFTs...');

    try {
        // fetch ETH price
        const response = await axios.get(COIN_API_URL);
        const ethPrice = response.data.ethereum.usd;

        console.log(`Current ETH Price: $${ethPrice}`);

        // fetch wallet balance
        let balanceInEth;
        try {
            const balance = await provider.getBalance(WALLET_ADDRESS);
            if (!balance) {
                throw new Error("Wallet balance not found or invalid address.");
            }
            balanceInEth = ethers.formatEther(balance);
            console.log(`Wallet Balance: ${balanceInEth} ETH`);
        } catch (error) {
            console.error(`Failed to fetch wallet balance: ${error.message}`);
            return;
        }

        // fetch owned NFTs
        const ownedNFTs = await getOwnedNFTs(WALLET_ADDRESS);

        if (ownedNFTs.length === 0) {
            console.log("No NFTs owned. Exiting metadata update.");
            return;
        }

        // loop through NFTs and update metadata based on conditions
        for (const tokenId of ownedNFTs) {
            try {
                let currentURI = await contract.tokenURI(tokenId);
                
                // check if metadata NEEDS to be updated, otherwise gas fees will be spent to change metadata to the same thing
                if ((parseFloat(balanceInEth) < 1 || ethPrice < 2000) && 
                    currentURI !== `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}_tears.json`) {
                    
                    console.log(`⚠️ Condition met for Token ID: ${tokenId}. Updating metadata to tears...`);
                    updateMetadata(tokenId, `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}_tears.json`);

                } else if ((parseFloat(balanceInEth) > 2 || ethPrice > 3500) && currentURI !== `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}_blush.json`){
                
                    console.log(`⚠️ Condition met for Token ID: ${tokenId}. Updating metadata to blush...`); 
                    updateMetadata(tokenId, `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}_blush.json`);

                } else if ((2 < parseFloat(balanceInEth) > 1 || 3500 < ethPrice > 2000) && currentURI !== `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}.json`){
                    
                    console.log(`⚠️ Condition met for Token ID: ${tokenId}. Updating metadata to base...`); 
                    updateMetadata(tokenId, `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}.json`);

                } else {
                    console.log(`Token ID: ${tokenId} - No updates required.`);
                }
            } catch (error) {
                console.error(`Error processing Token ID ${tokenId}: ${error.message}`);
                continue;
            }
        }
    } catch (error) {
        console.error(`Error in checkAndUpdateMetadata: ${error.message}`);
    }
}

async function updateMetadata(tokenId, newURI) {
    // call smart contract to update metadata
    try {
        console.log(`Attempting to update Token ID: ${tokenId}`);
        const tx = await contract.updateTokenURI(
            tokenId,
            `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}_tears.json`
        );
        console.log(`Transaction Sent: ${tx.hash}`);
        await tx.wait();
        console.log(`Successfully updated Token ID: ${tokenId}`);
    } catch (error) {
        console.error(`Failed to update Token ID: ${tokenId}, Error: ${error.message}`);
    }
}

// function to mint NFT (pass in wallet address and tokenURI of desired metadata)
// after minting from backend, make sure to import the NFT to your wallet
async function mintNFT(walletAddress, tokenURI) {
    try {
        const tx = await contract.mintNFT(ethers.getAddress(walletAddress), tokenURI);
        console.log(`Transaction Sent: ${tx.hash}`);
        await tx.wait();
        console.log(`Successfully minted NFT`);
        return tx.hash;
    } catch (error) {
        console.error(`Failed to mint NFT: ${error.message}`);
        throw error; // Re-throw the error to handle it in the calling function if needed
    }
}

//mintNFT(WALLET_ADDRESS, URI);

// periodic check every 5 minutes
setInterval(checkAndUpdateMetadata, 5 * 60 * 1000);

// start the server
app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});

// initial metadata check on startup
checkAndUpdateMetadata();
