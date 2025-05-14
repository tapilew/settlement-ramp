// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SettlementRamp {
    address public immutable chainSettleNodeAddress;
    address public immutable chainlinkAutomationRegistry;

    event PaymentAttested(
        bytes32 indexed escrowId,
        address indexed payerSim,
        uint256 amountSim,
        uint256 timestamp,
        string txRefPayPalSim
    );
    event AttestationHandled(bytes32 indexed escrowId, uint256 timestamp);

    mapping(bytes32 => bool) public isAttestationHandled;

    constructor(
        address _chainSettleNodeAddress,
        address _chainlinkAutomationRegistry
    ) {
        chainSettleNodeAddress = _chainSettleNodeAddress;
        chainlinkAutomationRegistry = _chainlinkAutomationRegistry;
    }

    modifier onlyChainSettleNode() {
        require(msg.sender == chainSettleNodeAddress, "Caller is not ChainSettle node");
        _;
    }

    modifier onlyAutomationRegistry() {
        require(msg.sender == chainlinkAutomationRegistry, "Caller is not Automation Registry");
        _;
    }

    function attestPayment(
        bytes32 _escrowId,
        address _payerSim,
        uint256 _amountSim,
        string calldata _txRefPayPalSim,
        bytes calldata _signature
    ) external onlyChainSettleNode {
        bytes32 messageHash = keccak256(
            abi.encodePacked(_escrowId, _payerSim, _amountSim, _txRefPayPalSim)
        );
        bytes32 prefixedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address signer = recoverSigner(prefixedHash, _signature);
        require(signer == chainSettleNodeAddress, "Invalid signature from ChainSettle");

        emit PaymentAttested(
            _escrowId,
            _payerSim,
            _amountSim,
            block.timestamp,
            _txRefPayPalSim
        );
    }

    function handleAttestationEvent(bytes32 _escrowId) external onlyAutomationRegistry {
        require(!isAttestationHandled[_escrowId], "Attestation already handled");
        isAttestationHandled[_escrowId] = true;
        emit AttestationHandled(_escrowId, block.timestamp);
    }

    function recoverSigner(bytes32 _hash, bytes calldata _signature)
        internal
        pure
        returns (address)
    {
        bytes32 r;
        bytes32 s;
        uint8 v;

        if (_signature.length != 65) {
            return address(0);
        }

        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        if (v != 27 && v != 28) {
            return address(0);
        }

        return ecrecover(_hash, v, r, s);
    }
} 