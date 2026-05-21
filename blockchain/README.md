# Bodim Blockchain (Hardhat)

This folder contains a minimal Hardhat setup and a simple `Escrow.sol` contract used to hold booking payments until the owner confirms the stay.

Commands:

```bash
cd blockchain
npm install
npx hardhat test
```

Contract: `contracts/Escrow.sol` — simple escrow with `createEscrow`, `confirmStay`, and `cancel`.
