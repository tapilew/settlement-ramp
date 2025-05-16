# Settlement Ramp

**Bridge PayPal Payments to On-Chain Settlements on Base Sepolia**

![Settlement Ramp Logo](https://utfs.io/f/IN4OjmY4wMHBmEE0RbSvpu9Wa06GPs5MZzXBNcr4EFIHfTox)

## Overview

Settlement Ramp addresses a critical challenge in Latin America: the high fees,
delays, and complexities when converting PayPal USD payments to local currency
or on-chain stablecoins. This friction blocks access to DeFi, global crypto
commerce, and efficient treasury management.

Built for the Base Batches Hackathon (Stablecoins Track), Settlement Ramp is the
foundation for **Equilibrio** – an open platform connecting LATAM's payment
rails with the on-chain world, with plans to support protocols like
[x402](https://www.x402.org/).

## Architecture

Settlement Ramp bridges off-chain payments with on-chain settlements through:

```mermaid
graph TD
    A[User] -->|Initiates Payment| B[PayPal]
    B -->|Payment Verification| C[Backend Service]
    C -->|Register Settlement| D[ChainSettle Oracle]
    D -->|Attestation| E[Smart Contract]
    E -->|Settlement| F[Blockchain]
    
    subgraph "Off-Chain Components"
        B
        C
    end
    
    subgraph "On-Chain Components"
        D
        E
        F
    end
```

The system operates in three key stages:

1. **Off-Chain Trigger:** PayPal Sandbox payment detected by ChainSettle oracle
   (Akash)
2. **On-Chain Verification:** ChainSettle submits signed attestation to the
   smart contract
3. **Automated Settlement:** Contract verification triggers Chainlink Automation

## Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant P as PayPal
    participant B as Backend
    participant C as ChainSettle
    participant S as Smart Contract
    
    U->>P: Initiate Payment
    P->>B: Payment Notification
    B->>C: Register Settlement
    C->>B: Settlement ID
    B->>C: Initiate Attestation
    C->>S: Verify Attestation
    S->>S: Process Settlement
    S->>U: Settlement Complete
```

## Core Components

### Smart Contracts (Foundry)

The modular contract architecture includes:

#### Core Components

- **SettlementRamp.sol**: Main contract for settlement logic
  - Inherits `Ownable` and `ReentrancyGuard` for security
  - Implements `AutomationCompatibleInterface` for Chainlink integration
  - Manages payment lifecycle from attestation to settlement

#### Interfaces

- **ISettlementRegistry**: ChainSettle oracle interaction
- **IChainSettleAttest**: Attestation verification
- **AutomationCompatibleInterface**: Chainlink Automation integration

#### Security Features

- Authorized attesters access control
- Payment amount validation and limits
- Reentrancy protection
- Automated settlement verification
- Configurable check intervals and retry limits

### Backend Services (FastAPI)

- **Core Services**:
  - `ChainSettleService`: Settlement registration and attestation
  - `PayPalService`: Payment verification
  - `BlockchainService`: Blockchain interactions
- **Key API Endpoints**:
  - `POST /api/settlements/register`: Register new settlement
  - `POST /api/settlements/{settlement_id}/attest`: Initiate attestation
  - `GET /api/settlements/{settlement_id}/status`: Check status
  - `GET /api/settlements/{settlement_id}/activity`: Monitor activity
- **Features**:
  - Environment-based configuration
  - Settlement monitoring with configurable intervals
  - Error handling with HTTP exceptions
  - Optional email notifications
  - Metadata support

### Frontend (React/Vite)

- Built with create-wagmi template and OnchainKit
- Wallet connection and contract event monitoring
- Payment initiation and transaction status UI

## Project Structure

```
settlement-ramp/
├── backend/                 # FastAPI service
│   ├── src/                 # Source code
│   └── tests/               # Unit tests
├── contracts/               # Solidity contracts
│   ├── src/                 # Contract code
│   ├── test/                # Tests
│   └── script/              # Deployment scripts
└── frontend/                # React/Vite frontend
    ├── src/                 # Source code
    └── public/              # Static assets
```

## Configuration

### Environment Variables

```bash
# Base Sepolia Configuration
BASE_SEPOLIA_RPC_URL=
SETTLEMENT_RAMP_CONTRACT_ADDRESS=
SETTLEMENT_REGISTRY_ADDRESS=

# ChainSettle Configuration
CHAINSETTLE_API_URL=
CHAINSETTLE_AKASH_URL=

# PayPal Configuration
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=

# Security
PRIVATE_KEY=

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
```

## Security Considerations

1. Private key management
2. API key security
3. Smart contract security
4. Oracle verification
5. Payment validation

## Deployment

### Smart Contract Deployment

1. Compile contracts using Forge
2. Deploy to Base Sepolia
3. Verify contract on Basescan
4. Update environment variables

### Backend Deployment

1. Set up Python 3.8+ environment
2. Install dependencies from requirements.txt
3. Configure environment variables
4. Start application with uvicorn

## Testing

### Smart Contract Tests

```bash
forge test
```

### Backend Tests

```bash
pytest
```

## Getting Started

### Prerequisites

- **ChainSettle Node (Akash):** Configured with PayPal Sandbox API credentials
- **PayPal Sandbox Account:** For test payments
- **Chainlink Automation (Base Sepolia):** LINK-funded upkeep
- **Base Sepolia Account:** For contract deployment
- **Development Tools:** pnpm, Foundry, Node.js

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tapilew/settlement-ramp.git
   cd settlement-ramp
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Deployment Steps

1. **Deploy ChainSettle Node to Akash**
2. **Deploy Settlement Ramp Contract to Base Sepolia**:
   ```bash
   pnpm forge script scripts/DeploySettlementRamp.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify --verifier basescan --verifier-url https://api-sepolia.basescan.org/api
   ```
3. **Configure Chainlink Automation** for the `PaymentAttested` event
4. **Run UI**: `pnpm dev`

## Future Roadmap

The broader Equilibrio vision includes:

- **Live & Localized Payments:** PayPal APIs and LATAM payment methods
- **Full USDC Settlement:** Automated settlement on Base mainnet
- **Fintech & Exchange Integration:** SDKs and third-party tools
- **Off-Ramp Capabilities:** Fiat payout flows
- **Protocol Enhancements:** x402 protocol integration
- **Enhanced UX:** OnchainKit components and Basenames integration
- **Production Readiness:** Robust error handling and security audits

## Acknowledgments

- **ChainSettle oracle system**
  ([GitHub](https://github.com/BrandynHamilton/chainsettle)) by Brandyn Hamilton
- **Chainlink Automation** for on-chain event triggering
- **Base Sepolia** for the underlying blockchain infrastructure
- **Equilibrio ecosystem**
  ([GitHub](https://github.com/tapilew/equilibrio-alpha)) for LATAM financial
  infrastructure
