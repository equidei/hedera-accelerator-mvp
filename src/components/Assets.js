import { data } from "../data/newrlData.js";

const Assets = ({ governorAddress }) => {
    const governorsAddressArray = [];
    const approveCounter = [];
    const declineCounter = [];
    const approveHandler = () => {
        try {
            if (!approveCounter.includes(governorAddress) && !declineCounter.includes(governorAddress)) {
                approveCounter.push(governorAddress)
                console.log(approveCounter)
            }

        } catch (err) {
            console.log(err)
        }
    }
    const declineHandler = () => {
        try {
            if (!approveCounter.includes(governorAddress) && !declineCounter.includes(governorAddress)) {
                approveCounter.push(governorAddress)
                console.log(approveCounter)
            }

        } catch (err) {
            console.log(err)
        }

    }
    // disabled={approveCounter.contains(governorAddress) || declineCounter.contains(governorAddress)} 


    return (
        <div className='assets'>
            <h2 className='title'>List of Assets</h2>
            <p className='subtitle'>Assets validated by validators and available for tokenization</p>
            <div className='assetsList'>
                <div className="assetItem" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className='col1'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>MSME Name: </span>{data[0].msmeName}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Tokens to be Transferred: </span>{data[0].tokenToBeTransferred}</p>
                    </div>
                    <div className='col2'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Asset Value:</span>{data[0].assetValue}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Value to be tokenised: </span>{data[0].valueToBeTokenized}</p>
                        {/* <p style={{ color: "green", fontWeight: "700", }}><span style={{ fontWeight: "700", color: "black", marginRight: "0.4rem" }}>Validation Result:</span>SUCCESS</p> */}
                    </div>
                    <div className='col3' style={{ display: "flex", gap: "1rem" }}>
                        <button disabled={approveCounter.includes(governorAddress) || declineCounter.includes(governorAddress) ? true : false} onClick={approveHandler} style={{ fontWeight: "700", marginRight: "0.4rem", height: "35px", width: "100px", background: "#daffda", border: "1px solid green", borderRadius: "5px", color: "green", cursor: "pointer" }} >Approve</button>
                        <button disabled={approveCounter.includes(governorAddress) || declineCounter.includes(governorAddress) ? true : false} onClick={declineHandler} style={{ fontWeight: "700", height: "35px", width: "100px", background: "#ffeaea", border: "1px solid red", borderRadius: "5px", color: "red", cursor: "pointer" }} >Decline</button>
                    </div>
                </div>
                <div className="assetItem" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className='col1'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>MSME Name: </span>{data[1].msmeName}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Tokens to be Transferred: </span>{data[1].tokenToBeTransferred}</p>
                    </div>
                    <div className='col2'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Asset Value:</span>{data[1].assetValue}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Value to be tokenised: </span>{data[1].valueToBeTokenized}</p>
                        {/* <p style={{ color: "green", fontWeight: "700", }}><span style={{ fontWeight: "700", color: "black", marginRight: "0.4rem" }}>Validation Result:</span>SUCCESS</p> */}
                    </div>
                    <div className='col3' style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={approveHandler} style={{ fontWeight: "700", marginRight: "0.4rem", height: "35px", width: "100px", background: "#daffda", border: "1px solid green", borderRadius: "5px", color: "green", cursor: "pointer" }} >Approve</button>
                        <button onClick={declineHandler} style={{ fontWeight: "700", height: "35px", width: "100px", background: "#ffeaea", border: "1px solid red", borderRadius: "5px", color: "red", cursor: "pointer" }} >Decline</button>
                    </div>
                </div>
                <div className="assetItem" style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className='col1'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>MSME Name: </span>{data[2].msmeName}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Tokens to be Transferred: </span>{data[2].tokenToBeTransferred}</p>
                    </div>
                    <div className='col2'>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Asset Value:</span>{data[2].assetValue}</p>
                        <p><span style={{ fontWeight: "700", marginRight: "0.4rem" }}>Value to be tokenised: </span>{data[2].valueToBeTokenized}</p>
                        {/* <p style={{ color: "green", fontWeight: "700", }}><span style={{ fontWeight: "700", color: "black", marginRight: "0.4rem" }}>Validation Result:</span>SUCCESS</p> */}
                    </div>
                    <div className='col3' style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={approveHandler} style={{ fontWeight: "700", marginRight: "0.4rem", height: "35px", width: "100px", background: "#daffda", border: "1px solid green", borderRadius: "5px", color: "green", cursor: "pointer" }} >Approve</button>
                        <button onClick={declineHandler} style={{ fontWeight: "700", height: "35px", width: "100px", background: "#ffeaea", border: "1px solid red", borderRadius: "5px", color: "red", cursor: "pointer" }} >Decline</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Assets