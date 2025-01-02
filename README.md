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

## Customisation
- Update Token Conditions: Modify conditions in index.js for triggers (e.g. ETH price threshold).
- Metadata Templates: Adjust metadata in /metadata.
- Image Layers: Add or edit image layers in /layers.
- Update Frequency: Modify the interval for periodic checks (setInterval) in index.js.
