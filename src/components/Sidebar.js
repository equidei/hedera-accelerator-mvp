import Logo from "../img/logoFull.png"

import { HiViewList } from "react-icons/hi"
import { BiCoin } from "react-icons/bi"
import { BiDollarCircle } from "react-icons/bi"
import { BiLogOut } from "react-icons/bi"
import { FaRegAddressCard } from "react-icons/fa"

const Sidebar = ({ governorAddress }) => {

    // const logoutHandler = () => {
    //     setGovernorAddress()
    // }
    return (
        <header className="header">
            <div className='headerWrapper'>
                <img src={Logo} alt="Equidei logo" />
                <div className="title">Governor's dashboard</div>
                <div className="navBar">
                    <ul className="navList">
                        <a href="#" className="navLink">
                            <li className="navItem">
                                <HiViewList />
                                <p> List of Assets</p>
                            </li>
                        </a>
                        <a href="#" className="navLink">
                            <li className="navItem">
                                <BiCoin />
                                <p>Manage Tokens</p>
                            </li>
                        </a>
                        <a href="#" className="navLink">
                            <li className="navItem">
                                <BiDollarCircle />
                                <p>  Balance Query</p>
                            </li>
                        </a>
                        <a className="navLink">
                            <li className="navItem logout">
                                <FaRegAddressCard />
                                <p>{governorAddress.substring(0, 8)}....{governorAddress.substring(37)}</p>
                            </li>
                        </a>
                    </ul>
                </div>

                {/* <div className="logout">
                    <span>Logout</span>
                </div> */}
            </div>
        </header>
    )
}
export default Sidebar