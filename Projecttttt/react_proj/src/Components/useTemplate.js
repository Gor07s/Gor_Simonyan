import React, { Component } from "react"
import SendTemplate from "./sendTemplate";

class UseTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            apiResponse:"",
            apiResponseTo:"",
            apiResponseVars:"",
            myTempIsClick: false,
            tempClicked: false,
            templateId: null,
            send: false,
            template: {},
            recipientsForSend: [],
            varsForSend: [],
            show: false
        }
        this.wordsForCheck = []
        this.arr = []
        this.words = []
        this.recipients = []
        this.vars = []
        this.myTemplates = this.myTemplates.bind(this)
        this.showMyTemps = this.showMyTemps.bind(this)
        this.templateOnClick = this.templateOnClick.bind(this)
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this)
    }

    templateOnClick(id){
        const p = document.getElementById("example")
        this.words.filter(template => {
            if(template.id == id){
                p.innerHTML = template.templateText
                this.setState({tempClicked: true})
                this.setState({templateId: id})
            }
        })
    }

    async myTemplates(){
        const div = document.getElementById("useTemplatesMenu")
        const myTemps = document.getElementById("myTemps")
        await fetch("/useTemplate/templates", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
        await fetch("/useTemplate/recipients", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponseTo: res}))
        await fetch("/useTemplate/vars", {
            method:'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponseVars: res}))
        let templates = (this.state.apiResponse).substring(1,this.state.apiResponse.length-1).split('},')
        if(templates[0] === ""){
            return
        }
        templates.forEach((template, index) => {
            if (index !== templates.length-1){
                templates[index] += "}"
            }
        })
        let recipients = (this.state.apiResponseTo).substring(1,this.state.apiResponseTo.length-1).split('},')
        recipients.forEach((template, index) => {
            if (index !== recipients.length-1){
                recipients[index] += "}"
            }
        })
        let vars = (this.state.apiResponseVars).substring(1,this.state.apiResponseVars.length-1).split('},')
        vars.forEach((template, index) => {
            if (index !== vars.length-1){
                vars[index] += "}"
            }
        })
        this.words = []
        this.recipients =[]
        this.vars = []
        for(let i = 0; i < templates.length; i++) {
            let a = JSON.parse(templates[i])
            this.words.push(a)
        }
        for(let i = 0; i < recipients.length; i++) {
            let a = JSON.parse(recipients[i])
            this.recipients.push(a)
        }
        for(let i = 0; i < vars.length; i++) {
            let a = JSON.parse(vars[i])
            this.vars.push(a)
        }
        this.words.forEach((template, index) => {
            const ep = document.getElementById(index+1)
            if(ep === null) {
                const p = document.createElement("p")
                p.id = index + 1
                p.innerHTML = template.templateName
                p.onclick = () => this.templateOnClick(p.id)
                div.appendChild(p)
                div.insertBefore(p, myTemps)
            }
        })
    }

    showMyTemps(){
        this.myTemplates()
        for(let i = 1; i <= this.words.length; i++){
            const p = document.getElementById(i)
            if(this.state.myTempIsClick){
                p.style.display = "none"
                const g = document.getElementById("example")
                g.innerHTML = ""
            }
            else {
                p.style.display = "block"
            }
        }
        this.setState({myTempIsClick: !this.state.myTempIsClick,
                            tempClicked: false,
                            templateId: null})
    }

    async UseTemplateFunc(){
        await this.setState({template: this.words.filter(temp => temp.id == this.state.templateId)[0],
                            send: true,
                            recipientsForSend: this.recipients.filter(temp => temp.tableId == this.state.templateId)[0],
                            varsForSend: this.vars.filter(temp => temp.tableId == this.state.templateId),
                            show: true})
    }

    render() {
        return (
            <div>
                {!this.state.send && <div id={"useTempsGeneral"}>
                    <span id={"useTemplatesMenu"}>
                        <p id={"defTemps"}>Default Templates</p>
                        <p id={"myTemps"} onClick={this.showMyTemps}>My Templates</p>
                    </span>
                    <span>
                        <p id={"example"}></p>
                        {this.state.tempClicked && <button id={"useTemplateButton"} onClick={this.UseTemplateFunc}>Use</button>}
                    </span>
                </div>}
                {this.state.send && <SendTemplate show={this.state.show} template={this.state.template} recipients={this.state.recipientsForSend} vars={this.state.varsForSend}/>}
            </div>
        )
    }
}

export default UseTemplate