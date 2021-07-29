import React, { Component } from "react"

class AddTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            apiResponse:"",
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
        await this.setState({rId : this.state.rId + 1})
        input.id = "recipients" + this.state.rId
        input.style.display = "flex"
        input.className = "form"
        delButton.type = "button"
        delButton.id = "del" + this.state.rId
        delButton.innerHTML = "X"
        delButton.onclick = () => {
            input.parentNode.removeChild(input)
            delButton.style.display = "none"
        }
        const button = document.getElementById("addRec")
        const form = document.getElementById("addForm")
        form.appendChild(input)
        form.insertBefore(input, button)
        form.appendChild(delButton)
        form.insertBefore(delButton, button)
    }

    render() {
        return(
            <div id={"addBox"}>
                <form id={"addForm"}>
                    <label htmlFor="templateName" className="form">Template Name</label>
                    <input id="templateName" className="form"/>
                    <label htmlFor="from" className="form">from</label>
                    <input id="from" type="email" className="form"/>
                    <label htmlFor="recipients1" className="form">To</label>
                    <input id="recipients1" type="email" className="form"/>
                    <button id={"addRec"} className={"form"} type={"button"} onClick={() => this.addRecipient()}>Add Recipient</button>
                    <label htmlFor="title" className="form">title</label>
                    <input id="title" className="form"/>
                    <label htmlFor="text" className={"form"}>Text</label>
                    <input id={"text"} className={"form"}/>
                    <button type={"submit"} id={"submit"} className={"form"} onClick={() => this.apiCall()}>Add</button>
                </form>
            </div>
        )
    }
}

export default AddTemplate