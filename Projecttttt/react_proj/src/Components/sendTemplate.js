import React, { Component } from "react"

class SendTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            show: props.show,
            variables: {},
            template: props.template,
            txt : props.template.templateText,
            text: props.template.templateText,
            recipients : props.recipients,
            recCount: 1
        }
        this.wordsForCheck = []
        this.arr = []
        this.vars = props.vars
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this)
        this.sendMail = this.sendMail.bind(this)
        this.textGenerator = this.textGenerator.bind(this)
        this.wordFinder = this.wordFinder.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
    }

    componentDidMount() {
        if(this.state.show){
            this.UseTemplateFunc()
            this.setState({show: false})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.show){
            this.UseTemplateFunc()
            this.setState({show: false})
        }
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
        const text = this.state.txt.split(" ")
        for(let i = 1; i <= text.length; i+=2){
            text.splice(i, 0, " ")
        }
        text.forEach(word => {
            this.wordFinder(word, [])
        })
    }

    async UseTemplateFunc(){
        const textLabel = document.getElementById("textLabel")
        const form = document.getElementById("sendForm")
        await this.vars.forEach(v => {
            const copy = Object.assign(this.state.variables, {[v.varName]: "{" + [v.varName] + "}"})
            this.setState({variables : copy})
        })
        await this.vars.forEach((template, index) => {
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
        const addButton = document.getElementById("addRec")
        await this.state.recipients.forEach((rec, index) => {
            if (index !== 0){
                const input = document.createElement("input")
                const button = document.createElement("button")
                input.value = rec
                this.setState({recCount: this.state.recCount + 1})
                input.id = "to" + this.state.recCount
                button.innerHTML = "X"
                input.style.display = "flex"
                input.className = "form"
                button.type = "button"
                button.onclick = () => {
                    input.parentNode.removeChild(input)
                    button.style.display = "none"
                }
                form.appendChild(input)
                form.insertBefore(input, addButton)
                form.appendChild(button)
                form.insertBefore(button, addButton)
            }
        })
    }

    async sendMail(){
        const from = document.getElementById("from").value
        let to = ""
        for (let i = 1; i <= this.state.recCount; i++){
            const rec = document.getElementById("to" + i).value
            to += rec
            if (i !== this.state.recCount){
                to += ","
            }
        }
        const title = document.getElementById("title").value
        const text = document.getElementById("text").value
        alert(to)
        await fetch("/useTemplate/send", {
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

    async addRecipient(){
        const input = document.createElement("input")
        const delButton = document.createElement("button")
        await this.setState({recCount : this.state.recCount + 1})
        input.id = "to" + this.state.recCount
        input.className = "form"
        delButton.type = "button"
        delButton.id = "del" + this.state.rId
        delButton.innerHTML = "X"
        delButton.onclick = () => {
            input.parentNode.removeChild(input)
            delButton.style.display = "none"
        }
        const button = document.getElementById("addRec")
        const form = document.getElementById("sendForm")
        form.appendChild(input)
        form.insertBefore(input, button)
        form.appendChild(delButton)
        form.insertBefore(delButton, button)
    }

    render() {
        return (
            <div>
                <form id={"sendForm"} >
                    <label htmlFor="from" className="form">from</label>
                    <input id={"from"} type="email" className="form" value={this.state.template.templateFrom}/>
                    <label htmlFor={"to"} className="form">To</label>
                    <input id={"to1"} type="email" className="form" value={this.state.recipients[0]}/>
                    <button type={"button"} id={"addRec"} style={{"display" : "block"}} onClick={() => this.addRecipient()}>Add Recipient</button>
                    <label id={"titleLabel"} htmlFor={"title"} className="form">title</label>
                    <input id={"title"} className="form" value={this.state.template.templateTitle}/>
                    <label htmlFor={"text"} className={"form"} id={"textLabel"}>Text</label>
                    <input id={"text"} value={this.state.text} className={"form"}/>
                    <button id={"submit"} type={"button"} className={"form"} onClick={this.sendMail}>Send</button>
                </form>
            </div>
        )
    }
}

export default SendTemplate