# Settlement Ramp

**Automated On-Chain Settlement on Base Sepolia Triggered by Verified PayPal
Payments**

![Settlement Ramp Logo](https://utfs.io/f/IN4OjmY4wMHBmEE0RbSvpu9Wa06GPs5MZzXBNcr4EFIHfTox)

## The Problem: LATAM's Disconnected Financial Rails - The On-Ramp/Off-Ramp Nightmare

For countless freelancers, small to medium-sized businesses (SMBs), and
individuals across Latin America (LATAM), participating fully in the global
digital economy is a constant struggle. While international platforms like
**PayPal** are widely used to receive vital USD payments, users hit a wall when
trying to access or utilize these funds efficiently:

- **The "PayPal Prison":** USD arrives in PayPal, but getting it into local
  currency or, critically, into on-chain stablecoins like **USDC on Base**, is a
  labyrinth of high fees (often 10-15%+), crippling multi-day delays, and
  confusing processes.
- **Blocked Access:** This friction prevents easy on-ramping into DeFi,
  participation in global crypto commerce, and efficient treasury management for
  businesses operating with stablecoins.
- **Infrastructure Gaps:** Unlike regions with seamless options like Stripe,
  LATAM lacks modern, developer-friendly infrastructure to bridge traditional
  payment rails (especially international ones) with the on-chain world.

This isn't just inconvenient; it's a major barrier to economic empowerment,
trapping value and hindering growth for a massive, digitally-savvy population.

## The Vision: Equilibrio - Seamlessly Connecting LATAM Payments to the On-Chain World

This friction disappears with **Equilibrio**, a project that allows LATAM users
to accept payments via their **local methods (Yappy, PSE, Nequi, etc.) OR
international platforms like PayPal**, and see those funds **automatically
reflected or converted to USDC on Base**, ready to plug into any app, DAO, or
DeFi protocol instantly.

## Settlement Ramp: Building the Core Engine for Equilibrio (Base Sepolia)

To realize this vision, robust underlying infrastructure is essential. For this
Base Batches project (Stablecoins Track), we are building and demonstrating
**Settlement Ramp**, the **critical core engine** that makes such seamless
integration possible.

Settlement Ramp is the **secure, automated bridge** connecting verified
off-chain payment confirmations to programmable actions on Base. Our
implementation uses the **ChainSettle oracle system (deployed on Akash)** to
attest to a **payment confirmation received directly within the PayPal Sandbox
environment**, simulating a common international payment scenario for LATAM
users and validating the trust-minimized, automated pipeline from an off-chain
payment confirmation to an actionable on-chain event.

**Why This Implementation is Crucial for Equilibrio & Fintechs:**

This Settlement Ramp implementation provides the **validated foundational
layer** that Equilibrio and other fintechs and exchanges can build upon to
offer:

- Automated USDC on-ramps from PayPal (and eventually other sources).
- Significantly reduced friction and costs for LATAM users accessing the
  on-chain economy.
- Programmable financial workflows triggered directly by real-world payments on
  Base.

## Technical Architecture: A Lean, Focused Bridge (Base Sepolia)

Our architecture is streamlined to showcase the core E2E flow, leveraging
ChainSettle's capabilities:

1. **ChainSettle Node (Akash - PayPal Sandbox Integration)**:
   - Integrates directly with the **PayPal Sandbox API** to monitor a configured
     recipient email address for payment confirmations.
   - Upon detecting a payment, ChainSettle verifies it and **generates a
     cryptographic attestation (a signed proof)** containing key payment
     details.
   - The ChainSettle node then **initiates an on-chain transaction**, calling
     the `SettlementRamp` contract on Base Sepolia with this signed proof.
2. **Settlement Ramp Contract (Base Sepolia)**:
   - A lean smart contract on Base Sepolia acting as the **on-chain verifier and
     event emitter.**
   - Its `attestPayment` function receives the signed proof from the trusted
     ChainSettle node address (enforced by a modifier) and **verifies the
     signature using `ecrecover`**. This confirms the attestation's authenticity
     as originating from ChainSettle.
   - If valid, it emits `PaymentAttested`, making the verified off-chain event
     available for on-chain automation.
   - Includes `handleAttestationEvent` triggered _only_ by Chainlink Automation.
3. **Chainlink Automation (Event Listener & Trigger - Base Sepolia)**:
   - Provides the decentralized, reliable mechanism to react to the
     `PaymentAttested` event.
   - An Upkeep registered on the Chainlink Automation network for Base Sepolia
     monitors the `SettlementRamp` contract.
   - Automatically calls `handleAttestationEvent` upon detection of the
     `PaymentAttested` event.
4. **Minimal UI (React/Vite/Tailwind)**:
   - A simple UI allows users to understand the flow. It provides instructions
     on how to trigger a payment in the PayPal Sandbox (to the email monitored
     by ChainSettle).
   - It then connects to Base Sepolia (via wagmi/viem) to listen for the final
     `AttestationHandled` event and display confirmation.
   - **The trigger is the PayPal Sandbox payment itself, detected by
     ChainSettle.** The UI serves to guide the user and observe the result.

```mermaid
sequenceDiagram
    participant PayPal_Sandbox as PayPal Sandbox API
    participant ChainSettle as ChainSettle Node (Akash - Monitors PayPal, Sends Tx)
    participant Base_Contract as Settlement Ramp Contract (Base Sepolia - Verifies & Emits)
    participant CL_Automation as Chainlink Automation (Base Sepolia - Reacts)
    participant UI as Minimal UI (React - Observes & Guides)

    Note over PayPal_Sandbox, ChainSettle: Off-Chain Payment & Detection
    User->>PayPal_Sandbox: Makes payment to monitored email (guided by UI)
    PayPal_Sandbox-->>ChainSettle: Payment notification detected

    Note over ChainSettle, Base_Contract: On-Chain Attestation by ChainSettle
    ChainSettle->>ChainSettle: Verify PayPal payment, Generate signed proof
    ChainSettle->>Base_Contract: Call attestPayment(signedProof) on Base Sepolia

    Note over Base_Contract, CL_Automation: On-Chain Event & Automation
    Base_Contract->>Base_Contract: Verify signature (ecrecover), Emit PaymentAttested Event
    CL_Automation->>Base_Contract: Detect Event & Trigger handleAttestationEvent()
    Base_Contract->>Base_Contract: Emit AttestationHandled Event

    Note over Base_Contract, UI: Final Confirmation
    Base_Contract-->>UI: AttestationHandled Event Detected
    UI->>UI: Update Status Display
```

## Security Model: Focused on Implementation Integrity

1. **Attestation Origin (ChainSettle on Akash):** ChainSettle's integration with
   PayPal Sandbox and its private key for signing ensure the attestation
   originates from a controlled source reflecting a (Sandbox) payment.
2. **On-Chain Signature Verification (`ecrecover`):** The `SettlementRamp`
   contract cryptographically verifies that the attestation was indeed signed by
   the known ChainSettle node, ensuring authenticity of the data submitted
   on-chain.
3. **Authorized Callers:** The contract uses modifiers to ensure `attestPayment`
   is only callable by the ChainSettle node and `handleAttestationEvent` only by
   the Chainlink Automation Registry.
4. **Decentralized Event Reaction (Chainlink Automation):** Provides a reliable
   and tamper-resistant way to act upon the verified on-chain event.

## Implementation Highlights (Base Sepolia)

### 1. ChainSettle Node (Akash) - PayPal Sandbox Integration & Tx Submission

- Configured with PayPal Sandbox API credentials to monitor a specific recipient
  email.
- Upon detecting a payment, it constructs a message with payment details (e.g.,
  `escrowId`, amount, PayPal `txRef`), signs it using its private key (EIP-191
  standard recommended), and then uses a library (like `web3.py` or `viem`) to
  send a raw transaction calling `attestPayment(...)` with all necessary
  arguments (including the signature) on the Base Sepolia contract.

### 2. Settlement Ramp Contract (Base Sepolia) - Signature Verification

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SettlementRamp {
    address public immutable chainSettleNodeAddress; // Authorized attester from Akash
    address public immutable chainlinkAutomationRegistry; // Base Sepolia Automation Registry

    event PaymentAttested(bytes32 indexed escrowId, address indexed payerSim, uint256 amountSim, uint256 timestamp, string txRefPayPalSim);
    event AttestationHandled(bytes32 indexed escrowId, uint256 timestamp);

    mapping(bytes32 => bool) public isAttestationHandled;

    constructor(address _chainSettleNodeAddress, address _chainlinkAutomationRegistry_baseSepolia) {
        chainSettleNodeAddress = _chainSettleNodeAddress; // Wallet address ChainSettle uses to send tx
        chainlinkAutomationRegistry = _chainlinkAutomationRegistry_baseSepolia;
    }

    modifier onlyChainSettleNode() {
        require(msg.sender == chainSettleNodeAddress, "Caller is not ChainSettle node");
        _;
    }

    modifier onlyAutomationRegistry() {
        require(msg.sender == chainlinkAutomationRegistry, "Caller is not Automation Registry");
        _;
    }

    // Called directly by the ChainSettle node on Akash
    function attestPayment(
        bytes32 _escrowId,         // Unique ID for the attestation
        address _payerSim,         // Simulated payer address from PayPal data
        uint256 _amountSim,        // Amount from PayPal data
        string calldata _txRefPayPalSim, // PayPal Transaction ID
        bytes calldata _signature      // Signature from ChainSettle node over hash of other params
    ) external onlyChainSettleNode {
        // Reconstruct the message hash exactly as ChainSettle signed it
        bytes32 messageHash = keccak256(abi.encodePacked(_escrowId, _payerSim, _amountSim, _txRefPayPalSim));
        // Apply EIP-191 prefix: "\x19Ethereum Signed Message:\n" + message length (32 bytes for hash)
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        // Verify the signature against the hash and the known ChainSettle node address
        address signer = recoverSigner(prefixedHash, _signature);
        require(signer == chainSettleNodeAddress, "Invalid signature from ChainSettle");

        // If signature is valid, emit the event
        emit PaymentAttested(_escrowId, _payerSim, _amountSim, block.timestamp, _txRefPayPalSim);
    }

    // Called by Chainlink Automation on Base Sepolia
    function handleAttestationEvent(bytes32 _escrowId) external onlyAutomationRegistry {
        require(!isAttestationHandled[_escrowId], "Attestation already handled");
        isAttestationHandled[_escrowId] = true;
        // Minimal action for MVP: emit event. Future: trigger USDC settlement.
        emit AttestationHandled(_escrowId, block.timestamp);
    }

    // Helper function to recover signer address from signature
    function recoverSigner(bytes32 _hash, bytes calldata _signature)
        internal pure returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;
        // Check signature length (must be 65 bytes)
        if (_signature.length != 65) {
            return address(0);
        }
        // Extract signature components (r, s, v)
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96))) // Use 96 for v if r,s are 32 bytes each
        }
        // Adjust v value for older Ledger signing standard if necessary (usually 27 or 28)
        if (v < 27) {
            v += 27;
        }
        // Ensure v is either 27 or 28
        if (v != 27 && v != 28) {
            return address(0);
        }
        // Use ecrecover precompile to recover the signer's address
        return ecrecover(_hash, v, r, s);
    }
}
```

### 3. Chainlink Automation Upkeep Configuration (Base Sepolia)

- **Trigger:** Event `PaymentAttested(bytes32,address,uint256,uint256,string)`
- **Target:** `SettlementRamp` contract address on Base Sepolia.
- **Action:** Call `handleAttestationEvent(bytes32)`, mapping `escrowId` from
  event.

### 4. Minimal UI (React/Vite/Tailwind)

- Provides instructions: "1. Send payment via PayPal Sandbox to
  `[monitored_email]`. 2. Wait for confirmation below."
- Connects wallet (wagmi/RainbowKit for Base Sepolia).
- Listens for `AttestationHandled` event using `viem watchContractEvent` on Base
  Sepolia.
- Displays status: "Waiting for PayPal Sandbox Payment..." -> "Payment Attested
  on Base Sepolia, Awaiting Automation..." -> "Attestation Handled! Tx:
  [SepoliaScan link]".

## Technical Stack

- **Smart Contracts**: Solidity, Foundry
- **Frontend**: React, Vite, Tailwind CSS
- **Web3 Integration**: wagmi (React hooks for Ethereum), viem (TypeScript
  Ethereum library)
- **Automation**: Chainlink Automation (Event-Based Trigger)
- **Oracle**: ChainSettle (deployed on Akash)
- **Testnet**: Base Sepolia

## Getting Started (for Base Sepolia)

### Prerequisites

- **ChainSettle Node (on Akash):**
  - Running instance configured with **PayPal Sandbox API credentials**.
  - Monitors a specific **PayPal Sandbox recipient email address**.
  - Wallet funded with **Base Sepolia ETH** to send `attestPayment`
    transactions. Note this wallet's address (`chainSettleNodeAddress`).
- **PayPal Sandbox Account:** To send test payments to the monitored email.
- **Chainlink Automation Upkeep (Base Sepolia):** Registered and funded with
  LINK for event-based triggering.
- **Base Sepolia Account:** Wallet with private key for deploying the contract.
- **Development Tools:**
  - pnpm (package manager)
  - Foundry (for smart contract development)
  - Node.js (for frontend development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tapilew/equilibrio-alpha.git
   cd equilibrio-alpha
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Deployment Steps (All for Base Sepolia)

1. **Deploy & Configure ChainSettle Node to Akash:**
   - Implement PayPal Sandbox monitoring and transaction submission logic
     (signing message, sending raw tx).
   - Note the Base Sepolia wallet address the node uses
     (`chainSettleNodeAddress`).
2. **Deploy Settlement Ramp Contract to Base Sepolia:**
   - Update constructor arguments in deployment script
     (`scripts/DeploySettlementRamp.s.sol`) with the `chainSettleNodeAddress`
     and the correct **Chainlink Automation Registry address for Base Sepolia**.
   - Set `DEPLOYER_PRIVATE_KEY` and `BASE_SEPOLIA_RPC_URL` in `.env`.
   - Run:
     ```bash
     pnpm forge script scripts/DeploySettlementRamp.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC_URL --private-key $DEPLOYER_PRIVATE_KEY --broadcast --verify --verifier basescan --verifier-url https://api-sepolia.basescan.org/api
     ```
   - Note deployed contract address.
3. **Register Chainlink Automation Upkeep (Base Sepolia):**
   - Use Chainlink Automation App for Base Sepolia
   - Configure Event trigger for `PaymentAttested` on your contract
   - Map the `escrowId` from the event to the `handleAttestationEvent` function
     parameter
   - Fund the upkeep with LINK tokens
4. **Run UI:**
   - Configure UI (`.env` with Base Sepolia contract address and RPC URL)
   - Start development server:
     ```bash
     pnpm dev
     ```

### Running the Automated Flow (on Base Sepolia)

1. **Make a PayPal Sandbox Payment:** Send payment to the email monitored by
   ChainSettle. Note any reference ID.
2. **Observe ChainSettle:** Node detects payment, verifies, signs, and sends
   transaction calling `attestPayment` on Base Sepolia.
3. **Monitor Base Sepolia Scan & UI:**
   - Transaction from ChainSettle node calling `attestPayment`.
   - `PaymentAttested` event.
   - Chainlink Automation Upkeep triggers on event detection.
   - Transaction from Automation Registry calling `handleAttestationEvent`.
   - `AttestationHandled` event.
   - UI updates status to "Attestation Handled!" with transaction link.

## Demo & Validation (Base Sepolia)

- **Proof:** Successful E2E execution via **Base Sepolia Explorer**
  (`https://sepolia.base.org/`) links for all on-chain steps.
