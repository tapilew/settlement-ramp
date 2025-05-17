// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {SettlementRamp} from "../src/SettlementRamp.sol";

contract DeployScript is Script {
    function run() public {
        // Cargar variables de entorno
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Iniciar broadcasting
        vm.startBroadcast(deployerPrivateKey);

        // Parámetros del constructor
        uint256 minPaymentAmount = 0.01 ether;  // 0.01 ETH
        uint256 maxPaymentAmount = 10 ether;    // 10 ETH
        
        // Direcciones de ChainSettle (estas son direcciones de ejemplo, necesitarás reemplazarlas con las correctas)
        address settlementRegistry = 0x0000000000000000000000000000000000000000;  // Reemplazar con la dirección correcta
        address chainSettleAttest = 0x0000000000000000000000000000000000000000;  // Reemplazar con la dirección correcta
        address chainSettleAttestNode = 0x0000000000000000000000000000000000000000;  // Reemplazar con la dirección correcta

        // Desplegar el contrato
        SettlementRamp settlementRamp = new SettlementRamp(
            minPaymentAmount,
            maxPaymentAmount,
            settlementRegistry,
            chainSettleAttest,
            chainSettleAttestNode
        );

        vm.stopBroadcast();

        // Imprimir la dirección del contrato desplegado
        console.log("SettlementRamp deployed at:", address(settlementRamp));
    }
} 