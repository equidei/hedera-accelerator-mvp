import './App.scss';
import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, PublicKey, AccountCreateTransaction, Hbar, TokenMintTransaction, TokenAssociateTransaction, AccountBalanceQuery, TransferTransaction } from "@hashgraph/sdk";
import { useEffect, useRef, useState } from 'react';
import { HashConnect, HashConnectTypes, setUpHashConnectEvents } from 'hashconnect';

import { data } from "./data/newrlData.js";
import { ColorRing, InfinitySpin } from 'react-loader-spinner';

import styles from "./App.scss"
import Login from './login.js';

import Logo from "./img/logoFull.png"
import Sidebar from './components/Sidebar';
import Assets from './components/Assets';
import Balance from './pages/Balance';
import CreateAndTransfer from './pages/CreateAndTransfer';

function App() {

  const hbarBalanceInputRef = useRef()
  const tokenBalanceInputRef = useRef()


  const tokenBalanceAccountIdRef = useRef();
  const tokenBalanceTokenIdRef = useRef();

  const [operatorKey, setOperatorKey] = useState()
  const [operatorId, setOperatorId] = useState()
  const [client, setClient] = useState()
  const [supplyKey, setSupplyKey] = useState()
  const [msmePvKey, setMsmePvKey] = useState()
  const [msmeId, setMsmeId] = useState()

  const [treasuryId, setTreasuryId] = useState()
  const [treasuryPvKey, setTreasuryPvKey] = useState()
  const [treasuryPbKey, setTreasuryPbKey] = useState()


  const [hbarBalance, setHbarBalance] = useState();
  const [tokenBalance, setTokenBalance] = useState();
  const [tokenId, setTokenId] = useState();
  const [createTokenTx, setCreateTokenTx] = useState()
  const [createTokenStatus, setCreateTokenStatus] = useState();

  // Storing wallet address
  const [walletAddress, setWalletAddress] = useState("");
  const [governorAddress, setGovernorAddress] = useState();

  // Loader, Colors and Errors
  const [hbarBalanceLoading, setHbarBalanceLoading] = useState(false)
  const [tokenBalanceLoading, setTokenBalanceLoading] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [createTokenLoading, setCreateTokenLoading] = useState(false)
  const [balanceColor, setAccountColor] = useState("green")

  const [hbarBalanceErr, setHbarBalanceErr] = useState(false)
  const [tokenBalanceErr, setTokenBalanceErr] = useState(false)

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
        setWalletAddress(accounts[0])
      } catch (err) {
        console.log(err);
      }
    }
    else {
      console.log("Please install Metamask!")
    }
  }

  const allowedGovernorAddresses = ["0x119F27a01F905715795a1Ee0e44B1E9d7599B929", "0x887B8Db66EA739Bccd75AC3C418Bf8C4184F27f3", "0x78230D336009BF761f4fBb2BE8f7Ce1411F11E98"];

  // Get previously/current connected wallet
  const getCurrentConnectedWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
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
        setWalletAddress(accounts[0]);
        console.log(accounts[0])
      })
    }
    else {
      setWalletAddress("")
      console.log("Please install Metamask!")
    }
  }

  // Creating MSME Account
  const createMsmeAc = async () => {
    // const msmeId = AccountId.fromString(process.env.REACT_APP_MSME_ID);
    // const msmePvKey = PrivateKey.fromString(process.env.REACT_APP_MSME_PV_KEY);
    // const msmePvKey = PrivateKey.generateED25519();
    // const msmePbKey = msmePvKey.publicKey;
    // // console.log("Private key of MSME", msmePvKey.toString());

    // const msmeAcTx = await new AccountCreateTransaction()
    //   .setKey(msmePbKey)
    //   .execute(client);
    // // console.log("Account transaction object", msmeAcTx)
    // const msmeAcRc = await msmeAcTx.getReceipt(client);
    // // console.log("This is the receipt", msmeAcRc);
    // const msmeId = msmeAcRc.accountId;
    // // console.log(msmeId.toString())
    // setMsmeId(msmeId);
    // setMsmePvKey(msmePvKey);
  }




  const createAccount = async () => {
    const newAccountPvKey = PrivateKey.generateED25519();
    const newAccountPbKey = newAccountPvKey.publicKey;
    console.log("This is public key", newAccountPbKey)
    const newAccountTx = await new AccountCreateTransaction()
      .setKey(newAccountPbKey)
      .execute(client);
    const newAccountRc = await newAccountTx.getReceipt(client);
    const newAccountId = newAccountRc.accountId;
    console.log("New Account Private Key", newAccountPvKey);
    console.log("New Account Private Key", newAccountId);
  }




  return (
    // <div className={[styles.app, "mt-[1rem]"].join(" ")}>
    <div className="app">
      {governorAddress ?
        <>
          <Sidebar governorAddress={governorAddress} />
          <div className='container'>
            <div className="wrapper">


              <main className="main mt-[1rem]">
                <div className="mainWrapper">
                  <Assets governorAddress={governorAddress} />


                  <CreateAndTransfer />
                  <Balance />
                  {/* <div className='' style={{ display: "flex", gap: "1rem", marginTop: "2rem", marginBottom: "3rem" }}>
                    <div>
                      <button className="button__primary button__third" onClick={createMsmeAc}>Create Msme Account</button>
                    </div>
                    <div>
                      <button className="button__primary button__third" onClick={connectWallet}>
                        {
                          walletAddress && walletAddress.length > 0 ? `Connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : "Connect Wallet"
                        }
                      </button>
                    </div>
                    <div>
                      <button className="button__primary button__third" onClick={hashConnect}>
                        {
                          "Connect Hashpack"
                        }
                      </button>
                    </div>
                    <div>
                      <button className="button__primary button__third" onClick={createAccount}>
                        {
                          "Create Another Account"
                        }
                      </button>
                    </div>

                  </div> */}

                </div>

              </main>

            </div>
          </div>
        </>
        : <Login setGovernorAddress={setGovernorAddress} />
      }
    </div>
  );
}

export default App;
