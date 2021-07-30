import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"

class AddTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            rId: 1
        }
        this.apiCall = this.apiCall.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
    }

    async apiCall(){
        const name = document.getElementById("templateName").value
        const text = document.getElementById("text").value
        let mail = []
        for (let i = 1; i <= this.state.rId; i++){
           mail.push(document.getElementById("recipients" + i).value)
        }
        const title = document.getElementById("title").value
        const from = document.getElementById("from").value
        await fetch("/addTemplate", {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                templateName: name,
                templateText: text,
                recipient: mail,
                title: title,
                from: from
            })
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}))
    }

    async addRecipient(){
        const input = document.createElement("input")
        const delButton = document.createElement("button")
        const div = document.createElement("div")
        await this.setState({rId : this.state.rId + 1})
        div.style.display ="flex"
        input.id = "recipients" + this.state.rId
        input.style.display = "flex"
        input.className = "formInputRec"
        delButton.className = "delButRec"
        delButton.type = "button"
        delButton.id = "del" + this.state.rId
        delButton.innerHTML = "X"
        delButton.onclick = () => {
            input.parentNode.removeChild(input)
            delButton.style.display = "none"
        }
        const label = document.getElementById("titleDiv")
        const form = document.getElementById("addForm")
        div.appendChild(input)
        div.appendChild(delButton)
        form.appendChild(div)
        form.insertBefore(div, label)
    }

    render() {
        return(
            <div id={"addBox"}>
                <form id={"addForm"} onSubmit={e => {
                    e.preventDefault()
                    //window.history.replaceState(null, '', "/")
                }}>
                    <div>
                        <label htmlFor="templateName" className={"form"}>Template</label>
                        <input id="templateName" className={"form"}/>
                    </div>
                    <div>
                        <label htmlFor="from" className={"form"}>from</label>
                        <input id="from" type="email" className={"form"}/>
                    </div>
                    <div>
                        <label htmlFor="recipients1" className={"form"}>To</label>
                        <input id="recipients1" type="email" className={"form"}/>
                        <button id={"addRec"} className={"form"} type={"button"} onClick={() => this.addRecipient()}>Add Recipient</button>
                    </div>
                    <div id={"titleDiv"}>
                        <label id={"titleLabel"} htmlFor="title" className={"form"}>title</label>
                        <input id="title" className={"form"}/>
                    </div>
                    <div>
                        <label htmlFor="text" className={"form"}>Text</label>
                        <input id={"text"} className={"form"}/>
                    </div>
                    <button type={"submit"} id={"submit"} className={"form"} onClick={() => this.apiCall()}>Add</button>
                </form>
            </div>
        )
    }
}

export default AddTemplate