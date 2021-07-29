import React, { Component } from "react";

class Header extends Component {

    render() {
        return (
                <div>
                    <header id={"header"}>
                        <a id={"header_text"} href={"http://localhost:3000/"}>Easy Sender</a>
                    </header>
                </div>
        )
    }
}

export default Header