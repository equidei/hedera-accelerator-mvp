import { HashConnect } from "hashconnect";
import { useEffect, useState } from "react";
import Logo from "./img/logoFull.png";

const Login = ({ setGovernorAddress }) => {
    // const [governorAddress, setGovernorAddress] = useState();

    async function hashConnect() {

        // Creating the hashconnect wallet 
        let hashConnect = new HashConnect(true);

        // Metadata for the wallet to display info about the app which is requesting the signature
        let appMetadata = {
            name: "EquiDEI",
            description: "A MVP of the product",
            icon: "https://absolute.url/to/icon.png"
        }

        // Register events
        // setUpHashConnectEvents();

        // Initialize and use returned data
        let initData = await hashConnect.init(appMetadata, "testnet", false);

        hashConnect.foundExtensionEvent.once(() => {
            connectWallet()
        })
    }


    useEffect(() => {
        getCurrentConnectedWallet();
        addWalletListener();
    })

    // Connect wallet function
    const connectWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                console.log(accounts[0]);
                setGovernorAddress(accounts[0])
            } catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("Please install Metamask!")
        }
    }

    // Get previously/current connected wallet
    const getCurrentConnectedWallet = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                const accounts = await window.ethereum.request({ method: "eth_accounts" });
                if (accounts.length > 0) {
                    setGovernorAddress(accounts[0])
                } else {
                    console.log("Please connect your wallet by clicking on the connect button")
                }
            } catch (err) {
                console.log(err);
            }
        }
        else {
            console.log("Please install Metamask!")
        }
    }

    // A listener that will listen to changes we do with Metamask
    const addWalletListener = async () => {
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                setGovernorAddress(accounts[0]);
                console.log(accounts[0])
            })
        }
        else {
            setGovernorAddress("")
            console.log("Please install Metamask!")
        }
    }
    return (
        <div className="" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem", minHeight: "100vh", minWidth: "100vw" }}>
            <div>
                <img src={Logo} style={{ height: "35px", width: "200px" }} alt="" />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                    <button className="button__primary button__third" onClick={connectWallet} >
                        Connect Wallet
                    </button>
                </div>
                {/* <div>
                    <button className="button__primary button__third" >
                        {
                            "Connect Hashpack"
                        }
                    </button>
                </div> */}
            </div>
        </div>
    )
}
export default Login