import { AccountBalanceQuery, AccountId, Client, PrivateKey } from "@hashgraph/sdk";
import { useRef, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";

const Balance = () => {
    const hbarBalanceInputRef = useRef()
    const tokenBalanceInputRef = useRef()
    const tokenBalanceAccountIdRef = useRef();
    const tokenBalanceTokenIdRef = useRef();

    const [createTokenLoading, setCreateTokenLoading] = useState(false)
    const [balanceColor, setAccountColor] = useState("green")

    const [hbarBalance, setHbarBalance] = useState();
    const [tokenBalance, setTokenBalance] = useState();

    const [hbarBalanceErr, setHbarBalanceErr] = useState(false)
    const [tokenBalanceErr, setTokenBalanceErr] = useState(false)

    const [hbarBalanceLoading, setHbarBalanceLoading] = useState(false)
    const [tokenBalanceLoading, setTokenBalanceLoading] = useState(false)


    const operatorId = AccountId.fromString(process.env.REACT_APP_OPERATOR_ID);
    const operatorKey = PrivateKey.fromString(process.env.REACT_APP_OPERATOR_PV_KEY);
    const client = Client.forTestnet();
    client.setOperator(operatorId, operatorKey);
    console.log(operatorId, operatorKey)

    // Generating a private key which will be treated as a "supply key"
    const supplyKey = PrivateKey.generate();

    const hbarBalanceQuery = async (e) => {
        e.preventDefault();
        console.log(hbarBalanceInputRef.current.value);
        setHbarBalanceErr(false)
        setHbarBalanceLoading(true);
        // balanceInputRef.current.value === " " || balanceInputRef.current.value === null ? setBalance("Enter a valid Account Id") : ""
        (hbarBalanceInputRef.current.value === " " || hbarBalanceInputRef.current.value === null) && setHbarBalance("Hello");
        try {
            let balanceQueryTx = new AccountBalanceQuery().setAccountId(hbarBalanceInputRef.current.value)
            console.log(balanceQueryTx)
            let balanceQuerySubmit = await balanceQueryTx.execute(client);
            setHbarBalance(balanceQuerySubmit.hbars.toString())
            console.log(hbarBalance)
        } catch (err) {
            console.log(err)
            setHbarBalance(err.toString())
            setHbarBalanceErr(true)
        }
        setHbarBalanceLoading(false);
    }

    const tokenBalanceQuery = async (e) => {
        e.preventDefault();
        setTokenBalanceErr(false)
        setTokenBalanceLoading(true);

        try {
            let balanceQueryTx = new AccountBalanceQuery().setAccountId(tokenBalanceAccountIdRef.current.value).execute(client);
            console.log(`- Treasury balance: ${(await balanceQueryTx).tokens._map.get(tokenBalanceTokenIdRef.toString())} units of token ID ${tokenBalanceTokenIdRef.current.value}`);
            const tokenBlc = (await balanceQueryTx).tokens._map.get(tokenBalanceTokenIdRef.current.value.toString()).toString()
            setTokenBalance(tokenBlc)
            console.log(tokenBalance)
        } catch (err) {
            console.log(err)
            setTokenBalance(err.toString())
            setTokenBalanceErr(true)
        }
        setTokenBalanceLoading(false);
    }
    return (
        <div className="balance my-6" id='balance'>
            <h3>Check Balance</h3>
            <div className='balanceWrapper'>
                <div>
                    <div className="button">
                        <input type="text" placeholder='Enter Account Id' ref={hbarBalanceInputRef} />
                        <button className='button__secondary' onClick={hbarBalanceQuery} >
                            Check Hbar Balance
                        </button>
                    </div>
                    <div className="info mt-[1rem]" style={{ display: "flex", marginTop: "1rem", alignItems: "center" }} >
                        {<>
                            <span className='ml-1rem' style={{ fontSize: "13px", marginRight: "0.5rem" }}>Your Balance is:</span>
                            <span style={{ color: hbarBalanceErr ? "red" : "yellow", fontSize: "13px", fontWeight: "700" }}>
                                {hbarBalanceLoading ? <InfinitySpin width='50' color="#ffff00" /> : hbarBalance}
                            </span>
                        </>
                        }

                    </div>
                </div>
                <div>
                    <div className="button">
                        <input type="text" placeholder='Enter Account Id' ref={tokenBalanceAccountIdRef} />
                        <input type="text" placeholder='Enter Token Id' ref={tokenBalanceTokenIdRef} />
                        <button className='button__secondary' onClick={tokenBalanceQuery} >
                            Check Token Balance
                        </button>
                    </div>
                    <div className="info mt-[1rem]" style={{ display: "flex", marginTop: "1rem", alignItems: "center" }} >
                        {<>
                            <span className='ml-1rem' style={{ fontSize: "13px", marginRight: "0.5rem" }}>Your Balance is:</span>
                            <span style={{ color: tokenBalanceErr ? "red" : "yellow", fontSize: "13px", fontWeight: "700" }}>
                                {tokenBalanceLoading ? <InfinitySpin width='50' color="#ffff00" /> : tokenBalance}
                            </span>
                        </>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Balance