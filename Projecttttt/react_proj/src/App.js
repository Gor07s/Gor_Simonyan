import React, { Component } from "react";
import AddTemplate from "./Components/addTemplate";
import UseTemplate from "./Components/useTemplate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Header from "./Components/header";

class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            add: false,
            use: false
        }
        this.addTemplateFunc = this.addTemplateFunc.bind(this)
    }

    addTemplateFunc(name){
        const genBox = document.getElementById("gen_box")
        genBox.style.display = "none"
        switch (name) {
            case "add":
                this.setState({
                    add: !this.state.add
                })
                break;
            case "use":
                this.setState({
                    use: !this.state.use
                })
                break;
            default:
                throw name
        }
    }


    Back(){
        const genBox = document.getElementById("gen_box")
        genBox.style.display = "block"
        this.setState({
            use: false,
            add: false
        })
    }

    render() {
        return (
            <Router>
                <Header />
                <div id={"general"}>
                    <div id={"gen_box"}>
                        <Link to="/addTemplate" id={"link"}>
                            <button onClick={() => this.addTemplateFunc("add")} className={"gen_but"}>Add Template</button>
                        </Link>
                        <Link to="/useTemplate" id={"link"}>
                            <button onClick={() => this.addTemplateFunc("use")} className={"gen_but"}>Use Template</button>
                        </Link>
                    </div>
                    <Switch>
                        <Route path={"/addTemplate"}>
                            <Link to="/">
                                <button onClick={() => this.Back()} id={"back"}>Back</button>
                            </Link>
                            <AddTemplate />
                        </Route>
                        <Route path={"/useTemplate"}>
                            <Link to="/">
                                <button onClick={() => this.Back()} id={"back"}>Back</button>
                            </Link>
                            <UseTemplate />
                        </Route>
                    </Switch>
                </div>
            </Router>
        )
    }
}


export default App;
