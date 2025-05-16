// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Elimino la importación de forge-std/Test.sol
// import {Test, console2} from "forge-std/Test.sol";
import {SettlementRamp} from "../src/SettlementRamp.sol";

contract MockSettlementRegistry {
    mapping(bytes32 => bool) public isFinalized;
    
    function getSettlement(bytes32 settlementId) external view returns (
        address attester,
        uint256 timestamp,
        bool finalized
    ) {
        return (address(0), block.timestamp, isFinalized[settlementId]);
    }

    function setFinalized(bytes32 settlementId, bool finalized) external {
        isFinalized[settlementId] = finalized;
    }
}

contract MockChainSettleAttest {
    mapping(bytes32 => bool) public isValidAttestation;
    
    function verifyAttestation(bytes32 settlementId) external view returns (bool) {
        return isValidAttestation[settlementId];
    }

    function setValidAttestation(bytes32 settlementId, bool isValid) external {
        isValidAttestation[settlementId] = isValid;
    }
}

contract SettlementRampTest {
    SettlementRamp public settlementRamp;
    MockSettlementRegistry public mockRegistry;
    MockChainSettleAttest public mockAttest;
    address public owner;
    address public attester;
    address public payer;
    uint256 public minPaymentAmount;
    uint256 public maxPaymentAmount;

    function setUp() public {
        owner = address(0x1);
        attester = address(0x2);
        payer = address(0x3);
        minPaymentAmount = 1 ether;
        maxPaymentAmount = 100 ether;

        // Desplegar mocks
        mockRegistry = new MockSettlementRegistry();
        mockAttest = new MockChainSettleAttest();

        // Desplegar el contrato con el owner correcto
        settlementRamp = new SettlementRamp(
            minPaymentAmount,
            maxPaymentAmount,
            address(mockRegistry),
            address(mockAttest),
            address(0)
        );

        // Autorizar al attester
        settlementRamp.addAuthorizedAttester(attester);
    }

    function test_Initialization() public view {
        assert(settlementRamp.minPaymentAmount() == minPaymentAmount);
        assert(settlementRamp.maxPaymentAmount() == maxPaymentAmount);
        assert(settlementRamp.authorizedAttesters(attester));
    }

    function test_AttestPayment() public {
        bytes32 escrowId = keccak256(abi.encodePacked("test_escrow"));
        uint256 amount = 2 ether;
        string memory paypalTxId = "PAY-123456";

        // Configurar el mock para que la attestación sea válida
        mockAttest.setValidAttestation(escrowId, true);

        // Llamar a attestPayment desde el attester
        settlementRamp.attestPayment(escrowId, payer, amount, paypalTxId);

        (
            address storedPayer,
            uint256 storedAmount,
            bool isSettled,
            string memory storedPaypalTxId,
            ,
        ) = settlementRamp.getPaymentDetails(escrowId);

        assert(storedPayer == payer);
        assert(storedAmount == amount);
        assert(!isSettled);
        assert(keccak256(bytes(storedPaypalTxId)) == keccak256(bytes(paypalTxId)));
    }

    function test_AttestPayment_InvalidAttestation() public {
        bytes32 escrowId = keccak256(abi.encodePacked("test_escrow"));
        uint256 amount = 2 ether;
        string memory paypalTxId = "PAY-123456";

        // Configurar el mock para que la attestación sea inválida
        mockAttest.setValidAttestation(escrowId, false);

        // Intentar attestar el pago
        bool success = true;
        try settlementRamp.attestPayment(escrowId, payer, amount, paypalTxId) {
            success = true;
        } catch {
            success = false;
        }
        assert(!success);
    }

    function test_SettlePayment() public {
        bytes32 escrowId = keccak256(abi.encodePacked("test_escrow"));
        uint256 amount = 2 ether;
        string memory paypalTxId = "PAY-123456";

        // Configurar los mocks
        mockAttest.setValidAttestation(escrowId, true);
        mockRegistry.setFinalized(escrowId, true);

        // Primero attestamos el pago
        settlementRamp.attestPayment(escrowId, payer, amount, paypalTxId);
        
        // Luego lo asentamos
        settlementRamp.settlePayment(escrowId);

        (
            ,
            ,
            bool isSettled,
            ,
            ,
        ) = settlementRamp.getPaymentDetails(escrowId);

        assert(isSettled);
    }

    function test_SettlePayment_NotFinalized() public {
        bytes32 escrowId = keccak256(abi.encodePacked("test_escrow"));
        uint256 amount = 2 ether;
        string memory paypalTxId = "PAY-123456";

        // Configurar los mocks
        mockAttest.setValidAttestation(escrowId, true);
        mockRegistry.setFinalized(escrowId, false);

        // Primero attestamos el pago
        settlementRamp.attestPayment(escrowId, payer, amount, paypalTxId);
        
        // Intentar asentar el pago
        bool success = true;
        try settlementRamp.settlePayment(escrowId) {
            success = true;
        } catch {
            success = false;
        }
        assert(!success);
    }
} 