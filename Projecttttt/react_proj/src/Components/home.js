import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import AddTemplate from "./addTemplate";
import UseTemplate from "./useTemplate";


class Home extends Component{

    render() {
        return (
            <Router>
                <div id={"gen_box"}>
                    <Link to="/addTemplate" id={"link"}>
                        <button className={"gen_but"}>Add Template</button>
                    </Link>
                    <Link to="/useTemplate" id={"link"}>
                        <button className={"gen_but"}>Use Template</button>
                    </Link>
                </div>
                <Switch>
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


export default Home
