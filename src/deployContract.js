console.clear()
// import './App.scss';
// const { data } = require("./data/newrlData.js");
// const contractBytecode = require("./../contracts/contracts_MultiSigWallet_sol_MultiSigWallet.bin")
const { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, PublicKey, AccountCreateTransaction, Hbar, TokenMintTransaction, TokenAssociateTransaction, AccountBalanceQuery, TransferTransaction, ContractCreateTransaction, FileCreateTransaction, ContractFunctionParameters, FileAppendTransaction } = require("@hashgraph/sdk");
// const { useEffect, useRef, useState } = require('react');
const fs = require("fs");
require("dotenv").config()
// const { HashConnectTypes, setUpHashConnectEvents } = require('hashconnect');



const deployContract = async () => {
    console.log("- Starting the deploy contract script")
    const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PV_KEY);
    const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
    const treasuryPvKey = PrivateKey.fromString(process.env.TREASURY_PV_KEY);
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    const bytecode = fs.readFileSync("contracts/contracts_MultiSigWallet_sol_MultiSigWallet.bin");
    const fileCreateTx = await new FileCreateTransaction()
        .setKeys([treasuryPvKey])
        .freezeWith(client);
    const fileCreateSign = await fileCreateTx.sign(treasuryPvKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRc = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRc.fileId;
    console.log("- Bytecode File Id", bytecodeFileId.toString())

    // Append contents to the file
    const fileAppendTx = new FileAppendTransaction()
        .setFileId(bytecodeFileId)
        .setContents(bytecode)
        .setMaxChunks(10)
        .freezeWith(client);
    const fileAppendSign = await fileAppendTx.sign(treasuryPvKey);
    const fileAppendSubmit = await fileAppendSign.execute(client);
    const fileAppendRc = await fileAppendSubmit.getReceipt(client);
    console.log("- File append transaction was", fileAppendRc.status.toString());

    const governorsAddressArray = [0x119F27a01F905715795a1Ee0e44B1E9d7599B929, 0x887B8Db66EA739Bccd75AC3C418Bf8C4184F27f3, 0x78230D336009BF761f4fBb2BE8f7Ce1411F11E98];

    const deployContractTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(3000000)
        .setConstructorParameters(new ContractFunctionParameters().addInt256Array(governorsAddressArray).addUint256(2));
    const deployContractSubmit = await deployContractTx.execute(client);
    const deployContractRc = await deployContractSubmit.getReceipt(client);

    const newContractId = deployContractRc.contractId;
    console.log("- Contract Id of the deployed contract is:", newContractId.toString())
}

deployContract()