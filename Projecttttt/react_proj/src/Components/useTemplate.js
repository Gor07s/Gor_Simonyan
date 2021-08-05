import React, { Component } from "react";
import { Link } from "react-router-dom";

export let template = [];
export let recipients = [];
export let vars = [];
export let show = [];

export class UseTemplate extends Component {
    constructor (props) {
        super(props);
        this.state = {
            apiResponse: "",
            apiResponseTo: "",
            apiResponseVars: "",
            myTempIsClick: false,
            tempClicked: false,
            currentTemp: {}
        };

        this.myTemplates = this.myTemplates.bind(this);
        this.showMyTemps = this.showMyTemps.bind(this);
        this.templateOnClick = this.templateOnClick.bind(this);
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this);
        this.DelTemplateFunc = this.DelTemplateFunc.bind(this);
    }

    templateOnClick (id) {
        const template = this.state.apiResponse.filter(template => template.id == id)[0];
        this.setState({currentTemp: template,
            tempClicked: true});
    }

    async myTemplates () {
        const div = document.getElementById("forTemps");
        await fetch("/useTemplate/templates", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponse: JSON.parse(res)}));
        await fetch("/useTemplate/recipients", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponseTo: JSON.parse(res)}));
        await fetch("/useTemplate/vars", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponseVars: JSON.parse(res)}));
        this.state.apiResponse.forEach((template, index) => {
            const ep = document.getElementById(index + 1);
            if (ep === null) {
                const p = document.createElement("p");
                p.id = index + 1;
                p.innerHTML = template.templateName;
                p.onclick = () => this.templateOnClick(template.id);
                div.appendChild(p);
            }
        });
    }

    showMyTemps () {
        this.myTemplates();
        const temp = document.getElementById("forTemps");
        if (this.state.myTempIsClick) {
            temp.style.display = "none";
        }
        else {
            temp.style.display = "block";
        }
        this.setState({myTempIsClick: !this.state.myTempIsClick,
            tempClicked: false,
            currentTemp: null});
    }

    UseTemplateFunc () {
        template.splice(0, template.length);
        vars.splice(0, vars.length);
        recipients.splice(0, recipients.length);
        template.push(this.state.currentTemp);
        this.state.apiResponseTo.filter(temp => temp.tableId == this.state.currentTemp.id).forEach(element => recipients.push(element.email));
        this.state.apiResponseVars.filter(temp => temp.tableId == this.state.currentTemp.id).forEach(element => vars.push(element));
        show.push(true);
    }

    async DelTemplateFunc () {
        await fetch("/useTemplate/delete", {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.currentTemp.id
            })
        });
        for (let i = 1; i <= this.state.apiResponse.length; i++) {
            const p = document.getElementById(i);
            p.parentNode.removeChild(p);
        }
        await this.showMyTemps();
    }

    render () {
        return (
            <div style={{"width" : "100%"}}>
                <Link to="/">
                    <button id={"back"}>Back</button>
                </Link>
                <div id={"UseTempsDiv"}>
                    <div id={"useTempsGeneral"}>
                        <span id={"useTemplatesMenu"}>
                            <p id={"myTemps"} onClick={this.showMyTemps}>My Templates</p>
                        </span>
                        <div id={"forTemps"}>

                        </div>
                        <div id={"forDefs"}>

                        </div>
                    </div>
                    {this.state.tempClicked && <span id={"exampleSpan"}>
                        <div id={"titleDiv"}>
                            <label id={"titleLabel"} htmlFor="title" className={"form"} >title</label>
                            <input id="title" className={"form"} value={this.state.currentTemp.templateTitle}/>
                        </div>
                        <textarea id={"example"} value={this.state.currentTemp.templateText}/>
                        <div id={"useButtons"}>
                            <Link to={"/useTemplate/send"}>
                                <button id={"useTemplateButton"} onClick={() => this.UseTemplateFunc()}>Use</button>
                            </Link>
                            <Link to={"/useTemplate/modify"}>
                                <button id={"modTemplateButton"} onClick={() => this.UseTemplateFunc()}>Modify</button>
                            </Link>
                            <button id={"delTemplateButton"} onClick={() => this.DelTemplateFunc()}>Delete</button>
                        </div>
                    </span>}
                </div>
            </div>
        );
    }
}