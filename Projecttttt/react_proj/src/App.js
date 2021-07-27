import React, { Component } from "react";
import AddTemplate from "./Components/addTemplate";
import UseTemplate from "./Components/useTemplate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

class App extends Component{
    constructor() {
        super();
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
        const { add, use } = this.state;
        return (
            <Router>
                <div id={"general"}>
                    <div id={"gen_box"}>
                        <button onClick={() => this.addTemplateFunc("add")} className={"gen_but"}>
                            <Link to="/addTemplate">Add Template</Link>
                        </button>
                        <button onClick={() => this.addTemplateFunc("use")} className={"gen_but"}> <Link to="/useTemplate">Use Template</Link></button>
                    </div>
                    {(add || use) && <button onClick={() => this.Back()} id={"back"}> <Link to="/">Back</Link></button>}
                    {add && <AddTemplate />}
                    {use && <UseTemplate/>}
                </div>
            </Router>
        )
    }
}


export default App;
