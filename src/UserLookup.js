import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, PublicKey, AccountCreateTransaction, Hbar, TokenMintTransaction, TokenAssociateTransaction, AccountBalanceQuery, TransferTransaction, FileCreateTransaction, ContractCreateTransaction, ContractFunctionParameters, ContractCallQuery } from "@hashgraph/sdk";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();


const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PV_KEY);
const operatorId = AccountId.fromString(process.env.OPERATOR_ID);

const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

async function main() {

    // Balance query for the operator account
    const balanceQuery = await new AccountBalanceQuery()
        .setAccountId(operatorId)
        .execute(client);
    console.log("Balance of the operator account is:", balanceQuery.hbars.toString());

    // Importing and storing the bytecode in a variable
    const contractBytecode = fs.readFileSync("contracts/contracts_UserLookup_sol_UserLookup.bin")

    // Create a file on Hedera and store the bytecode
    const fileCreateTx = new FileCreateTransaction()
        .setContents(contractBytecode)
        .setKeys([operatorKey])
        .freezeWith(client);
    const fileCreateSign = await fileCreateTx.sign(operatorKey);
    const fileCreateSubmit = await fileCreateSign.execute(client);
    const fileCreateRx = await fileCreateSubmit.getReceipt(client);
    const bytecodeFileId = fileCreateRx.fileId;
    console.log(`- The bytecode file ID is: ${bytecodeFileId} \n`);

    console.log(`- Logging the file id: `, bytecodeFileId.toString());

    // Instantiate the Smart Contract
    const contractInstantiateTx = new ContractCreateTransaction()
        .setBytecodeFileId(bytecodeFileId)
        .setGas(100000)
        .setConstructorParameters(new ContractFunctionParameters().addString("Great").addString("0.0.48928778"));
    const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
    const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();  //Displaying the contractId as Solidity Contract Address
    console.log("- The contract Id is:", contractId)
    console.log("- The contract id in Solidity format is:", contractAddress)

    // Query the contract to check the state changes
    const contractQueryTx = new ContractCallQuery()
        .setContractId(contractId)
        .setGas(100000)
        .setFunction("getAccountNumber", new ContractFunctionParameters().addString("Raghav"))
        .setMaxQueryPayment(new Hbar(2));
    const contractQuerySubmit = await contractQueryTx.execute(client);
    const contractQueryResult = contractQuerySubmit.getString(0);
    console.log("- Here is the account number you asked for", contractQueryResult);

    // Query the contract to change a state variable






}

main();