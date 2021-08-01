import React, { Component } from "react";
import { Link } from "react-router-dom"



class Home extends Component{

    render() {
        return (
            <div id={"gen_box"}>
                <Link to="/addTemplate" id={"link"}>
                    <button className={"gen_but"}>Add Template</button>
                </Link>
                <Link to="/useTemplate" id={"link"}>
                    <button className={"gen_but"}>Use Template</button>
                </Link>
                <Link to="/noTemplate" id={"link"}>
                    <button className={"gen_but"}>Send without template</button>
                </Link>
            </div>
        )
    }
}


export default Home
