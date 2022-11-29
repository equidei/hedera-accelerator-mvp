import { AccountId, Client, PrivateKey, TokenAssociateTransaction, TokenCreateTransaction, TokenSupplyType, TokenType, TransferTransaction } from "@hashgraph/sdk";
import { useRef, useState } from "react";
import { ColorRing } from "react-loader-spinner"

const CreateAndTransfer = () => {
    const tokenAmountRef = useRef();
    const associateIdRef = useRef()
    const associateKeyRef = useRef()
    const transferTokenNoRef = useRef();
    const transferMsmeIdRef = useRef();



    const [transferLoading, setTransferLoading] = useState(false)
    // const [treasuryId, setTreasuryId] = useState()
    // const [treasuryPvKey, setTreasuryPvKey] = useState()
    // const [treasuryPbKey, setTreasuryPbKey] = useState()

    const [createTokenTx, setCreateTokenTx] = useState()
    const [createTokenStatus, setCreateTokenStatus] = useState();
    const [tokenId, setTokenId] = useState();


    const [associateLoading, setAssociateLoading] = useState(false)
    const [createTokenLoading, setCreateTokenLoading] = useState(false)






    const operatorId = AccountId.fromString(process.env.REACT_APP_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.REACT_APP_OPERATOR_PV_KEY);
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);
    console.log(operatorId, operatorKey)

    // Generating a private key which will be treated as a "supply key"
    const supplyKey = PrivateKey.generate();

    const treasuryPvKey = PrivateKey.fromString(process.env.REACT_APP_TREASURY_PV_KEY);
    const treasuryPbKey = treasuryPvKey.publicKey;
    const treasuryId = AccountId.fromString(process.env.REACT_APP_TREASURY_ID);


    const associateAccount = async () => {
        // await createMsmeAc();
        setAssociateLoading(true);
        // console.log("This is the msme account Id:", msmeId.toString())
        // TOKEN ASSOCIATION WITH MSME/INVESTOR/TRUST ACCOUNT
        // const msmePvKey = PrivateKey.fromString(process.env.REACT_APP_MSME_PV_KEY);

        const msmePvKey = PrivateKey.fromString(associateKeyRef.current.value);
        console.log("Account to be associate with Id:", msmePvKey)

        // setTimeout(async () => {
        // console.log("Account to be associate with Id:", msmeId.toString())
        // const msmePvKey = "302e020100300506032b6570042204203a40bcb102637f939a870dfaede68fa202d6cea421694b6dcc75dac8ce44aa21";
        let associateTx = await new TokenAssociateTransaction()
            .setAccountId(associateIdRef.current.value)
            .setTokenIds([tokenId])
            .freezeWith(client)
            .sign(msmePvKey);

        let associateTxSubmit = await associateTx.execute(client);
        console.log("Associate Account Submit Transaction:", associateTxSubmit)
        let associateRc = await associateTxSubmit.getReceipt(client);
        console.log("Associate Account Transaction Receipt:", associateRc);
        console.log(`- Token association with Msme's account having account Id ${associateIdRef.current.value} is ${associateRc.status.toString()}  \n`);
        // }, 5000);
        setAssociateLoading(false);
    }


    const createToken = async () => {
        setTransferLoading(true);
        try {
            const createTokenTx = new TokenCreateTransaction()
                .setTokenName("Example")
                .setTokenSymbol("EXPL")
                .setTokenType(TokenType.FungibleCommon)
                .setDecimals(0)
                .setInitialSupply(tokenAmountRef.current.value)
                .setTreasuryAccountId(treasuryId)
                .setSupplyType(TokenSupplyType.Finite)
                .setMaxSupply(tokenAmountRef.current.value)
                .setSupplyKey(supplyKey)
                .freezeWith(client);
            setCreateTokenTx(createTokenTx)
            console.log("CreateTokenTx", createTokenTx)
            const createTokenSign = await createTokenTx.sign(treasuryPvKey);
            const createTokenSubmit = await createTokenSign.execute(client)
            const createTokenRc = await createTokenSubmit.getReceipt(client);
            console.log(createTokenRc)
            setCreateTokenStatus(createTokenRc.status.toString())
            const tokenId = createTokenRc.tokenId;
            console.log("Token created with: ", tokenId.toString(), "tokenId");
            setTokenId(tokenId);
            setTransferLoading(false);
        } catch (err) {
            console.log(err)
        }
    }

    const transferToken = async () => {
        console.log("This is the msme account Id:", associateIdRef.current.value)

        // TRANSFER STABLECOIN FROM TREASURY TO MSME/INVESTOR/TRUST
        let tokenTransferTx = await new TransferTransaction()
            .addTokenTransfer(tokenId, treasuryId, -(transferTokenNoRef.current.value))
            .addTokenTransfer(tokenId, transferMsmeIdRef.current.value, transferTokenNoRef.current.value)
            .freezeWith(client)
            .sign(treasuryPvKey);
        console.log("- This is tokenId ", tokenId.toString(), " This is Treasury Id: ", treasuryId.toString(), "This is msmeId: ", associateIdRef.current.value.toString(), "This is treasuryPvKey", treasuryPvKey.toString(), "\n");
        console.log("- This is the number of token to be transferred: ", transferTokenNoRef.current.value)
        let tokenTransferSubmit = await tokenTransferTx.execute(client);
        let tokenTransferRx = await tokenTransferSubmit.getReceipt(client);
        console.log(`\n- Stablecoin with collection Id ${tokenId} transfer from Treasury to Msme: ${tokenTransferRx.status} \n`);
    }

    return (
        <>
            {/* <div className='clientTreasury'>
                <div className="createClient mt-[1rem]">
                    <h3>Create Client </h3>
                    <button className='button__primary button__third' onClick={createClient}>Create Client</button>
                </div>
                <div className="createTreasury">
                    <h3>Create Treasury</h3>
                    <button className='button__primary button__third' onClick={createTreasury}>Create Treasury Account</button>
                </div>
            </div> */}

            <div className='createAndTransfer'>
                <div className="createAndTransferWrapper">
                    <h2>TOKENIZE THE ASSET AND TRANSFER TOKENS</h2>
                    <div className="createTokens">
                        <div className="heading">
                            <h3>Create Tokens</h3>
                            <p>Enter the number of tokens to be created and click on the "Create Tokens" button</p>
                        </div>
                        <div className='button'>
                            <div className='buttonWrapper'>
                                <input type="text" placeholder='Number of tokens' ref={tokenAmountRef} />
                                <button className='button__secondary' onClick={createToken}>
                                    {
                                        transferLoading ? <span> <p>Creating Tokens...</p> <p> <ColorRing visible={true} height="20" width="20" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" color="#fff" /></p></span>
                                            : "Create Tokens"
                                    }
                                </button>
                            </div>
                            <div className='tokenCreationStatus' style={{ fontWeight: "700" }}>
                                {
                                    createTokenStatus === "SUCCESS"
                                        ?
                                        <div className='tokenInfo' style={{ background: "#ffffff4d", borderRadius: "5px", padding: "0.6rem" }}>
                                            <p>Tokens have been created with the following specifications</p>
                                            <ul style={{ fontSize: "12px", fontWeight: "500", marginLeft: "0px", paddingLeft: "5px", marginTop: "0.4rem" }}>
                                                <li><span style={{ fontWeight: "700", marginRight: "0.3rem", marginLeft: "" }}> Token Name:</span> {createTokenTx._tokenName}</li>
                                                <li><span style={{ fontWeight: "700", marginRight: "0.3rem" }}> Token Symbol:</span> {createTokenTx._tokenSymbol}</li>
                                                <li><span style={{ fontWeight: "700", marginRight: "0.3rem" }}> Initial Supply:</span> {createTokenTx._initialSupply.toString()}</li>
                                                <li><span style={{ fontWeight: "700", marginRight: "0.3rem" }}>  Token collection Id:</span> {tokenId.toString()}</li>
                                            </ul>

                                        </div>
                                        : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="associateAndTransferTokens">
                            <div className="heading">
                                <h3>Associate Account and Transfer Tokens</h3>
                                <p>First associate the account with the token and then after adding the number of tokens to be transferred, click on the "Transfer Tokens" button</p>
                            </div>
                            <div className='associateAccount'>
                                <div className='input'>
                                    <input type="text" ref={associateIdRef} placeholder='Account Id' />
                                    <input type="password" ref={associateKeyRef} placeholder='Account Key' />
                                </div>
                                <button className='button__secondary' onClick={associateIdRef && associateKeyRef && associateAccount}>

                                    {
                                        associateLoading ? <span> <p>Associating Account...</p> <p> <ColorRing visible={true} height="20" width="20" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" color="#fff" /></p></span>
                                            : "Associate Account"
                                    }
                                </button>
                            </div>
                            <div className="button">
                                <span className='input'>
                                    {/* <input type="text" ref={associateIdRef} placeholder='Account Id of Trust/Investor' />
        <input type="text" ref={associateKeyRef} placeholder='Account Key of Trust/Investor' /> */}
                                    <input type="text" placeholder='No. of tokens' ref={transferTokenNoRef} />
                                    <input type="text" placeholder='MSME Id' ref={transferMsmeIdRef} />
                                </span>
                                <button className='button__secondary' onClick={transferToken}>
                                    {
                                        createTokenLoading ? <p> Transferring Tokens <ColorRing visible={true} height="80" width="80" ariaLabel="blocks-loading" wrapperStyle={{}} wrapperClass="blocks-wrapper" colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} /></p>
                                            : "Send tokens transfer for approval"
                                    }
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreateAndTransfer