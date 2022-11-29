import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, PublicKey, AccountCreateTransaction, Hbar, TokenMintTransaction, TokenAssociateTransaction, AccountBalanceQuery, TransferTransaction } from "@hashgraph/sdk";
// import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_PV_KEY);

const client = Client.forTestnet();
client.setOperator(operatorId, operatorKey);

// Generating a private key which will be treated as a "supply key"
const supplyKey = PrivateKey.generate();


async function main() {
    // Generating key pairs for treasury account
    const treasuryPvKey = PrivateKey.generateED25519();
    const treasuryPbKey = treasuryPvKey.publicKey;
    const treasuryAc = await new AccountCreateTransaction().setKey(treasuryPbKey).setInitialBalance(Hbar.fromTinybars(1000)).execute(client);

    const treasuryAccRx = await treasuryAc.getReceipt(client);
    const treasuryId = treasuryAccRx.accountId;
    console.log("1. This is Treasury's Account Id: ", treasuryId + ".");

    // Creating additional account for sending the first minted NFT
    const raghavPvKey = PrivateKey.generateED25519();
    const raghavPbKey = raghavPvKey.publicKey;
    const raghavAc = await new AccountCreateTransaction().setKey(raghavPbKey).setInitialBalance(Hbar.fromTinybars(1000)).execute(client);

    const raghavTxRx = await raghavAc.getReceipt(client);
    const raghavId = raghavTxRx.accountId;
    console.log(`2. This is Raghav's Account Id: `, raghavId + ".");

    // Creating the Token create transaction
    let createNft = new TokenCreateTransaction()
        .setTokenName("dei")
        .setTokenSymbol("DEI")
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(treasuryId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(99)
        .setSupplyKey(supplyKey)
        .freezeWith(client);

    // Sign with treasury 
    let createNftSign = await createNft.sign(treasuryPvKey);

    //Submitting the transaction to the Hedera network
    let nftCreateSubmit = await createNftSign.execute(client);

    // Get the transaction receipt
    let nftCreateReceipt = await nftCreateSubmit.getReceipt(client);

    // Get the token Id of the collection
    let tokenId = nftCreateReceipt.tokenId;

    // Logging the token Id
    console.log(`3. This is the token Id for created NFT collection : ` + tokenId);



    // MINTING A NFT

    //IPFS Content Identifier for which we'll create an NFT
    let CID = "ipfs://QmTzWcVfk88JRqjTpVwHzBeULRTNzHY7mnBSG42CpwHmPa";

    // Minting a new nft
    let mintTx = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([Buffer.from(CID)])
        .freezeWith(client);

    // Sign the transaction with the "supply key"
    let signTx = await mintTx.sign(supplyKey);

    // Submitting the transaction to the Hedera network
    let mintTxSubmit = await signTx.execute(client);
    let mintTxReceipt = await mintTxSubmit.getReceipt(client);

    console.log(`4. Created NFT ${tokenId} with the serial number: ${mintTxReceipt.serials[0].low} \n`)


    // Making an account a associate to the NFT
    // If an account isn't a treasury for the token ID, before they receive or send a token need to become an associate with the token
    // And to make an account a associate the owner account must sign the associate transaction
    // Also, if we have already set a automatic token association property then we don't need to associate a account before sending token to it.

    let associateTx = await new TokenAssociateTransaction()
        .setAccountId(raghavId)
        .setTokenIds([tokenId])
        .freezeWith(client)
        .sign(raghavPvKey);

    let associateTxSubmit = await associateTx.execute(client);
    let associateTxRc = await associateTxSubmit.getReceipt(client);

    console.log(`\n5. NFT association with Raghav's account is`, associateTxRc.status.toString() == "SUCCESS" ? associateTxRc.status.toString() + "FUL" : "FAILED")


    // Checking the balance of Treasury and Raghav BEFORE transfer
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryId).execute(client);
    console.log(`6. Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(raghavId).execute(client);
    console.log(`7. Raghav's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);


    // Transferring NFT from Treasury to Raghav
    // Token transfer requires a sign from treasury
    let tokenTransferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, 1, treasuryId, raghavId)
        .freezeWith(client)
        .sign(treasuryPvKey);

    let tokenTransferRc = await (await tokenTransferTx.execute(client)).getReceipt(client);
    console.log(`\n8. Token transfer to Raghav is ` + tokenTransferRc.status.toString());

    // Checking the balance after the token transfer
    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(treasuryId)
        .execute(client);
    console.log(`9. Treasury's balance after token transfer: `, balanceCheckTx.tokens._map.get(tokenId.toString()).low, `NFTs of tokenId ${tokenId}`)

    var balanceCheckTx = await new AccountBalanceQuery()
        .setAccountId(raghavId)
        .execute(client);
    console.log(`10. Raghav's balance after token transfer: `, balanceCheckTx.tokens._map.get(tokenId.toString()).low, `NFTs of tokenId ${tokenId}`)
}
main()
