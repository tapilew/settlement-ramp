// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./interfaces/AutomationCompatibleInterface.sol";

interface ISettlementRegistry {
    event Attested(bytes32 indexed settlementId, address indexed attester, uint256 timestamp);
    event SettlementFinalized(bytes32 indexed settlementId, uint256 timestamp);

    function getSettlement(bytes32 settlementId) external view returns (
        address attester,
        uint256 timestamp,
        bool isFinalized
    );
}

interface IChainSettleAttest {
    function verifyAttestation(bytes32 settlementId) external view returns (bool);
}

/**
 * @title SettlementRamp
 * @dev Contract to handle verified PayPal payments and their settlement on the blockchain
 */
contract SettlementRamp is Ownable, ReentrancyGuard, AutomationCompatibleInterface {
    // Eventos
    event PaymentAttested(
        bytes32 indexed escrowId,
        address indexed payer,
        uint256 amount,
        string paypalTxId
    );
    
    event PaymentSettled(bytes32 indexed escrowId);
    event AutomationTriggered(bytes32 indexed escrowId, bool success);

    // Estructuras
    struct Payment {
        address payer;
        uint256 amount;
        string paypalTxId;
        uint256 lastCheckTimestamp;
        uint256 checkCount;
    }

    // Variables de estado
    mapping(bytes32 => Payment) public payments;
    mapping(bytes32 => bool) public isSettled;
    mapping(address => bool) public authorizedAttesters;
    uint256 public minPaymentAmount;
    uint256 public maxPaymentAmount;
    uint256 public constant MAX_CHECK_COUNT = 10;
    uint256 public constant CHECK_INTERVAL = 1 hours;

    // Direcciones de ChainSettle
    ISettlementRegistry public immutable settlementRegistry;
    IChainSettleAttest public immutable chainSettleAttest;
    address public immutable chainSettleAttestNode;

    // Modificadores
    modifier onlyAuthorizedAttester() {
        require(authorizedAttesters[msg.sender], "Not authorized attester");
        _;
    }

    modifier validAmount(uint256 amount) {
        require(amount >= minPaymentAmount, "Amount too low");
        require(amount <= maxPaymentAmount, "Amount too high");
        _;
    }

    // Constructor
    constructor(
        uint256 _minPaymentAmount,
        uint256 _maxPaymentAmount,
        address _settlementRegistry,
        address _chainSettleAttest,
        address _chainSettleAttestNode
    ) {
        require(_minPaymentAmount < _maxPaymentAmount, "Invalid limits");
        minPaymentAmount = _minPaymentAmount;
        maxPaymentAmount = _maxPaymentAmount;
        authorizedAttesters[msg.sender] = true;
        
        settlementRegistry = ISettlementRegistry(_settlementRegistry);
        chainSettleAttest = IChainSettleAttest(_chainSettleAttest);
        chainSettleAttestNode = _chainSettleAttestNode;
    }

    /**
     * @dev Registra un pago verificado de PayPal a través de ChainSettle
     * @param escrowId ID único del escrow
     * @param payer Dirección del pagador
     * @param amount Monto del pago
     * @param paypalTxId ID de la transacción de PayPal
     */
    function attestPayment(
        bytes32 escrowId,
        address payer,
        uint256 amount,
        string calldata paypalTxId
    ) external onlyAuthorizedAttester validAmount(amount) {
        require(payments[escrowId].payer == address(0), "Payment already attested");
        
        // Verify ChainSettle attestation
        require(chainSettleAttest.verifyAttestation(escrowId), "Invalid ChainSettle attestation");
        
        payments[escrowId] = Payment({
            payer: payer,
            amount: amount,
            paypalTxId: paypalTxId,
            lastCheckTimestamp: block.timestamp,
            checkCount: 0
        });

        emit PaymentAttested(escrowId, payer, amount, paypalTxId);
    }

    /**
     * @dev Marca un pago como asentado
     * @param escrowId ID único del escrow
     */
    function settlePayment(bytes32 escrowId) external onlyAuthorizedAttester nonReentrant {
        require(payments[escrowId].payer != address(0), "Payment not found");
        require(!isSettled[escrowId], "Payment already settled");

        // Verify that the payment has been finalized in ChainSettle
        (,,bool isFinalized) = settlementRegistry.getSettlement(escrowId);
        require(isFinalized, "Payment not finalized in ChainSettle");

        isSettled[escrowId] = true;
        emit PaymentSettled(escrowId);
    }

    /**
     * @dev Obtiene los detalles de un pago
     * @param escrowId ID único del escrow
     */
    function getPaymentDetails(bytes32 escrowId) external view returns (
        address payer,
        uint256 amount,
        bool settled,
        string memory paypalTxId,
        uint256 lastCheckTimestamp,
        uint256 checkCount
    ) {
        Payment storage payment = payments[escrowId];
        return (
            payment.payer,
            payment.amount,
            isSettled[escrowId],
            payment.paypalTxId,
            payment.lastCheckTimestamp,
            payment.checkCount
        );
    }

    /**
     * @dev Función que Chainlink Automation llama para verificar si necesita ejecutar
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    ) external view override returns (bool upkeepNeeded, bytes memory /* performData */) {
        bytes32[] memory pendingPayments = _getPendingPayments();
        
        for (uint i = 0; i < pendingPayments.length; i++) {
            bytes32 escrowId = pendingPayments[i];
            Payment storage payment = payments[escrowId];
            
            if (_shouldCheckPayment(payment)) {
                return (true, abi.encode(escrowId));
            }
        }
        
        return (false, "");
    }

    /**
     * @dev Función que Chainlink Automation ejecuta
     */
    function performUpkeep(bytes calldata performData) external override {
        bytes32 escrowId = abi.decode(performData, (bytes32));
        Payment storage payment = payments[escrowId];
        
        require(_shouldCheckPayment(payment), "Payment not ready for check");
        
        // Verify that the payment has been finalized in ChainSettle
        (,,bool isFinalized) = settlementRegistry.getSettlement(escrowId);
        
        if (isFinalized) {
            isSettled[escrowId] = true;
            emit PaymentSettled(escrowId);
            emit AutomationTriggered(escrowId, true);
        } else {
            payment.lastCheckTimestamp = block.timestamp;
            payment.checkCount++;
            emit AutomationTriggered(escrowId, false);
        }
    }

    /**
     * @dev Función interna para obtener pagos pendientes
     */
    function _getPendingPayments() internal view returns (bytes32[] memory) {
        // Simplified implementation - in production, use a dynamic array
        bytes32[] memory pending = new bytes32[](100);
        uint256 count = 0;
        
        // Aquí iría la lógica para obtener los pagos pendientes
        // Por ahora retornamos un array vacío
        
        bytes32[] memory result = new bytes32[](count);
        for (uint i = 0; i < count; i++) {
            result[i] = pending[i];
        }
        
        return result;
    }

    /**
     * @dev Función interna para verificar si un pago debe ser verificado
     */
    function _shouldCheckPayment(Payment storage payment) internal view returns (bool) {
        return (
            payment.payer != address(0) &&
            payment.checkCount < MAX_CHECK_COUNT &&
            block.timestamp >= payment.lastCheckTimestamp + CHECK_INTERVAL
        );
    }

    // Funciones administrativas
    function addAuthorizedAttester(address attester) external onlyOwner {
        authorizedAttesters[attester] = true;
    }

    function removeAuthorizedAttester(address attester) external onlyOwner {
        authorizedAttesters[attester] = false;
    }

    function updatePaymentLimits(uint256 _minAmount, uint256 _maxAmount) external onlyOwner {
        require(_minAmount < _maxAmount, "Invalid limits");
        minPaymentAmount = _minAmount;
        maxPaymentAmount = _maxAmount;
    }
} 