import React, { Component } from "react"

class AddTemplate extends Component{
    constructor(props) {
        super(props);
        this.state={
            apiResponse:""
        }
        this.apiCall = this.apiCall.bind(this)
    }

    apiCall(){
        const name = document.getElementById("templateName").value
        const text = document.getElementById("text").value
        const mail = document.getElementById("recipients").value
        const title = document.getElementById("title").value
        const from = document.getElementById("from").value
        fetch("/addTemplate", {
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

    render() {
        return(
            <div id={"addBox"}>
                <form id={"addForm"}>
                    <label htmlFor="templateName" className="form">Template Name</label>
                    <input id="templateName" className="form"/>
                    <label htmlFor="from" className="form">from</label>
                    <input id="from" type="email" className="form"/>
                    <label htmlFor="recipients" className="form">To</label>
                    <input id="recipients" type="email" className="form"/>
                    <label htmlFor="title" className="form">title</label>
                    <input id="title" className="form"/>
                    <label htmlFor="text" className={"form"}>Text</label>
                    <input id={"text"} className={"form"}/>
                    <button id={"submit"} className={"form"} onClick={() => this.apiCall()}>Add</button>
                </form>
            </div>
        )
    }
}

export default AddTemplate
