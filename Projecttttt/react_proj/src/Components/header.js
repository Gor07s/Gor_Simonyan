import React, { Component } from "react";
import { Link } from "react-router-dom"

class Header extends Component {

    render() {
        return (
                <header id={"header"}>
                    <p id={"header_text"}>
                        <Link to={"/"}>Easy Sender</Link>
                    </p>
                    <nav id={"nav_panel"}>
                        <p><Link to={"/addTemplate"}>Add</Link></p>
                        <p><Link to={"/useTemplate"}>Use</Link></p>
                        <p><Link to={"/noTemplate"}>Send</Link></p>
                    </nav>
                </header>
        )
    }
}

export default Header