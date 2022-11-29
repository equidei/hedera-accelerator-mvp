import './App.scss';
import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, PublicKey, AccountCreateTransaction, Hbar, TokenMintTransaction, TokenAssociateTransaction, AccountBalanceQuery, TransferTransaction, ContractCreateTransaction, FileCreateTransaction } from "@hashgraph/sdk";
import { useEffect, useRef, useState } from 'react';
import { HashConnect, HashConnectTypes, setUpHashConnectEvents } from 'hashconnect';

import fs from "fs"

import { data } from "./data/newrlData.js";

const deployContract = async () => {

    const operatorId = AccountId.fromString(process.env.REACT_APP_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.REACT_APP_OPERATOR_PV_KEY);
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);

    const bytecode = fs.readFileSync("./../contracts/contracts_UserLookup_sol_UserLookup.bin");
    const fileCreateTx = await new FileCreateTransaction()
        .setContents(bytecode)
        .execute(client);
    const fileCreateRc = await fileCreateTx.getReceipt(client)
    const bytecodeFileId = fileCreateRc.fileId;
    console.log(bytecodeFileId)

    const deployContractTx = await new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .
}

deployContract()