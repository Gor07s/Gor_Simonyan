import React, { Component } from "react"
import {Link} from "react-router-dom";

class ModTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            show: props.show,
            template: props.template[0],
            recipients : props.recipients,
            recCount: 1,
        }
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this)
        this.modTemp = this.modTemp.bind(this)
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

    UseTemplateFunc(){
        const div2= document.getElementById("addRecBigDiv")
        this.state.recipients.forEach(async (rec, index) => {
            if (index !== 0){
                const input = document.createElement("input")
                const button = document.createElement("button")
                const div = document.createElement("div")
                input.value = rec
                div.className = "addRecDiv"
                div.style.display = "flex"
                await this.setState({recCount: this.state.recCount + 1})
                input.id = "to" + this.state.recCount
                button.innerHTML = "X"
                input.style.display = "flex"
                input.className = "formInputRec"
                button.className = "delButRec"
                button.type = "button"
                button.onclick = () => {
                    input.parentNode.removeChild(input)
                    button.style.display = "none"
                }
                div.appendChild(input)
                div.appendChild(button)
                div2.appendChild(div)
            }
        })
    }

    async modTemp(){
        let mail = []
        for (let i = 1; i <= this.state.recCount; i++) {
            mail.push(document.getElementById("to" + i).value)
        }
        console.log(this.state.template)
        await fetch("/useTemplate/modify", {
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: this.state.template.id,
                templateName: document.getElementById("templateName").value,
                from: document.getElementById("from").value,
                recipient: mail,
                title: document.getElementById("title").value,
                templateText: document.getElementById("text").value
            })
        })
    }

    async addRecipient(){
        const input = document.createElement("input")
        const delButton = document.createElement("button")
        const div = document.createElement("div")
        await this.setState({rId : this.state.rId + 1})
        div.style.display ="flex"
        div.className = "addRecDiv"
        input.id = "recipients" + this.state.recCount
        input.style.display = "flex"
        input.className = "formInputRec"
        delButton.className = "delButRec"
        delButton.type = "button"
        delButton.id = "del" + this.state.recCount
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
        return (
            <div style={{"width" : "100%"}}>
                <Link to="/useTemplate">
                    <button id={"back"}>Back</button>
                </Link>
                <div  id={"sendBox"}>
                    <form id={"sendForm"} onSubmit={e => {
                        e.preventDefault()
                        window.history.replaceState(null, '', "/")
                    }}>
                        <div>
                            <label htmlFor="templateName" className={"form"}>Template*</label>
                            <input id="templateName" className={"form"} value={this.state.template.templateName} onChange={(e) => {this.setState(prevState => ({
                                template : {
                                    ...prevState.template,
                                    templateName : e.target.value
                                }
                            }))}}/>
                        </div>
                        <div>
                            <label htmlFor="from" className="form">from</label>
                            <input id={"from"} type="email" className="form" value={this.state.template.templateFrom} onChange={(e) => {this.setState(prevState => ({
                                template : {
                                    ...prevState.template,
                                    templateFrom : e.target.value
                                }
                            }))}}/>
                        </div>
                        <div>
                            <label htmlFor={"to1"} className="form">To</label>
                            <input id={"to1"} type="email" className="form" value={this.state.recipients[0]} onChange={(e) => {this.setState(prevState => ({
                                recipients: {
                                    ...prevState.recipients,
                                    [0]: e.target.value
                                }
                            }))}}/>
                            <button type={"button"} id={"addRec"} onClick={() => this.addRecipient()}>Add Recipient</button>
                        </div>
                        <div id={"addRecBigDiv"}>

                        </div>
                        <div>
                            <label id={"titleLabel"} htmlFor={"title"} className="form">title</label>
                            <input id={"title"} className="form" value={this.state.template.templateTitle} onChange={(e) => {this.setState(prevState => ({
                                template : {
                                    ...prevState.template,
                                    templateTitle : e.target.value
                                }
                            }))}}/>
                        </div>
                        <div id={"forVars"}>

                        </div>
                        <div>
                            <label htmlFor={"text"} className={"form"} id={"textLabel"}>Text*</label>
                            <textarea id={"text"} value={this.state.template.templateText} className={"form"} onChange={(e) => {this.setState(prevState => ({
                                template : {
                                    ...prevState.template,
                                    templateText : e.target.value
                                }
                            }))}}/>
                        </div>
                        <Link to={"/useTemplate"}>
                          <button id={"submit"} type={"submit"} className={"form"} onClick={this.modTemp}>Modify</button>
                        </Link>
                    </form>
                </div>
            </div>
        )
    }
}

export default ModTemplate