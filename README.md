# Dynamic NFT Backend

### Real-Time NFT Metadata Updates Based on Wallet Activity and Token Prices

This backend enables **Dynamic NFTs** to update their metadata in real-time based on wallet activity and token price triggers. Built with **Node.js**, **Ethers.js**, and **IPFS**, it bridges blockchain smart contracts with real-world data.

---

## **Key Features**

- **Dynamic Metadata Updates:** Real-time updates to NFT metadata based on token prices and wallet activity.
- **Smart Contract Integration:** Seamlessly interact with ERC-721 smart contracts.
- **Wallet Monitoring:** Tracks wallet balances and token prices dynamically.
- **IPFS Integration:** Metadata and image storage on IPFS.
- **Automated Updates:** Periodic metadata checks via schedulers.

---

## **Getting Started**

Ensure the contract you reference to deploy the NFTs has an updateTokenURI() method.

### **1. Installation**

Clone the repository:

```bash
git clone https://github.com/your-username/dynamic-nft-backend.git
cd dynamic-nft-backend
```

Install dependencies:

```
npm install
```

### 2. Configure Environment Variables
Create a .env file in the root directory:
```
INFURA_API_KEY=your_infura_api_key
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_contract_address
WALLET_ADDRESS=wallet_to_monitor
COIN_API_URL=https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd
```

Change rules (if statements from lines 99-113) accordingly based on what you want the dynamic NFT to change from.

Assuming your IPFS .json files have the tokenId somewhere in them, and are named 'nft_{tokenId}.json', change `ipfsData` value.

### 3. Run the Backend Server
Start the server locally:
```
node index.js
```

## How it Works
1. Fetch Data: The backend fetches wallet balances and token prices using APIs (e.g., CoinGecko).
2. Evaluate Conditions: Checks if predefined triggers are met (this implementation has: ETH price drop, low wallet balance).
3. Smart Contract Call: Calls the updateTokenURI function in the smart contract to update metadata.
4. Metadata Update: IPFS metadata and image links are updated dynamically.
5. Periodic Checks: Backend runs periodic updates.

## Contact
Twitter: @0xpoot_poot
Email: 0xpoot@gmail.com

## Customisation
- Update Token Conditions: Modify conditions in index.js for triggers (e.g. ETH price threshold).
- In case a reference for the project this was used with is needed, it can be found [here](https://github.com/0xpoot-poot/nft-generator)
- Also, the Solidity script responsible for the deployed contract for the NFT can be found [here](https://github.com/0xpoot-poot/basic-solidity-contracts/tree/main/DeployNFT/contracts)
- Update Frequency: Modify the interval for periodic checks (setInterval) in index.js.

## Minting pre-existing NFTs
In case you want to mine the NFTs of the collection I made (personally, I have only minted one), you can do so using the `mintNFT()` function that is unused in `index.js`. Ensure to pass in your wallet address and the following tokenURI format: `https://tan-labour-roundworm-161.mypinata.cloud/ipfs/bafybeib6j2ntpora67rfq4kekhrggjj6774ar2sox4yazotvcgqawfhm2i/nft_${tokenId}.json` where ${tokenId} ranges from 1 to 49.

Also, you will need to import the NFT to metamask when minting from the backend. For some reason it will not just appear in your wallet, make sure to click the "Import NFT" button and put in the tokenId and contract address: `0x58f960E4AA01b9EBE72A51b76A92162C04eD03D3`.
