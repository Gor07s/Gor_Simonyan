import React, { Component } from "react";
import {Link} from "react-router-dom";

class SendTemplate extends Component {
    constructor (props) {
        super(props);
        this.state = {
            show: props.show,
            template: props.template[0],
            txt : props.template[0].templateText,
            text: props.template[0].templateText,
            recipients : props.recipients,
            recCount: 1,
            checks: 0
        };
        this.texts = [];
        this.wordsForCheck = [];
        this.arr = [];
        this.vars = props.vars;
        this.varsIndividual = {};
        this.UseTemplateFunc = this.UseTemplateFunc.bind(this);
        this.sendMail = this.sendMail.bind(this);
        this.textGenerator = this.textGenerator.bind(this);
        this.wordFinder = this.wordFinder.bind(this);
        this.addRecipient = this.addRecipient.bind(this);
        this.check = this.check.bind(this);
        this.checkMail = this.checkMail.bind(this);
    }

    componentDidMount () {
        if (this.state.show) {
            this.UseTemplateFunc();
            this.setState({show: false});
        }
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.state.show) {
            this.UseTemplateFunc();
            this.setState({show: false});
        }
    }

    checkMail () {
        if (!/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("log").value)) {
            alert("You have entered an invalid login!");
            return false;
        }
        if (document.getElementById("pass").value === "") {
            alert("Write password!");
            return false;
        }
        for (let i = 1; i <= this.state.recCount; i++) {
            if (!(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(document.getElementById("recipients" + i).value))) {
                alert("You have entered an invalid email address!");
                return false;
            }
        }
        return true;
    }

    wordFinder (word, index) {
        let start = null;
        let st = 0;
        if (word.includes("{") && word.includes("}")) {
            for (let i = 0; i < word.length; i++) {
                if (word[0] !== "{") {
                    this.wordsForCheck.forEach(element => {
                        let varInd = this.varsIndividual[element][index];
                        if (varInd === undefined) {
                            varInd = this.varsIndividual[element][0];
                        }
                        if (varInd === "") {
                            this.arr.push("{" + element + "}");
                        }
                        else {
                            this.arr.push(varInd);
                        }
                    });
                    this.wordsForCheck = [];
                }
                if (word[i] === "{") {
                    start = i;
                    if (st !== null) {
                        this.arr.push(word.replace(word.slice(i, word.length), ""));
                        word = word.replace(word.slice(st, i), "");
                        st = null;
                        if (start !== null) {
                            start = 0;
                        }
                    }
                }
                else if (word[i] === "}") {
                    if (start !== null) {
                        if (this.varsIndividual[word.slice(start + 1, i)][0] !== undefined) {
                            this.wordsForCheck.splice(0, 0, word.slice(start + 1, i));
                        }
                        let newWord = word.replace(word.slice(start, i + 1), "");
                        this.wordFinder(newWord, index);
                        return;

                    }
                }
            }
        }
        else {
            this.wordsForCheck.forEach(element => {
                let varInd = this.varsIndividual[element][index];
                if (varInd === undefined) {
                    varInd = this.varsIndividual[element][0];
                }
                if (varInd === "") {
                    this.arr.push("{" + element + "}");
                }
                else {
                    this.arr.push(varInd);
                }
            });
            this.wordsForCheck = [];
            this.arr.push(word);
        }
    }

    textGenerator (index) {
        const text = this.state.txt.split(" ");
        for (let i = 1; i <= text.length; i += 2) {
            text.splice(i, 0, " ");
        }
        text.forEach(word => {
            this.wordFinder(word, index);
        });
        let txt = "";
        this.arr.forEach(v => txt += v);
        this.arr = [];
        this.texts[index] = txt;
        this.setState({text: txt});
    }

    check (checkbox, variable) {
        if (checkbox.checked) {
            const div = document.getElementById("d" + checkbox.id);
            for (let i = 2; i <= this.state.recCount; i++) {
                if (!document.getElementById("v" + checkbox.id + "dv" + i)) {
                    const label = document.createElement("label");
                    const input = document.createElement("input");
                    const newDiv = document.createElement("div");
                    input.id = "t" + checkbox.id + "_" + i;
                    this.varsIndividual[variable][i - 1] = "{" + variable + "}";
                    input.onchange = (e) => {
                        this.varsIndividual[variable][i - 1] = e.target.value || "{" + variable + "}";
                    };
                    input.placeholder = "for recipient" + i;
                    label.innerHTML = variable;
                    label.htmlFor = "t" + checkbox.id + "_" + i;
                    newDiv.id = "v" + checkbox.id + "dv" + i;
                    newDiv.appendChild(label);
                    newDiv.appendChild(input);
                    div.appendChild(newDiv);
                }
                div.style.borderStyle = "groove";
                div.style.borderColor = "black";
                div.style.marginBottom = "10px";
            }
            const extraDiv = document.getElementById("v" + checkbox.id + "dv" + (this.state.recCount + 1));
            if (extraDiv) {
                extraDiv.parentNode.removeChild(extraDiv);
            }
        }
        else {
            for (let i = 2; i <= this.state.recCount; i++) {
                const div = document.getElementById("v" + checkbox.id + "dv" + i);
                if (div) div.parentNode.removeChild(div);
            }
            this.varsIndividual[variable] = [this.varsIndividual[variable][0]];
        }
    }

    async UseTemplateFunc () {
        const div = document.getElementById("forVars");
        await this.vars.forEach(v => {
            this.varsIndividual = Object.assign(this.varsIndividual, {[v.varName]: ["{" + [v.varName] + "}"]});
        });
        await this.vars.forEach((template, index) => {
            div.style.borderStyle = "groove";
            div.style.borderColor = "black";
            div.style.paddingTop = "10px";
            div.style.paddingBottom = "10px";
            div.style.paddingLeft = "10px";
            const label = document.createElement("label");
            const input = document.createElement("input");
            const newDiv = document.createElement("div");
            const check = document.createElement("input");
            newDiv.id = "d" + (index + 1);
            newDiv.className = "checkDivs";
            check.className = "checkbox";
            check.type = "checkbox";
            check.id = index + 1;
            input.id = "t" + (index + 1);
            input.onchange = (e) => {
                this.varsIndividual[template.varName][0] = e.target.value || "{" + template.varName + "}";
                this.textGenerator(0);
            };
            label.innerHTML = template.varName || "{noname}";
            label.htmlFor = "t" + (index + 1);
            check.onclick = (e) => {
                if (e.target.checked) {
                    this.setState({checks: this.state.checks + 1});
                }
                else {
                    this.setState({checks: this.state.checks - 1});
                }
                this.check(e.target, label.innerHTML);
            };
            newDiv.appendChild(label);
            newDiv.appendChild(input);
            newDiv.appendChild(check);
            div.appendChild(newDiv);
        });
        const div2 = document.getElementById("addRecBigDiv");
        await this.state.recipients.forEach((rec, index) => {
            if (index !== 0) {
                const input = document.createElement("input");
                const button = document.createElement("button");
                const div = document.createElement("div");
                input.value = rec;
                div.className = "addRecDiv";
                div.style.display = "flex";
                this.setState({recCount: this.state.recCount + 1});
                input.id = "to" + this.state.recCount;
                button.innerHTML = "X";
                input.style.display = "flex";
                input.className = "formInputRec";
                button.className = "delButRec";
                button.type = "button";
                button.onclick = () => {
                    input.parentNode.removeChild(input);
                    this.setState({recCount: this.state.recCount - 1});
                    button.style.display = "none";
                };
                div.appendChild(input);
                div.appendChild(button);
                div2.appendChild(div);
            }
        });
    }

    async sendMail () {
        if (!this.checkMail()) return false;
        let text = "";
        if (this.state.checks === 0) {
            text = document.getElementById("text").value;
        }
        else {
            for (let i = 0; i < this.state.recCount; i++) {
                this.textGenerator(i);
            }
            text = this.texts;
        }
        let to = "";
        let a = [];
        for (let i = 1; i <= this.state.recCount; i++) {
            const rec = document.getElementById("recipients" + i).value;
            if (rec === "") continue;
            if (this.state.checks === 0) {
                to += rec;
                if (i !== this.state.recCount) {
                    to += ",";
                }
            }
            else {
                a.push(rec);
                to = a;
            }
        }
        await fetch("/useTemplate/send", {
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: document.getElementById("log").value,
                pass: document.getElementById("pass").value,
                from: document.getElementById("from").value,
                to: to,
                subject: document.getElementById("title").value,
                text: text
            })
        })
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}));
    }

    async addRecipient () {
        const input = document.createElement("input");
        const delButton = document.createElement("button");
        const div = document.createElement("div");
        await this.setState({recCount : this.state.recCount + 1});
        for (let i = 1; i <= this.vars.length; i++) {
            const checkbox = document.getElementById(i);
            this.check(checkbox, Object.keys(this.varsIndividual)[i - 1]);
        }
        div.style.display = "flex";
        div.className = "addRecDiv";
        input.id = "recipients" + this.state.recCount;
        input.style.display = "flex";
        input.className = "formInputRec";
        delButton.className = "delButRec";
        delButton.type = "button";
        delButton.id = "del" + this.state.recCount;
        delButton.innerHTML = "X";
        delButton.onclick = async () => {
            input.parentNode.removeChild(input);
            delButton.style.display = "none";
            await this.setState({recCount : this.state.recCount - 1});
            for (let i = 1; i <= this.vars.length; i++) {
                const checkbox = document.getElementById(i);
                this.check(checkbox, Object.keys(this.varsIndividual)[0]);
            }
        };
        const bigDiv = document.getElementById("addRecBigDiv");
        div.appendChild(input);
        div.appendChild(delButton);
        bigDiv.appendChild(div);
    }

    render () {
        return (
            <div style={{"width" : "100%"}}>
                <Link to="/useTemplate">
                    <button id={"back"}>Back</button>
                </Link>
                <div id={"sendBox"}>
                    <form id={"sendForm"} onSubmit={e => {
                        e.preventDefault();
                        window.history.replaceState(null, '', "/");
                    }}>
                        <div>
                            <label htmlFor="log" className="form">Login*</label>
                            <input id={"log"} type="email" className="form"/>
                        </div>
                        <div>
                            <label htmlFor="pass" className="form">Password*</label>
                            <input id={"pass"} type="password" className="form"/>
                        </div>
                        <div>
                            <label htmlFor="from" className="form">from</label>
                            <input id={"from"} type="email" className="form" value={this.state.template.templateFrom} onChange={(e) => {this.setState(prevState => ({
                                template : {
                                    ...prevState.template,
                                    templateFrom : e.target.value
                                }
                            }));}}/>
                        </div>
                        <div>
                            <label htmlFor={"recipients1"} className="form">To*</label>
                            <input id={"recipients1"} type="email" className="form" value={this.state.recipients[0]} onChange={(e) => {this.setState(prevState => ({
                                recipients: {
                                    ...prevState.recipients,
                                    [0]: e.target.value
                                }
                            }));}}/>
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
                            }));}}/>
                        </div>
                        <div id={"forVars"}>

                        </div>
                        <div>
                            <label htmlFor={"text"} className={"form"} id={"textLabel"}>Text</label>
                            <textarea id={"text"} value={this.state.text} className={"form"} onChange={(e) => this.setState({text: e.target.value, txt: e.target.value})}/>
                        </div>
                        <Link to={"/"}>
                            <button id={"submit"} type={"submit"} className={"form"} onClick={this.sendMail}>Send</button>
                        </Link>
                    </form>
                </div>
            </div>
        );
    }
}

export default SendTemplate;