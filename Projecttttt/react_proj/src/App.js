import React, { Component } from "react";
import AddTemplate from "./Components/addTemplate";
import UseTemplate from "./Components/useTemplate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Footer from "./Components/footer";

class App extends Component{

    render() {
        return (
            <Router>
                <div id={"general"}>
                    <header id={"header"}>
                        <p id={"header_text"}>
                            <Link to={"/"}>Easy Sender</Link>
                        </p>
                        <nav id={"nav_panel"}>
                            <p><Link to={"/addTemplate"}>Add</Link></p>
                            <p><Link to={"/modifyTemplate"}>Modify</Link></p>
                            <p><Link to={"/useTemplate"}>Use</Link></p>
                            <p><Link to={"/noTemplate"}>Send</Link></p>
                        </nav>
                    </header>
                    <Switch>
                        <Route exact path={"/"}>
                            <div id={"gen_box"}>
                                <Link to="/addTemplate" id={"link"}>
                                    <button className={"gen_but"}>Add Template</button>
                                </Link>
                                <Link to="/modifyTemplate" id={"link"}>
                                    <button className={"gen_but"}>Modify Template</button>
                                </Link>
                                <Link to="/useTemplate" id={"link"}>
                                    <button className={"gen_but"}>Use Template</button>
                                </Link>
                                <Link to="/noTemplate" id={"link"}>
                                    <button className={"gen_but"}>Send without template</button>
                                </Link>
                            </div>
                        </Route>
                        <Route exact path={"/addTemplate"}>
                            <Link to="/">
                                <button id={"back"}>Back</button>
                            </Link>
                            <AddTemplate />
                        </Route>
                        <Route exact path={"/useTemplate"}>
                            <Link to="/">
                                <button id={"back"}>Back</button>
                            </Link>
                            <UseTemplate />
                        </Route>
                    </Switch>
                    <Footer/>
                </div>
            </Router>
        )
    }

}


export default App;
