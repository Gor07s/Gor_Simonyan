import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import AddTemplate from "./addTemplate";
import UseTemplate from "./useTemplate";
import Home from "./home";

class Header extends Component {

    render() {
        return (
            <Router>
                <header id={"header"}>
                    <p id={"header_text"}>
                        <Link to={"/"}>Easy Sender</Link>
                    </p>
                    <nav id={"nav_panel"}>
                        <p><Link to={"/addTemplate"}>Add</Link></p>
                        <p><Link to={"/modifyTemplate"}>Modify</Link></p>
                        <p><Link to={"/useTemplate"}>Use</Link></p>
                    </nav>
                </header>
                <Switch>
                    <Route path={"/"}>
                        <Home/>
                    </Route>
                    <Route path={"/addTemplate"}>
                        <AddTemplate/>
                    </Route>
                    <Route path={"/useTemplate"}>
                        <UseTemplate/>
                    </Route>
                </Switch>
            </Router>
        )
    }

}

export default Header