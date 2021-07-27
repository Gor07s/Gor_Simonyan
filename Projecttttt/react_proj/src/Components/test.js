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
            text: "",
            templateId: null,
            send: false,
            variables: {}
        }
        this.txt = ""
        this.wordsForCheck = []
        this.arr = []
        this.words = []
        this.recipients = []
        this.vars = []
        this.myTemplates = this.myTemplates.bind(this)
        this.showMyTemps = this.showMyTemps.bind(this)
        this.templateOnClick = this.templateOnClick.bind(this)
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this)
        this.sendMail = this.sendMail.bind(this)
        this.textGenerator = this.textGenerator.bind(this)
        this.wordFinder = this.wordFinder.bind(this)
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

    wordFinder(word){
        let start = null
        let st = 0
        if(word.includes("{") && word.includes("}")) {
            for (let i = 0; i < word.length; i++) {
                if (word[0] !== "{"){
                    this.wordsForCheck.forEach(element => {
                        if(this.state.variables[element] === ""){
                            this.arr.push("{" + element + "}")
                        }
                        else {
                            this.arr.push(this.state.variables[element])
                        }
                    })
                    this.wordsForCheck = []
                }
                if (word[i] === "{") {
                    start = i
                    if (st !== null){
                        this.arr.push(word.replace(word.slice(i, word.length), ""))
                        word = word.replace(word.slice(st, i), "")
                        st = null
                        if (start !== null){
                            start = 0
                        }
                    }
                }
                else if (word[i] === "}") {
                    if (start !== null) {
                        this.wordsForCheck.splice(0, 0, word.slice(start + 1, i))
                        let newWord = word.replace(word.slice(start, i + 1), "")
                        this.wordFinder(newWord)
                        return
                    }
                }
            }
        }
        else {
            this.wordsForCheck.forEach(element => {
                if(this.state.variables[element] === ""){
                    this.arr.push("{" + element + "}")
                }
                else {
                    this.arr.push(this.state.variables[element])
                }
            })
            this.wordsForCheck = []
            this.arr.push(word)
        }
    }

    textGenerator(){
        const text = this.txt.split(" ")
        for(let i = 1; i <= text.length; i+=2){
            text.splice(i, 0, " ")
        }
        text.forEach(word => {
            this.wordFinder(word, [])
        })
    }

    async UseTemplateFunc(){
        const form = document.getElementById("sendForm")
        form.style.display = "block"
        const from = document.getElementById("from")
        const to = document.getElementById("to")
        const title = document.getElementById("title")
        const textLabel = document.getElementById("textLabel")
        const template = (this.words.filter(temp => temp.id == this.state.templateId))[0]
        this.txt = template.templateText
        this.setState({send: true, text: this.txt})
        const recipients = this.recipients.filter(temp => temp.tableId == this.state.templateId)
        const vars = this.vars.filter(temp => temp.tableId == this.state.templateId)
        await vars.forEach(v => {
            const copy = Object.assign(this.state.variables, {[v.varName]: "{" + [v.varName] + "}"})
            this.setState({variables : copy})
        })
        await vars.forEach((template, index) => {
            const label = document.createElement("label")
            const input = document.createElement("input")
            input.id = "t" + (index + 1)
            input.onchange = (e) => {
                this.setState(prevState => ({
                    variables : {
                        ...prevState.variables,
                        [template.varName] : e.target.value
                    }
                }))
                this.textGenerator()
                let txt = ""
                this.arr.forEach(v => txt += v)
                this.arr = []
                this.setState({text: txt})
            }
            label.innerHTML = template.varName
            label.htmlFor = "t" + (index + 1)
            label.style.display = "block"
            form.appendChild(label)
            form.appendChild(input)
            form.insertBefore(input, textLabel)
            form.insertBefore(label, input)
        })
        from.value = template.templateFrom
        recipients.forEach(recipient => to.value += recipient.email)
        title.value = template.templateTitle
    }

    sendMail(){
        const from = document.getElementById("from").value
        const to = document.getElementById("to").value
        const title = document.getElementById("title").value
        const text = document.getElementById("text").value
        fetch("/useTemplate/send", {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: "gorsimonyan200307@gmail.com",
                pass: "gor07072003",
                from: from,
                to: to,
                subject: title,
                text: text
            })
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
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
                <form id={"sendForm"} style={{"display": "none"}}>
                    <label htmlFor="from" className="form">from</label>
                    <input id={"from"} type="email" className="form"/>
                    <label htmlFor={"to"} className="form">To</label>
                    <input id={"to"} type="email" className="form"/>
                    <label htmlFor={"title"} className="form">title</label>
                    <input id={"title"} className="form"/>
                    <label htmlFor={"text"} className={"form"} id={"textLabel"}>Text</label>
                    <input id={"text"} value={this.state.text} className={"form"}/>
                    <button id={"submit"} type={"submit"} className={"form"} onClick={this.sendMail}>Send</button>
                </form>
                <SendTemplate words={this.words} recipients={this.recipients} vars={this.vars}/>
            </div>
        )
    }
}

export default UseTemplate