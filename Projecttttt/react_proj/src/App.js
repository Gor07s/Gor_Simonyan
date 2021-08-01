import React, { Component } from "react";
import AddTemplate from "./Components/addTemplate";
import { UseTemplate, template, recipients, vars, show } from "./Components/useTemplate";
import NoTemplate from "./Components/noTemplate";
import SendTemplate from "./Components/sendTemplate";
import ModTemplate from "./Components/modTemplate";
import Footer from "./Components/footer";
import Header from "./Components/header";
import Home from "./Components/home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

class App extends Component{

    render() {
        return (
            <Router>
                <div id={"general"}>
                    <Header/>
                    <Switch>
                        <Route exact path={"/"}>
                            <Home/>
                        </Route>
                        <Route exact path={"/addTemplate"}>
                            <AddTemplate />
                        </Route>
                        <Route exact path={"/useTemplate"}>
                            <UseTemplate />
                        </Route>
                        <Route exact path={"/useTemplate/send"}>
                            <SendTemplate show={show} template={template} recipients={recipients} vars={vars}/>
                        </Route>
                        <Route exact path={"/useTemplate/modify"}>
                            <ModTemplate show={show} template={template} recipients={recipients} vars={vars}/>
                        </Route>
                        <Route exact path={"/noTemplate"}>
                            <NoTemplate />
                        </Route>
                    </Switch>
                    <Footer/>
                </div>
            </Router>
        )
    }

}


export default App;
