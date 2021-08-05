import React from "react";
import { Link } from "react-router-dom";

export function Navbar({ address, KaiBalance, ibKaiBalance }) {
    function truncateAddr() {
        return (address.substr(0, 6) + "..." + address.substr(address.length - 4, address.length))
    }
    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid ">
                <div className="navbar-brand"><b>KALOMIRA</b></div>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/MintAndRedeem">Mint/Redeem</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" to="/Farm">Farm</Link>
                        </li>
                    </ul>

                </div>
                <div className="row">
                    <div className="col-md-auto">
                        <text>
                            <b>{"KAI: "}</b>{(KaiBalance / (10 ** 18)).toFixed(5)}
                        </text>
                    </div>
                    <div className="col-md-auto">
                        <text>
                            <b>{"ibKAI: "}</b>{(KaiBalance / (10 ** 18)).toFixed(5)}
                        </text>
                    </div>
                    <div className="col">
                        <b>
                            {truncateAddr()}
                        </b>
                    </div>
                    <div className="col">
                        <b className="text-success">Connected</b>
                    </div>

                </div>
            </div>
        </nav>
    )
}
