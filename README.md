# Chain Mood Tracker 🫧

FHEVM Chain Mood Tracker - Privacy-preserving mood recording DApp

[![License](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](LICENSE)

## 🌟 Overview

Chain Mood Tracker is a decentralized application built on **FHEVM** (Fully Homomorphic Encryption Virtual Machine) that allows users to record their daily moods with complete privacy. The app combines beautiful UI design with cutting-edge cryptography to create a truly private mood journaling experience.

**Live Demo**: [https://your-deployment-url.com](https://your-deployment-url.com)

## 🚀 Key Features

- **🔒 Privacy-First**: Uses FHEVM encryption to protect all user data on the blockchain
- **🎨 Beautiful UI**: Modern gradient design with responsive cards and smooth animations
- **📱 Dual Storage**: Combines blockchain persistence with local storage for optimal UX
- **📅 Daily Tracking**: Smart validation prevents duplicate daily mood entries
- **🌐 Multi-Network**: Supports Sepolia testnet and local Hardhat development
- **⚡ Static Export**: Ready for deployment to any static hosting service
- **🎯 User-Friendly**: Intuitive emoji selection and text input

## 🏗️ Architecture

### Smart Contracts (FHEVM)
- **MoodTracker.sol**: Main contract handling encrypted mood storage and validation
- **FHE Operations**: Uses euint8 for emoji indices and euint256 for message hashes
- **ACL Control**: Implements proper access control for encrypted data

### Frontend (Next.js + TypeScript)
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **FHEVM Integration**: @zama-fhe/relayer-sdk for blockchain interaction
- **State Management**: React hooks for mood tracking and UI state
- **Responsive Design**: Mobile-first approach with beautiful gradients

## 📦 Installation

### Prerequisites
- Node.js 18+
- MetaMask wallet
- Git

### Clone & Setup
```bash
git clone https://github.com/EmmanulVella/chain-mood-tracker.git
cd chain-mood-tracker

# Install frontend dependencies
cd frontend
npm install

# Install smart contract dependencies
cd ../fhevm-hardhat-template
npm install
```

### Local Development

1. **Start Hardhat Node**:
   ```bash
   cd fhevm-hardhat-template
   npx hardhat node --verbose
   ```

2. **Deploy Contracts** (in new terminal):
   ```bash
   cd fhevm-hardhat-template
   npx hardhat deploy --network localhost
   ```

3. **Start Frontend** (in new terminal):
   ```bash
   cd frontend
   npm run dev:mock
   ```

4. **Open Browser**: [http://localhost:3000](http://localhost:3000)

## 🛠️ Smart Contract Deployment

### Sepolia Testnet
```bash
cd fhevm-hardhat-template
npx hardhat vars set MNEMONIC
npx hardhat vars set INFURA_API_KEY
npx hardhat deploy --network sepolia
```

**Current Sepolia Deployment**: `0x5672D5C544D24256fA90885537E21215eeeB30F1`

## 📄 Static Deployment

The app supports static export for deployment to any hosting service:

```bash
cd frontend
npm run build
# Static files available in frontend/out/
```

### Supported Platforms
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Traditional web servers**

## 🎨 UI Screenshots

### Landing Page
Beautiful gradient background with mood tracking interface.

### Mood Recording
Emoji selection grid with text input and recording button.

### Mood History
Timeline view of recorded moods with encryption status indicators.

## 🔐 Privacy & Security

- **FHEVM Encryption**: All mood data encrypted on-chain
- **Zero-Knowledge**: Server cannot decrypt user data
- **Local Storage**: Combines blockchain security with local UX
- **Access Control**: Users control their own data access

## 🧪 Testing

### Smart Contract Tests
```bash
cd fhevm-hardhat-template
npx hardhat test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📚 Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama** for FHEVM technology
- **Hardhat** for Ethereum development tools
- **Next.js** for the React framework
- **Tailwind CSS** for utility-first CSS

## 📞 Contact

- **GitHub**: [EmmanulVella](https://github.com/EmmanulVella)
- **Project Link**: [https://github.com/EmmanulVella/chain-mood-tracker](https://github.com/EmmanulVella/chain-mood-tracker)

---

**Made with ❤️ and FHEVM**
