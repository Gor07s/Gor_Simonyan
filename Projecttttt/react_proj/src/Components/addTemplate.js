import React, { Component } from "react"
import {Link} from "react-router-dom";

class AddTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            rId: 1
        }
        this.apiCall = this.apiCall.bind(this)
        this.addRecipient = this.addRecipient.bind(this)
        this.check = this.check.bind(this)
    }

    check(){
        if (document.getElementById("templateName").value === "" ||
            document.getElementById("text").value === "") {
            alert("Pls, write anything in lines Template and Text!")
            return false
        }
        for (let i = 1; i <= this.state.rId; i++) {
            if ((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("recipients" + i).value)) || document.getElementById("recipients" + i).value === "")  return true
        }
        alert("You have entered an invalid email address!")
        return false
    }

    async apiCall(){
        if (this.check()) {
            let mail = []
            for (let i = 1; i <= this.state.rId; i++) {
                mail.push(document.getElementById("recipients" + i).value)
            }
            await fetch("/addTemplate", {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    templateName: document.getElementById("templateName").value,
                    templateText: document.getElementById("text").value,
                    recipient: mail,
                    title: document.getElementById("title").value,
                    from: document.getElementById("from").value
                })
            })
        }
    }

    async addRecipient(){
        const input = document.createElement("input")
        const delButton = document.createElement("button")
        const div = document.createElement("div")
        await this.setState({rId : this.state.rId + 1})
        div.style.display ="flex"
        div.className = "addRecDiv"
        input.id = "recipients" + this.state.rId
        input.className = "formInputRec"
        delButton.className = "delButRec"
        delButton.type = "button"
        delButton.id = "del" + this.state.rId
        delButton.innerHTML = "X"
        delButton.onclick = () => {
            input.parentNode.removeChild(input)
            delButton.style.display = "none"
        }
        const bigDiv = document.getElementById("addRecBigDiv")
        div.appendChild(input)
        div.appendChild(delButton)
        bigDiv.appendChild(div)
    }

    render() {
        return(
            <div>
                <Link to="/">
                    <button id={"back"}>Back</button>
                </Link>
                <div id={"addBox"}>
                    <form id={"addForm"} onSubmit={e => {
                        e.preventDefault()
                        //window.history.replaceState(null, '', "/")
                    }}>
                        <div>
                            <label htmlFor="templateName" className={"form"}>Template*</label>
                            <input id="templateName" className={"form"}/>
                        </div>
                        <div>
                            <label htmlFor="from" className={"form"}>from</label>
                            <input id="from" className={"form"}/>
                        </div>
                        <div>
                            <label htmlFor="recipients1" className={"form"}>To</label>
                            <input id="recipients1" type="email" className={"form"}/>
                            <button id={"addRec"} className={"form"} type={"button"} onClick={() => this.addRecipient()}>Add Recipient</button>
                        </div>
                        <div id={"addRecBigDiv"}>

                        </div>
                        <div id={"titleDiv"}>
                            <label id={"titleLabel"} htmlFor="title" className={"form"}>title</label>
                            <input id="title" className={"form"}/>
                        </div>
                        <div id={"textDiv"}>
                            <label htmlFor="text" className={"form"}>Text*</label>
                            <textarea id={"text"} className={"form"}/>
                        </div>
                        <Link to={"/"}>
                            <button type={"submit"} id={"submit"} className={"form"} onClick={() => this.apiCall()}>Add</button>
                        </Link>
                    </form>
                </div>
            </div>
        )
    }
}

export default AddTemplate