- **Video:** [Watch the 1-2 minute demo video](https://example.com)
  _(Placeholder - shows PayPal Sandbox payment -> automated Base Sepolia flow ->
  UI update)_

## Future Roadmap (Building Towards Equilibrio & Beyond)

This Settlement Ramp implementation proves the core automated bridge from PayPal
Sandbox to Base Sepolia. The future roadmap, building towards the full
Equilibrio vision and solving the LATAM on-ramp/off-ramp challenge, includes:

- **Live PayPal & Broader API Integration:** Transition ChainSettle to use live
  PayPal APIs and integrate with APIs for **actual LATAM local payment methods
  (Yappy, PSE, Nequi, etc.)** as they become accessible or explore alternative
  verification methods.
- **Direct USDC Conversion & Settlement:** Implement logic within
  `handleAttestationEvent` (or a subsequent contract called by it) to perform
  **automated conversion/transfer of USDC** on Base (mainnet).
- **Building for Fintechs & Exchanges:** Develop SDKs and clear integration
  paths for other financial services to leverage this core bridging
  infrastructure.
- **Expanding Off-Ramp Capabilities:** Architecting the reverse flow (on-chain
  event -> off-chain fiat payout attestation) for seamless off-ramping.
- **Enhanced Data & Security:** Robust parsing of payment data, comprehensive
  error handling, and production-grade security.

## Acknowledgments

- This project, **Settlement Ramp**, heavily features and showcases the
  **ChainSettle oracle system**
  ([GitHub](https://github.com/BrandynHamilton/chainsettle)) by Brandyn
  Hamilton, deployed on **Akash Network**, as the core technology for off-chain
  event attestation and on-chain transaction initiation.
- Utilizes **Chainlink Automation** for reliable on-chain event triggering on
  **Base Sepolia**.
- Built on **Base Sepolia** for the Base Batches Buildathon (Stablecoins Track).
- Leverages **PayPal Sandbox** for realistic off-chain payment event
  demonstration.
- Part of the broader **Equilibrio** ecosystem
  ([GitHub](https://github.com/tapilew/equilibrio-alpha)) focused on building
  composable financial infrastructure for LATAM.
